"""Support router — contacto y ayuda."""
from fastapi import APIRouter, Depends, Query
from ..dependencies import get_current_user

router = APIRouter(prefix="/api/support", tags=["support"])


@router.post("/", status_code=201)
async def create_support_ticket(
    subject: str = Query(...), message: str = Query(...),
    current_user=Depends(get_current_user),
):
    """Crear ticket de soporte."""
    return {"status": "received", "ticket_id": f"TKT-{hash(subject + current_user.id) % 100000:05d}"}
