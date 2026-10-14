# онлайн школ

Monorepo workspace for the online school project.

## Apps

| App | Path | Stack |
| --- | --- | --- |
| Brain Hub | [`brain-hub/`](./brain-hub) | Next.js + libSQL/Turso — қазақ тіліндегі лендинг және кабинет |

## Quick start (Brain Hub)

```bash
cd brain-hub
npm install
npm run build
npm run start -- -p 43127 -H 0.0.0.0
```

Open [http://127.0.0.1:43127](http://127.0.0.1:43127). See [`brain-hub/README.md`](./brain-hub/README.md) for Vercel/Netlify deploy.
