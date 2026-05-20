# Finance Dashboard — Application Specification

## Overview

A single-user personal finance dashboard for tracking income and expenses in Indian Rupees (₹). The app provides monthly transaction management, budget tracking, category-based analytics, and expense projection with inflation modeling. Designed for a Bangalore-based software engineer persona.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | React 18 + TypeScript 5.6 |
| Build tool | Vite 5.4 |
| Styling | Tailwind CSS 3.4 |
| Server state | TanStack React Query 5.59 |
| Routing | React Router DOM 6.27 |
| Charts | Recharts 2.13 |
| Backend framework | Express 4.21 + TypeScript 5.6 |
| Database | PostgreSQL 15+ |
| Validation | Zod 3.23 |
| File upload | Multer + csv-parse |

**Dev ports:** Client on `5173`, server on `4000`. Client proxies `/api` to server.

---

## Data Model

### Money representation
All monetary values are stored as **integer paise** (₹1 = 100 paise) to avoid floating-point errors. Formatting to ₹ strings happens exclusively on the frontend.

### Database tables

**`categories`**
- `id` — serial primary key
- `name` — unique text (1–60 chars)
- `color` — hex color string (default `#888888`)
- `created_at` — timestamptz

Pre-seeded categories: Groceries, Rent, Utilities, Transport, Dining, Entertainment, Health, Shopping, Income, Other.

**`transactions`**
- `id` — serial primary key
- `occurred_on` — date (YYYY-MM-DD)
- `description` — text
- `amount_paise` — BIGINT (integer paise)
- `category_id` — FK → categories (nullable)
- `notes` — text (optional)
- `created_at` — timestamptz
- Indexes on `occurred_on DESC`, `category_id`

**`budgets`**
- `id` — serial primary key
- `category_id` — FK → categories
- `month` — date stored as YYYY-MM-01
- `amount_paise` — BIGINT (non-negative)
- Unique constraint on `(category_id, month)`; upsertable

**`_migrations`**
- Tracks applied SQL migrations to enforce idempotency

---

## API

All endpoints are prefixed `/api`.

### Categories

| Method | Path | Description |
|---|---|---|
| GET | `/categories` | List all categories, sorted by name |
| POST | `/categories` | Create category (name, optional color) |
| PATCH | `/categories/:id` | Update category name or color |
| DELETE | `/categories/:id` | Delete category |

### Transactions

| Method | Path | Description |
|---|---|---|
| GET | `/transactions` | List transactions; query params: `month` (YYYY-MM), `limit` (1–1000, default 50), `offset` (default 0) |
| POST | `/transactions` | Create transaction |
| PATCH | `/transactions/:id` | Update transaction |
| DELETE | `/transactions/:id` | Delete transaction |
| POST | `/transactions/import` | Bulk import via CSV file upload (multipart/form-data) |

### Budgets

| Method | Path | Description |
|---|---|---|
| GET | `/budgets` | List budgets for `?month=YYYY-MM` |
| PUT | `/budgets` | Upsert budget (categoryId, month, amountPaise) |

### Reports

| Method | Path | Description |
|---|---|---|
| GET | `/reports/monthly-spend` | Spending by category for `?month=YYYY-MM` (categories with expenses > 0 only) |
| GET | `/reports/budget-vs-actual` | Budget vs. actual spending for `?month=YYYY-MM` |

