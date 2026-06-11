# Ishga tushirish qo'llanmasi

## Talablar

- Python 3.11+
- Node.js 20+
- (ixtiyoriy) PostgreSQL — lokalda SQLite ishlatiladi

---

## Backend (Django + DRF)

```bash
cd backend

# 1. virtual muhit
python -m venv .venv
.venv\Scripts\activate          # Windows
# source .venv/bin/activate     # macOS/Linux

# 2. paketlar
pip install -r requirements.txt

# 3. env
copy .env.example .env          # Windows
# cp .env.example .env          # macOS/Linux

# 4. migratsiya
python manage.py migrate

# 5. ishga tushirish
python manage.py runserver
# -> http://localhost:8000/api/health/
```

### Backend testlari

```bash
cd backend
pytest                # qamrov bilan, --cov-fail-under=80
```

### Django admin (kelgusi fazalar)

```bash
python manage.py createsuperuser
# -> http://localhost:8000/admin/
```

---

## Frontend (Next.js)

```bash
cd frontend

# 1. paketlar
npm install

# 2. env
copy .env.local.example .env.local     # Windows
# cp .env.local.example .env.local     # macOS/Linux
# NEXT_PUBLIC_API_URL ni backend manziliga sozlang

# 3. ishga tushirish
npm run dev
# -> http://localhost:3000
```

### Frontend testlari

```bash
cd frontend
npm test              # vitest
```

---

## Env o'zgaruvchilar

### backend/.env

| Kalit | Tavsif | Default |
|---|---|---|
| SECRET_KEY | Django maxfiy kalit | dev-default (prodda almashtir) |
| DEBUG | debug rejimi | True |
| ALLOWED_HOSTS | ruxsat etilgan hostlar | localhost,127.0.0.1 |
| DATABASE_URL | Postgres URL (bo'sh = SQLite) | (bo'sh) |
| CORS_ALLOWED_ORIGINS | front domenlari | http://localhost:3000 |
| AI_PROVIDER | mock yoki gemini | mock |
| GEMINI_API_KEY | Gemini kaliti | (bo'sh) |

### frontend/.env.local

| Kalit | Tavsif | Default |
|---|---|---|
| NEXT_PUBLIC_API_URL | backend REST manzili | http://localhost:8000 |

---

## Deploy

### Backend → Railway
1. Railway loyiha + PostgreSQL plugin (`DATABASE_URL` avtomatik beriladi)
2. Env: `SECRET_KEY`, `DEBUG=False`, `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`, `AI_PROVIDER`, `GEMINI_API_KEY`
3. Start: `gunicorn config.wsgi` (Procfile bor)
4. Release: `python manage.py migrate`

### Frontend → Vercel
1. `frontend/` ni import qil
2. Env: `NEXT_PUBLIC_API_URL` = Railway backend URL
3. Deploy
