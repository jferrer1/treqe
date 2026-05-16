"""Notification service — guarda y publica notificaciones."""
import json
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from ..models.notification import Notification


async def notify_user(user_id: str, notif_type: str, title: str, body: str = "",
                      action_url: str = "", db: AsyncSession | None = None):
    """Guarda notificación en BD y publica en Redis Pub/Sub."""
    if db:
        notif = Notification(
            user_id=user_id, type=notif_type, title=title,
            body=body, action_url=action_url
        )
        db.add(notif)
        await db.commit()

    # Redis Pub/Sub → WebSocket (si Redis disponible)
    try:
        from redis import Redis
        r = Redis.from_url("redis://localhost:6379", decode_responses=True)
        r.publish(f"user:{user_id}", json.dumps({
            "type": notif_type, "title": title, "body": body,
            "action_url": action_url, "timestamp": datetime.utcnow().isoformat(),
        }))
    except Exception:
        pass  # Redis no disponible en dev
