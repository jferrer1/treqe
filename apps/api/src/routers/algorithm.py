"""Algorithm router — dispara el matching engine."""
from fastapi import APIRouter, Depends, Query
from ..dependencies import get_current_user

router = APIRouter(prefix="/api/algorithm", tags=["algorithm"])


@router.post("/run")
async def trigger_algorithm(current_user=Depends(get_current_user), sync: bool = Query(False)):
    """Dispara el algoritmo de matching. ?sync=true para ejecucion sincrona."""
    try:
        from ..workers.algorithm_worker import run_algorithm, _run_matching_sync
        if sync:
            cycles, debug = _run_matching_sync()
            return {"status": "completed", "cycles_found": len(cycles), "cycles": cycles, "debug": debug}
        task = run_algorithm.delay("manual")
        return {"status": "queued", "task_id": task.id}
    except Exception as e:
        import traceback
        return {"status": "error", "detail": str(e), "traceback": traceback.format_exc()}
