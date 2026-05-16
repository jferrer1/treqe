"""Products router."""
import json
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select, func, or_
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db
from ..models.product import Product
from ..dependencies import get_current_user

router = APIRouter(prefix="/api/products", tags=["products"])

CATEGORIES = [
    "Electrónica", "Móviles", "Consolas", "Hogar", "Deporte",
    "Moda", "Libros", "Música", "Coleccionismo", "Motor",
    "Niños", "Herramientas", "Decoración", "Jardín", "Informática",
    "Cámaras", "Bicicletas", "Instrumentos", "Juguetes", "Otros",
]


@router.get("/categories")
async def list_categories():
    return {"categories": CATEGORIES}


@router.get("/")
async def list_products(
    search: str | None = Query(None),
    category: str | None = Query(None),
    price_min: float | None = Query(None),
    price_max: float | None = Query(None),
    condition: str | None = Query(None),
    sort: str = Query("newest"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, le=100),
    db: AsyncSession = Depends(get_db),
):
    query = select(Product).where(Product.status == "active")
    if search:
        query = query.where(or_(Product.title.ilike(f"%{search}%"), Product.description.ilike(f"%{search}%")))
    if category:
        query = query.where(Product.category == category)
    if price_min is not None:
        query = query.where(Product.price >= price_min)
    if price_max is not None:
        query = query.where(Product.price <= price_max)
    if condition:
        query = query.where(Product.condition == condition)
    sort_map = {"newest": Product.created_at.desc(), "price_asc": Product.price.asc(), "price_desc": Product.price.desc()}
    query = query.order_by(sort_map.get(sort, Product.created_at.desc()))

    count_q = select(func.count()).select_from(query.subquery())
    total = (await db.execute(count_q)).scalar() or 0
    query = query.offset((page - 1) * limit).limit(limit)
    result = await db.execute(query)
    products = result.scalars().all()
    return {"items": [p.to_dict() for p in products], "total": total, "page": page, "pages": max(1, (total + limit - 1) // limit)}


@router.get("/{product_id}")
async def get_product(product_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product).where(Product.id == product_id, Product.status == "active"))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product.to_dict()


@router.post("/", status_code=201)
async def create_product(
    title: str = Query(...), description: str = Query(None), price: float = Query(...),
    category: str = Query(...), condition: str = Query(...),
    weight: float | None = Query(None),
    current_user=Depends(get_current_user), db: AsyncSession = Depends(get_db),
):
    product = Product(user_id=current_user.id, title=title or "", description=description,
                      price=price, category=category, condition=condition, weight=weight,
                      photos="[]", videos="[]", status="active")
    db.add(product)
    await db.commit()
    await db.refresh(product)
    return product.to_dict()


@router.delete("/{product_id}")
async def delete_product(product_id: str, current_user=Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if product.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your product")
    product.status = "deleted"
    await db.commit()
    return {"ok": True}


@router.put("/{product_id}")
async def update_product(
    product_id: str, title: str = Query(None), description: str = Query(None),
    price: float = Query(None), category: str = Query(None), condition: str = Query(None),
    current_user=Depends(get_current_user), db: AsyncSession = Depends(get_db),
):
    """Editar producto (solo el dueño)."""
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if product.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your product")
    if title:
        product.title = title
    if description is not None:
        product.description = description
    if price is not None:
        product.price = price
    if category:
        product.category = category
    if condition:
        product.condition = condition
    await db.commit()
    await db.refresh(product)
    return product.to_dict()
