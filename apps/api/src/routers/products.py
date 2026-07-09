"""Products router."""
import json
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select, func, or_, case
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db
from ..models.product import Product
from ..dependencies import get_current_user

router = APIRouter(prefix="/api/products", tags=["products"])

CATEGORIES = [
    "Electrónica", "Moda", "Deporte", "Música", "Hogar",
    "Libros", "Motor", "Inmuebles", "Bicicletas", "Electrodomésticos",
    "Bebés", "Coleccionismo", "Construcción", "Industria", "Empleo",
    "Servicios", "Otros",
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
    sort: str = Query("relevance"),
    offset: int = Query(0, ge=0),
    page: int = Query(1, ge=1),
    limit: int = Query(20, le=100),
    db: AsyncSession = Depends(get_db),
):
    query = select(Product).where(Product.status == "active")
    if search:
        query = query.where(or_(Product.title.ilike(f"%{search}%"), Product.description.ilike(f"%{search}%")))
    if category:
        # Strip accents for accent-insensitive matching
        import unicodedata
        normalized = unicodedata.normalize('NFKD', category.lower())
        normalized = ''.join(c for c in normalized if not unicodedata.combining(c))
        # Strip accents from DB value too (SQLite LOWER preserves them)
        db_cat = func.lower(Product.category)
        for a, r in [('á','a'),('é','e'),('í','i'),('ó','o'),('ú','u')]:
            db_cat = func.replace(db_cat, a, r)
        query = query.where(db_cat == normalized)
    if price_min is not None:
        query = query.where(Product.price >= price_min)
    if price_max is not None:
        query = query.where(Product.price <= price_max)
    if condition:
        query = query.where(Product.condition == condition)
    sort_map = {
        "relevance": [case((Product.photos != "[]", 1), else_=0).desc(), Product.created_at.desc()],
        "newest": Product.created_at.desc(),
        "price_asc": Product.price.asc(),
        "price_desc": Product.price.desc(),
    }
    order = sort_map.get(sort, sort_map["relevance"])
    if isinstance(order, list):
        query = query.order_by(*order)
    else:
        query = query.order_by(order)

    count_q = select(func.count()).select_from(query.subquery())
    total = (await db.execute(count_q)).scalar() or 0
    effective_offset = offset if offset > 0 else (page - 1) * limit
    query = query.offset(effective_offset).limit(limit)
    result = await db.execute(query)
    products = result.scalars().all()
    safe_limit = max(1, limit)
    return {"items": [p.to_dict() for p in products], "total": total, "page": page, "pages": max(1, (total + safe_limit - 1) // safe_limit)}


@router.get("/mine")
async def list_my_products(current_user=Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    """List user's own active products (for trade modal)."""
    result = await db.execute(
        select(Product).where(Product.user_id == current_user.id, Product.status == "active")
        .order_by(Product.created_at.desc())
    )
    products = result.scalars().all()
    return {"items": [p.to_dict() for p in products], "total": len(products)}


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
    photos: str = Query(None),
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
    if photos is not None:
        product.photos = photos
    await db.commit()
    await db.refresh(product)
    return product.to_dict()
