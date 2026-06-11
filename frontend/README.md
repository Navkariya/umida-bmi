# Frontend — Next.js

BMI demo platforma foydalanuvchi interfeysi.

## Tuzilma

```
frontend/
├── app/             # App Router sahifalar
│   ├── layout.tsx
│   ├── page.tsx     # backend health holatini ko'rsatadi
│   └── globals.css
├── lib/
│   ├── api.ts       # backend REST chaqiruvlari
│   └── api.test.ts  # vitest testlar
└── vitest.config.ts
```

## Lokal ishga tushirish

```bash
npm install
copy .env.local.example .env.local     # Windows
npm run dev                            # http://localhost:3000
```

`NEXT_PUBLIC_API_URL` backend manziliga ishora qilishi kerak
(default `http://localhost:8000`).

## Testlar

```bash
npm test          # vitest run
npm run test:watch
```

## Deploy (Vercel)

- Root: `frontend/`
- Env: `NEXT_PUBLIC_API_URL` = Railway backend URL
