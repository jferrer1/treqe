"""Payments router — Stripe intents + escrow."""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db
from ..models.payment import Payment
from ..models.purchase import Purchase
from ..dependencies import get_current_user
from ..config import settings
import stripe as _stripe
import json

router = APIRouter(prefix="/api/payments", tags=["payments"])


@router.post("/intent")
async def create_payment_intent(
    reference_id: str = Query(...), reference_type: str = Query(...),
    current_user=Depends(get_current_user), db: AsyncSession = Depends(get_db),
):
    """Crear intent de pago Stripe."""
    # Verificar referencia
    if reference_type == "purchase":
        purchase = (await db.execute(select(Purchase).where(Purchase.id == reference_id))).scalar_one_or_none()
        if not purchase:
            raise HTTPException(404, "Purchase not found")
        if purchase.buyer_id != current_user.id:
            raise HTTPException(403, "Not your purchase")
        amount = int(purchase.total * 100) if purchase.total else int(purchase.price * 100)
    else:
        raise HTTPException(400, f"Unknown reference_type: {reference_type}")

    # Crear Payment en BD
    payment = Payment(user_id=current_user.id, reference_id=reference_id,
                      reference_type=reference_type, amount=amount / 100, status="pending")
    db.add(payment)
    await db.commit()
    await db.refresh(payment)

    # Crear intent en Stripe (si la clave está configurada)
    client_secret = None
    if settings.STRIPE_SECRET_KEY:
        _stripe.api_key = settings.STRIPE_SECRET_KEY
        intent = _stripe.PaymentIntent.create(
            amount=amount, currency="eur",
            metadata={"payment_id": payment.id, "reference_type": reference_type, "reference_id": reference_id},
        )
        payment.stripe_payment_intent_id = intent.id
        await db.commit()
        client_secret = intent.client_secret

    return {"payment_id": payment.id, "client_secret": client_secret, "amount": amount / 100}


@router.get("/escrow/{payment_id}")
async def escrow_status(payment_id: str, current_user=Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    """Consultar estado del escrow."""
    payment = (await db.execute(select(Payment).where(Payment.id == payment_id))).scalar_one_or_none()
    if not payment:
        raise HTTPException(404, "Payment not found")
    return payment.to_dict()


@router.post("/webhook")
async def stripe_webhook(db: AsyncSession = Depends(get_db)):
    """Webhook de Stripe — se llama desde Stripe, no desde el frontend."""
    from fastapi import Request
    return {"received": True}
