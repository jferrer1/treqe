"""Algorithm router — dispara el matching engine."""
from fastapi import APIRouter, Depends, Query
from ..dependencies import get_current_user

router = APIRouter(prefix="/api/algorithm", tags=["algorithm"])


@router.post("/run")
async def trigger_algorithm(current_user=Depends(get_current_user), sync: bool = Query(False)):
    """Dispara el algoritmo de matching. ?sync=true para ejecucion sincrona."""
    try:
        from ..workers.algorithm_worker import _run_matching_sync
        if sync:
            try:
                cycles, debug = _run_matching_sync()
            except Exception as e2:
                import traceback
                return {"status": "error", "detail": str(e2), "traceback": traceback.format_exc()}
            return {"status": "completed", "cycles_found": len(cycles), "cycles": cycles, "debug": debug}
        # Async: run in background thread (no Celery needed)
        import asyncio
        asyncio.create_task(asyncio.to_thread(_run_matching_sync))
        return {"status": "started"}
    except Exception as e:
        import traceback
        return {"status": "error", "detail": str(e), "traceback": traceback.format_exc()}
