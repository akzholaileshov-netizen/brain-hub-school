# Brain Hub

Қазақ тіліндегі лендинг + студент кабинеті: IELTS/грант дайындығы, бағыт тесті, тіркелу/кіру, пән модульдері және VIP IELTS.

Стек: Next.js (App Router), TypeScript, Tailwind CSS, **libSQL** (`@libsql/client`) — жергілікті SQLite файл немесе Turso, JWT сессия (`jose`), bcryptjs.

## Жергілікті іске қосу

```bash
cd brain-hub
npm install
cp .env.example .env   # SESSION_SECRET міндетті емес (dev fallback бар)
npm run build
npm run start -- -p 43127 -H 0.0.0.0
```

Ашыңыз: [http://127.0.0.1:43127](http://127.0.0.1:43127)

Дерекқор автоматты түрде `data/brain-hub.db` файлына жазылады (gitignore).

## Не бар

- Лендинг, бағыт тесті, auth modal (Кіру/Тіркелу)
- `/dashboard` — ID, GPA, пән прогресі
- `/dashboard/subjects/[slug]` — бейне, үй жұмысы, тест
- `/dashboard/ielts` — модульдер, ментор брондау, mock-тест

## Дерекқор (deploy)

Vercel/Netlify serverless ортасында жергілікті SQLite файл **сақталмайды**. Сондықтан production үшін **Turso (hosted libSQL)** қолданылады:

1. [Turso](https://turso.tech) аккаунт → DB жасау
2. `DATABASE_URL` (`libsql://...`) және `DATABASE_AUTH_TOKEN` алу
3. Схема мен seed бірінші сұрауда автоматты инициализацияланады

Жергілікті әзірлеуде `DATABASE_URL` қоймасаңыз да жұмыс істейді (`file:` fallback).

`better-sqlite3` алынып тасталды — native build Vercel-де қажет емес.

## Vercel deploy

1. Репоны Vercel-ге импорттаңыз (Root Directory: `brain-hub` егер monorepo болса)
2. Environment Variables:
   - `SESSION_SECRET` — ұзын кездейсоқ жол (міндетті)
   - `DATABASE_URL` — Turso URL
   - `DATABASE_AUTH_TOKEN` — Turso token
   - `NEXT_PUBLIC_SITE_URL` — сіздің домен (OG үшін)
3. Deploy → Node 20+

## Netlify deploy

1. Site → import repo, base: `brain-hub`
2. Build: `npm run build` (немесе `netlify.toml`)
3. Сол env айнымалыларын қосыңыз (`SESSION_SECRET`, `DATABASE_URL`, `DATABASE_AUTH_TOKEN`, `NEXT_PUBLIC_SITE_URL`)
4. `@netlify/plugin-nextjs` қолданылады

## Auth ескертпелері

- Құпия сөз: ≥8 таңба, әріп + сан
- Студент ID: `BH-2026-NNNN`
- Production-да `SESSION_SECRET` жоқ болса сервер қате шығарады
