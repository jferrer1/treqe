"""Redis Pub/Sub listener — bridge Celery workers → WebSocket."""
import asyncio
import json

try:
    from redis.asyncio import Redis
except ImportError:
    Redis = None

from fastapi import WebSocket

_listener: "RedisListener | None" = None


def get_listener() -> "RedisListener | None":
    return _listener


class RedisListener:
    """Escucha Redis Pub/Sub y reenvía mensajes a WebSockets conectados."""

    def __init__(self, redis_url: str):
        self.redis = Redis.from_url(redis_url)
        self.connections: dict[str, WebSocket] = {}
        self._task: asyncio.Task | None = None

    async def start(self):
        self._task = asyncio.create_task(self._listen())

    async def stop(self):
        if self._task:
            self._task.cancel()
        await self.redis.close()

    async def _listen(self):
        pubsub = self.redis.pubsub()
        await pubsub.psubscribe("user:*")
        async for message in pubsub.listen():
            if message["type"] != "pmessage":
                continue
            channel: str = message["channel"].decode()
            user_id = channel.split(":", 1)[1]
            if ws := self.connections.get(user_id):
                try:
                    data = json.loads(message["data"])
                    await ws.send_json(data)
                except Exception:
                    self.connections.pop(user_id, None)

    def register(self, user_id: str, ws: WebSocket):
        self.connections[user_id] = ws

    def unregister(self, user_id: str):
        self.connections.pop(user_id, None)
