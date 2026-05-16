"""Cleanup worker — tareas de mantenimiento periódicas."""
import sys
from datetime import datetime, timedelta
from .celery_app import celery_app


@celery_app.task(name="src.workers.cleanup_worker.run_cleanup")
def run_cleanup():
    """
    Limpieza periódica (cada hora):
    - Expira matches > 24h
    - Limpia rejected_pairs > 7 días
    - Soft-delete productos inactivos > 90 días
    """
    results = {"matches_expired": 0, "rejected_cleaned": 0, "products_cleaned": 0}
    print(f"[cleanup_worker] Running...")

    # En producción: queries contra PostgreSQL
    # Por ahora: log y placeholder
    results["matches_expired"] = 0
    results["rejected_cleaned"] = 0
    results["products_cleaned"] = 0

    print(f"[cleanup_worker] Done: {results}", file=sys.stderr)
    return results
