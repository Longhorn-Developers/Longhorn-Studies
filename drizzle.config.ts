import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema",
  dialect: "postgresql",
  // camelCase in TS, snake_case in Postgres.
  casing: "snake_case",
  // Supabase already creates its roles (anon, authenticated, ...); don't try to manage them.
  entities: { roles: { provider: "supabase" } },
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
