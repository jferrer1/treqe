"""SQLAlchemy async engine + session factory."""
import sys
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from .config import settings

db_url = settings.DATABASE_URL
print(f"[treqe] DB URL type: {'PostgreSQL' if 'postgres' in db_url.lower() else 'SQLite' if 'sqlite' in db_url.lower() else 'unknown'}", file=sys.stderr)

# Convertir postgresql:// → postgresql+asyncpg:// (Railway da sin +asyncpg)
if db_url and "postgresql://" in db_url and "+asyncpg" not in db_url:
    db_url = db_url.replace("postgresql://", "postgresql+asyncpg://", 1)
elif not db_url or "${{" in db_url:
    # Railway reference variable no resuelta → SQLite fallback
    print("[treqe] WARNING: DATABASE_URL is unresolved reference, using SQLite fallback", file=sys.stderr)
    db_url = "sqlite+aiosqlite:///treqe_dev.db"

engine = create_async_engine(
    db_url,
    echo=settings.DEBUG,
    connect_args={"check_same_thread": False} if "sqlite" in db_url else {},
)

async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


async def get_db():
    async with async_session() as session:
        try:
            yield session
        finally:
            await session.close()
