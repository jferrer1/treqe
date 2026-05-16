"""Offers router — ofertas de intercambio."""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db
from ..models.offer import Offer
from ..models.product import Product
from ..dependencies import get_current_user

router = APIRouter(prefix="/api/offers", tags=["offers"])


@router.get("/mine")
async def list_my_offers(current_user=Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Offer).where(Offer.user_id == current_user.id, Offer.status == "active")
        .order_by(Offer.created_at.desc())
    )
    offers = result.scalars().all()
    items = []
    for o in offers:
        d = o.to_dict()
        product_offered = (await db.execute(select(Product).where(Product.id == o.product_id_offers))).scalar_one_or_none()
        product_wanted = (await db.execute(select(Product).where(Product.id == o.product_id_wants))).scalar_one_or_none()
        d["product_offered"] = product_offered.to_dict() if product_offered else None
        d["product_wanted"] = product_wanted.to_dict() if product_wanted else None
        items.append(d)
    return {"items": items, "total": len(items)}


@router.post("/", status_code=201)
async def create_offer(
    product_id_offers: str = Query(...), product_id_wants: str = Query(...),
    current_user=Depends(get_current_user), db: AsyncSession = Depends(get_db),
):
    """Ofrecer mi producto a cambio de otro."""
    offered = (await db.execute(select(Product).where(Product.id == product_id_offers))).scalar_one_or_none()
    if not offered or offered.user_id != current_user.id:
        raise HTTPException(400, "Product not yours or not found")
    wanted = (await db.execute(select(Product).where(Product.id == product_id_wants, Product.status == "active"))).scalar_one_or_none()
    if not wanted:
        raise HTTPException(404, "Target product not found")
    if wanted.user_id == current_user.id:
        raise HTTPException(400, "Cannot offer for your own product")

    existing = (await db.execute(
        select(Offer).where(Offer.product_id_offers == product_id_offers,
                           Offer.product_id_wants == product_id_wants,
                           Offer.status == "active")
    )).scalar_one_or_none()
    if existing:
        raise HTTPException(409, "Offer already exists")

    offer = Offer(user_id=current_user.id, product_id_offers=product_id_offers,
                  product_id_wants=product_id_wants, status="active")
    db.add(offer)
    await db.commit()
    await db.refresh(offer)

    # Disparar algoritmo en background (Celery — solo en producción)
    try:
        from ..workers.algorithm_worker import run_algorithm
        if run_algorithm:
            run_algorithm.delay("new_offer")
    except (ImportError, Exception):
        pass

    # Nota: notificación manejada por el frontend/WebSocket en producción

    return offer.to_dict()


@router.delete("/{offer_id}")
async def withdraw_offer(offer_id: str, current_user=Depends(get_current_user),
                         db: AsyncSession = Depends(get_db)):
    offer = (await db.execute(select(Offer).where(Offer.id == offer_id))).scalar_one_or_none()
    if not offer:
        raise HTTPException(404, "Offer not found")
    if offer.user_id != current_user.id:
        raise HTTPException(403, "Not your offer")
    offer.status = "withdrawn"
    await db.commit()
    return {"ok": True}
