"""Algorithm worker — ejecuta find_cycles_adaptive en background."""
import json
import sys
from datetime import datetime
from redis import Redis
from .celery_app import celery_app

redis_client = Redis.from_url("redis://localhost:6379", decode_responses=True)


@celery_app.task(name="src.workers.algorithm_worker.run_algorithm")
def run_algorithm(trigger: str = "scheduled"):
    """
    Ejecuta el algoritmo de matching circular.
    
    Disparado por:
    - Celery Beat (cada 15 min) → trigger="scheduled"
    - Nueva oferta (POST /api/offers) → trigger="new_offer"
    """
    print(f"[algorithm_worker] Running (trigger={trigger})")

    # Cargar ofertas activas desde PostgreSQL
    # En producción: usar SQLAlchemy async con un event loop separado
    # Para Celery sync: usar el sync engine o httpx contra la API
    
    try:
        # Simulación por ahora — en producción integra el motor real
        cycles_found = _run_matching()
        
        # Notificar participantes vía Redis Pub/Sub
        for cycle in cycles_found:
            for user_id in cycle.get("user_ids", []):
                notification = {
                    "type": "new_match",
                    "title": "¡Nuevo intercambio encontrado!",
                    "body": f"Se encontró un círculo de {cycle.get('size', 0)} artículos",
                    "action_url": f"/treqes",
                    "reference_id": cycle.get("id", ""),
                    "timestamp": datetime.utcnow().isoformat(),
                }
                redis_client.publish(f"user:{user_id}", json.dumps(notification))
        
        return {"cycles_found": len(cycles_found), "trigger": trigger}
    except Exception as e:
        print(f"[algorithm_worker] Error: {e}", file=sys.stderr)
        return {"error": str(e)}


def _run_matching():
    """Wrapper para el motor de matching (conexión a BD real en prod)."""
    # En producción: carga ofertas de PostgreSQL, ejecuta find_cycles_adaptive()
    # Por ahora: placeholder que será reemplazado cuando se integre el motor
    return []
