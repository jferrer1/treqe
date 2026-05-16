"""Treqe API — FastAPI application."""
import sys
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

print(f"[treqe] Starting API...", file=sys.stderr)
print(f"[treqe] Python {sys.version}", file=sys.stderr)

from .config import settings
print(f"[treqe] DB: {settings.DATABASE_URL[:30]}... DEBUG={settings.DEBUG}", file=sys.stderr)

from .database import engine, Base
print(f"[treqe] DB engine created", file=sys.stderr)


# Redis listener (solo si hay Redis disponible)
from .services import redis_listener as rl
redis_listener = None
if settings.REDIS_URL and "redis://" in settings.REDIS_URL:
    try:
        redis_listener = rl.RedisListener(settings.REDIS_URL)
        rl._listener = redis_listener
        print(f"[treqe] Redis listener ready", file=sys.stderr)
    except Exception as e:
        print(f"[treqe] Redis unavailable: {e}", file=sys.stderr)


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("[treqe] Creating database tables...", file=sys.stderr)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("[treqe] Database ready", file=sys.stderr)
    if redis_listener:
        await redis_listener.start()
        print("[treqe] Redis listener started", file=sys.stderr)
    yield
    if redis_listener:
        await redis_listener.stop()
    print("[treqe] Shutting down...", file=sys.stderr)
    await engine.dispose()


app = FastAPI(title="Treqe API", version="0.1.0", lifespan=lifespan)

# Rate limiting — 200 req/min público, 500 req/min autenticado
limiter = Limiter(key_func=get_remote_address, default_limits=["200/minute"])
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
async def health():
    """Health check con verificación real de servicios."""
    import sys
    db_status = "disconnected"
    try:
        async with engine.connect() as conn:
            await conn.execute(__import__("sqlalchemy", fromlist=["text"]).text("SELECT 1"))
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {e}"

    redis_status = "disconnected"
    try:
        from .services.redis_listener import get_listener
        rl = get_listener()
        if rl:
            await rl.redis.ping()
            redis_status = "connected"
    except Exception:
        pass

    workers_status = "unknown"
    try:
        from .workers.celery_app import celery_app
        workers_status = "configured" if celery_app else "not_configured"
    except Exception:
        workers_status = "not_available"

    return {
        "status": "ok",
        "version": "0.1.0",
        "db": db_status,
        "redis": redis_status,
        "workers": workers_status,
    }


# Routers — Todas las fases
from .routers import auth, products, favorites, purchases, payments, shipments, disputes, notifications, offers, matches, algorithm, reviews, users

app.include_router(auth.router)
app.include_router(products.router)
app.include_router(favorites.router)
app.include_router(purchases.router)
app.include_router(payments.router)
app.include_router(shipments.router)
app.include_router(disputes.router)
app.include_router(notifications.router)
app.include_router(offers.router)
app.include_router(matches.router)
app.include_router(algorithm.router)
app.include_router(reviews.router)
app.include_router(users.router)
