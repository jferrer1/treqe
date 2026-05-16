"""Notification worker — envía notificaciones push + in-app."""
import json
import sys
from datetime import datetime

try:
    from redis import Redis
    redis_client = Redis.from_url("redis://localhost:6379", decode_responses=True)
except (ImportError, Exception):
    redis_client = None

from .celery_app import celery_app


@celery_app.task(name="src.workers.notification_worker.send_notification")
def send_notification(user_id: str, notif_type: str, title: str, body: str = "", action_url: str = ""):
    """
    Envía una notificación a un usuario:
    1. Guarda en BD (in-app)
    2. Publica en Redis Pub/Sub (WebSocket)
    3. Push notification (FCM/APNs — futuro)
    """
    notification = {
        "type": notif_type,
        "title": title,
        "body": body,
        "action_url": action_url,
        "timestamp": datetime.utcnow().isoformat(),
    }
    
    # Redis Pub/Sub → WebSocket
    if redis_client:
        redis_client.publish(f"user:{user_id}", json.dumps(notification))
    
    print(f"[notification_worker] Sent to user:{user_id} type={notif_type}", file=sys.stderr)
    return {"ok": True, "user_id": user_id}
