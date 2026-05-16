# Treqe — Setup de Servicios Cloud
# Tiempo total: ~15 minutos

## 1. Railway (PostgreSQL + Redis + Backend)

1. Ve a https://railway.app → Login con GitHub
2. Click "New Project" → "Deploy from GitHub repo"
3. Selecciona `jferrer1/treqe` (privado, necesitas dar permisos)
4. Railway detecta el Dockerfile en `apps/api/`
5. Añadir servicios:
   - Click "New" → "Database" → "PostgreSQL"
   - Click "New" → "Database" → "Redis"
6. Variables de entorno (Railway las inyecta automáticamente al conectar servicios):
   - `DATABASE_URL` → se pone sola al añadir PostgreSQL ✅
   - `REDIS_URL` → se pone sola al añadir Redis ✅
   - `JWT_SECRET` → genera una aleatoria (ej: `openssl rand -hex 32`)
   - `DEBUG` → `false`
   - `SUPABASE_JWT_SECRET` → la copias de Supabase (abajo)
7. Click "Deploy"

La API estará en: `https://treqe-api.railway.app`

Coste: ~$5/mes (starter plan, $5 de crédito gratis el primer mes)

---

## 2. Supabase (Auth)

1. Ve a https://supabase.com → Login con GitHub
2. Click "New project"
3. Nombre: `treqe`
4. Database Password: genera una fuerte
5. Region: West EU (Ireland)
6. Click "Create project" (tarda 2 min)

7. Ve a Settings → API:
   - Copia `URL` → lo pones en Railway como `SUPABASE_URL`
   - Copia `anon public key` (no hace falta, va en el frontend)
   - Copia `JWT Secret` → en Railway como `SUPABASE_JWT_SECRET`

8. Ve a Authentication → Providers:
   - Habilita "Email" ✅
   - Habilita "Google" (opcional, necesita Google Cloud keys)

9. SQL Editor → pegar este SQL para crear las tablas:

```sql
-- Schema base (en Railway también está esto, Supabase es solo para auth)
-- Pero podemos usar Supabase como BD también si prefieres
```

## 3. Variables de entorno en Railway (resumen)

| Variable | De dónde sale |
|----------|--------------|
| `DATABASE_URL` | Railway → PostgreSQL (auto) |
| `REDIS_URL` | Railway → Redis (auto) |
| `JWT_SECRET` | La generas tú |
| `SUPABASE_URL` | Supabase → Settings → API |
| `SUPABASE_JWT_SECRET` | Supabase → Settings → API → JWT Secret |
| `CORS_ORIGINS` | `https://treqe.es,https://treqe.netlify.app` |
| `DEBUG` | `false` |
