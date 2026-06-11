# BMI Demo Platforma — To'liq Reja (v2, Codex tuzatishlari bilan)

> Mavzu: 8–9-sinf o'quvchilarida mustaqil fikrlashni AKT bilan rivojlantirish.
> Maqsad: BMI himoyasida ishlaydigan **demo** (real prodakt emas). Muddat: ~1 oy.
> Kod muallif tomonidan yoziladi. Bu hujjat — dizayn yo'l xaritasi, kod yo'q.

---

## 1. Stack (qat'iy)

| Qatlam | Texnologiya | Joy |
|---|---|---|
| Frontend | Next.js (App Router) + Tailwind + Recharts | Vercel |
| Backend | Django + Django REST Framework | Railway |
| DB | PostgreSQL | Railway |
| AI | Google Gemini (kalit bor) | provider orqali |

**Bog'lanish:** Next.js `fetch` → DRF REST API. CORS: Django faqat Vercel domeniga ruxsat beradi.

---

## 2. Asosiy arxitektura tamoyili

**AI bitta Django moduli orqasida** (`ai/provider.py` konseptual). Sozlama: `PROVIDER=mock|gemini`.

Faqat **4 metod** (oshma):
- `score_answer(question, answer, rubric)` → ball + izoh
- `socratic_next(history, problem)` → keyingi yo'naltiruvchi savol
- `analyze_profile(solution)` → 5 komponent ball + xato joyi
- `summarize_error(solution)` → qisqa "qayerda adashding" matni (ixtiyoriy)

**Qoida:** mock va gemini **bir xil JSON shakl** qaytaradi. Shaklni Faza 1da qotir, keyin tegma.
Gemini uzilsa → mockka fallback (demo o'lmasin).

---

## 3. Ma'lumot modeli (Django)

- **Student**: id, ism, sinf, guruh (`experimental` | `control`), kirish_kodi
- **Test**: id, nomi, turi (`critical` | `creative` | `likert`), tavsif
- **Question**: id, test(FK), matn, format (`open` | `mc0` | `likert`), variantlar(JSON), rubrika(JSON)
- **Attempt**: id, student(FK), test(FK), bosqich (`pre` | `post`), boshlangan_vaqt, jami_ball
- **Answer**: id, attempt(FK), question(FK), javob(matn/raqam), ball, ai_izoh
- **SocraticSession**: id, student(FK), muammo, transkript(JSON: [{rol, matn}]), navbat_soni
- **ThinkingProfile**: id, student(FK), attempt(FK), komponentlar(JSON: tanqidiy/ijodiy/analitik/mantiqiy/refleksiv), indeks, xato_izohi
- **GameScore**: id, student(FK), o'yin, ball, vaqt (faqat o'yin fazasida)
- **DataSource** belgisi: har Attempt/Profile `manba` maydoni (`seed` | `live`) — ⚠️ demo data va jonli sinovni ajratish uchun

Django admin orqali Test/Question kiritiladi — alohida front shart emas.

---

## 4. API endpointlar (DRF, taxminiy)

```
POST /api/students/                profil yaratish/kirish (kod bilan)
GET  /api/tests/?type=critical     test + savollarni olish
POST /api/attempts/                test boshlash (student, test, bosqich)
POST /api/attempts/{id}/submit/    javoblarni yuborish → backend baholaydi
GET  /api/attempts/{id}/result/    natija + ball
POST /api/socratic/start/          muammo tanlab sessiya boshlash
POST /api/socratic/{id}/reply/     talaba javobi → keyingi savol
GET  /api/profile/{student}/       fikrlash-profil (radar uchun)
GET  /api/dashboard/               eksp vs nazorat agregat (grafik uchun)
```

Auth: **to'liq auth yo'q.** O'quvchi — kirish_kodi. O'qituvchi dashboard — bitta parol yoki Django admin.

---

## 5. AI provider JSON shakllari (mock = gemini)

`score_answer` →
```json
{ "ball": 7, "maks": 10, "izoh": "Argument bor, lekin dalil zaif",
  "mezonlar": { "argument_soni": 2, "mantiqiy_bog": 1, "originallik": 1 } }
```

`socratic_next` →
```json
{ "savol": "Nega bu manbaga ishonding?", "tugadimi": false, "navbat": 3 }
```

`analyze_profile` →
```json
{ "komponentlar": { "tanqidiy": 6, "ijodiy": 5, "analitik": 7, "mantiqiy": 6, "refleksiv": 4 },
  "indeks": 56, "xato_bosqichi": "2-qadamda dalilni tekshirmadi",
  "xato_turi": "manba_ishonchliligi" }
```

**Rubrika aniq mezonli bo'lsin** ("tanqidiy fikrlash" degan mavhum emas): argument soni, mantiqiy bog'lanish, dalil keltirish, original yondashuv, xulosa asoslari — har biri ball.

---

