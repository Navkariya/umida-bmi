# BMI Demo Platforma — Mustaqil Fikrlash

8–9-sinf o'quvchilarida mustaqil fikrlashni (tanqidiy, ijodiy, analitik, mantiqiy)
AKT yordamida o'lchaydigan va rivojlantiradigan **demo** veb-platforma.
Bitiruv malakaviy ishi (BMI) himoyasi uchun prototip.

> ⚠️ Bu demo prototip — real prodakt emas. AI baholari **indikativ/formativ**,
> psixometrik o'lchov (IQ) emas.

## Struktura

```
umida_bmi/
├── backend/     # Django + DRF REST API  (-> Railway)
├── frontend/    # Next.js + Tailwind     (-> Vercel)
└── docs/        # Reja va arxitektura
    ├── PLAN.md          # to'liq bosqichma-bosqich reja
    ├── ARCHITECTURE.md  # tizim arxitekturasi
    └── SETUP.md         # ishga tushirish qo'llanmasi
```

## Stack

| Qatlam | Texnologiya | Deploy |
|---|---|---|
| Frontend | Next.js (App Router) + Tailwind | Vercel |
| Backend | Django + Django REST Framework | Railway |
| DB | PostgreSQL (lokal: SQLite) | Railway |
| AI | Google Gemini (provider orqali) | — |

## Tez boshlash

To'liq qadamlar: [docs/SETUP.md](docs/SETUP.md)

```bash
# Backend
cd backend
python -m venv .venv && .venv\Scripts\activate   # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver        # http://localhost:8000/api/health/

# Frontend
cd frontend
npm install
npm run dev                       # http://localhost:3000
```

## Holat

| Faza | Tavsif | Holat |
|---|---|---|
| 0 | Skelet + deploy quvuri + health endpoint | 🔨 jarayonda |
| 1 | Modellar + admin + profil | ⏳ |
| 2 | Diagnostika testlari + AI baholash | ⏳ |
| 3 | Dashboard (eksp vs nazorat) | ⏳ |
| 4 | AI fikrlash-profil | ⏳ |
| 5 | Sukrot suhbati | ⏳ |
| 6 | Gemini ulash | ⏳ |
| 7 | Seed-data + sayqal | ⏳ |
| 8 | O'yin (bufer) | ⏳ |
