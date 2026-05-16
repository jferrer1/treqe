"""Disputes router."""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db
from ..models.dispute import Dispute
from ..dependencies import get_current_user

router = APIRouter(prefix="/api/disputes", tags=["disputes"])

VALID_REASONS = ["not_arrived", "broken", "not_as_described", "other"]


@router.get("/")
async def list_disputes(current_user=Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Dispute).where(Dispute.user_id == current_user.id).order_by(Dispute.created_at.desc())
    )
    return {"items": [d.to_dict() for d in result.scalars().all()]}


@router.post("/", status_code=201)
async def create_dispute(
    reference_id: str = Query(...), reference_type: str = Query(...),
    reason: str = Query(...), description: str = Query(None),
    current_user=Depends(get_current_user), db: AsyncSession = Depends(get_db),
):
    if reason not in VALID_REASONS:
        raise HTTPException(400, f"Invalid reason. Must be one of: {VALID_REASONS}")
    dispute = Dispute(
        reference_id=reference_id, reference_type=reference_type,
        user_id=current_user.id, reason=reason, description=description,
        status="open"
    )
    db.add(dispute)
    await db.commit()
    await db.refresh(dispute)
    return dispute.to_dict()


@router.get("/{dispute_id}")
async def get_dispute(dispute_id: str, current_user=Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    dispute = (await db.execute(select(Dispute).where(Dispute.id == dispute_id))).scalar_one_or_none()
    if not dispute:
        raise HTTPException(404, "Dispute not found")
    return dispute.to_dict()
