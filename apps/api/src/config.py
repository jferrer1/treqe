from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # App
    APP_NAME: str = "treqe-api"
    DEBUG: bool = False

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://treqe:treqe_dev@localhost:5432/treqe_dev"

    # Redis
    REDIS_URL: str = "redis://localhost:6379"

    # JWT (Supabase)
    SUPABASE_URL: str = ""
    SUPABASE_JWT_SECRET: str = ""

    # Stripe
    STRIPE_SECRET_KEY: str = ""
    STRIPE_WEBHOOK_SECRET: str = ""

    # Cloudinary
    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""

    # SendCloud
    SENDCLOUD_API_KEY: str = ""
    SENDCLOUD_API_SECRET: str = ""

    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "https://treqe.netlify.app",
        "https://treqe.es",
    ]

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
