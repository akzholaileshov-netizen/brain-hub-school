# Brain Hub

Қазақ тіліндегі лендинг + студент кабинеті: IELTS/грант дайындығы, бағыт тесті, тіркелу/кіру, пән модульдері және VIP IELTS.

Стек: Next.js (App Router), TypeScript, Tailwind CSS, **Supabase** (Postgres + Auth), `@supabase/ssr` cookie сессиялары.

## Жергілікті іске қосу

```bash
cd brain-hub
npm install
cp .env.example .env
# .env ішіне Supabase URL + anon key қойыңыз
npm run build
npm run start -- -p 43127 -H 0.0.0.0
```

Ашыңыз: [http://127.0.0.1:43127](http://127.0.0.1:43127)

Env айнымалылары жоқ болса, қолданба құлап кетпейді — лендингте қазақша баптау хабарламасы шығады.

## Supabase жобасын баптау

1. [supabase.com](https://supabase.com) → New project
2. SQL Editor немесе CLI арқылы миграцияларды қолданыңыз:
   ```bash
   npx supabase login
   npx supabase link --project-ref YOUR_REF
   npx supabase db push
   # немесе SQL Editor-де supabase/migrations/*.sql сосын supabase/seed.sql
   ```
3. Project Settings → API:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` — тек серверге (браузерге ешқашан қоймаңыз; бұл жобада міндетті емес)
4. Authentication → Providers → Email қосулы
5. Authentication → URL configuration:
   - Site URL = сіздің Vercel/Netlify доменіңіз (немесе `http://127.0.0.1:43127`)
   - Redirect URLs: сол домен + `/dashboard`, `/`
6. Email confirmation:
   - Жергілікті/демо үшін: Authentication → Providers → Email → **Confirm email** өшіруге болады
   - Қосулы болса, тіркелуден кейін қазақша «почтаны растаңыз» хабарламасы шығады

## Не бар

- Лендинг, бағыт тесті, auth modal (Кіру/Тіркелу)
- `/dashboard` — ID (`BH-2026-NNNN`), GPA, пән прогресі (сессиясыз → лендинг)
- `/dashboard/subjects/[slug]` — бейне, үй жұмысы, тест (балл серверде/RPC)
- `/dashboard/ielts` — модульдер, ментор брондау, mock-тест

## Дерекқор

Схема: `supabase/migrations/`  
Seed (пәндер/сұрақтар): `supabase/seed.sql` (қайта генерация: `npx tsx scripts/generate-seed.ts`)

RLS: студент тек өз жолдарын оқиды/жазады; каталог кестелері authenticated оқуға ашық; дұрыс жауаптар RPC арқылы ғана.

## Vercel deploy

1. Репоны импорттаңыз (Root Directory: `brain-hub` егер monorepo болса)
2. Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL`
3. Supabase Auth-та Site URL / Redirect URLs-ты Vercel доменіне қойыңыз
4. Deploy → Node 20+

## Netlify deploy

1. Site → import, base: `brain-hub`
2. Build: `npm run build` (`netlify.toml`)
3. Сол env айнымалыларын қосыңыз
4. `@netlify/plugin-nextjs` қолданылады

## Auth ескертпелері

- Құпия сөз: ≥8 таңба, әріп + сан (клиент тексеруі + Supabase саясаты)
- Студент ID: `BH-2026-NNNN` (DB trigger/функция)
- Қателер қазақша: қайталанатын почта, қате құпия сөз, әлсіз құпия сөз, почта растау
