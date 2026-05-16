"""JWT auth service — Supabase JWKS + local fallback."""
import json
from datetime import datetime, timedelta
from jose import jwt, JWTError
import httpx
from ..config import settings

# Cache de la public key de Supabase (JWKS)
_jwks_cache: list[dict] | None = None


async def get_supabase_public_key(kid: str) -> dict | None:
    """Obtiene la public key de Supabase desde el JWKS endpoint."""
    global _jwks_cache
    if not _jwks_cache:
        async with httpx.AsyncClient() as client:
            resp = await client.get(settings.SUPABASE_JWKS_URL)
            resp.raise_for_status()
            _jwks_cache = resp.json()["keys"]
    for key in _jwks_cache:
        if key.get("kid") == kid:
            return key
    return None


def decode_token(token: str) -> dict | None:
    """
    Intenta validar el token en este orden:
    1. Supabase JWT (ES256, via JWKS public key)
    2. Local JWT (HS256, shared secret — modo dev)
    """
    # 1. Intentar Supabase (sin verificar firma primero para leer el kid)
    try:
        unverified = jwt.get_unverified_header(token)
        kid = unverified.get("kid")
        # Si tiene kid y algorithm ES256 → es token de Supabase
        if kid and unverified.get("alg") == "ES256":
            return _verify_supabase_token(token, kid)
    except JWTError:
        pass

    # 2. Intentar local HS256 (desarrollo)
    try:
        return jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
    except JWTError:
        return None


def _verify_supabase_token(token: str, kid: str) -> dict | None:
    """Verifica un token de Supabase sincrónicamente (usa cache de JWKS)."""
    import asyncio
    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    
    jwk_data = loop.run_until_complete(get_supabase_public_key(kid))
    if not jwk_data:
        return None
    try:
        # Construir PEM manualmente para ES256 (P-256 curve)
        from cryptography.hazmat.primitives import serialization
        from cryptography.hazmat.primitives.asymmetric import ec
        from cryptography.hazmat.backends import default_backend
        import base64
        
        x_int = int.from_bytes(base64.urlsafe_b64decode(jwk_data["x"] + "=="), "big")
        y_int = int.from_bytes(base64.urlsafe_b64decode(jwk_data["y"] + "=="), "big")
        public_numbers = ec.EllipticCurvePublicNumbers(x_int, y_int, ec.SECP256R1())
        public_key = public_numbers.public_key(default_backend())
        pem = public_key.public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo
        )
        
        return jwt.decode(token, pem, algorithms=["ES256"],
                         audience="authenticated",
                         options={"verify_aud": True, "verify_exp": True})
    except (JWTError, Exception):
        return None


# ─── Local auth (desarrollo sin Supabase) ───

import hashlib
import secrets


def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    return f"{salt}${hashlib.sha256(f'{salt}{password}'.encode()).hexdigest()}"


def verify_password(plain: str, hashed: str) -> bool:
    try:
        salt, stored = hashed.split("$", 1)
        return hashlib.sha256(f'{salt}{plain}'.encode()).hexdigest() == stored
    except (ValueError, AttributeError):
        return False


def create_local_token(user_id: str) -> str:
    """Token local para desarrollo (HS256)."""
    expire = datetime.utcnow() + timedelta(minutes=settings.JWT_EXPIRE_MINUTES)
    return jwt.encode(
        {"sub": user_id, "exp": expire, "role": "authenticated"},
        settings.JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM,
    )
