# Brain Hub

Қазақ тіліндегі лендинг + студент кабинеті: IELTS/грант дайындығы, бағыт тесті, тіркелу/кіру, пән модульдері және VIP IELTS.

Стек: Next.js (App Router), TypeScript, Tailwind CSS, **Supabase** (Postgres + Auth), `@supabase/ssr` cookie сессиялары.

## Жергілікті іске қосу

```bash
cd brain-hub
npm install
cp .env.example .env.local
# .env.local (gitignore): NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run build
npm run start -- -p 43127 -H 0.0.0.0
```

Ашыңыз: [http://127.0.0.1:43127](http://127.0.0.1:43127)

Env айнымалылары жоқ болса, қолданба құлап кетпейді — лендингте қазақша баптау хабарламасы шығады.

## Supabase жобасын баптау

1. [supabase.com](https://supabase.com) → New project
2. **Схема + seed (ең оңай):** Dashboard → **SQL Editor** → New query → `supabase/setup.sql` файлының **бүкіл** мазмұнын қойып → **Run**  
   (немесе CLI: `npx supabase db push` + seed; anon key DDL істей алмайды)
3. Project Settings → API / keys:
   - `NEXT_PUBLIC_SUPABASE_URL` — тек `https://xxxx.supabase.co` (/rest/v1, тырнақша, соңғы `/` қоспаңыз)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (publishable / anon)
   - `SUPABASE_SERVICE_ROLE_KEY` — тек серверге (браузерге ешқашан қоймаңыз; бұл жобада міндетті емес)
4. Authentication → Providers → Email қосулы
5. Authentication → URL configuration:
   - **Site URL** = `http://127.0.0.1:43127` (жергілікті) немесе Vercel домені
   - **Redirect URLs**: `http://127.0.0.1:43127/**`, `http://127.0.0.1:43127/dashboard`, production домендері
6. Email confirmation (QA үшін ұсынылады):
   - Authentication → Providers → Email → **Confirm email** → **OFF**
   - Қосулы болса, тіркелуден кейін сессия жоқ → UI қазақша «почтаны растаңыз» көрсетеді; free-tier email rate limit тез толады

## Не бар

- Лендинг, бағыт тесті, auth modal (Кіру/Тіркелу)
- `/dashboard` — ID (`BH-2026-NNNN`), GPA, пән прогресі (сессиясыз → лендинг)
- `/dashboard/subjects/[slug]` — бейне, үй жұмысы, тест (балл серверде/RPC)
- `/dashboard/ielts` — модульдер, ментор брондау, mock-тест

## Дерекқор

Схема: `supabase/migrations/`  
Seed (пәндер/сұрақтар): `supabase/seed.sql` (қайта генерация: `npx tsx scripts/generate-seed.ts`)

RLS: студент тек өз жолдарын оқиды/жазады; каталог кестелері authenticated оқуға ашық; дұрыс жауаптар RPC арқылы ғана.

## Сабаққа бейне қосу

1. `lib/lesson-videos.ts` ішінде кілт: `` `${subjectSlug}::${videoTitle}` ``
2. YouTube үшін `https://www.youtube-nocookie.com/embed/<ID>` (алдымен oEmbed арқылы ID-ны тексеріңіз)
3. Немесе тікелей `.mp4` URL
4. Расталмаған тақырыпта `videoUrl: null` қалдырыңыз — UI: «Бұл сабақтың видеосы жақын арада қосылады»
5. Seed жаңарту: `npx tsx scripts/generate-seed.ts`
6. SQL миграция жаңарту: `npx tsx scripts/generate-video-migration.ts` → Supabase SQL Editor-де `supabase/migrations/20261017000000_lesson_videos.sql` (немесе `docs` папкасындағы ready-to-paste файл) орындаңыз

Қолданба DB-де әлі `/videos/sample.mp4` тұрса да құламайды — `lib/lesson-videos.ts` fallback қолданылады.

## IELTS mock-тест (сұрақтарды өзгерту)

1. Дерек көзі: `lib/ielts-mock-data.ts` (сұрақтар ағылшынша, түсіндірмелер қазақша)
2. Тексеру: `npx tsx scripts/validate-ielts-mock.ts`
3. Seed: `npx tsx scripts/generate-seed.ts`
4. Supabase: SQL Editor-де `supabase/migrations/20261017010000_ielts_mock_v2.sql` (немесе ready-to-paste `docs` файлы) орындаңыз
5. Бағалау серверде (`scoreIeltsMock`) — `correctAnswer` клиентке тек submit-тен кейін review ретінде келеді
6. Миграциясыз да тест жұмыс істейді; тарихтың толық өрістері үшін SQL қажет

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
