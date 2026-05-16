"""Purchase model — compra directa."""
import uuid
from datetime import datetime
from sqlalchemy import String, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from ..database import Base


class Purchase(Base):
    __tablename__ = "purchases"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    buyer_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False)
    seller_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False)
    product_id: Mapped[str] = mapped_column(String(36), ForeignKey("products.id"), nullable=False)
    price: Mapped[float] = mapped_column(Float, nullable=False)
    shipping: Mapped[float | None] = mapped_column(Float, default=None)
    insurance: Mapped[bool] = mapped_column(Boolean, default=False)
    total: Mapped[float | None] = mapped_column(Float, default=None)
    status: Mapped[str] = mapped_column(String(20), default="requested")
    # requested → accepted → paid → shipped → received → completed
    #                                               → disputed
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id, "buyer_id": self.buyer_id, "seller_id": self.seller_id,
            "product_id": self.product_id, "price": self.price,
            "shipping": self.shipping, "insurance": self.insurance, "total": self.total,
            "status": self.status, "created_at": self.created_at.isoformat(),
        }
