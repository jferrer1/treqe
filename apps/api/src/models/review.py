"""Review model — valoraciones entre usuarios."""
import uuid
from datetime import datetime
from sqlalchemy import String, Integer, Text, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from ..database import Base


class Review(Base):
    __tablename__ = "reviews"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    from_user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False)
    to_user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False)
    reference_id: Mapped[str | None] = mapped_column(String(36), default=None)
    score: Mapped[int] = mapped_column(Integer, nullable=False)
    comment: Mapped[str | None] = mapped_column(Text, default=None)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id, "from_user_id": self.from_user_id, "to_user_id": self.to_user_id,
            "reference_id": self.reference_id, "score": self.score, "comment": self.comment,
            "created_at": self.created_at.isoformat(),
        }
