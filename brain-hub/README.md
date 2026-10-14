# Brain Hub

Қазақ тіліндегі лендинг + студент кабинеті: IELTS/грант дайындығы, бағыт тесті, тіркелу/кіру және прогресс.

Стек: Next.js (App Router), TypeScript, Tailwind CSS, SQLite (`better-sqlite3`), JWT сессия (`jose`), bcrypt құпия сөз.

## Іске қосу

```bash
cd brain-hub
npm install
cp .env.example .env   # міндетті емес — SESSION_SECRET үшін жергілікті fallback бар
npm run build
npm run start -- -p 43127 -H 0.0.0.0
```

Немесе әзірлеу:

```bash
npm run dev -- -p 43127 -H 0.0.0.0
```

Ашыңыз: [http://127.0.0.1:43127](http://127.0.0.1:43127)

## Не бар

- Лендинг (hero, формат, 12 сұрақтық тест, бағыттар, жетістіктер, пікірлер)
- Тіркелу / кіру API + httpOnly cookie сессия
- `/dashboard` — студент ID, GPA, пән/сабақ прогресі, VIP IELTS сервисі
- SQLite дерекқор: `data/brain-hub.db` (gitignore)

## Auth ескертпелері

- Құпия сөз: кемінде 8 таңба, әріп + сан
- Студент ID форматы: `BH-2026-NNNN`
- `SESSION_SECRET` — `.env.example` қараңыз
