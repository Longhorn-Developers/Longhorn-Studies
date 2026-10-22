# Database (Drizzle + Supabase)

Layout follows Drizzle's Supabase guide (https://orm.drizzle.team/docs/get-started/supabase-new). `src/db/schema/` is the source of truth for the Postgres schema, RLS policies included.

## Setup

1. `cp .env.example .env` and fill in `DATABASE_URL` (Supabase dashboard → Connect → Session pooler).
2. `npm run db:generate -- --name init` → writes SQL to `drizzle/`.
3. `npm run db:migrate` → applies it to the database.

## Changing the schema

1. Edit or add a file in `src/db/schema/` (drizzle-kit picks up every file in the folder; also add it to `schema/index.ts` if app code imports it).
2. `npm run db:generate -- --name <what_changed>`
3. Review the SQL, then `npm run db:migrate`.

`npm run db:push` skips migration files and syncs the schema directly — handy for prototyping, but don't mix it with `db:migrate` on the same database.
`npm run db:studio` opens a browser UI for the data.

## Using it in the app

- Get row types with `typeof table.$inferSelect` (type-only, safe on device).
- Do **not** connect to Postgres from the app: `DATABASE_URL` is a full-access credential. On device, query through the client in `@/lib/supabase` (RLS applies);
  use Drizzle's query builder only server-side (Expo API routes or Supabase Edge Functions).
- Columns are camelCase in TS and snake_case in Postgres (`casing: "snake_case"` in `drizzle.config.ts`).
