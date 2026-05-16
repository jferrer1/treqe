"""Celery app configuration for Treqe."""
from celery import Celery
from ..config import settings

celery_app = Celery(
    "treqe",
    broker=settings.REDIS_URL or "redis://localhost:6379",
    backend=settings.REDIS_URL or "redis://localhost:6379",
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_acks_late=True,
    worker_prefetch_multiplier=1,
    task_soft_time_limit=30,
    task_time_limit=60,
    beat_schedule={
        "algorithm-run": {
            "task": "src.workers.algorithm_worker.run_algorithm",
            "schedule": 900.0,  # cada 15 min
        },
        "cleanup-run": {
            "task": "src.workers.cleanup_worker.run_cleanup",
            "schedule": 3600.0,  # cada hora
        },
    },
)
