"""Algorithm router — dispara el matching engine."""
from fastapi import APIRouter, Depends
from ..dependencies import get_current_user

router = APIRouter(prefix="/api/algorithm", tags=["algorithm"])


@router.post("/run")
async def trigger_algorithm(current_user=Depends(get_current_user)):
    """Dispara el algoritmo de matching. Requiere auth."""
    try:
        from ..workers.algorithm_worker import run_algorithm
        task = run_algorithm.delay("manual")
        return {"status": "queued", "task_id": task.id}
    except Exception as e:
        return {"status": "error", "detail": str(e)}
