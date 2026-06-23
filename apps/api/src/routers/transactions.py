"""Transaction history endpoint."""
from fastapi import APIRouter, Depends
from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db
from ..dependencies import get_current_user

router = APIRouter(prefix="/api/transactions", tags=["transactions"])

@router.get("/")
async def list_transactions(current_user=Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    """Get user's complete transaction history — purchases + trade payments."""
    items = []
    
    # 1. Purchases (compras directas)
    result = await db.execute(
        text("SELECT id, status, created_at, 'purchase' as type, price as amount FROM purchases WHERE buyer_id = :uid OR seller_id = :uid ORDER BY created_at DESC LIMIT 20"),
        {"uid": current_user.id}
    )
    for row in result:
        items.append({
            "id": row[0], "status": row[1], "date": str(row[2]),
            "type": "purchase", "amount": float(row[4] or 0)
        })
    
    # 2. Trade escrow payments
    result = await db.execute(
        text("""
            SELECT mp.id, mp.status, mp.cash_diff, mp.payment_confirmed, m.created_at, m.status as match_status
            FROM match_participants mp 
            JOIN matches m ON mp.match_id = m.id 
            WHERE mp.user_id = :uid AND mp.cash_diff != 0
            ORDER BY m.created_at DESC LIMIT 20
        """),
        {"uid": current_user.id}
    )
    for row in result:
        cash = float(row[2] or 0)
        if cash > 0:
            label = f"Pago de diferencia (trade)"
        else:
            label = f"Cobro de diferencia (trade)"
        items.append({
            "id": row[0], "status": "confirmed" if row[3] else row[1],
            "date": str(row[4]), "type": "trade_escrow", 
            "amount": abs(cash), "label": label, "match_status": row[5]
        })
    
    return {"items": sorted(items, key=lambda x: x["date"], reverse=True), "total": len(items)}
