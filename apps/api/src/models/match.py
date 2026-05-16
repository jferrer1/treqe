"""Match + MatchParticipant models — ciclos de intercambio."""
import uuid
from datetime import datetime
from sqlalchemy import String, Float, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from ..database import Base


class Match(Base):
    __tablename__ = "matches"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    circular_id: Mapped[str | None] = mapped_column(String(36), default=None)
    status: Mapped[str] = mapped_column(String(20), default="pending")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    expires_at: Mapped[datetime | None] = mapped_column(DateTime, default=None)

    def to_dict(self):
        return {
            "id": self.id, "circular_id": self.circular_id,
            "status": self.status, "created_at": self.created_at.isoformat(),
            "expires_at": self.expires_at.isoformat() if self.expires_at else None,
        }


class MatchParticipant(Base):
    __tablename__ = "match_participants"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    match_id: Mapped[str] = mapped_column(String(36), ForeignKey("matches.id"), nullable=False)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False)
    product_id: Mapped[str] = mapped_column(String(36), ForeignKey("products.id"), nullable=False)
    receives_from: Mapped[str | None] = mapped_column(String(36), ForeignKey("users.id"), default=None)
    cash_diff: Mapped[float] = mapped_column(Float, default=0)
    status: Mapped[str] = mapped_column(String(20), default="pending")
    accepted_at: Mapped[datetime | None] = mapped_column(DateTime, default=None)

    def to_dict(self):
        return {
            "id": self.id, "match_id": self.match_id,
            "user_id": self.user_id, "product_id": self.product_id,
            "receives_from": self.receives_from, "cash_diff": self.cash_diff,
            "status": self.status,
        }
