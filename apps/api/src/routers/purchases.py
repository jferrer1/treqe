"""Purchases router."""
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select, and_, or_
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db
from ..models.purchase import Purchase
from ..models.product import Product
from ..dependencies import get_current_user
from ..models.user import User

router = APIRouter(prefix="/api/purchases", tags=["purchases"])


@router.get("/")
async def list_purchases(current_user=Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    """Lista compras donde el usuario es comprador o vendedor."""
    result = await db.execute(
        select(Purchase).where(
            or_(Purchase.buyer_id == current_user.id, Purchase.seller_id == current_user.id)
        ).order_by(Purchase.created_at.desc())
    )
    purchases = result.scalars().all()
    items = []
    for p in purchases:
        d = p.to_dict()
        buyer = (await db.execute(select(User).where(User.id == p.buyer_id))).scalar_one_or_none()
        seller = (await db.execute(select(User).where(User.id == p.seller_id))).scalar_one_or_none()
        product = (await db.execute(select(Product).where(Product.id == p.product_id))).scalar_one_or_none()
        d["buyer"] = {"id": buyer.id, "name": buyer.name} if buyer else None
        d["seller"] = {"id": seller.id, "name": seller.name} if seller else None
        d["product"] = product.to_dict() if product else None
        items.append(d)
    return {"items": items, "total": len(items)}


@router.post("/", status_code=201)
async def create_purchase(
    product_id: str = Query(...), shipping: float = Query(None), insurance: bool = Query(False),
    current_user=Depends(get_current_user), db: AsyncSession = Depends(get_db),
):
    """Solicitar compra de un producto."""
    product = (await db.execute(select(Product).where(Product.id == product_id, Product.status == "active"))).scalar_one_or_none()
    if not product:
        raise HTTPException(404, "Product not found")
    if product.user_id == current_user.id:
        raise HTTPException(400, "Cannot buy your own product")

    total = product.price + (shipping or 0) + (1.99 if insurance else 0)
    purchase = Purchase(
        buyer_id=current_user.id, seller_id=product.user_id, product_id=product.id,
        price=product.price, shipping=shipping, insurance=insurance, total=total, status="requested"
    )
    db.add(purchase)
    await db.commit()
    await db.refresh(purchase)

    # Create notifications for both parties
    try:
        from ..models.notification import Notification
        buyer_name = current_user.name or current_user.email or "Comprador"
        seller = (await db.execute(select(User).where(User.id == product.user_id))).scalar_one_or_none()
        seller_name = seller.name if seller else "Vendedor"
        n1 = Notification(user_id=current_user.id, type="purchase_buyer",
            title=f"Has comprado {product.title}", body=f"Total: {total:.2f} €", action_url="/treqes", read=False)
        n2 = Notification(user_id=product.user_id, type="purchase_seller",
            title=f"{buyer_name} ha comprado {product.title}", body=f"Total: {total:.2f} €", action_url="/treqes", read=False)
        db.add(n1)
        db.add(n2)
        await db.commit()
    except Exception:
        pass  # Notification failure shouldn't block purchase

    return purchase.to_dict()


@router.put("/{purchase_id}/accept")
async def accept_purchase(purchase_id: str, current_user=Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    purchase = (await db.execute(select(Purchase).where(Purchase.id == purchase_id))).scalar_one_or_none()
    if not purchase:
        raise HTTPException(404, "Purchase not found")
    if purchase.seller_id != current_user.id:
        raise HTTPException(403, "Not your product")
    if purchase.status != "requested":
        raise HTTPException(400, f"Cannot accept purchase in status: {purchase.status}")
    purchase.status = "accepted"
    await db.commit()
    return purchase.to_dict()


@router.get("/{purchase_id}")
async def get_purchase(purchase_id: str, current_user=Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    purchase = (await db.execute(select(Purchase).where(Purchase.id == purchase_id))).scalar_one_or_none()
    if not purchase:
        raise HTTPException(404, "Purchase not found")
    if purchase.buyer_id != current_user.id and purchase.seller_id != current_user.id:
        raise HTTPException(403, "Not your purchase")
    return purchase.to_dict()
