# Treqe — Setup de Servicios Cloud
# Tiempo total: ~15 minutos

## 1. Railway (PostgreSQL + Redis + Backend)

✅ PROYECTO CREADO: `treqe` (ID: 40e9f840...d9c4)
⚠️ FALTA: Añadir PostgreSQL, Redis y configurar manualmente

1. Ve a https://railway.app → Login con GitHub
2. El proyecto `treqe` ya existe. Ábrelo.
3. Añadir servicios:
   - Click "New" → "Database" → "PostgreSQL"
   - Click "New" → "Database" → "Redis"
4. Click "New" → "GitHub Repo" → selecciona `jferrer1/treqe`
5. Variables de entorno necesarias:
   - `JWT_SECRET` → genera una: `openssl rand -hex 32`
   - `SUPABASE_URL` → `https://cyijniokppdgwxwszamg.supabase.co`
   - `SUPABASE_JWT_SECRET` → de Supabase dashboard (abajo)
   - `DEBUG` → `false`
6. Click "Deploy"

API: `https://treqe-api.railway.app`
Coste: ~$5/mes

---

## 2. Supabase (Auth)

✅ PROYECTO CREADO: `treqe` (cyijniokppdgwxwszamg)

URL: https://cyijniokppdgwxwszamg.supabase.co
Anon Key: (configurada en .env)

⚠️ FALTA: Obtener JWT Secret del dashboard

1. Ve a https://supabase.com/dashboard/project/cyijniokppdgwxwszamg
2. Settings → API → JWT Settings
3. Copia `JWT Secret` → pásamelo para completar el .env

8. Authentication → Providers:
   - "Email" ya viene habilitado ✅
   - Habilita "Google" si quieres login social
