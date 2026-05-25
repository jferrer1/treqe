"""Payment methods router — tarjetas guardadas."""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db
from ..dependencies import get_current_user

router = APIRouter(prefix="/api/payments/methods", tags=["payment_methods"])

# Simulación para MVP — en producción: Stripe Customer API
_fake_methods: dict[str, list[dict]] = {}


def _get_user_methods(user_id: str) -> list[dict]:
    if user_id not in _fake_methods:
        _fake_methods[user_id] = [
            {"id": "pm_default", "type": "card", "brand": "Visa", "last4": "4242", "expiry": "12/28", "is_default": True}
        ]
    return _fake_methods[user_id]


@router.get("/")
async def list_methods(current_user=Depends(get_current_user)):
    return {"items": _get_user_methods(current_user.id)}


@router.post("/", status_code=201)
async def add_method(
    card_number: str = Query(...), expiry: str = Query(...), cvc: str = Query(...),
    current_user=Depends(get_current_user),
):
    """Añadir método de pago. En producción → Stripe SetupIntent."""
    import uuid
    method = {"id": str(uuid.uuid4())[:8], "type": "card", "brand": "Visa",
              "last4": card_number[-4:], "expiry": expiry, "is_default": False}
    _get_user_methods(current_user.id).append(method)
    return method


@router.delete("/{method_id}")
async def remove_method(method_id: str, current_user=Depends(get_current_user)):
    methods = _get_user_methods(current_user.id)
    _fake_methods[current_user.id] = [m for m in methods if m["id"] != method_id]
    return {"ok": True}
