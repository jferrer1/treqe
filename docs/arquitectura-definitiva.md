# TREQE — ARQUITECTURA DEFINITIVA

> Basada en el Mapa Completo v1.0 (14 mayo 2026)
> 27 páginas · 56 conexiones · 13 tablas · 42 endpoints · Algoritmo v1.3
> Arquitecto: DeepSeek V4 Pro · Revisor: DeepSeek V4 Pro (2 pasadas)
> Última actualización: 14 mayo 2026, 15:30 CET — Secciones SSR, ORM y Redis Pub/Sub profundizadas

---

## 0. ÍNDICE

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Estructura Monorepo](#2-estructura-monorepo)
3. [Backend: Servicios y Workers](#3-backend-servicios-y-workers)
4. [Frontend: Componentes y Rutas](#4-frontend-componentes-y-rutas)
5. [Base de Datos: Esquema Validado](#5-base-de-datos-esquema-validado)
6. [Algoritmo de Matching: Integración](#6-algoritmo-de-matching-integración)
7. [Infraestructura y DevOps](#7-infraestructura-y-devops)
8. [Seguridad](#8-seguridad)
9. [Plan de Implementación por Fases](#9-plan-de-implementación-por-fases)
10. [Estimación de Esfuerzo](#10-estimación-de-esfuerzo)

---

## 1. RESUMEN EJECUTIVO

Treqe es un marketplace de segunda mano con **intercambio circular inteligente** como diferenciador principal. La arquitectura sigue un patrón **monorepo con dos aplicaciones principales** (frontend React + backend FastAPI) y **tres workers especializados** (algoritmo, notificaciones, pagos).

### Decisiones Clave de Arquitectura

| Decisión | Elección | Justificación |
|----------|----------|---------------|
| Monorepo | Sí (pnpm workspaces) | Código compartido, deploys coordinados |
| API Style | REST + WebSocket | REST para CRUD, WS para notificaciones real-time |
| Backend | FastAPI (Python) | Rendimiento, tipado, async nativo, ecosistema algoritmo |
| Frontend | React + Vite | SPA rápida, SSR opcional para GEO |
| ORM | SQLAlchemy 2.0 (async) | Tipado completo, migraciones Alembic, Python-nativo |
| Queue | Redis + Celery | Python-nativo, maduro, compatible con FastAPI |
| Algoritmo | Servicio Python dedicado | Aislado del API, escala independiente |
| Auth | Supabase Auth | JWT out-of-the-box, RLS, OAuth |
| Pagos | Stripe Connect | Escrow nativo, webhooks fiables |
| Media | Cloudinary | Upload directo, transformaciones serverless |

### Principios de Diseño

1. **Separación de responsabilidades**: API no ejecuta algoritmo, worker no sirve HTTP
2. **Fallo aislado**: Si el algoritmo falla, el catálogo sigue funcionando
3. **Estado único**: PostgreSQL es la fuente de verdad, Redis es solo cache
4. **Optimista por defecto**: UI actualiza primero, backend confirma después
5. **Telemetría desde el día 1**: Toda acción crítica genera evento medible

---

## 2. ESTRUCTURA MONOREPO

```
treqe/
├── apps/
│   ├── web/                          # Frontend React + Vite
│   │   ├── src/
│   │   │   ├── app/                  # Router + providers
│   │   │   │   ├── App.tsx           # Root component
│   │   │   │   ├── router.tsx        # React Router config
│   │   │   │   └── providers.tsx     # Auth, Query, Theme providers
│   │   │   ├── pages/               # 24 páginas del mapa
│   │   │   │   ├── landing/         # v16 — Portada (pública, SEO)
│   │   │   │   ├── catalog/         # v1 — Catálogo
│   │   │   │   ├── product/         # v2 — Detalle artículo
│   │   │   │   ├── upload/          # v3 — Subir artículo
│   │   │   │   ├── profile/         # v4 — Perfil
│   │   │   │   ├── onboarding/      # v5 — Onboarding
│   │   │   │   ├── match/           # v6 — Match notification
│   │   │   │   ├── tracking/        # v7 — Seguimiento envíos
│   │   │   │   ├── settings/        # v8 — Ajustes
│   │   │   │   ├── splash/          # v9 — Splash
│   │   │   │   ├── register/        # v10 — Registro
│   │   │   │   ├── notifications/   # v11 — Avisos (9 tipos)
│   │   │   │   ├── hub/             # v12 — MIS TREQES (HUB CENTRAL)
│   │   │   │   ├── blog/            # v13 — Blog + 7 posts
│   │   │   │   ├── favorites/       # v13f — Favoritos
│   │   │   │   ├── edit-profile/    # v14 — Editar perfil
│   │   │   │   ├── verify/          # v15 — Verificar identidad
│   │   │   │   ├── legal/           # v17-v22 — Páginas legales
│   │   │   │   ├── payment/         # v23 — Pago
│   │   │   │   ├── dispute/         # v24 — Disputa
│   │   │   │   └── requests/        # v17m — Mis Solicitudes
│   │   │   ├── components/          # Componentes compartidos
│   │   │   │   ├── ui/              # Design system (Button, Modal, Toast...)
│   │   │   │   ├── layout/          # BottomNav, Header, Shell
│   │   │   │   ├── product/         # ProductCard, ProductGrid, Gallery
│   │   │   │   ├── match/           # MatchCard, CycleVisualization, Timer
│   │   │   │   ├── payment/         # PaymentForm, EscrowStatus
│   │   │   │   ├── shipping/        # TrackingTimeline, ShippingLabel
│   │   │   │   └── review/          # StarRating, ReviewModal
│   │   │   ├── hooks/               # Custom hooks
│   │   │   │   ├── useAuth.ts       # Supabase auth wrapper
│   │   │   │   ├── useProducts.ts   # Product queries + mutations
│   │   │   │   ├── useMatches.ts    # Match queries + mutations
│   │   │   │   ├── usePayments.ts   # Payment intent + escrow status
│   │   │   │   ├── useShipments.ts  # Tracking + confirmation
│   │   │   │   ├── useDisputes.ts   # Dispute creation + status
│   │   │   │   ├── useNotifications.ts # Notification list + read
│   │   │   │   └── useWebSocket.ts  # Real-time connection
│   │   │   ├── stores/              # Zustand stores
│   │   │   │   ├── authStore.ts     # User session
│   │   │   │   ├── catalogStore.ts  # Filters, search, sort
│   │   │   │   ├── hubStore.ts      # v12 tab state + counters
│   │   │   │   └── notificationStore.ts # Unread count + list
│   │   │   ├── lib/                 # Utilities
│   │   │   │   ├── api.ts           # Axios/fetch wrapper
│   │   │   │   ├── supabase.ts      # Supabase client
│   │   │   │   ├── stripe.ts        # Stripe.js loader
│   │   │   │   ├── constants.ts     # Categories, conditions, etc.
│   │   │   │   └── formatters.ts    # Price, date, weight
│   │   │   └── styles/              # Tailwind + CSS modules
│   │   ├── public/
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   ├── tailwind.config.ts
│   │   └── package.json
│   │
│   └── api/                          # Backend FastAPI
│       ├── src/
│       │   ├── main.py              # FastAPI app factory
│       │   ├── config.py            # Settings (pydantic-settings)
│       │   ├── database.py          # SQLAlchemy async engine
│       │   ├── dependencies.py      # Dep injection (auth, db)
│       │   ├── routers/             # API endpoints (por dominio)
│       │   │   ├── __init__.py
│       │   │   ├── auth.py          # /api/auth/*
│       │   │   ├── users.py         # /api/users/*
│       │   │   ├── products.py      # /api/products/*
│       │   │   ├── favorites.py     # /api/favorites/*
│       │   │   ├── offers.py        # /api/offers/*
│       │   │   ├── matches.py       # /api/matches/*
│       │   │   ├── purchases.py     # /api/purchases/*
│       │   │   ├── payments.py      # /api/payments/*
│       │   │   ├── shipments.py     # /api/shipments/*
│       │   │   ├── disputes.py      # /api/disputes/*
│       │   │   ├── notifications.py # /api/notifications/*
│       │   │   ├── algorithm.py     # /api/algorithm/*
│       │   │   └── reviews.py       # /api/reviews/*
│       │   ├── models/              # SQLAlchemy ORM models
│       │   │   ├── __init__.py
│       │   │   ├── user.py
│       │   │   ├── product.py
│       │   │   ├── offer.py
│       │   │   ├── match.py
│       │   │   ├── purchase.py
│       │   │   ├── payment.py
│       │   │   ├── shipment.py
│       │   │   ├── dispute.py
│       │   │   ├── notification.py
│       │   │   ├── review.py
│       │   │   └── favorite.py
│       │   ├── schemas/             # Pydantic request/response
│       │   │   ├── __init__.py
│       │   │   ├── auth.py
│       │   │   ├── user.py
│       │   │   ├── product.py
│       │   │   └── ... (uno por dominio)
│       │   ├── services/            # Lógica de negocio
│       │   │   ├── __init__.py
│       │   │   ├── algorithm.py     # Bridge al motor de matching
│       │   │   ├── escrow.py        # Lógica escrow Stripe
│       │   │   ├── shipping.py      # SendCloud integration
│       │   │   ├── notifications.py # Push + in-app
│       │   │   └── scoring.py       # Reputation scoring
│       │   ├── workers/             # Tareas asíncronas (Celery)
│       │   │   ├── __init__.py
│       │   │   ├── celery_app.py        # Celery configuration
│       │   │   ├── algorithm_worker.py   # find_cycles_adaptive()
│       │   │   ├── notification_worker.py # Envío notificaciones
│       │   │   ├── payment_worker.py     # Webhook processing
│       │   │   └── cleanup_worker.py     # TTL expired, stale data
│       │   ├── middleware/          # Middleware HTTP
│       │   │   ├── __init__.py
│       │   │   ├── auth.py          # JWT verification
│       │   │   ├── rate_limit.py    # Rate limiting
│       │   │   ├── cors.py          # CORS config
│       │   │   └── logging.py       # Request logging
│       │   └── utils/               # Helpers
│       │       ├── __init__.py
│       │       ├── cloudinary.py    # Upload helpers
│       │       ├── geo.py           # Schema.org generators
│       │       └── pagination.py    # Cursor pagination
│       ├── tests/
│       │   ├── conftest.py
│       │   ├── test_auth.py
│       │   ├── test_products.py
│       │   ├── test_algorithm.py
│       │   └── ... (uno por router)
│       ├── alembic/                 # Migraciones
│       ├── alembic.ini
│       ├── Dockerfile
│       ├── requirements.txt
│       └── pyproject.toml
│
├── packages/                        # Código compartido
│   ├── shared-types/                # Tipos TypeScript (frontend)
│   │   ├── src/
│   │   │   ├── product.ts
│   │   │   ├── match.ts
│   │   │   ├── user.ts
│   │   │   └── ... (interfaces alineadas con API)
│   │   └── package.json
│   └── algorithm-engine/            # Motor de matching (Python)
│       ├── src/
│       │   ├── __init__.py
│       │   ├── engine.py            # find_cycles_adaptive()
│       │   ├── graph.py             # Graph builder + index
│       │   ├── compensation.py      # calculate_compensation()
│       │   ├── scoring.py           # Cycle scoring
│       │   └── types.py             # Cycle, Config dataclasses
│       ├── tests/
│       └── pyproject.toml
│
├── infra/                           # Infraestructura como código
│   ├── railway/
│   │   ├── railway.toml            # Railway config
│   │   └── variables.toml          # Env vars template
│   ├── netlify/
│   │   └── netlify.toml            # Build + redirects
│   └── docker/
│       ├── docker-compose.yml      # Desarrollo local
│       └── docker-compose.prod.yml # Producción (referencia)
│
├── scripts/                         # Scripts de operación
│   ├── seed-demo.ts                # 32 productos demo
│   ├── deploy.sh                   # Deploy script
│   └── backup-db.sh               # Backup PostgreSQL
│
├── .github/
│   └── workflows/
│       ├── ci.yml                  # Lint + test + build
│       ├── deploy-web.yml          # Deploy Netlify
│       └── deploy-api.yml          # Deploy Railway
│
├── pnpm-workspace.yaml
├── turbo.json                      # Turborepo config
├── package.json                    # Root
└── README.md
```

### Por qué Monorepo

- **Tipos compartidos**: `packages/shared-types` garantiza que frontend y backend usen las mismas interfaces
- **Algoritmo aislado**: `packages/algorithm-engine` es un paquete Python puro, testeable sin levantar toda la API
- **Deploys atómicos**: Un cambio en el modelo de datos se refleja en frontend y backend en el mismo commit
- **Turborepo**: Cache de builds, solo recompila lo que cambió

---

## 3. BACKEND: SERVICIOS Y WORKERS

### 3.1 Diagrama de Servicios

```
┌─────────────────────────────────────────────────────────┐
│                      INTERNET                           │
│  Cliente Web (React SPA)  │  App Móvil (futuro)         │
└──────────────┬──────────────┴──────────────┬────────────┘
               │                             │
               ▼                             ▼
┌──────────────────────────┐   ┌──────────────────────────┐
│   NETLIFY (CDN)          │   │   RAILWAY                │
│   Static assets          │   │                          │
│   _redirects → API       │   │  ┌─────────────────────┐ │
└──────────────────────────┘   │  │  FASTAPI (3 inst.)  │ │
                               │  │  :8000              │ │
                               │  │  REST + WebSocket   │ │
                               │  └──────┬──────┬───────┘ │
                               │         │      │         │
                               │         ▼      ▼         │
                               │  ┌──────────┐ ┌────────┐ │
                               │  │ Redis    │ │ PostgreSQL│ │
                               │  │ Cache +  │ │ (managed)│ │
                               │  │ Queue    │ │          │ │
                               │  └────┬─────┘ └──────────┘ │
                               │       │                    │
                               │       ▼                    │
                               │  ┌──────────────────────┐ │
                               │  │ WORKERS (Celery)     │ │
                               │  │ ├─ AlgorithmWorker   │ │
                               │  │ ├─ NotificationWorker│ │
                               │  │ ├─ PaymentWorker     │ │
                               │  │ └─ CleanupWorker     │ │
                               │  └──────────────────────┘ │
                               └──────────────────────────┘
                                          │
                    ┌─────────────────────┼─────────────────────┐
                    ▼                     ▼                     ▼
             ┌────────────┐      ┌──────────────┐      ┌──────────────┐
             │  STRIPE    │      │  SENDCLOUD   │      │  CLOUDINARY  │
             │  Connect   │      │  Shipping    │      │  Media       │
             └────────────┘      └──────────────┘      └──────────────┘
```

### 3.2 Organización de Routers

Cada router es un módulo independiente con sus propias dependencias:

```python
# apps/api/src/routers/products.py
from fastapi import APIRouter, Depends, Query
from ..schemas.product import ProductCreate, ProductResponse, ProductList
from ..services.cloudinary import upload_photos
from ..dependencies import get_current_user, get_db

router = APIRouter(prefix="/api/products", tags=["products"])

@router.get("/", response_model=ProductList)
async def list_products(
    search: str | None = Query(None),
    category: str | None = Query(None),
    subcategory: str | None = Query(None),
    price_min: float | None = Query(None),
    price_max: float | None = Query(None),
    condition: str | None = Query(None),
    sort: str = Query("newest"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, le=100),
    db = Depends(get_db)
):
    """Catálogo público con filtros. No requiere auth."""
    ...

@router.post("/", response_model=ProductResponse)
async def create_product(
    product: ProductCreate,  # multipart form data
    current_user = Depends(get_current_user),
    db = Depends(get_db)
):
    """Subir artículo. Requiere auth."""
    ...
```

### 3.3 Workers (Celery sobre Redis)

> **Por qué Celery y no BullMQ**: BullMQ es Node.js. Con backend Python/FastAPI, Celery es la opción nativa y madura. Usa Redis como broker (ya está en el stack) y soporta tareas periódicas (Celery Beat) para los cron.

```
┌─────────────────────────────────────────────────────────┐
│                    REDIS (broker + backend)              │
│                                                         │
│  Queue: algorithm    │  Cada 15 min (Celery Beat)       │
│  Queue: notifications│  Eventos del sistema             │
│  Queue: payments     │  Webhooks Stripe                 │
│  Queue: cleanup      │  Cada hora (Celery Beat)         │
└─────────────────────────────────────────────────────────┘

AlgorithmWorker (@celery_app.task):
  1. Recibe job (trigger "new_offer" o "scheduled")
  2. Adquiere lock Redis (TTL 30s, anti-concurrencia)
  3. Carga grafo desde Redis (o reconstruye desde PostgreSQL)
  4. Ejecuta find_cycles_adaptive() con timeouts
  5. Guarda ciclos encontrados → tabla matches
  6. Notifica participantes → notification queue
  7. Libera lock

NotificationWorker (@celery_app.task):
  1. Recibe job {user_id, type, title, body, action_url}
  2. Inserta en tabla notifications (in-app)
  3. Envía push notification (Firebase/Supabase)
  4. Emite evento WebSocket al usuario conectado

PaymentWorker (@celery_app.task):
  1. Procesa webhooks Stripe (payment_intent.succeeded, etc.)
  2. Actualiza estado en payments + purchases/matches
  3. Si escrow: marca para liberación
  4. Si fallo: notifica al usuario

CleanupWorker (@celery_app.task):
  1. Expira matches > 24h
  2. Limpia rejected_pairs > 7 días (TTL)
  3. Soft-delete productos inactivos > 90 días
  4. Limpia sesiones JWT expiradas en Redis

Celery Beat Schedule:
  algorithm-run:     schedule=900.0  # cada 15 min
  cleanup-run:       schedule=3600.0 # cada hora
```

### 3.4 Middleware Stack

```python
# Orden de ejecución en FastAPI:
# 1. CORS           — Permite origen Netlify
# 2. Logging        — Request ID, duración, status
# 3. Rate Limit     — 100 req/min público, 300 req/min autenticado
# 4. Auth (JWT)     — Solo rutas protegidas
# 5. Error Handler  — Captura excepciones → respuesta estructurada
```

### 3.5 WebSocket + Redis Pub/Sub: Notificaciones Real-Time

> **Problema arquitectónico**: Los Celery workers son procesos independientes. Cuando el AlgorithmWorker encuentra un match, no puede emitir directamente al WebSocket conectado al proceso FastAPI.
>
> **Solución**: Redis Pub/Sub como bus de mensajería entre procesos.

```
┌─────────────────────┐     Redis Pub/Sub      ┌─────────────────────┐
│  CELERY WORKER       │ ──► canal "user:123" ─► │  FASTAPI (asyncio)  │
│  algorithm_worker.py │                         │  redis_listener.py  │
│                      │     PUBLISH             │  SUBSCRIBE          │
│  r.publish(          │ ──────────────────────► │  ┌───────────────┐  │
│    f"user:{uid}",    │                         │  │ConnectionMgr  │  │
│    json.dumps(msg)   │                         │  │  .send(uid,   │  │
│  )                   │                         │  │   msg) → WS   │  │
└─────────────────────┘                         │  └───────────────┘  │
                                                 └─────────────────────┘
```

#### Implementación completa

```python
# ============================================================================
# apps/api/src/services/redis_listener.py
# Corre en el event loop de FastAPI. Escucha Pub/Sub y enruta a WebSockets.
# ============================================================================
import asyncio
import json
from redis.asyncio import Redis
from fastapi import WebSocket

class RedisListener:
    """
    Puente Redis Pub/Sub → WebSocket.
    - Se inicializa en el evento startup de FastAPI
    - Corre como tarea asíncrona en background
    - Cada worker publica en canal "user:{user_id}"
    - Este listener reenvía al WebSocket correspondiente
    """
    
    def __init__(self, redis_url: str):
        self.redis = Redis.from_url(redis_url)
        self.connections: dict[str, WebSocket] = {}  # user_id → ws
        self._task: asyncio.Task | None = None
    
    async def start(self):
        """Inicia el listener en background."""
        self._task = asyncio.create_task(self._listen())
    
    async def stop(self):
        if self._task:
            self._task.cancel()
        await self.redis.close()
    
    async def _listen(self):
        """
        Se suscribe a canales con patrón 'user:*'.
        Cada mensaje se enruta al WebSocket del usuario correspondiente.
        """
        pubsub = self.redis.pubsub()
        await pubsub.psubscribe("user:*")
        
        async for message in pubsub.listen():
            if message["type"] != "pmessage":
                continue
            
            # El canal tiene formato "user:{user_id}"
            channel: str = message["channel"].decode()
            user_id = channel.split(":", 1)[1]
            
            if ws := self.connections.get(user_id):
                try:
                    data = json.loads(message["data"])
                    await ws.send_json(data)
                except Exception:
                    # WebSocket cerrado o corrupto → limpiar
                    self.connections.pop(user_id, None)

    def register(self, user_id: str, websocket: WebSocket):
        self.connections[user_id] = websocket
    
    def unregister(self, user_id: str):
        self.connections.pop(user_id, None)


# ============================================================================
# apps/api/src/workers/algorithm_worker.py
# El worker publica resultados al canal del usuario via Redis Pub/Sub
# ============================================================================
import json
from celery_app import celery_app
from redis import Redis

redis_client = Redis.from_url("redis://localhost:6379", decode_responses=True)

@celery_app.task
def run_algorithm(trigger: str = "scheduled"):
    """Ejecuta find_cycles_adaptive() y notifica vía Redis Pub/Sub."""
    # ... lógica del algoritmo ...
    cycles_found = find_cycles_adaptive(offers, rejected, config)
    
    for cycle in cycles_found:
        # Guardar en PostgreSQL
        match = save_match_to_db(cycle)
        
        # Notificar a cada participante vía Redis Pub/Sub
        for user_id in cycle.user_ids:
            notification = {
                "type": "new_match",
                "title": "¡Nuevo intercambio encontrado!",
                "body": f"Se ha encontrado un círculo de {len(cycle.article_ids)} artículos",
                "action_url": f"/match/{match.id}",
                "match_id": str(match.id),
                "timestamp": datetime.utcnow().isoformat(),
            }
            
            # PUBLICAR en el canal del usuario
            redis_client.publish(
                f"user:{user_id}",
                json.dumps(notification)
            )
            
            # También guardar en BD para historial (in-app notifications)
            save_notification_to_db(user_id, notification)
    
    return {"cycles_found": len(cycles_found)}


# ============================================================================
# apps/api/src/routers/notifications.py (WebSocket endpoint)
# ============================================================================
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from ..services.redis_listener import RedisListener

router = APIRouter(prefix="/ws", tags=["websocket"])

@router.websocket("/notifications")
async def notifications_websocket(
    websocket: WebSocket,
    token: str = Query(...),
):
    """
    Conexión WebSocket para notificaciones en tiempo real.
    
    Flujo:
    1. Cliente se conecta con JWT token
    2. Se verifica el token → se obtiene user_id
    3. Se registra el WebSocket en RedisListener
    4. Cuando un worker publica en "user:{id}", se reenvía al cliente
    5. Cliente envía ping cada 30s para mantener la conexión
    """
    from ..dependencies import verify_token
    
    user = await verify_token(token)
    if not user:
        await websocket.close(code=4001, reason="Invalid token")
        return
    
    listener: RedisListener = websocket.app.state.redis_listener
    listener.register(user.id, websocket)
    
    try:
        while True:
            # Keepalive: el cliente envía ping, el servidor responde pong
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        pass
    finally:
        listener.unregister(user.id)


# ============================================================================
# apps/api/src/main.py (startup/shutdown)
# ============================================================================
from contextlib import asynccontextmanager
from fastapi import FastAPI
from .services.redis_listener import RedisListener

@asynccontextmanager
async def lifespan(app: FastAPI):
    # STARTUP
    app.state.redis_listener = RedisListener(settings.REDIS_URL)
    await app.state.redis_listener.start()
    yield
    # SHUTDOWN
    await app.state.redis_listener.stop()

app = FastAPI(lifespan=lifespan)
```

#### Contrato del mensaje Pub/Sub

```typescript
// Tipo compartido entre workers y frontend
interface PubSubNotification {
  type: "new_match" | "match_accepted" | "match_rejected" | "match_broken" 
      | "payment_confirmed" | "escrow_released" | "shipping_update" 
      | "dispute_resolved" | "price_drop" | "new_offer";
  title: string;
  body: string;
  action_url: string;
  reference_id: string;
  timestamp: string;  // ISO 8601
}
```

---

## 4. FRONTEND: COMPONENTES Y RUTAS

### 4.1 Router Configuration

```typescript
// apps/web/src/app/router.tsx
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  // === PÚBLICAS (SEO) ===
  {
    path: "/",
    element: <LandingPage />,           // v16 — Portada
  },
  {
    path: "/catalogo",
    element: <CatalogPage />,           // v1 — Catálogo
  },
  {
    path: "/articulo/:id",
    element: <ProductDetailPage />,     // v2 — Detalle
  },
  {
    path: "/blog",
    element: <BlogIndexPage />,         // v13 — Blog
  },
  {
    path: "/blog/:slug",
    element: <BlogPostPage />,          // v13 — Post individual
  },
  
  // === PÚBLICAS (NOINDEX) ===
  {
    path: "/registro",
    element: <RegisterPage />,          // v10
  },
  {
    path: "/legal/aviso",
    element: <LegalNoticePage />,       // v17
  },
  {
    path: "/legal/privacidad",
    element: <PrivacyPage />,           // v18
  },
  {
    path: "/legal/terminos",
    element: <TermsPage />,             // v19
  },
  {
    path: "/legal/cookies",
    element: <CookiesPage />,           // v20
  },
  {
    path: "/legal/pagos",
    element: <PaymentsInfoPage />,      // v21
  },
  {
    path: "/legal/envios",
    element: <ShippingInfoPage />,      // v22
  },
  
  // === PROTEGIDAS (requiere auth) ===
  {
    element: <ProtectedLayout />,       // Verifica auth, redirige si no
    children: [
      {
        path: "/splash",
        element: <SplashPage />,        // v9
      },
      {
        path: "/onboarding",
        element: <OnboardingPage />,    // v5
      },
      {
        path: "/subir",
        element: <UploadPage />,        // v3
      },
      {
        path: "/perfil",
        element: <ProfilePage />,       // v4
      },
      {
        path: "/perfil/editar",
        element: <EditProfilePage />,   // v14
      },
      {
        path: "/perfil/verificar",
        element: <VerifyIdentityPage />,// v15
      },
      {
        path: "/favoritos",
        element: <FavoritesPage />,     // v13f
      },
      {
        path: "/mis-solicitudes",
        element: <MyRequestsPage />,    // v17m
      },
      {
        path: "/avisos",
        element: <NotificationsPage />, // v11
      },
      {
        path: "/treqes",
        element: <HubPage />,          // v12 — HUB CENTRAL
      },
      {
        path: "/match/:id",
        element: <MatchDetailPage />,   // v6
      },
      {
        path: "/seguimiento/:id",
        element: <TrackingPage />,      // v7
      },
      {
        path: "/ajustes",
        element: <SettingsPage />,      // v8
      },
      {
        path: "/pago/:referenceType/:id",
        element: <PaymentPage />,       // v23
      },
      {
        path: "/disputa/:referenceType/:id",
        element: <DisputePage />,       // v24
      },
    ],
  },
]);
```

### 4.2 Component Tree — HUB CENTRAL (v12)

v12 es la página más compleja. Aquí su arquitectura de componentes:

```
HubPage
├── HubHeader
│   ├── BackButton
│   └── Title ("Mis Treqes")
│
├── TabBar (4 tabs con contadores dinámicos)
│   ├── TabButton("Activos", count=2, badge=🔴)
│   ├── TabButton("Pendientes", count=3, badge=🟡)
│   ├── TabButton("En curso", count=3, badge=🟢)
│   └── TabButton("Completados", count=2, badge=🔵)
│
├── TabPanel("activos")      ← visible cuando tab == 0
│   ├── PurchaseRequestCard  ← "Esperando vendedor"
│   │   ├── ProductThumbnail
│   │   ├── Timer (si <24h restantes)
│   │   └── CancelButton
│   └── MatchPendingCard     ← "Match propuesto"
│       ├── CycleVisualization (círculo participante)
│       ├── Timer (24h countdown)
│       ├── AcceptButton
│       └── RejectButton
│
├── TabPanel("pendientes")   ← visible cuando tab == 1
│   ├── PaymentPendingCard
│   ├── MatchWaitingCard
│   └── MatchBrokenCard
│
├── TabPanel("en_curso")     ← visible cuando tab == 2
│   ├── PurchaseTrackingCard
│   │   ├── TrackingTimeline
│   │   └── OpenDisputeButton → v24
│   ├── CoordinateShippingCard
│   └── InTransitCard
│
├── TabPanel("completados")  ← visible cuando tab == 3
│   ├── PurchaseCompletedCard
│   │   └── ReviewButton → ReviewModal
│   └── ExchangeCompletedCard
│       └── ReviewButton → ReviewModal
│
└── BottomNav (shared)       ← Buscar 🔍 | Treqes 🔄 | ➕ | Avisos 🔔 | Perfil 👤
```

### 4.3 State Management (Zustand)

```typescript
// apps/web/src/stores/hubStore.ts
import { create } from "zustand";

interface HubState {
  activeTab: number;
  counts: { activos: number; pendientes: number; en_curso: number; completados: number };
  
  setTab: (tab: number) => void;
  updateCounts: () => Promise<void>;
}

export const useHubStore = create<HubState>((set, get) => ({
  activeTab: 0,
  counts: { activos: 0, pendientes: 0, en_curso: 0, completados: 0 },
  
  setTab: (tab) => set({ activeTab: tab }),
  
  updateCounts: async () => {
    const res = await api.get("/api/matches?summary=true");
    set({ counts: res.data.counts });
  },
}));
```

### 4.4 Data Flow Pattern

```
┌──────────────────────────────────────────────────────┐
│                  REACT QUERY (TanStack)               │
│                                                       │
│  useQuery → GET /api/products    (cache: 5 min)       │
│  useQuery → GET /api/matches     (cache: 30s)         │
│  useQuery → GET /api/notifications (cache: 30s)       │
│                                                       │
│  useMutation → POST /api/products (invalida queries)  │
│  useMutation → POST /api/matches/:id/accept           │
│  useMutation → POST /api/payments/intent              │
│                                                       │
│  useWebSocket → /ws/notifications                     │
│    → actualiza notificationStore                      │
│    → invalida queries relevantes                      │
└──────────────────────────────────────────────────────┘
```

Optimistic updates para acciones de usuario (aceptar match, marcar notificación leída):
```typescript
const acceptMatch = useMutation({
  mutationFn: (id: string) => api.post(`/api/matches/${id}/accept`),
  onMutate: async (id) => {
    // Cancel queries salientes
    await queryClient.cancelQueries({ queryKey: ["matches"] });
    // Snapshot previo
    const previous = queryClient.getQueryData(["matches"]);
    // Optimistic update
    queryClient.setQueryData(["matches"], (old) => /* ... */);
    return { previous };
  },
  onError: (_err, _id, context) => {
    // Rollback
    queryClient.setQueryData(["matches"], context.previous);
    toast.error("No se pudo aceptar el match");
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ["matches"] });
  },
});
```

---

## 4.5 SSR y SEO: Estrategia para Páginas Indexables

> **Problema**: React SPA renderiza en cliente. Los crawlers (Google, redes sociales) ven un `<div id="root">` vacío. Las páginas indexables del mapa (v16 Portada, v13 Blog, v1 Catálogo, v2 Detalle) necesitan contenido real en el HTML inicial.

### 4.5.1 Matriz de Estrategia por Página

| Página | Tipo | Estrategia | Tecnología |
|--------|------|-----------|------------|
| v16 Portada | Contenido estático | **Pre-render** en build | `vite-plugin-ssr` (Vike) |
| v13 Blog | Contenido estático | **Pre-render** en build | `vite-plugin-ssr` (Vike) |
| v1 Catálogo | Dinámico (32+ productos) | **CSR + meta tags dinámicos** | `react-helmet-async` |
| v2 Detalle | Dinámico (producto individual) | **CSR + Schema.org JSON-LD** | `react-helmet-async` |
| v17-v22 Legal | Estático, noindex | CSR (no necesita SEO) | Componente simple |
| Resto (🔒 App) | No indexable | CSR | React SPA normal |

### 4.5.2 Arquitectura Híbrida SPA + SSR

```
┌──────────────────────────────────────────────────────────┐
│                    VITE BUILD PIPELINE                    │
│                                                           │
│  ┌─────────────────────┐    ┌──────────────────────────┐ │
│  │ Vike pages           │    │ SPA pages                 │ │
│  │ (SSR en build)       │    │ (CSR en runtime)          │ │
│  │                      │    │                           │ │
│  │ pages/               │    │ pages/                    │ │
│  │ ├── landing/         │    │ ├── catalog/              │ │
│  │ │   ├── +Page.tsx    │    │ ├── product/              │ │
│  │ │   ├── +Head.tsx    │    │ ├── hub/                  │ │
│  │ │   └── +config.ts   │    │ └── ... (resto)           │ │
│  │ └── blog/            │    │                           │ │
│  │     ├── +Page.tsx    │    │ Meta tags via             │ │
│  │     ├── +Head.tsx    │    │ react-helmet-async        │ │
│  │     └── +onBeforeRender.ts │                        │ │
│  └─────────────────────┘    └──────────────────────────┘ │
│              │                         │                  │
│              ▼                         ▼                  │
│  ┌─────────────────────┐    ┌──────────────────────────┐ │
│  │ HTML pre-renderizado │    │ HTML skeletal + JS bundle │ │
│  │ (Google ve contenido)│    │ (Google renderiza con JS) │ │
│  └─────────────────────┘    └──────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

### 4.5.3 Implementación Vike para v16 (Portada)

```typescript
// apps/web/src/pages/landing/+config.ts
import type { Config } from "vike/types";

export default {
  // Prerenderizar en build → HTML estático con contenido real
  prerender: true,
  // Sin JS del lado del cliente (hidratación parcial opcional)
  clientRouting: false,
} satisfies Config;
```

```typescript
// apps/web/src/pages/landing/+Head.tsx
// Meta tags que el crawler ve en el HTML fuente
export function Head() {
  return (
    <>
      <title>Treqe — Intercambia lo que no usas por lo que necesitas</title>
      <meta name="description" content="Marketplace de segunda mano con intercambio circular inteligente. Sin comisiones abusivas." />
      
      {/* Open Graph (WhatsApp, Telegram, Twitter previews) */}
      <meta property="og:title" content="Treqe — Intercambio circular inteligente" />
      <meta property="og:description" content="Intercambia artículos de segunda mano en círculos de 3 personas. Sin dinero, solo trueque." />
      <meta property="og:image" content="https://treqe.es/og-portada.png" />
      <meta property="og:url" content="https://treqe.es" />
      <meta property="og:type" content="website" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      
      {/* Schema.org WebApplication (del mapa) */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Treqe",
          "description": "Marketplace de intercambio circular",
          "url": "https://treqe.es",
          "applicationCategory": "Marketplace",
          "operatingSystem": "Web"
        })}
      </script>
      
      <link rel="canonical" href="https://treqe.es" />
    </>
  );
}
```

### 4.5.4 Schema.org para v2 (Detalle Artículo)

El mapa pide `Schema Product` en v2. Esto se genera dinámicamente:

```typescript
// apps/web/src/pages/product/ProductDetailPage.tsx
import { Helmet } from "react-helmet-async";

function ProductSchema({ product }: { product: Product }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "description": product.description,
    "image": product.photos,
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "EUR",
      "availability": product.status === "active" 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      "itemCondition": conditionToSchema(product.condition),
      "url": `https://treqe.es/articulo/${product.id}`,
    },
  };

  return (
    <Helmet>
      <title>{product.title} — Treqe</title>
      <meta name="description" content={product.description?.slice(0, 160)} />
      <meta property="og:title" content={product.title} />
      <meta property="og:image" content={product.photos[0]} />
      <meta property="og:type" content="product" />
      <meta property="product:price" content={String(product.price)} />
      <meta property="product:condition" content={product.condition} />
      <link rel="canonical" href={`https://treqe.es/articulo/${product.id}`} />
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}
```

### 4.5.5 Sitemap y Robots (Generados en Build)

```xml
<!-- apps/web/public/sitemap.xml (generado por script en build) -->
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://treqe.es/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://treqe.es/catalogo</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://treqe.es/blog</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <!-- Posts de blog generados dinámicamente -->
  <!-- Productos generados dinámicamente (top 500 más vistos) -->
</urlset>
```

```txt
<!-- apps/web/public/robots.txt -->
User-agent: *
Allow: /

Sitemap: https://treqe.es/sitemap.xml

# Páginas de app (no indexar)
Disallow: /subir
Disallow: /perfil
Disallow: /treqes
Disallow: /avisos
Disallow: /pago
Disallow: /disputa
Disallow: /splash
Disallow: /onboarding
Disallow: /registro
Disallow: /match
Disallow: /seguimiento
Disallow: /ajustes
Disallow: /favoritos
Disallow: /mis-solicitudes
```

### 4.5.6 Script de Build para Sitemap Dinámico

```typescript
// scripts/generate-sitemap.ts (se ejecuta en CI antes del deploy)
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

async function generateSitemap() {
  const baseUrl = "https://treqe.es";
  
  // Páginas estáticas
  const staticPages = [
    { loc: "/", priority: 1.0, changefreq: "weekly" },
    { loc: "/catalogo", priority: 0.9, changefreq: "daily" },
    { loc: "/blog", priority: 0.8, changefreq: "weekly" },
  ];
  
  // Posts de blog (desde BD — tabla `blog_posts` a crear en Fase 4)
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("slug, updated_at");
  
  // Productos activos (top 500 por fecha, no por views)
  const { data: products } = await supabase
    .from("products")
    .select("id, updated_at")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(500);
  
  // Generar XML...
}

generateSitemap();
```

---

## 5. BASE DE DATOS: ESQUEMA VALIDADO

### 5.1 Diagrama de Relaciones

```
users ──┬── products ──┬── offers ──────────────┐
        │              │                          │
        │              └── favorites             │
        │                                        │
        ├── matches ◄── match_participants ──────┘
        │       │
        │       └── rejected_pairs
        │
        ├── purchases ──┬── payments
        │               └── shipments
        │
        ├── disputes
        ├── notifications
        └── reviews (from_user / to_user)
```

### 5.2 Esquema SQL (Validado del Mapa)

El mapa define 13 tablas. Todas están validadas y cubiertas en la arquitectura. Notas:

1. **UUID para PKs**: PostgreSQL `gen_random_uuid()` en lugar de SERIAL. Ventajas: no expone conteo, seguro en APIs públicas, compatible con replicación.

2. **`rejected_pairs` tiene TTL**: El mapa define `expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days'`. CleanupWorker lo vacía.

3. **`match_participants.receives_from`**: FK a `users(id)`. Es la clave del intercambio circular: indica de quién recibe el artículo cada participante.

4. **`payments.reference_id` + `reference_type`**: Polimórfico. `reference_type` = 'purchase' | 'match'. `reference_id` es UUID de la tabla correspondiente. Mismo patrón en `shipments` y `disputes`.

5. **Corrección de tipos PostgreSQL**: El mapa declara `photos JSON[]` y `videos JSON[]`. PostgreSQL no tiene `JSON[]` como tipo nativo de array. La implementación usará `JSONB` almacenando arrays directamente: `'["url1", "url2"]'`.

6. **Índices necesarios** (no en el mapa, añadidos aquí):

```sql
-- Búsqueda de catálogo (la consulta más frecuente)
CREATE INDEX idx_products_search ON products 
  USING GIN (to_tsvector('spanish', title || ' ' || COALESCE(description, '')));
CREATE INDEX idx_products_category ON products(category, subcategory);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_user_status ON products(user_id, status);

-- Matching
CREATE INDEX idx_offers_active ON offers(status) WHERE status = 'active';
CREATE INDEX idx_offers_user_product ON offers(user_id, product_id_offers);
CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_match_participants_match ON match_participants(match_id);
CREATE INDEX idx_match_participants_user ON match_participants(user_id);

-- Pagos
CREATE INDEX idx_payments_reference ON payments(reference_type, reference_id);
CREATE INDEX idx_payments_stripe ON payments(stripe_payment_intent_id);

-- Notificaciones (paginated, ordenadas por fecha)
CREATE INDEX idx_notifications_user_read ON notifications(user_id, read, created_at DESC);
```

### 5.3 Estrategia de Migraciones

```
Alembic (Python):
  ├── versions/
  │   ├── 001_initial_schema.py      — Todas las tablas base
  │   ├── 002_add_indexes.py         — Índices de búsqueda
  │   ├── 003_seed_categories.py     — 20 categorías + 120 subcategorías
  │   └── 004_seed_demo_products.py  — 32 productos demo

Flujo:
  $ alembic upgrade head            # Aplica todas las migraciones
  $ alembic downgrade -1            # Revierte última
  $ alembic revision --autogenerate  # Genera nueva migración desde modelos
```

---

## 5.5 ORM Definitivo: SQLAlchemy 2.0 Async

> **Decisión**: Con backend Python/FastAPI confirmado, el ORM es **SQLAlchemy 2.0** con el modo async (`asyncpg`). Prisma queda descartado (es Node.js).

### 5.5.1 ¿Por qué SQLAlchemy 2.0 Async?

| Criterio | SQLAlchemy 2.0 async | Prisma (Node) | SQLModel |
|----------|----------------------|---------------|----------|
| Compatible con FastAPI | ✅ Nativo | ❌ Otro runtime | ✅ (wrapper) |
| Migraciones | ✅ Alembic | ✅ Prisma Migrate | ✅ Alembic |
| Tipado Python | ✅ Completo | ❌ TypeScript | ✅ Pydantic |
| Async nativo | ✅ `asyncpg` | ✅ | ✅ |
| Madurez | ✅ 15+ años | ✅ 5+ años | ⚠️ 2 años |
| Modelos compartidos con algoritmo | ✅ Mismo runtime | ❌ Cross-language | ✅ |

**SQLAlchemy 2.0 async** es la única opción que permite:
1. Compartir modelos entre API y `packages/algorithm-engine` (mismo runtime Python)
2. Usar `asyncpg` para queries no bloqueantes en FastAPI
3. Migraciones con Alembic (auto-generación desde modelos)

### 5.5.2 Modelo Base con SQLAlchemy 2.0

```python
# apps/api/src/database.py
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from .config import settings

engine = create_async_engine(
    settings.DATABASE_URL,        # postgresql+asyncpg://user:pass@host:5432/treqe
    pool_size=20,                 # Conexiones máximas
    max_overflow=10,              # Overflow en picos
    pool_pre_ping=True,           # Verificar conexión antes de usar
    echo=settings.DEBUG,          # SQL logging en dev
)

async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

class Base(DeclarativeBase):
    """Clase base para todos los modelos."""
    pass

async def get_db() -> AsyncSession:
    """FastAPI dependency: inyecta sesión de BD."""
    async with async_session() as session:
        yield session
```

### 5.5.3 Modelo de Ejemplo: Product

```python
# apps/api/src/models/product.py
import uuid
from datetime import datetime
from sqlalchemy import String, Text, Numeric, Boolean, DateTime, ForeignKey, Index
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ..database import Base

class Product(Base):
    __tablename__ = "products"
    
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    price: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False)
    subcategory: Mapped[str | None] = mapped_column(String(50))
    condition: Mapped[str] = mapped_column(String(20), nullable=False)
    weight: Mapped[float | None] = mapped_column(Numeric(5, 2))
    dim_l: Mapped[int | None]
    dim_w: Mapped[int | None]
    dim_h: Mapped[int | None]
    photos: Mapped[dict] = mapped_column(JSONB, default=list)    # Corrección: JSONB (no JSON[])
    videos: Mapped[dict] = mapped_column(JSONB, default=list)    # Corrección: JSONB (no JSON[])
    status: Mapped[str] = mapped_column(String(20), default="active")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow
    )
    
    # Relaciones (lazy='selectin' evita N+1 queries)
    owner: Mapped["User"] = relationship(back_populates="products", lazy="selectin")
    offers: Mapped[list["Offer"]] = relationship(back_populates="product_offered", lazy="selectin")
    favorites: Mapped[list["Favorite"]] = relationship(back_populates="product", lazy="selectin")
    
    # Índices (definidos en el modelo → Alembic los genera automáticamente)
    __table_args__ = (
        Index("idx_products_category", "category", "subcategory"),
        Index("idx_products_price", "price"),
        Index("idx_products_user_status", "user_id", "status"),
    )
    
    def to_dict(self) -> dict:
        """Serialización para API responses."""
        return {
            "id": str(self.id),
            "title": self.title,
            "description": self.description,
            "price": float(self.price),
            "category": self.category,
            "subcategory": self.subcategory,
            "condition": self.condition,
            "weight": float(self.weight) if self.weight else None,
            "photos": self.photos,
            "status": self.status,
            "created_at": self.created_at.isoformat(),
        }
```

### 5.5.4 Pydantic Schemas (Request/Response)

```python
# apps/api/src/schemas/product.py
from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime

class ProductCreate(BaseModel):
    """Schema para POST /api/products (validación de entrada)."""
    title: str = Field(..., min_length=5, max_length=200)
    description: str | None = Field(None, max_length=2000)
    price: float = Field(..., gt=0, le=99999.99)
    category: str = Field(..., max_length=50)
    subcategory: str | None = Field(None, max_length=50)
    condition: str = Field(..., pattern="^(new|like_new|good|fair|poor)$")
    weight: float | None = Field(None, gt=0, le=50000)  # gramos, max 50kg
    dim_l: int | None = Field(None, gt=0, le=200)       # cm
    dim_w: int | None = Field(None, gt=0, le=200)
    dim_h: int | None = Field(None, gt=0, le=200)

class ProductResponse(BaseModel):
    """Schema para respuestas de API."""
    id: UUID
    title: str
    description: str | None
    price: float
    category: str
    subcategory: str | None
    condition: str
    weight: float | None
    photos: list[str]
    status: str
    created_at: datetime
    
    model_config = {"from_attributes": True}  # Permite crear desde ORM model

class ProductList(BaseModel):
    """Respuesta paginada del catálogo."""
    items: list[ProductResponse]
    total: int
    page: int
    pages: int
```

### 5.5.5 Consultas con AsyncSession

```python
# apps/api/src/routers/products.py
from sqlalchemy import select, func, or_
from sqlalchemy.ext.asyncio import AsyncSession

@router.get("/", response_model=ProductList)
async def list_products(
    search: str | None = Query(None),
    category: str | None = Query(None),
    subcategory: str | None = Query(None),
    price_min: float | None = Query(None),
    price_max: float | None = Query(None),
    condition: str | None = Query(None),
    sort: str = Query("newest"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, le=100),
    db: AsyncSession = Depends(get_db),
):
    # Query base
    query = select(Product).where(Product.status == "active")
    
    # Filtros combinables (AND)
    if search:
        query = query.where(
            or_(
                Product.title.ilike(f"%{search}%"),
                Product.description.ilike(f"%{search}%"),
            )
        )
    if category:
        query = query.where(Product.category == category)
    if subcategory:
        query = query.where(Product.subcategory == subcategory)
    if price_min is not None:
        query = query.where(Product.price >= price_min)
    if price_max is not None:
        query = query.where(Product.price <= price_max)
    if condition:
        query = query.where(Product.condition == condition)
    
    # Ordenación
    sort_map = {
        "newest": Product.created_at.desc(),
        "price_asc": Product.price.asc(),
        "price_desc": Product.price.desc(),
    }
    query = query.order_by(sort_map.get(sort, Product.created_at.desc()))
    
    # Conteo total (para paginación)
    count_query = select(func.count()).select_from(query.subquery())
    total = (await db.execute(count_query)).scalar()
    
    # Paginación
    query = query.offset((page - 1) * limit).limit(limit)
    result = await db.execute(query)
    products = result.scalars().all()
    
    return ProductList(
        items=[ProductResponse.model_validate(p) for p in products],
        total=total,
        page=page,
        pages=(total + limit - 1) // limit,
    )
```

### 5.5.6 Migraciones con Alembic

```bash
# Inicializar Alembic (una vez)
cd apps/api
alembic init -t async alembic

# Generar migración desde modelos SQLAlchemy
alembic revision --autogenerate -m "initial_schema"

# Aplicar migraciones
alembic upgrade head

# Revertir última migración
alembic downgrade -1

# Ver SQL que se ejecutará (sin aplicarlo)
alembic upgrade head --sql
```

```python
# apps/api/alembic/env.py (configuración async)
from sqlalchemy.ext.asyncio import create_async_engine
from app.models import Base  # Importa todos los modelos

# Alembic descubre automáticamente los modelos heredados de Base
# y genera las migraciones correspondientes
target_metadata = Base.metadata
```

### 5.5.7 Compartición de Modelos con el Algoritmo

Una ventaja clave de SQLAlchemy en Python: el motor de algoritmo (`packages/algorithm-engine`) puede importar los mismos modelos:

```python
# packages/algorithm-engine/src/engine.py
# El algoritmo NO depende de FastAPI, solo importa los modelos
import sys
sys.path.insert(0, "../../apps/api/src")

from models.product import Product
from models.offer import Offer

# Usar los mismos tipos que la API
async def load_active_offers(db: AsyncSession) -> list[Offer]:
    result = await db.execute(
        select(Offer).where(Offer.status == "active")
    )
    return result.scalars().all()
```

Esto elimina la necesidad de mapear entre tipos de API y tipos de algoritmo — son los mismos objetos.

---

## 6. ALGORITMO DE MATCHING: INTEGRACIÓN

### 6.1 Arquitectura del Motor

```
┌─────────────────────────────────────────────────────┐
│              ALGORITHM ENGINE (Python package)       │
│                                                     │
│  find_cycles_adaptive(                               │
│    offers: List[Offer],       # Ofertas activas     │
│    rejected: Set[FrozenSet],  # Pares rechazados    │
│    config: Config             # Timeouts, k_max      │
│  ) -> List[Cycle]                                    │
│                                                     │
│  Internamente:                                      │
│  1. build_graph(offers) → adjacency lists           │
│  2. Para k in [2, 3, 4, 5]:                        │
│     find_cycles_of_size_k(k, time_limit)            │
│  3. score_cycles() + sort                          │
│  4. filter_conflicts()  # Sin solapamiento          │
│  5. calculate_compensation() por ciclo              │
│  6. return ciclos ordenados por score               │
└─────────────────────────────────────────────────────┘
```

### 6.2 Disparadores

```
┌──────────────────────┐     ┌──────────────────────┐
│  NUEVA OFERTA        │     │  CRON (15 min)       │
│  (trigger inmediato) │     │  (batch completo)    │
└────────┬─────────────┘     └────────┬─────────────┘
         │                            │
         ▼                            ▼
┌─────────────────────────────────────────────────┐
│           /api/algorithm/run                     │
│           POST → AlgorithmWorker                │
│                                                 │
│  1. Adquiere Redis lock "algorithm:run" (30s)   │
│  2. Carga ofertas activas de PostgreSQL          │
│  3. Carga rejected_pairs (últimos 7 días)        │
│  4. Ejecuta find_cycles_adaptive()               │
│  5. Guarda ciclos nuevos → tabla matches         │
│  6. Notifica a participantes                     │
│  7. Libera lock                                  │
└─────────────────────────────────────────────────┘
```

### 6.3 Redis Cache del Grafo

Para evitar reconstruir el grafo desde PostgreSQL en cada ejecución:

```python
# Estructura en Redis:
# Key: "graph:offers" → Hash de {article_id: json(offer_data)}
# Key: "graph:outgoing:{article_id}" → Set de {article_ids que quiere}
# Key: "graph:incoming:{article_id}" → Set de {article_ids que lo quieren}
# Key: "graph:rejected" → Sorted Set {frozenset_hash: expiry_timestamp}

# Invalidación:
# - Nueva oferta → añade al grafo incrementalmente
# - Oferta cancelada → elimina del grafo
# - Cada 15 min → reconstrucción completa (consistency check)
```

---

## 7. INFRAESTRUCTURA Y DEVOPS

### 7.1 Entornos

| Entorno | Frontend | Backend | BD | Propósito |
|---------|----------|---------|-----|-----------|
| **dev** | localhost:5173 | localhost:8000 | Docker PostgreSQL | Desarrollo |
| **preview** | Netlify Deploy Preview | Railway preview | Branch DB | PR review |
| **staging** | staging.treqe.es | Railway staging | Railway staging | QA / tests E2E |
| **prod** | treqe.es | Railway prod | Railway prod | Producción |

### 7.2 CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm lint          # ESLint + Prettier (frontend)
      - run: cd apps/api && ruff check .  # Python linter
  
  test:
    needs: lint
    steps:
      - run: pnpm test          # Vitest (frontend)
      - run: cd apps/api && pytest  # Backend tests
  
  build:
    needs: test
    steps:
      - run: pnpm build --filter=web  # Build frontend
      - run: cd apps/api && docker build -t treqe-api .

# .github/workflows/deploy-web.yml
name: Deploy Web
on:
  push:
    branches: [main]
    paths: ['apps/web/**', 'packages/shared-types/**']
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm build --filter=web
      - uses: nwtgck/actions-netlify@v3
        with:
          publish-dir: apps/web/dist
          production-branch: main

# .github/workflows/deploy-api.yml
name: Deploy API
on:
  push:
    branches: [main]
    paths: ['apps/api/**', 'packages/algorithm-engine/**']
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: railwayapp/railway-deploy@v1
        with:
          service: treqe-api
```

### 7.3 Monitoreo

```
┌─────────────────────────────────────────────┐
│              MONITORING STACK                │
│                                              │
│  Railway Metrics (incluido)                  │
│  ├── CPU, RAM, request latency              │
│  ├── Error rate por endpoint                │
│  └── P95/P99 response time                  │
│                                              │
│  Stripe Dashboard                            │
│  ├── Volumen transacciones                  │
│  ├── Tasa éxito pago                        │
│  └── Disputas                               │
│                                              │
│  SendCloud Dashboard                         │
│  ├── Envíos creados                         │
│  └── Incidencias                            │
│                                              │
│  Custom Health Endpoint                      │
│  GET /api/health                             │
│  { status: "ok", db: "connected",            │
│    redis: "connected", workers: 3 }         │
└─────────────────────────────────────────────┘
```

### 7.4 Configuración Local (Docker Compose)

```yaml
# infra/docker/docker-compose.yml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: treqe_dev
      POSTGRES_USER: treqe
      POSTGRES_PASSWORD: treqe_dev
    ports: ["5432:5432"]
    volumes:
      - pgdata:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]
  
  api:
    build: ../../apps/api
    ports: ["8000:8000"]
    environment:
      DATABASE_URL: postgresql+asyncpg://treqe:treqe_dev@postgres:5432/treqe_dev
      REDIS_URL: redis://redis:6379
    volumes:
      - ../../apps/api/src:/app/src  # Hot reload
    depends_on: [postgres, redis]

volumes:
  pgdata:
```

---

## 8. SEGURIDAD

### 8.1 Modelo de Confianza

```
┌─────────────────────────────────────────────────┐
│  CAPA            │  MEDIDA                       │
├──────────────────┼───────────────────────────────┤
│  Transporte      │  TLS 1.3 (Netlify + Railway) │
│  Autenticación   │  Supabase JWT (RS256)        │
│  Autorización    │  Row Level Security (RLS)    │
│  API             │  Rate limit (100/300 rpm)    │
│  Datos           │  UUIDs (no expone IDs)       │
│  Pagos           │  Stripe (PCI-DSS)            │
│  Media           │  Cloudinary signed uploads   │
│  Identidad       │  Verificación DNI (v15)      │
└─────────────────────────────────────────────────┘
```

### 8.2 Rate Limiting

```python
# apps/api/src/middleware/rate_limit.py
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

# Por endpoint:
@router.get("/api/products")
@limiter.limit("200/minute")   # Búsquedas: más generoso
async def list_products(...): ...

@router.post("/api/products")
@limiter.limit("20/minute")    # Creación: más restrictivo
async def create_product(...): ...

@router.post("/api/algorithm/run")
@limiter.limit("4/minute")     # Algoritmo: muy restrictivo (costoso)
async def run_algorithm(...): ...
```

### 8.3 Datos Sensibles

- **DNI/NIE (v15)**: Encriptado AES-256 antes de almacenar. Solo visible para verificación.
- **Fotos/vídeos**: Cloudinary con signed URLs, sin acceso público directo sin token.
- **Chat futuro**: E2E encryption (fuera del alcance MVP).

---

## 9. PLAN DE IMPLEMENTACIÓN POR FASES

### FASE 0 — Fundación (Semanas 1-2)

**Objetivo**: Infraestructura mínima funcionando con una página visible.

```
Entregables:
├── Monorepo configurado (Turborepo + pnpm)
├── CI/CD funcionando (lint + test + build en cada PR)
├── apps/api: FastAPI con health check + CORS
├── apps/web: React + Vite con router básico
├── infra/docker: PostgreSQL + Redis locales
├── Supabase: Proyecto creado, auth configurada
├── Stripe: Cuenta Connect creada (modo test)
├── Cloudinary: Upload configurado
└── Netlify: Deploy de placeholder en treqe.es
```

### FASE 1 — Catálogo + Auth (Semanas 3-5)

**Objetivo**: Usuarios pueden registrarse, ver productos y subir artículos.

```
Páginas implementadas:
├── v16 Portada (landing page estática, SEO)
├── v10 Registro (Supabase email + Google OAuth)
├── v9  Splash (animación + redirect)
├── v5  Onboarding (3-4 slides swipeables)
├── v1  Catálogo (32 productos demo, búsqueda, filtros, chips)
├── v2  Detalle artículo (galería, "Comprar ahora", "Quiero esto")
├── v3  Subir artículo (multipart: fotos + vídeos + datos)
├── v4  Perfil (avatar, stats, navegación)
└── v17-v20 Páginas legales (aviso, privacidad, términos, cookies)

Backend:
├── Auth endpoints (register, login, refresh, logout, me)
├── Products CRUD (list, detail, create, update, soft delete)
├── Favorites CRUD
├── Cloudinary signed uploads
└── Schema Product en páginas de producto
```

### FASE 2 — HUB CENTRAL + Compras (Semanas 6-8)

**Objetivo**: Usuarios pueden comprar artículos y gestionar sus transacciones.

```
Páginas implementadas:
├── v12 MIS TREQES (HUB CENTRAL con 4 tabs dinámicos)
│   ├── Tab Activos (solicitud compra + match pendiente)
│   ├── Tab Pendientes (pago pendiente + matchs)
│   ├── Tab En curso (tracking + disputa)
│   └── Tab Completados (valoración)
├── v23 Pago (Stripe Elements, formulario + resumen)
├── v7  Seguimiento (timeline envíos)
├── v24 Disputa (formulario + fotos + vídeos)
├── v13f Favoritos
├── v17m Mis Solicitudes
└── v21-v22 Páginas info (pagos & escrow, envíos & costes)

Backend:
├── Purchases endpoints (solicitar, aceptar, estado)
├── Payments endpoints (Stripe intent, webhook, escrow status)
├── Shipments endpoints (crear etiqueta, tracking, confirmación)
├── Disputes endpoints (crear, estado, resolver)
└── WebSocket notificaciones real-time
```

### FASE 3 — Algoritmo + Intercambio Circular (Semanas 9-12)

**Objetivo**: El diferenciador principal de Treqe funciona.

```
Páginas implementadas:
├── v6  Match notification (ciclo visual, timer, aceptar/rechazar)
├── v11 Notificaciones (9 tipos, lista plana, liquid glass)

Backend:
├── Offers endpoints (crear, listar, retirar)
├── Matches endpoints (listar, detalle, aceptar, rechazar, cancelar)
├── AlgorithmWorker (find_cycles_adaptive en Celery)
├── Redis graph cache (incremental + full rebuild)
├── Notificaciones (9 tipos no redundantes)
└── Reviews endpoints (crear, listar)

Algoritmo:
├── Integración completa con PostgreSQL
├── Tests de carga (1000 usuarios, 5000 ofertas)
├── Timeouts validados (<10s por batch)
└── Monitoreo de ciclos encontrados/tasa de éxito
```

### FASE 4 — Pulido + Lanzamiento (Semanas 13-16)

```
Tareas:
├── v14 Editar perfil (avatar, bio, ubicación)
├── v15 Verificar identidad (DNI + selfie)
├── v8  Ajustes (notificaciones, privacidad, idioma)
├── v13 Blog + 7 posts (SEO)
├── SEO completo (Schema.org, OG, canonical, sitemap)
├── Tests E2E (Playwright: flujos A, B, C completos)
├── Load testing (k6: 500 usuarios concurrentes)
├── GDPR compliance (cookie consent, datos, ARSOL)
├── Accessibility audit (WCAG 2.1 AA)
├── Error tracking (Sentry)
└── Analytics (Plausible — privacy-first)
```

### FASE 5 — Post-Lanzamiento (Semanas 17+)

```
├── Dashboard admin (métricas, usuarios, disputas)
├── Sistema reputación avanzado (ML opcional)
├── App PWA (offline, push notifications nativas)
├── Recomendaciones personalizadas
├── Chat entre usuarios (post-transacción)
├── Marketplace secundario (si validación positiva)
└── Internacionalización (i18n)
```

---

## 10. ESTIMACIÓN DE ESFUERZO

### Por Fase

| Fase | Semanas | Desarrolladores | Esfuerzo | Entregable principal |
|------|---------|-----------------|----------|---------------------|
| F0: Fundación | 1-2 | 1 full-stack | 2 semanas | Infra + CI/CD |
| F1: Catálogo + Auth | 3-5 | 1 front + 1 back | 6 semanas | MVP visible |
| F2: Hub + Compras | 6-8 | 1 front + 1 back | 6 semanas | Transacciones |
| F3: Algoritmo | 9-12 | 1 back + 1 algo | 8 semanas | Intercambio circular |
| F4: Pulido | 13-16 | 1 front + 1 back | 8 semanas | Production ready |
| **Total** | **1-16** | **2 personas** | **30 semanas** | **LANZAMIENTO** |

### Coste Total Estimado

```
Infraestructura (primer año operación):
  Railway (starter):      12 × $5     = $60
  Netlify (free):          14 × $0    = $0
  Supabase (free):         14 × $0    = $0
  Cloudinary (free):       14 × $0    = $0
  Dominio (2 años):        2 × €12    = €24
                              Total infra: ~$84

Desarrollo (16 semanas × 2 devs = 30 semanas-persona):
  Frontend developer:      ~€35,000
  Backend developer:       ~€35,000
                              Total dev: ~€70,000

TOTAL ESTIMADO: ~€75,084
```

Para un solo desarrollador full-stack: ~55-60 semanas (~€65,000).

### Nota sobre los plazos

La Fase 3 (algoritmo) es la de **mayor incertidumbre**. El algoritmo v1.3 ya está implementado (~480 líneas en `docs/algorithm_v1.3_final.py`), pero la integración con PostgreSQL, Redis graph cache, Celery workers, y el manejo de concurrencia (locks, timeouts, reintentos) añade complejidad significativa. Se ha ampliado de 6 a 8 semanas para absorber este riesgo. La Fase 4 (pulido) también se extiende 2 semanas por el trabajo de SEO, GDPR y tests E2E.

---

## APÉNDICE: Checklist de Implementación

### FASE 0 ✅

- [ ] Crear monorepo en GitHub (treqe)
- [ ] Configurar Turborepo + pnpm workspaces
- [ ] apps/web: Vite + React + Tailwind + React Router
- [ ] apps/api: FastAPI + SQLAlchemy + Alembic
- [ ] packages/shared-types: Interfaces TypeScript
- [ ] packages/algorithm-engine: Motor Python puro
- [ ] infra/docker: docker-compose.yml desarrollo local
- [ ] .github/workflows: CI (lint + test + build)
- [ ] Supabase: Proyecto + auth config
- [ ] Stripe: Cuenta Connect (test mode)
- [ ] Cloudinary: Upload preset
- [ ] Netlify: Sitio + deploy automático
- [ ] Railway: Proyecto + PostgreSQL + Redis

### FASE 1 ✅

- [ ] v16 Portada (hero, pasos, CTA, SEO)
- [ ] v10 Registro (Supabase Auth UI)
- [ ] v9 Splash (animación logo)
- [ ] v5 Onboarding (swipeable)
- [ ] v1 Catálogo (grid, búsqueda, filtros modal)
- [ ] v2 Detalle artículo (galería, Schema Product)
- [ ] v3 Subir artículo (Cloudinary upload)
- [ ] v4 Perfil (avatar, stats)
- [ ] v17-v20 Legal (4 páginas markdown)
- [ ] API: auth + products + favorites
- [ ] Migraciones: 001_initial_schema
- [ ] Seed: 32 productos demo

### FASE 2 ✅

- [ ] v12 HUB CENTRAL (4 tabs, timers, contadores)
- [ ] v23 Pago (Stripe Elements)
- [ ] v7 Seguimiento (timeline, tracking)
- [ ] v24 Disputa (formulario + media)
- [ ] v13f Favoritos (grid)
- [ ] v17m Mis Solicitudes
- [ ] v21-v22 Pagos & Envíos (info pages)
- [ ] API: purchases + payments + shipments + disputes
- [ ] WebSocket: notificaciones real-time
- [ ] Workers: notification + payment

### FASE 3 ✅

- [ ] v6 Match notification (ciclo visual, timer)
- [ ] v11 Notificaciones (9 tipos, lista plana)
- [ ] API: offers + matches + algorithm + reviews
- [ ] AlgorithmWorker: find_cycles_adaptive integrado
- [ ] Redis: graph cache + incremental updates
- [ ] Load tests: 1000 usuarios, 5000 ofertas
- [ ] Tests: algoritmo v1.3 validado en CI

### FASE 4 ✅

- [ ] v14 Editar perfil
- [ ] v15 Verificar identidad
- [ ] v8 Ajustes
- [ ] v13 Blog + 7 posts
- [ ] SEO: Schema.org, OG, canonical, sitemap
- [ ] Tests E2E: Playwright (A, B, C)
- [ ] Load tests: k6 (500 concurrentes)
- [ ] GDPR: cookie consent, ARSOL
- [ ] Accessibility: WCAG 2.1 AA
- [ ] Sentry: error tracking
- [ ] Plausible: analytics

---

---

## 11. ADVERTENCIAS Y RIESGOS TÉCNICOS

### 11.1 WebSocket + Celery: Comunicación Cross-Process

**Problema**: Los Celery workers son procesos independientes. No pueden emitir directamente a WebSockets conectados al proceso FastAPI.

**Solución**: Pub/Sub de Redis como puente:
```
Celery Worker → Redis Pub/Sub (canal "user:{id}") → FastAPI listener → WebSocket
```

El listener de Redis corre en el event loop de FastAPI (`asyncio`), recibe mensajes y los enruta al WebSocket correspondiente.

### 11.2 Proceso D (Seguros): Lógica Explícita

El mapa define dos escenarios de seguro:
- **Compra directa**: Opcional (+1.99€). Se añade como checkbox en v23 (Pago).
- **Intercambio circular**: Obligatorio. Incluido automáticamente en el coste de envío.

Implementación:
```python
# apps/api/src/services/shipping.py
def calculate_shipping(product: Product, is_circular: bool) -> ShippingCost:
    base = get_carrier_rate(product.weight, product.dimensions)
    if is_circular:
        insurance = base * 0.05  # 5% obligatorio
    else:
        insurance = 1.99  # Opcional, se añade si el usuario lo selecciona
    return ShippingCost(base=base, insurance=insurance, total=base + insurance)
```

### 11.3 Riesgos Identificados

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| Supabase llega a límite gratuito (50k usuarios) | Baja (MVP) | Medio | Plan Pro ($25/mes) |
| Algoritmo no escala con >10k ofertas | Media | Alto | Tests de carga en Fase 3, límite `max_degree=50` |
| Stripe Connect rechaza el modelo de negocio | Baja | Crítico | Validación temprana con soporte Stripe |
| SendCloud no tiene cobertura en España rural | Media | Medio | Múltiples transportistas (Correos/MRW/SEUR) |
| Redis se pierde y el grafo hay que reconstruir | Baja | Bajo | Reconstrucción desde PostgreSQL < 30s |
| Celery workers se bloquean con algoritmo pesado | Media | Medio | Timeouts estrictos (10s), lock TTL (30s) |

### 11.4 Lo Que Falta en el MVP (Decisiones Conscientes)

Estos elementos del mapa se postergan intencionalmente:
- **v0 (Prototipo Hub)**: Herramienta interna de desarrollo, no es parte del producto
- **Chat entre usuarios**: El mapa no incluye chat ("Sin chat" en v11). Se añadirá post-lanzamiento
- **App nativa**: PWA como paso intermedio (Fase 5)
- **Dashboard admin**: Panel básico en Fase 4, completo en Fase 5
- **Machine Learning**: Recomendaciones personalizadas en Fase 5

### 11.5 Stack Validado vs Mapa

| Componente | Mapa Original | Arquitectura Final | Motivo |
|-----------|---------------|-------------------|--------|
| Backend | Node.js/Express **o** Python/FastAPI | **Python/FastAPI** | Algoritmo en Python, ecosistema unificado |
| Frontend | React+Vite **o** Next.js | **React+Vite** (SSR opcional) | Simplicidad MVP, SSR solo para páginas SEO |
| Queue | No especificado | **Celery + Redis** | Python-nativo, maduro, Celery Beat para cron |
| ORM | No especificado | **SQLAlchemy 2.0 (async)** | Tipado completo, migraciones Alembic |
*Basado en el Mapa Completo de Treqe v1.0 (27 páginas, 56 conexiones).*
*Próximo paso: Revisión con Pepe y comienzo de FASE 0.*
