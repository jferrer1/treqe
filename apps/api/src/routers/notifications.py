"""Notifications router — in-app list + read + WebSocket."""
import json
from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect, Query
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db
from ..models.notification import Notification
from ..dependencies import get_current_user
from ..services.redis_listener import get_listener, RedisListener

router = APIRouter(prefix="/api/notifications", tags=["notifications"])


@router.get("/")
async def list_notifications(
    current_user=Depends(get_current_user), db: AsyncSession = Depends(get_db),
    page: int = Query(1, ge=1), limit: int = Query(20, le=100),
):
    count_q = select(Notification).where(Notification.user_id == current_user.id)
    total = len((await db.execute(count_q)).scalars().all())
    result = await db.execute(
        select(Notification).where(Notification.user_id == current_user.id)
        .order_by(Notification.created_at.desc())
        .offset((page - 1) * limit).limit(limit)
    )
    unread = len([n for n in (await db.execute(count_q)).scalars().all() if not n.read])
    return {
        "items": [n.to_dict() for n in result.scalars().all()],
        "total": total, "unread": unread, "page": page,
        "pages": max(1, (total + limit - 1) // limit),
    }


@router.post("/{notification_id}/read")
async def mark_read(notification_id: str, current_user=Depends(get_current_user),
                    db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Notification).where(Notification.id == notification_id, Notification.user_id == current_user.id)
    )
    n = result.scalar_one_or_none()
    if not n:
        raise HTTPException(404, "Notification not found")
    n.read = True
    await db.commit()
    return {"ok": True}


@router.post("/read-all")
async def mark_all_read(current_user=Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    await db.execute(
        update(Notification).where(Notification.user_id == current_user.id).values(read=True)
    )
    await db.commit()
    return {"ok": True}


@router.put("/read-all")
async def mark_all_read(current_user=Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    """Marcar todas las notificaciones como leídas."""
    await db.execute(
        update(Notification).where(Notification.user_id == current_user.id).values(read=True)
    )
    await db.commit()
    return {"ok": True}

# ─── WebSocket ───

@router.websocket("/ws")
async def notifications_ws(websocket: WebSocket, token: str = Query(...)):
    """WebSocket para notificaciones en tiempo real vía Redis Pub/Sub."""
    from ..services.auth import decode_token
    payload = decode_token(token)
    if not payload:
        await websocket.close(code=4001, reason="Invalid token")
        return
    user_id = payload.get("sub")
    if not user_id:
        await websocket.close(code=4001)
        return

    await websocket.accept()
    listener: RedisListener | None = get_listener()
    if listener:
        listener.register(user_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        pass
    finally:
        if listener:
            listener.unregister(user_id)
