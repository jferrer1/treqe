"""Payment model."""
import uuid
from datetime import datetime
from sqlalchemy import String, Float, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from ..database import Base


class Payment(Base):
    __tablename__ = "payments"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False)
    reference_id: Mapped[str] = mapped_column(String(36), nullable=False)
    reference_type: Mapped[str] = mapped_column(String(20), nullable=False)  # "purchase" | "match"
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    stripe_payment_intent_id: Mapped[str | None] = mapped_column(String(255), default=None)
    status: Mapped[str] = mapped_column(String(20), default="pending")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id, "user_id": self.user_id, "amount": self.amount,
            "reference_id": self.reference_id, "reference_type": self.reference_type,
            "status": self.status, "created_at": self.created_at.isoformat(),
        }
