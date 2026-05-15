# Treqe — Desarrollo en Shadow PC (sin Docker/WSL2)

## Por qué no Docker

Shadow PC es una VM en la nube. No soporta virtualización anidada (WSL2/Hyper-V),
así que Docker Desktop no funciona. Esto NO es un problema.

## Cómo desarrollar sin Docker

### Base de datos (PostgreSQL)
→ Usar Railway directamente (es lo mismo que usaremos en producción)
→ O instalar PostgreSQL nativo para Windows: https://www.postgresql.org/download/windows/

### Cache (Redis)
→ Usar Railway Redis (incluido con el proyecto)
→ O Upstash Redis gratuito: https://upstash.com/ (plan free, 256MB)
→ O Memurai (Redis nativo para Windows): https://www.memurai.com/

### API (FastAPI)
```powershell
cd apps/api
pip install -r requirements.txt
uvicorn src.main:app --reload --port 8000
```

### Frontend (React + Vite)
```powershell
pnpm dev
# → http://localhost:5173
```

### Variables de entorno
Copiar `.env.example` a `.env` y rellenar con las URLs de Railway:
```
DATABASE_URL=postgresql+asyncpg://user:pass@host.railway.app:5432/treqe_dev
REDIS_URL=redis://host.railway.app:6379
```

## docker-compose.yml

El archivo `infra/docker/docker-compose.yml` se mantiene como referencia
para CI/CD (GitHub Actions corre en Linux, donde Docker sí funciona).
No se usa en desarrollo local en Shadow PC.
