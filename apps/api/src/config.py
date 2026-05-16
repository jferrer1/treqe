"""Pydantic settings."""
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "treqe-api"
    DEBUG: bool = True
    DATABASE_URL: str = "sqlite+aiosqlite:///treqe_dev.db"
    REDIS_URL: str = "redis://localhost:6379"
    JWT_SECRET: str = "treqe-dev-secret-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    CORS_ORIGINS: list[str] = ["http://localhost:5173", "https://treqe.netlify.app", "https://treqe.es"]
    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""
    SUPABASE_SERVICE_KEY: str = ""
    SUPABASE_JWKS_URL: str = ""
    SUPABASE_JWT_SECRET: str = ""
    RAILWAY_PROJECT_ID: str = ""
    STRIPE_SECRET_KEY: str = ""
    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8", "extra": "ignore"}


settings = Settings()
