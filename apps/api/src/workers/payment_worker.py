"""Payment worker — procesa webhooks de Stripe y libera escrow."""
import json
import sys
from datetime import datetime

try:
    from redis import Redis
    redis_client = Redis.from_url("redis://localhost:6379", decode_responses=True)
except (ImportError, Exception):
    redis_client = None

from .celery_app import celery_app


@celery_app.task(name="src.workers.payment_worker.process_webhook")
def process_webhook(event_type: str, event_data: dict):
    """
    Procesa eventos de Stripe:
    - payment_intent.succeeded → actualiza estado pago
    - payment_intent.failed → notifica al usuario
    - charge.refunded → libera escrow
    """
    print(f"[payment_worker] Processing: {event_type}")

    if event_type == "payment_intent.succeeded":
        _handle_payment_success(event_data)
    elif event_type == "payment_intent.payment_failed":
        _handle_payment_failed(event_data)
    elif event_type == "charge.refunded":
        _handle_refund(event_data)

    return {"processed": event_type}


def _handle_payment_success(data: dict):
    """Actualizar BD: pago confirmado → liberar para envío."""
    payment_id = data.get("metadata", {}).get("payment_id", "")
    user_id = data.get("metadata", {}).get("user_id", "")
    if redis_client and user_id:
        redis_client.publish(f"user:{user_id}", json.dumps({
            "type": "payment_confirmed",
            "title": "¡Pago confirmado!",
            "body": "El vendedor puede proceder al envío",
            "action_url": "/treqes",
            "reference_id": payment_id,
            "timestamp": datetime.utcnow().isoformat(),
        }))


def _handle_payment_failed(data: dict):
    """Notificar fallo de pago."""
    user_id = data.get("metadata", {}).get("user_id", "")
    if redis_client and user_id:
        redis_client.publish(f"user:{user_id}", json.dumps({
            "type": "payment_failed",
            "title": "El pago ha fallado",
            "body": "Inténtalo de nuevo con otro método",
            "action_url": "/treqes",
            "reference_id": "",
            "timestamp": datetime.utcnow().isoformat(),
        }))


def _handle_refund(data: dict):
    """Liberar fondos del escrow."""
    print(f"[payment_worker] Refund processed")


@celery_app.task(name="src.workers.payment_worker.release_escrow")
def release_escrow(payment_id: str):
    """Liberar fondos del escrow después de confirmar recepción."""
    print(f"[payment_worker] Releasing escrow for payment {payment_id}")
    if redis_client:
        redis_client.publish("system:escrow", json.dumps({
            "type": "escrow_released",
            "payment_id": payment_id,
            "timestamp": datetime.utcnow().isoformat(),
        }))
    return {"released": payment_id}
