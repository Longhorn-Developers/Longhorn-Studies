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
├── drizzle/              # Generated SQL migrations (created by `npm run db:generate`)
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

The schema lives in TypeScript under `src/db/schema/`. Drizzle Kit turns it into SQL migrations and applies them to Supabase.

### Querying from the app

```ts
import { supabase } from "@/lib/supabase";

const { data, error } = await supabase.from("study_spots").select("*");
```

Every table needs row level security policies (define them in the Drizzle schema with `pgPolicy`), or the app can't read it.

### Adding or changing tables

1. Add or edit a file in `src/db/schema/` (e.g. `study-spots.ts`) and export its tables. Drizzle Kit reads every file in the folder. Also re-export the file from `src/db/schema/index.ts` if app code imports it.
2. Generate a migration:
   ```bash
   npm run db:generate -- --name <what_changed>
   ```
3. Review the SQL in `drizzle/`, then apply it:
   ```bash
   npm run db:migrate
   ```

| Script | What it does |
| --- | --- |
| `npm run db:generate` | Create a SQL migration from schema changes |
| `npm run db:migrate` | Apply pending migrations to the database |
| `npm run db:push` | Sync the schema directly without migration files (prototyping only; don't mix with `db:migrate` on the same database) |
| `npm run db:studio` | Open Drizzle Studio to browse data |
| `npm run db:check` | Check migration files for consistency |

Columns are camelCase in TypeScript and snake_case in Postgres (`casing: "snake_case"`).

> **Never connect to Postgres from the app.** `DATABASE_URL` is a full-access credential. On device, query with the Supabase client in `src/lib/supabase.ts` (publishable key) so row level security applies. Use Drizzle queries only in server code (Expo API routes or Supabase Edge Functions).

See [`src/db/README.md`](src/db/README.md) for more detail.

## Technology Stack

- Expo SDK 58 with Expo Router (file-based navigation)
- React Native 0.88, React 19.3
- TypeScript 6
- NativeWind 4 (Tailwind CSS 3) for styling
- React Native Reanimated, Gesture Handler, Expo Image, Expo Symbols
- Supabase (Postgres, Auth)
- Drizzle ORM and Drizzle Kit

## Configuration

Copy `.env.example` to `.env`. `.env` is gitignored, so don't commit it.

| Variable | Where it's used | Notes |
| --- | --- | --- |
| `DATABASE_URL` | Drizzle Kit (migrations) | Supabase dashboard → Connect → Session pooler (works over IPv4; the direct connection is IPv6-only). Server-only, so never prefix it with `EXPO_PUBLIC_` |
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
