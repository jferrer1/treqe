"""Offer model — un usuario ofrece un producto a cambio de otro."""
import uuid
from datetime import datetime
from sqlalchemy import String, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from ..database import Base


class Offer(Base):
    __tablename__ = "offers"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False)
    product_id_offers: Mapped[str] = mapped_column(String(36), ForeignKey("products.id"), nullable=False)
    product_id_wants: Mapped[str] = mapped_column(String(36), ForeignKey("products.id"), nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="active")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id, "user_id": self.user_id,
            "product_id_offers": self.product_id_offers,
            "product_id_wants": self.product_id_wants,
            "status": self.status, "created_at": self.created_at.isoformat(),
        }
