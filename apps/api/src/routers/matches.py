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
    
    # Check if user needs to pay (cash_diff > 0)
    payment_needed = part.cash_diff > 0
    payment_intent = None
    
    if payment_needed:
        try:
            from ..config import settings
            import stripe
            stripe.api_key = settings.STRIPE_SECRET_KEY
            amount_cents = max(50, int(part.cash_diff * 100))  # min 0.50eur for Stripe
            payment_intent = stripe.PaymentIntent.create(
                amount=amount_cents,
                currency="eur",
                metadata={"match_id": match_id, "user_id": current_user.id, "type": "trade_escrow"},
                capture_method="manual"
            )
            part.payment_intent_id = payment_intent.id
        except Exception as e:
            raise HTTPException(500, f"Payment setup failed: {str(e)}")
    
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
    
    result = {"ok": True, "payment_required": payment_needed}
    if payment_intent:
        result["client_secret"] = payment_intent.client_secret
        result["amount"] = amount_cents
    return result


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


@router.post("/{match_id}/cancel")
async def cancel_match(match_id: str, current_user=Depends(get_current_user),
                       db: AsyncSession = Depends(get_db)):
    """Cancelar participación en un match."""
    match = (await db.execute(select(Match).where(Match.id == match_id))).scalar_one_or_none()
    if not match:
        raise HTTPException(404, "Match not found")
    match.status = "cancelled"
    await db.commit()
    return {"ok": True}


@router.post("/{match_id}/confirm-payment")
async def confirm_match_payment(match_id: str, current_user=Depends(get_current_user),
                                db: AsyncSession = Depends(get_db)):
    """Confirm (capture) the escrow payment for a trade match."""
    part = (await db.execute(
        select(MatchParticipant).where(MatchParticipant.match_id == match_id,
                                       MatchParticipant.user_id == current_user.id)
    )).scalar_one_or_none()
    if not part or not part.payment_intent_id:
        raise HTTPException(404, "No payment found")
    if part.payment_confirmed:
        return {"ok": True, "status": "already_confirmed"}
    
    try:
        from ..config import settings
        import stripe
        stripe.api_key = settings.STRIPE_SECRET_KEY
        stripe.PaymentIntent.capture(part.payment_intent_id)
        part.payment_confirmed = True
        await db.commit()
    except Exception as e:
        raise HTTPException(500, f"Payment capture failed: {str(e)}")
    
    return {"ok": True, "status": "captured"}


@router.get("/{match_id}/payment")
async def get_match_payment(match_id: str, current_user=Depends(get_current_user),
                            db: AsyncSession = Depends(get_db)):
    """Get payment intent info for trade escrow."""
    part = (await db.execute(
        select(MatchParticipant).where(MatchParticipant.match_id == match_id,
                                       MatchParticipant.user_id == current_user.id)
    )).scalar_one_or_none()
    if not part or not part.payment_intent_id:
        raise HTTPException(404, "No payment found")
    
    try:
        from ..config import settings
        import stripe
        stripe.api_key = settings.STRIPE_SECRET_KEY
        pi = stripe.PaymentIntent.retrieve(part.payment_intent_id)
        return {"client_secret": pi.client_secret, "amount": pi.amount, "status": pi.status}
    except Exception as e:
        raise HTTPException(500, str(e))
