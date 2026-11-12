# Database

## Remote: Supabase

The database's structure lives in [`supabase/migrations/`](../../supabase/migrations) as SQL files. See the root README's Database section for how to change it.

The app queries Supabase through the client in `@/lib/supabase` (publishable key, so row level security applies). Never connect to Postgres from the app: `DATABASE_URL` is a full-access credential.

## Local: on-device SQLite (coming next)

A follow-up PR repoints Drizzle to the phone's SQLite database: `drizzle.config.ts`, a schema for the cached catalog (places, spots, hours, majors), generated migrations, and typed queries. Until then, don't run Drizzle Kit against Supabase.