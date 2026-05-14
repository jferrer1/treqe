from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    # STARTUP: Inicializar Redis listener, pool DB, etc.
    yield
    # SHUTDOWN: Cerrar conexiones


app = FastAPI(
    title="Treqe API",
    version="0.0.1",
    description="Marketplace de intercambio circular inteligente",
    lifespan=lifespan,
)

# CORS — Permite frontend en Netlify y desarrollo local
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
async def health_check():
    """Health check para Railway y monitoreo."""
    return {
        "status": "ok",
        "version": "0.0.1",
        "service": "treqe-api",
    }


# Routers (se importan aquí para evitar circular imports)
# Cada fase añade sus routers:
# from .routers import auth, products, ...
# app.include_router(auth.router)
