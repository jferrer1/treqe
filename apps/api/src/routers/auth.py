"""Auth router — register, login, refresh, logout, me."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db
from ..models.user import User
from ..schemas.auth import RegisterRequest, LoginRequest, AuthResponse
from ..services.auth import hash_password, verify_password, create_local_token
from ..dependencies import get_current_user
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

bearer = HTTPBearer()

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=AuthResponse)
async def register(body: RegisterRequest, db: AsyncSession = Depends(get_db)):
    existing = await db.execute(select(User).where(User.email == body.email))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")
    user = User(email=body.email, password_hash=hash_password(body.password), name=body.name)
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return AuthResponse(token=create_local_token(user.id), user=user.to_dict())


@router.post("/login", response_model=AuthResponse)
async def login(body: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == body.email))
    user = result.scalar_one_or_none()
    if not user or not verify_password(body.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    return AuthResponse(token=create_local_token(user.id), user=user.to_dict())


@router.get("/me")
async def me(current_user: User = Depends(get_current_user)):
    return current_user.to_dict()


@router.post("/refresh")
async def refresh(credentials: HTTPAuthorizationCredentials = Depends(bearer)):
    """Refrescar token JWT."""
    from ..services.auth import decode_token, create_local_token
    payload = decode_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    return {"token": create_local_token(payload["sub"])}


@router.post("/logout")
async def logout():
    """Logout — el cliente descarta el token."""
    return {"ok": True}
