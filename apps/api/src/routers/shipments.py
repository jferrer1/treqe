"""Shipments router."""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db
from ..models.shipment import Shipment
from ..dependencies import get_current_user

router = APIRouter(prefix="/api/shipments", tags=["shipments"])


@router.get("/")
async def list_shipments(current_user=Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Shipment).where(
            or_(Shipment.from_user_id == current_user.id, Shipment.to_user_id == current_user.id)
        ).order_by(Shipment.created_at.desc())
    )
    return {"items": [s.to_dict() for s in result.scalars().all()]}


@router.post("/", status_code=201)
async def create_shipment(
    reference_id: str = Query(...), reference_type: str = Query("purchase"),
    carrier: str = Query("correos"),
    current_user=Depends(get_current_user), db: AsyncSession = Depends(get_db),
):
    shipment = Shipment(
        reference_id=reference_id, reference_type=reference_type,
        from_user_id=current_user.id, to_user_id="",  # Se asigna al confirmar
        carrier=carrier, status="pending", insurance=0.0 if reference_type == "purchase" else 1.99,
    )
    db.add(shipment)
    await db.commit()
    await db.refresh(shipment)
    return shipment.to_dict()


@router.get("/{shipment_id}")
async def get_shipment(shipment_id: str, current_user=Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    shipment = (await db.execute(select(Shipment).where(Shipment.id == shipment_id))).scalar_one_or_none()
    if not shipment:
        raise HTTPException(404, "Shipment not found")
    return shipment.to_dict()


@router.post("/{shipment_id}/confirm")
async def confirm_receipt(shipment_id: str, current_user=Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    shipment = (await db.execute(select(Shipment).where(Shipment.id == shipment_id))).scalar_one_or_none()
    if not shipment:
        raise HTTPException(404, "Shipment not found")
    if shipment.to_user_id != current_user.id:
        raise HTTPException(403, "Not your shipment")
    shipment.status = "received"
    await db.commit()
    return {"ok": True}
