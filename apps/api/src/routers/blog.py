"""Blog router — articulos del blog de Treqe."""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db
from ..models.blog_post import BlogPost

router = APIRouter(prefix="/api/blog", tags=["blog"])


@router.get("/")
async def list_posts(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
):
    """Listar articulos del blog (solo publicados)."""
    q = select(BlogPost).where(BlogPost.published == True).order_by(BlogPost.created_at.desc())
    total_q = await db.execute(select(BlogPost.id).where(BlogPost.published == True))
    total = len(total_q.all())
    result = await db.execute(q.offset(offset).limit(limit))
    posts = result.scalars().all()
    return {
        "items": [_serialize(p) for p in posts],
        "total": total,
        "offset": offset,
        "limit": limit,
    }


@router.get("/{slug}")
async def get_post(slug: str, db: AsyncSession = Depends(get_db)):
    """Obtener articulo por slug."""
    result = await db.execute(select(BlogPost).where(BlogPost.slug == slug, BlogPost.published == True))
    post = result.scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=404, detail="Articulo no encontrado")
    return _serialize(post)


@router.post("/", status_code=201)
async def create_post(
    title: str = Query(...),
    slug: str = Query(...),
    excerpt: str = Query(""),
    body: str = Query(...),
    cover_image: str = Query(""),
    author: str = Query("Treqe"),
    db: AsyncSession = Depends(get_db),
):
    """Crear articulo (admin)."""
    post = BlogPost(title=title, slug=slug, excerpt=excerpt, body=body, cover_image=cover_image, author=author)
    db.add(post)
    await db.commit()
    await db.refresh(post)
    return _serialize(post)


def _serialize(p: BlogPost) -> dict:
    return {
        "id": p.id,
        "slug": p.slug,
        "title": p.title,
        "excerpt": p.excerpt,
        "body": p.body,
        "cover_image": p.cover_image,
        "author": p.author,
        "published": p.published,
        "created_at": p.created_at.isoformat() if p.created_at else None,
    }
