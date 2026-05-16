"""Reviews router."""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db
from ..models.review import Review
from ..models.user import User
from ..dependencies import get_current_user

router = APIRouter(prefix="/api/reviews", tags=["reviews"])


@router.post("/", status_code=201)
async def create_review(
    to_user_id: str = Query(...), reference_id: str = Query(None),
    score: int = Query(..., ge=1, le=5), comment: str = Query(None),
    current_user=Depends(get_current_user), db: AsyncSession = Depends(get_db),
):
    if to_user_id == current_user.id:
        raise HTTPException(400, "Cannot review yourself")
    existing = (await db.execute(
        select(Review).where(Review.from_user_id == current_user.id,
                            Review.reference_id == reference_id)
    )).scalar_one_or_none()
    if existing:
        raise HTTPException(409, "Already reviewed this transaction")

    review = Review(from_user_id=current_user.id, to_user_id=to_user_id,
                    reference_id=reference_id, score=score, comment=comment)
    db.add(review)

    # Actualizar reputación del usuario
    result = await db.execute(select(func.avg(Review.score)).where(Review.to_user_id == to_user_id))
    avg = result.scalar()
    if avg:
        user = (await db.execute(select(User).where(User.id == to_user_id))).scalar_one_or_none()
        if user:
            user.reputation = round(float(avg), 1)
    await db.commit()
    await db.refresh(review)
    return review.to_dict()


@router.get("/user/{user_id}")
async def get_user_reviews(user_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Review).where(Review.to_user_id == user_id).order_by(Review.created_at.desc()).limit(20)
    )
    reviews = result.scalars().all()
    avg_result = await db.execute(select(func.avg(Review.score)).where(Review.to_user_id == user_id))
    avg = avg_result.scalar()
    return {"items": [r.to_dict() for r in reviews], "average": round(float(avg), 1) if avg else None, "total": len(reviews)}
