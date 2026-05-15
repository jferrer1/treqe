"""Product model."""
import uuid
from datetime import datetime
from sqlalchemy import String, Text, Float, Integer, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ..database import Base


class Product(Base):
    __tablename__ = "products"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, default=None)
    price: Mapped[float] = mapped_column(Float, nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False)
    subcategory: Mapped[str | None] = mapped_column(String(50), default=None)
    condition: Mapped[str] = mapped_column(String(20), nullable=False)
    weight: Mapped[float | None] = mapped_column(Float, default=None)
    dim_l: Mapped[int | None] = mapped_column(Integer, default=None)
    dim_w: Mapped[int | None] = mapped_column(Integer, default=None)
    dim_h: Mapped[int | None] = mapped_column(Integer, default=None)
    photos: Mapped[str] = mapped_column(Text, default="[]")  # JSON array as string (SQLite compat)
    videos: Mapped[str] = mapped_column(Text, default="[]")
    status: Mapped[str] = mapped_column(String(20), default="active")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="products", lazy="selectin")

    def to_dict(self):
        import json
        return {
            "id": self.id,
            "user_id": self.user_id,
            "title": self.title,
            "description": self.description,
            "price": self.price,
            "category": self.category,
            "subcategory": self.subcategory,
            "condition": self.condition,
            "weight": self.weight,
            "photos": json.loads(self.photos) if self.photos else [],
            "videos": json.loads(self.videos) if self.videos else [],
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