### Utilities

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/README.md` | Serves the root README |

---

## Features

### Month picker
- Native `<input type="month">` in the app header
- Selection is stored in the URL as `?month=YYYY-MM`
- All data views (transactions, budgets, reports) respond to the selected month
- Defaults to the current calendar month

### Monthly summary cards
Four stat cards displayed at the top of the dashboard:
1. **Total Income** — sum of income transactions for the month
2. **Total Expenses** — sum of expense transactions for the month
3. **Net Savings** — income minus expenses
4. **Transaction Count** — number of transactions in the month

Savings rate (%) is derived from net / income.

### Add transaction form
Fields:
- **Date** — defaults to today (YYYY-MM-DD)
- **Description** — free text
- **Amount (₹)** — decimal input, converted to paise on submission
- **Type** — expense or income
- **Category** — dropdown populated from categories API

Form resets on successful submission. Mutations invalidate transactions, monthly-spend, budget-vs-actual, and summary query caches.

### CSV bulk import
Accepts a CSV file upload via the Add Transaction form. Expected columns: `date`, `description`, `amount`, `category`.

- Amount is parsed as a decimal string (strips commas/spaces) and converted to paise
- Category matched case-insensitively by name; unrecognized categories map to null
- Import is transactional (all-or-nothing per file)
- Row-level errors are reported with 1-indexed row number and error message
- Returns `{ inserted: number, errors: [{ row, message }] }`

### Recent transactions table
- Displays transactions for the selected month (up to configured limit)
- **Sort** — toggleable amount sort (none → descending → ascending)
- **Search** — case-insensitive substring filter with match highlighting
- **Delete** — inline delete button per row
- Category displayed as a colored badge
- Amounts colored: red for expenses, green for income

### Spending by category chart
- Donut-style pie chart (45% inner radius) using Recharts
- Shows each category's share of total spending for the month
- Percentage labels on slices, category amounts in the legend
- Hover tooltips

### Budget vs. actual
- Form to set a monthly budget per category (category dropdown + amount input)
- Budgets are upserted (one budget per category per month)
- Visualization: horizontal bar per category showing actual vs. budgeted spend
  - Bar color: red if over budget, green if under
- Reads from the `budget-vs-actual` report endpoint

### Expense projection chart
- Line chart (Recharts) showing spending over the last 3 months (actuals) plus a 1-month projection
- Projection applies per-category inflation rates to 4 tracked categories:
  - Dining, Groceries, Rent, Utilities
- Dashed reference line separates historical data from the projection
- Collapsible table showing per-category inflation assumptions with India CPI context

---

## Server Architecture

### Validation middleware
`validate.ts` — Zod-based middleware for body, query, and params validation. Returns structured 400 responses on failure.

### Error handler
`error.ts` — Global Express error handler. Formats `ZodError` instances as validation issue arrays; passes other errors through with status 500.

### Database
- PostgreSQL connection pool via `pg` driver
- BIGINT fields (20-digit) explicitly coerced to `Number` (safe for personal finance amounts)
- `monthBounds(month)` helper returns first-of-month and first-of-next-month dates for range queries

### Migrations
SQL migration files applied in order, tracked in `_migrations` table. Run via `npm run migrate` in the server package.

---

## Frontend Architecture

### State management
TanStack React Query handles all server state. Configuration:
- Stale time: 30 seconds
- No refetch on window focus

**Query keys:**
- `['transactions', month, limit]`
- `['categories']`
- `['budgets', month]`
- `['monthly-spend', month]`
- `['budget-vs-actual', month]`

All write mutations invalidate the relevant query keys so the UI stays consistent.

### API client
`api/client.ts` provides typed wrappers: `api.get()`, `api.post()`, `api.put()`, `api.patch()`, `api.del()`, `api.upload()`.

Money formatting:
- `inr` — `Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })`
- `fmtINR(paise: number)` — converts integer paise to a formatted ₹ string

### Layout
- `AppShell` — header (title + month picker), main content area, footer with README link
- `Dashboard` — responsive grid: 1 column on mobile, 2 columns on desktop (Tailwind `lg:grid-cols-2`)

### UI primitives
- `Card` — white card with rounded border, shadow, optional title and action slot in header
- `Button` — indigo solid button with hover and disabled states
- `Spinner` — "Loading…" text placeholder

---

## TypeScript Types (Client)

```typescript
type Category = {
  id: number;
  name: string;
  color: string;
};

type Transaction = {
  id: number;
  occurredOn: string;       // YYYY-MM-DD
  description: string;
  amountPaise: number;
  categoryId: number | null;
  categoryName: string | null;
  categoryColor: string | null;
  notes: string | null;
};

type MonthlySpend = {
  categoryId: number;
  name: string;
  color: string;
  spentPaise: number;
};

type BudgetVsActual = {
  categoryId: number;
  name: string;
  color: string;
  budgetPaise: number;
  spentPaise: number;
};

type Budget = {
  id: number;
  categoryId: number;
  categoryName: string;
  categoryColor: string;
  month: string;            // YYYY-MM-01
  amountPaise: number;
};
```

---

## Configuration

### Environment variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `DATABASE_URL` | Yes | — | PostgreSQL connection string |
| `PORT` | No | `4000` | Server listen port |

Copy `.env.example` to `.env` and fill in `DATABASE_URL` before running.

### Running locally

```bash
# Install all dependencies (root, client, server)
npm install

# Run database migrations
npm run migrate --workspace=server

# Start both client and server in watch mode
npm run dev
```

---

## Constraints and Design Decisions

- **No authentication** — single-user app, no auth layer
- **CORS enabled** — client and server run on different ports in development
- **Paise storage** — integer arithmetic eliminates floating-point rounding errors
- **URL-persisted month** — month selection survives page refresh
- **No refetch on focus** — prevents unnecessary requests when switching browser tabs
- **Transactional CSV import** — partial imports are rejected; errors are reported row by row
