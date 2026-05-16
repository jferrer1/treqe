"""Users router — profile, edit, verify, GDPR."""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db
from ..models.user import User
from ..dependencies import get_current_user

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("/me/reviews")
async def my_reviews(current_user=Depends(get_current_user)):
    """Redirige a /api/reviews/user/{id}."""
    from fastapi.responses import RedirectResponse
    return RedirectResponse(f"/api/reviews/user/{current_user.id}")


@router.put("/me")
async def update_profile(
    name: str = Query(None), bio: str = Query(None),
    location: str = Query(None), avatar_url: str = Query(None),
    current_user=Depends(get_current_user), db: AsyncSession = Depends(get_db),
):
    """Actualizar perfil del usuario autenticado."""
    if name:
        current_user.name = name
    if bio is not None:
        current_user.bio = bio
    if location is not None:
        current_user.location = location
    if avatar_url:
        current_user.avatar_url = avatar_url
    await db.commit()
    await db.refresh(current_user)
    return current_user.to_dict()


@router.post("/verify")
async def verify_identity(
    dni: str = Query(...), selfie_url: str = Query(None),
    current_user=Depends(get_current_user), db: AsyncSession = Depends(get_db),
):
    """Solicitar verificación de identidad."""
    current_user.verified = False  # Queda pendiente de revisión manual
    await db.commit()
    return {"status": "pending", "message": "Verification request submitted"}


@router.get("/{user_id}")
async def get_public_profile(user_id: str, db: AsyncSession = Depends(get_db)):
    """Perfil público de un usuario."""
    user = (await db.execute(select(User).where(User.id == user_id))).scalar_one_or_none()
    if not user:
        raise HTTPException(404, "User not found")
    d = user.to_dict()
    d.pop("email", None)
    d.pop("password_hash", None)
    return d


@router.get("/me/export")
async def export_data(current_user=Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    """GDPR: Exportar todos los datos del usuario."""
    return {
        "user": current_user.to_dict(),
        "message": "GDPR data export — full history to be added"
    }


@router.delete("/me")
async def delete_account(current_user=Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    """GDPR: Eliminar cuenta (soft delete)."""
    current_user.email = f"deleted_{current_user.id}@treqe.es"
    current_user.name = "Deleted User"
    await db.commit()
    return {"ok": True, "message": "Account deleted"}
