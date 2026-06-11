# Arxitektura

## Umumiy ko'rinish

```
┌─────────────────┐        HTTPS / REST         ┌──────────────────────┐
│   Next.js (FE)  │ ─────────────────────────▶  │   Django + DRF (BE)  │
│   Vercel        │ ◀─────────────────────────  │   Railway            │
│                 │        JSON                  │                      │
│  - sahifalar    │                              │  - REST API          │
│  - lib/api.ts   │                              │  - Django admin      │
│  - Recharts     │                              │  - ai/provider       │
└─────────────────┘                              └──────────┬───────────┘
                                                            │
                                                            ▼
                                              ┌──────────────────────────┐
                                              │  PostgreSQL (Railway)     │
                                              │  lokal: SQLite            │
                                              └──────────────────────────┘
                                                            │
                                          PROVIDER=mock|gemini
                                                            ▼
                                              ┌──────────────────────────┐
                                              │  Google Gemini API        │
                                              └──────────────────────────┘
```

## Loyiha tuzilmasi

```
backend/
├── config/              # Django proyekt (settings, urls, wsgi/asgi)
├── apps/                # biznes modullar (har biri mustaqil app)
│   └── health/          # Faza 0: health-check endpoint
│       ├── views.py
│       ├── urls.py
│       └── tests/
├── manage.py
├── requirements.txt
├── pytest.ini
└── .env.example

frontend/
├── app/                 # App Router sahifalar
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── lib/
│   └── api.ts           # backend REST chaqiruvlari
├── tests/
└── .env.local.example
```

## Asosiy tamoyillar

1. **AI bitta provider orqasida.** `apps/ai/provider.py` da 4 metod
   (`score_answer`, `socratic_next`, `analyze_profile`, `summarize_error`).
   `PROVIDER=mock|gemini`. Mock va Gemini **bir xil JSON shakl** qaytaradi.
   Mock — deterministik demo + Gemini uzilsa fallback.

2. **Clean app bo'linishi.** Har modul alohida Django app:
   `health`, `students`, `diagnostics`, `socratic`, `profiles`, `dashboard`, `ai`.
   Yuqori kohesiya, past bog'liqlik.

3. **Env-bilan sozlash.** Sirlar kodda emas — `.env` (lokal) / Railway env (prod).
   DB: `DATABASE_URL` bo'lsa Postgres, bo'lmasa SQLite.

4. **Test birinchi joyda.** Har app uchun `tests/`, maqsad 80% qamrov
   (pytest + pytest-django + pytest-cov, `--cov-fail-under=80`).

## Ma'lumot modeli (kelgusi fazalar)

| Model | Asosiy maydonlar |
|---|---|
| Student | ism, sinf, guruh(exp/control), kirish_kodi |
| Test | nomi, turi(critical/creative/likert) |
| Question | test, matn, format, variantlar, rubrika |
| Attempt | student, test, bosqich(pre/post), jami_ball, manba(seed/live) |
| Answer | attempt, question, javob, ball, ai_izoh |
| SocraticSession | student, muammo, transkript, navbat_soni |
| ThinkingProfile | student, attempt, komponentlar, indeks, xato_izoh |
| GameScore | student, o'yin, ball, vaqt |

> `manba` (seed/live) — demo ma'lumot va jonli sinovni ajratish uchun (halollik).

## AI provider JSON shakllari

```
score_answer    -> { ball, maks, izoh, mezonlar:{...} }
socratic_next   -> { savol, tugadimi, navbat }
analyze_profile -> { komponentlar:{tanqidiy,ijodiy,analitik,mantiqiy,refleksiv},
                     indeks, xato_bosqichi, xato_turi }
```

## Deploy

- **Backend → Railway:** `gunicorn config.wsgi`, `DATABASE_URL` avtomatik,
  `python manage.py migrate` release qadamida.
- **Frontend → Vercel:** `NEXT_PUBLIC_API_URL` = Railway backend URL.
- **CORS:** Django `CORS_ALLOWED_ORIGINS` = Vercel domeni.
