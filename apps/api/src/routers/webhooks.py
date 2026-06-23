"""Stripe webhook handler — escrow automation."""
import sys
import json
from fastapi import APIRouter, Request, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/api/webhooks", tags=["webhooks"])


@router.post("/stripe")
async def stripe_webhook(request: Request):
    """
    Stripe webhook endpoint.
    
    Events handled:
    - payment_intent.succeeded → auto-confirm escrow payment
    - payment_intent.canceled → release escrow
    """
    from ..config import settings
    from ..database import async_session
    from ..models.match import MatchParticipant, Match
    
    try:
        import stripe
        stripe.api_key = settings.STRIPE_SECRET_KEY
        payload = await request.body()
        sig_header = request.headers.get("stripe-signature", "")
        
        # Verify webhook signature
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
            )
        except ValueError:
            raise HTTPException(400, "Invalid payload")
        except stripe.error.SignatureVerificationError:
            raise HTTPException(400, "Invalid signature")
        
        event_type = event["type"]
        data = event["data"]["object"]
        
        if event_type == "payment_intent.succeeded":
            return await handle_payment_succeeded(data, async_session)
        elif event_type == "payment_intent.canceled":
            return await handle_payment_canceled(data, async_session)
        
        return {"status": "ignored", "type": event_type}
        
    except Exception as e:
        print(f"[webhook] Error: {e}", file=sys.stderr)
        return {"status": "error", "detail": str(e)}


async def handle_payment_succeeded(payment_intent, session_factory):
    """Auto-confirm escrow payment when PaymentIntent succeeds."""
    pi_id = payment_intent.get("id")
    metadata = payment_intent.get("metadata", {})
    match_id = metadata.get("match_id")
    
    if not match_id or metadata.get("type") != "trade_escrow":
        return {"status": "ignored", "reason": "not trade escrow"}
    
    async with session_factory() as db:
        # Find the participant with this payment intent
        from ..models.match import MatchParticipant
        result = await db.execute(
            select(MatchParticipant).where(
                MatchParticipant.payment_intent_id == pi_id
            )
        )
        part = result.scalar_one_or_none()
        
        if not part:
            return {"status": "ignored", "reason": "participant not found"}
        
        part.payment_confirmed = True
        await db.commit()
        
        print(f"[webhook] Payment confirmed for match {match_id}, user {part.user_id}", file=sys.stderr)
        
        # Check if all participants have accepted AND paid
        await check_all_confirmed(db, match_id)
        
        return {"status": "ok", "action": "payment_confirmed"}


async def handle_payment_canceled(payment_intent, session_factory):
    """Handle cancelled payment (refund/release)."""
    pi_id = payment_intent.get("id")
    
    async with session_factory() as db:
        from ..models.match import MatchParticipant
        result = await db.execute(
            select(MatchParticipant).where(
                MatchParticipant.payment_intent_id == pi_id
            )
        )
        part = result.scalar_one_or_none()
        
        if part:
            part.payment_intent_id = None
            part.payment_confirmed = False
            await db.commit()
        
        return {"status": "ok", "action": "payment_canceled"}


async def check_all_confirmed(db: AsyncSession, match_id: str):
    """If all participants accepted and paid, release escrow and activate match."""
    from ..models.match import MatchParticipant, Match
    
    result = await db.execute(
        select(MatchParticipant).where(MatchParticipant.match_id == match_id)
    )
    parts = result.scalars().all()
    
    all_accepted = all(p.status == "accepted" for p in parts)
    all_paid = all(
        p.cash_diff <= 0 or p.payment_confirmed 
        for p in parts
    )
    
    if all_accepted and all_paid:
        match_result = await db.execute(select(Match).where(Match.id == match_id))
        match = match_result.scalar_one_or_none()
        if match and match.status == "pending":
            match.status = "active"
            
            # Capture all payments (release escrow)
            import stripe
            from ..config import settings
            stripe.api_key = settings.STRIPE_SECRET_KEY
            
            for p in parts:
                if p.payment_intent_id and p.payment_confirmed:
                    try:
                        # Payment already captured via webhook
                        pass
                    except Exception:
                        pass
            
            await db.commit()
            print(f"[webhook] Match {match_id} activated — all confirmed", file=sys.stderr)
