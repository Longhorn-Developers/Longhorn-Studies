# Longhorn Studies

A mobile app for finding study spots at UT Austin, built with Expo (React Native) and backed by Supabase Postgres, with Drizzle ORM managing the schema.

## Project Structure

```
longhorn-studies-layout/
├── src/
│   ├── app/              # Expo Router routes. Every file is a screen, _layout.tsx files define navigators
│   ├── components/       # Shared UI components (components/ui/ for design-system pieces)
│   ├── constants/        # Theme and other constants
│   ├── hooks/            # Custom hooks
│   ├── lib/
│   │   └── supabase.ts   # Supabase client (auth session persisted on device)
│   ├── db/
│   │   ├── schema/       # Drizzle table definitions (one file per area)
│   │   └── README.md     # Database workflow
│   └── global.css        # Tailwind / NativeWind styles
├── assets/               # Images, icons, fonts
├── supabase/             # Supabase CLI project: config.toml (storage buckets) and migrations/ (database structure)
├── app.json              # Expo configuration
├── drizzle.config.ts     # Drizzle Kit configuration
├── tailwind.config.js    # Tailwind theme (colors, font sizes)
├── .env.example          # Environment variable template
└── package.json
```

Keep non-route code (components, hooks, utils) outside `src/app/`.

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Then fill in the values (see [Configuration](#configuration)).

3. Start the development server:
   ```bash
   npm start
   ```

4. Choose your platform:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Press `w` for web browser
   - Scan the QR code with Expo Go on your phone

Libraries with native code that Expo Go doesn't include need a development build instead: `npx expo run:ios` / `npx expo run:android`, or `npx eas-cli@latest build --profile development`.

## Database

App accesses Supabase (Postgres, Auth, Storage) through `supabase-js`. The database's structure lives in `supabase/migrations/` as SQL files, applied in timestamp order. Supabase's GitHub integration applies new migrations to production when a PR is merged into `main`.

### Querying from the app

```ts
import { supabase } from "@/lib/supabase";

const { data, error } = await supabase.from("spots").select("*");
```

Every table has row level security, and permissions are granted per table and column, so the app can only do what the policies and permissions allow.

### One-time local setup

```bash
npx supabase login                              # opens the browser
npx supabase link --project-ref <project-ref>   # the ID in the dashboard URL
```

Link saved in `supabase/.temp/` for future development, which is gitignored, so each developer links their own copy. The Supabase CLI is a dev dependency, so `npm install` already installed it.

### Changing the database

1. On a feature branch, make the change one of two ways:
   - **In the dashboard**, then capture it: `npx supabase db pull <what_changed> --remote` (with Docker installed and running). MUST answer **Y** when it asks to record the migration as applied.
   - **By hand:** `npx supabase migration new <what_changed>`, then write the SQL in the new file.
2. Write permissions (`grant` / `revoke`) by hand in a migration. `db pull` doesn't capture per-column permissions.
3. Review the SQL and open a PR. Merging into `main` applies it to production.
4. Check what production has applied: `npx supabase migration list --remote`.

Rules:
- Capture every dashboard change as a migration in the same PR. A change made only in the dashboard goes live without review and is missing from the repo.
- NEVER edit a migration that has been merged; add a new one.
- Data every database needs (the majors list) goes in a migration. Test data goes in `supabase/seed.sql`, which never runs on production.
- Hide rows with `status = 'inactive'` instead of deleting them.

### Storage buckets

`spot-photos` and `user_avatars` are declared in `supabase/config.toml`, which creates them in local and test databases.

### Drizzle

Drizzle Kit (`drizzle.config.ts`, `src/db/schema/` and the `db:generate`, `db:studio` and `db:check` scripts) will be repointed to the on-device SQLite database in a follow-up PR. Don't use it to change Supabase.

> **Never connect to Postgres from the app.** `DATABASE_URL` is a full-access credential. On device, query with the Supabase client in `src/lib/supabase.ts` (publishable key) so row level security applies.

See [`src/db/README.md`](src/db/README.md) for more detail.

## Technology Stack

- Expo SDK 58 with Expo Router (file-based navigation)
- React Native 0.88, React 19.3
- TypeScript 6
- NativeWind 4 (Tailwind CSS 3) for styling
- React Native Reanimated, Gesture Handler, Expo Image, Expo Symbols
- Supabase (Postgres, Auth, Storage), with the Supabase CLI for migrations
- Drizzle ORM and Drizzle Kit

## Configuration

Copy `.env.example` to `.env`. `.env` is gitignored, so don't commit it.

| Variable | Where it's used | Notes |
| --- | --- | --- |
| `DATABASE_URL` | Drizzle Kit scripts, until they move to SQLite | Not needed for migrations: the Supabase CLI uses `npx supabase login`. Supabase dashboard → Connect → Session pooler. Server-only, so never prefix it with `EXPO_PUBLIC_` |
| `EXPO_PUBLIC_SUPABASE_URL` | App | Your project URL |
| `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | App | Supabase dashboard → Project Settings → API Keys → Publishable key. Protected by row level security; never use the secret key here |
| `SUPABASE_SECRET_KEY` | Server only (seed scripts, API routes, Edge Functions) | Bypasses row level security. Never prefix with `EXPO_PUBLIC_` or import it in app code |

Variables prefixed with `EXPO_PUBLIC_` are bundled into the app and visible to anyone, so only put public values there.

## Development

```bash
npm start            # start the dev server
npm run lint         # lint (npx expo lint)
npx tsc --noEmit     # typecheck
npx expo-doctor      # diagnose dependency/config issues
```

- Add packages with `npx expo install <package>` (not `npm install <package>`) so you get versions that work with the current SDK.
- `ios/` and `android/` are generated (Continuous Native Generation) and gitignored. Configure native behavior in `app.json` and config plugins instead of editing them.
- Run lint and typecheck before opening a PR.

## Development Workflow

### Branch Naming Conventions

```
<type>/<short-description>
```

Examples:
- `feature/{feature-name}`
- `fix/{bug-description}`
- `docs/{documentation-change}`

### Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification, which keeps the commit history consistent and enables automated versioning and changelog generation.

```
<type>(<scope>): <subject>
```

Where `type` is one of:
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code formatting only
- `refactor`: Code changes without behavior change
- `test`: Adding or updating tests
- `chore`: Build process or tooling updates

### PR Process

- Branch from `main` (or fork)
- Open a PR with a clear description
- Make sure checks pass (lint, typecheck, build)
- Request a review before merging

## License

MIT