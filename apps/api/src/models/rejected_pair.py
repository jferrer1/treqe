"""RejectedPair model — pares de artículos rechazados (TTL 7 días)."""
from datetime import datetime, timedelta
from sqlalchemy import String, DateTime, ForeignKey, PrimaryKeyConstraint
from sqlalchemy.orm import Mapped, mapped_column
from ..database import Base


class RejectedPair(Base):
    __tablename__ = "rejected_pairs"

    article_a: Mapped[str] = mapped_column(String(36), ForeignKey("products.id"), nullable=False)
    article_b: Mapped[str] = mapped_column(String(36), ForeignKey("products.id"), nullable=False)
    rejected_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    expires_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.utcnow() + timedelta(days=7))

    __table_args__ = (PrimaryKeyConstraint("article_a", "article_b"),)
