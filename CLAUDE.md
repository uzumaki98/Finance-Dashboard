# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install all workspaces
npm install

# Start both client (localhost:5173) and server (localhost:4000) in watch mode
npm run dev

# Run DB migrations (creates tables + seeds default categories)
npm run migrate

# Build both workspaces
npm run build

# Run only the server or only the client
npm run dev -w server
npm run dev -w client
```

There are no test commands — this project has no test suite.

## Architecture

This is an npm workspaces monorepo with two packages: `client/` and `server/`.

### Data flow

```
Browser → Vite dev server (:5173)
            └─ /api proxy → Express (:4000) → PostgreSQL
```

In production, client is built as static files served separately; the Vite proxy is dev-only (`client/vite.config.ts`).

### Money representation

All amounts are stored as **integer paise** (`BIGINT`) in the database — ₹1 = 100 paise. Conversion to/from rupees happens only at the client boundary. The formatter is `fmtINR(paise)` in `client/src/api/client.ts`.

**Sign convention:** expenses are **negative** paise, income is positive. The reports sum `CASE WHEN amount_paise < 0 THEN -amount_paise ELSE 0 END` to compute spend.

### CSV import

`POST /api/transactions/import` (multipart `file` field) expects columns: `date` (YYYY-MM-DD), `description`, `amount` (rupees, decimals OK, commas stripped), `category` (optional, matched case-insensitively to existing category names). Unknown categories are silently ignored (set to NULL). The whole file commits atomically; row errors are reported without aborting the batch.

### Server (`server/src/`)

- `index.ts` — Express app setup, route mounting, global error handler
- `db.ts` — pg connection pool; explicitly casts BIGINT columns to `Number`
- `env.ts` — Zod-validated env (`DATABASE_URL` required, `PORT` default 4000)
- `schemas/index.ts` — All Zod schemas + `monthBounds()` helper (converts `YYYY-MM` → SQL date range)
- `middleware/validate.ts` — Wraps Zod schemas into Express middleware for body/query/params
- `middleware/error.ts` — Global error handler; formats `ZodError` as structured validation errors
- `routes/` — One file per resource (`categories`, `transactions`, `budgets`, `reports`)
- `services/csvImport.ts` — CSV parsing logic (commits the whole batch, reports per-row errors without aborting)
- `services/reports.ts` — SQL queries for `monthly-spend` and `budget-vs-actual` aggregations
- `migrate.ts` — Reads SQL files from `migrations/` in order, tracks applied migrations in `_migrations` table

### Client (`client/src/`)

- `api/client.ts` — Thin fetch wrapper (`api.get/post/put/patch/del/upload`); throws on non-2xx
- `types/index.ts` — Shared TypeScript types matching server response shapes
- `hooks/` — TanStack Query hooks; one file per resource, co-located with their mutations
- `components/` — Feature components (`transactions/`, `budgets/`, `charts/`, `layout/`, `ui/`)
- `pages/` — Route-level components (currently a single dashboard page)

**Query key conventions:**
- `['transactions', month, limit]`
- `['categories']`
- `['budgets', month]`
- `['monthly-spend', month]`
- `['budget-vs-actual', month]`
- `['summary']` — invalidated by transaction mutations but no dedicated hook yet

Mutations invalidate the affected keys broadly (e.g. creating a transaction invalidates `transactions`, `monthly-spend`, `budget-vs-actual`, `summary`).

### Month selection

Selected month is stored in the URL as `?month=YYYY-MM` (via React Router). All data hooks read from this query param. Changing the month re-fetches everything without any client-side filtering.

### Database migrations

Plain SQL files in `server/migrations/`, applied in filename order. The migration runner is idempotent — it skips files already recorded in `_migrations`. To add a migration, create `004_<name>.sql`.

### API routes

All routes are mounted under `/api`:
- `GET/POST /api/transactions` — list (paginated, optional `?month=`) / create
- `PATCH/DELETE /api/transactions/:id`
- `POST /api/transactions/import` — CSV bulk import
- `GET /api/categories`, `POST /api/categories`, `PATCH /api/categories/:id`, `DELETE /api/categories/:id`
- `GET/PUT /api/budgets` — list by `?month=` / upsert (PUT is idempotent via `ON CONFLICT`)
- `GET /api/reports/monthly-spend?month=` — spend per category
- `GET /api/reports/budget-vs-actual?month=` — budget vs. actual per category
