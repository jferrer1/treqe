"""Dispute model."""
import uuid
from datetime import datetime
from sqlalchemy import String, Text, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from ..database import Base


class Dispute(Base):
    __tablename__ = "disputes"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    reference_id: Mapped[str] = mapped_column(String(36), nullable=False)
    reference_type: Mapped[str] = mapped_column(String(20), nullable=False)  # "purchase" | "match"
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False)
    reason: Mapped[str] = mapped_column(String(50), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, default=None)
    photos: Mapped[str] = mapped_column(Text, default="[]")
    videos: Mapped[str] = mapped_column(Text, default="[]")
    status: Mapped[str] = mapped_column(String(20), default="open")
    resolution: Mapped[str | None] = mapped_column(Text, default=None)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        import json
        return {
            "id": self.id, "reference_id": self.reference_id,
            "reason": self.reason, "description": self.description,
            "status": self.status, "resolution": self.resolution,
            "created_at": self.created_at.isoformat(),
        }
