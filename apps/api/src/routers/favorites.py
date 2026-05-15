"""Favorites router."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db
from ..models.favorite import Favorite
from ..models.product import Product
from ..dependencies import get_current_user

router = APIRouter(prefix="/api/favorites", tags=["favorites"])


@router.get("/")
async def list_favorites(current_user=Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Favorite).where(Favorite.user_id == current_user.id).order_by(Favorite.created_at.desc())
    )
    favorites = result.scalars().all()
    items = []
    for fav in favorites:
        r = await db.execute(select(Product).where(Product.id == fav.product_id))
        product = r.scalar_one_or_none()
        if product and product.status == "active":
            items.append(product.to_dict())
    return {"items": items, "total": len(items)}


@router.post("/", status_code=201)
async def add_favorite(product_id: str = Depends(lambda: None), current_user=Depends(get_current_user),
                       db: AsyncSession = Depends(get_db)):
    from fastapi import Query
    return {"error": "Use POST /api/favorites?product_id=..."}


@router.post("/{product_id}", status_code=201)
async def add_favorite_by_id(product_id: str, current_user=Depends(get_current_user),
                             db: AsyncSession = Depends(get_db)):
    existing = await db.execute(
        select(Favorite).where(and_(Favorite.user_id == current_user.id, Favorite.product_id == product_id))
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Already favorited")
    fav = Favorite(user_id=current_user.id, product_id=product_id)
    db.add(fav)
    await db.commit()
    return {"ok": True}


@router.delete("/{product_id}")
async def remove_favorite(product_id: str, current_user=Depends(get_current_user),
                          db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Favorite).where(and_(Favorite.user_id == current_user.id, Favorite.product_id == product_id))
    )
    fav = result.scalar_one_or_none()
    if not fav:
        raise HTTPException(status_code=404, detail="Not found")
    await db.delete(fav)
    await db.commit()
    return {"ok": True}
