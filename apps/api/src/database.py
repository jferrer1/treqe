"""SQLAlchemy async engine + session factory."""
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from .config import settings

# SQLite para desarrollo local (Shadow PC sin Docker)
# Cambiar a DATABASE_URL=postgresql+asyncpg://... en Railway
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {},
)

async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


class Base(DeclarativeBase):
    """Clase base para todos los modelos ORM."""
    pass


async def get_db():
    """FastAPI dependency: inyecta sesión de BD."""
    async with async_session() as session:
        try:
            yield session
        finally:
            await session.close()
