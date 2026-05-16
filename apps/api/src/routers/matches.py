"""Matches router."""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db
from ..models.match import Match, MatchParticipant
from ..models.product import Product
from ..models.user import User
from ..dependencies import get_current_user

router = APIRouter(prefix="/api/matches", tags=["matches"])


@router.get("/")
async def list_matches(
    current_user=Depends(get_current_user), db: AsyncSession = Depends(get_db),
    status: str = Query(None),
):
    """Lista matches donde participa el usuario."""
    part_result = await db.execute(
        select(MatchParticipant).where(MatchParticipant.user_id == current_user.id)
    )
    participations = part_result.scalars().all()
    match_ids = list(set(p.match_id for p in participations))

    items = []
    for mid in match_ids:
        match = (await db.execute(select(Match).where(Match.id == mid))).scalar_one_or_none()
        if not match or (status and match.status != status):
            continue
        d = match.to_dict()
        parts_result = await db.execute(
            select(MatchParticipant).where(MatchParticipant.match_id == mid)
        )
        d["participants"] = []
        for mp in parts_result.scalars().all():
            pd = mp.to_dict()
            product = (await db.execute(select(Product).where(Product.id == mp.product_id))).scalar_one_or_none()
            user = (await db.execute(select(User).where(User.id == mp.user_id))).scalar_one_or_none()
            pd["product"] = product.to_dict() if product else None
            pd["user"] = {"id": user.id, "name": user.name} if user else None
            d["participants"].append(pd)
        items.append(d)

    # Counts for hub tabs
    counts = {"activos": 0, "pendientes": 0, "en_curso": 0, "completados": 0}
    for m in items:
        s = m.get("status", "")
        if s in ("pending", "active"):
            counts["activos" if s == "active" else "pendientes"] += 1
        elif s == "in_progress":
            counts["en_curso"] += 1
        elif s == "completed":
            counts["completados"] += 1

    return {"items": items, "total": len(items), "counts": counts}


@router.get("/{match_id}")
async def get_match(match_id: str, current_user=Depends(get_current_user),
                    db: AsyncSession = Depends(get_db)):
    match = (await db.execute(select(Match).where(Match.id == match_id))).scalar_one_or_none()
    if not match:
        raise HTTPException(404, "Match not found")
    parts = (await db.execute(select(MatchParticipant).where(MatchParticipant.match_id == match_id))).scalars().all()
    user_ids = [p.user_id for p in parts]
    if current_user.id not in user_ids:
        raise HTTPException(403, "Not your match")
    d = match.to_dict()
    d["participants"] = [p.to_dict() for p in parts]
    return d


@router.post("/{match_id}/accept")
async def accept_match(match_id: str, current_user=Depends(get_current_user),
                       db: AsyncSession = Depends(get_db)):
    part = (await db.execute(
        select(MatchParticipant).where(MatchParticipant.match_id == match_id,
                                       MatchParticipant.user_id == current_user.id)
    )).scalar_one_or_none()
    if not part:
        raise HTTPException(404, "Not a participant")
    if part.status != "pending":
        raise HTTPException(400, f"Already {part.status}")
    part.status = "accepted"
    part.accepted_at = __import__("datetime").datetime.utcnow()
    await db.commit()

    # Verificar si todos aceptaron → activar match
    all_parts = (await db.execute(select(MatchParticipant).where(MatchParticipant.match_id == match_id))).scalars().all()
    if all(p.status == "accepted" for p in all_parts):
        match = (await db.execute(select(Match).where(Match.id == match_id))).scalar_one_or_none()
        if match:
            match.status = "active"
            await db.commit()
    return {"ok": True}


@router.post("/{match_id}/reject")
async def reject_match(match_id: str, current_user=Depends(get_current_user),
                       db: AsyncSession = Depends(get_db)):
    part = (await db.execute(
        select(MatchParticipant).where(MatchParticipant.match_id == match_id,
                                       MatchParticipant.user_id == current_user.id)
    )).scalar_one_or_none()
    if not part:
        raise HTTPException(404, "Not a participant")
    part.status = "rejected"
    match = (await db.execute(select(Match).where(Match.id == match_id))).scalar_one_or_none()
    if match:
        match.status = "cancelled"
    await db.commit()
    return {"ok": True}
