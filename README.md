# Lattely

A community ranking of specialty coffee shops in Barcelona. See [CONTEXT.md](CONTEXT.md) for the domain language.

## Getting started

You need Node, pnpm and Docker (we use [OrbStack](https://orbstack.dev) on macOS). Make sure OrbStack is running.

```bash
pnpm install
docker compose up -d   # Postgres + PostGIS on localhost:5433
pnpm db:migrate        # create the tables in the dev database
pnpm db:seed           # add a few sample Shops
pnpm dev               # http://localhost:3000
```

After a restart, run `docker compose up -d` again before `pnpm dev`. The data is kept until you run `docker compose down`.

## Scripts

| Command            | What it does                                                                  |
| ------------------ | ----------------------------------------------------------------------------- |
| `pnpm dev`         | Run the app, using the dev database `lattely` (URL in `.env.development`)     |
| `pnpm test`        | Start Docker if needed, rebuild the empty `lattely_test` database, run Vitest |
| `pnpm typecheck`   | Check TypeScript                                                              |
| `pnpm lint`        | Run ESLint                                                                    |
| `pnpm format`      | Format all files with Prettier                                                |
| `pnpm db:generate` | Write a new migration after changing `db/schema.ts`                           |
| `pnpm db:migrate`  | Apply new migrations to the database in `DATABASE_URL` (dev by default)       |
| `pnpm db:seed`     | Add the sample Shops to the dev database (safe to run again)                  |