## 6. Diagnostika testlari (BMI ILOVA bilan mos)

| Test | BMI manbai | Demoda |
|---|---|---|
| Tanqidiy (ochiq+MCQ) | ILOVA 2, CCTST | **to'liq** ~10 savol |
| Likert so'rovnoma | ILOVA 1, 30 savol | **qisqartir → 15 savol** |
| Ijodiy (ochiq) | ILOVA 3, Torrance | **yengil** 2-3 topshiriq |

- Likert/MCQ → backend oddiy hisob (AI shart emas)
- Ochiq javob → `score_answer` (mock rubrika, keyin gemini)
- Pre va post bosqich → o'sish foizi (BMI Jadval 1 ko'rinishi)

---

## 7. Sukrot suhbati (cheklangan)

- **Erkin chat emas.** Tanlangan muammo + **4-6 navbat** + transkript saqlash.
- *mock:* har muammo uchun oldindan yozilgan **savol-daraxti**:
  ```
  { "muammo": "...",
    "savollar": [
      { "navbat": 1, "savol": "...", "keyingi": {"kalit_so'z_bor": 2, "default": 2} },
      ...
    ] }
  ```
- *gemini:* dinamik. System-prompt: **"Hech qachon javob berma. Faqat yo'naltiruvchi savol ber. Talabani o'zi topishga yetakla. 5-6 savoldan keyin yakunla."**

---

## 8. AI fikrlash-profil

- `analyze_profile` → 5 komponent ball + qaysi bosqichda adashgani
- Front: **radar diagramma** (Recharts) + matnli hisobot
- ⚠️ **"IQ" emas → "rubrika ko'rsatkichlariga asoslangan fikrlash indeksi"**
- Komponentlarni **bitta sehrli raqamga aralashtirma** — alohida ko'rsat

---

## 9. Tuzatilgan fazalar (Codex tartibi)

| # | Faza | Kun | Izoh |
|---|---|---|---|
| 0 | Deploy quvuri (Django+DRF+CORS, Postgres, Next.js, hello endpoint, 2 deploy) | 2-3 | **2-3 kunda ishlamasa → bitta stackka kes** |
| 1 | Modellar + Django admin + profil + AI provider interfeys (mock) | 2-3 | JSON shaklni shu yerda qotir |
| 2 | Diagnostika testlari + mock baholash (pre/post, o'sish %) | 5-6 | **o'zak** |
| 3 | **MINIMAL dashboard** (eksp vs nazorat: 2-3 grafik) | 2-3 | ⬆️ yuqoriga — screenshot kerak |
| 4 | AI fikrlash-profil (mock + radar) | 3 | |
| 5 | Sukrot suhbati (cheklangan 4-6 turn, mock daraxt) | 3-4 | |
| 6 | **Gemini ulash** (mock→real, prompt, low temp, JSON validatsiya, o'zbekcha test, fallback) | 2-3 | vaqt yeguvchi |
| 7 | Seed-data + sayqal + deploy qayta sinov | 2 | demo to'ldirish |
| 8 | O'yin ("Yolg'onni top" / escape-room) | bufer | **faqat vaqt qolsa** |

**Jami: ~22-27 kun** (o'yinsiz). O'yin — bufer.

---

## 10. Risklar

| Daraja | Risk | Yechim |
|---|---|---|
| HIGH | "Indeks"ni obyektiv o'lchov deb ko'rsatish | "rubrika asosida indikativ" deb ata |
| HIGH | Demo data ≠ BMI eksperiment data | `manba` maydoni; "vosita prototipi" deb so'zla |
| HIGH | mock↔gemini shakl mos kelmasligi | JSON shaklni Faza 1da qotir |
| MED | Gemini o'zbekcha ball izchilligi | qattiq rubrika, low temp, indikativ |
| MED | 2 platforma CORS/env/cold start | Faza 0 uchidan-uchiga sinov, fallback |
| MED | Sukrot+Gemini bir hafta yeyishi | cheklangan turn, mock fallback |
| LOW | O'yin sig'masligi | oxirgi, optional |

---

## 11. Halollik qoidalari (himoya uchun)

1. App = **eksperimentda ishlatilgan vosita prototipi**, BMI raqamlarini "ishlab chiqargan" tizim emas.
2. AI baho = **formativ/indikativ**, psixometrik shkala emas.
3. Seed-data va jonli sinov ajratilgan (`manba` belgisi).
4. Likert (o'z-baho) + AI ochiq ball + o'yin balli — **alohida** ko'rsatiladi, qo'shib yuborilmaydi.

---

## 12. Minimal "ishlaydigan demo" yadrosi

O'quvchi pre/post test ishlaydi → mock/AI baholaydi → fikrlash-profil (radar) chiqadi →
o'qituvchi eksp/nazorat o'sish grafigini ko'radi → Sukrot transkripti bor.
**Shu beshtasi bo'lsa — demo tayyor.** Qolgani bonus.
