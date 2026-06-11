# Backend — Django + DRF

BMI demo platforma REST API.

## Tuzilma

```
backend/
├── config/          # Django proyekt sozlamalari
│   ├── settings.py  # env-bilan sozlangan
│   ├── env.py       # env o'qish helperlari
│   └── urls.py      # /api/ marshrutlari
├── apps/            # biznes modullar
│   └── health/      # health-check (Faza 0)
├── manage.py
├── requirements.txt
└── pytest.ini
```

## Lokal ishga tushirish

```bash
python -m venv .venv
.venv\Scripts\activate            # Windows
pip install -r requirements.txt
copy .env.example .env            # Windows
python manage.py migrate
python manage.py runserver
```

Tekshir: <http://localhost:8000/api/health/>
→ `{"status": "ok", "service": "bmi-backend", "version": "0.1.0"}`

## Testlar

```bash
pytest
```

Qamrov 80% dan past bo'lsa test yiqiladi (`--cov-fail-under=80`).

## Deploy (Railway)

- Start: `gunicorn config.wsgi` (Procfile)
- Release: `python manage.py migrate`
- Env: `SECRET_KEY`, `DEBUG=False`, `ALLOWED_HOSTS`, `DATABASE_URL` (avtomatik),
  `CORS_ALLOWED_ORIGINS`, `AI_PROVIDER`, `GEMINI_API_KEY`
