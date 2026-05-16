"""Notification service — guarda notificación y publica en Redis."""
from sqlalchemy.ext.asyncio import AsyncSession
from ..models.notification import Notification


async def notify_user(user_id: str, notif_type: str, title: str, body: str = "", action_url: str = ""):
    """Guarda notificación en BD. Redis Pub/Sub se maneja en el worker."""
    # En producción: esto se haría desde un Celery worker con acceso a BD
    # Por ahora: placeholder que se completa cuando Celery esté corriendo
    pass
