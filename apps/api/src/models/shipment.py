"""Shipment model."""
import uuid
from datetime import datetime
from sqlalchemy import String, Float, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from ..database import Base


class Shipment(Base):
    __tablename__ = "shipments"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    reference_id: Mapped[str] = mapped_column(String(36), nullable=False)
    reference_type: Mapped[str] = mapped_column(String(20), nullable=False)  # "purchase" | "match"
    from_user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False)
    to_user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False)
    carrier: Mapped[str | None] = mapped_column(String(50), default=None)
    tracking_number: Mapped[str | None] = mapped_column(String(100), default=None)
    label_url: Mapped[str | None] = mapped_column(String(500), default=None)
    insurance: Mapped[float | None] = mapped_column(Float, default=None)
    status: Mapped[str] = mapped_column(String(20), default="pending")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id, "reference_id": self.reference_id,
            "carrier": self.carrier, "tracking_number": self.tracking_number,
            "status": self.status, "created_at": self.created_at.isoformat(),
        }
