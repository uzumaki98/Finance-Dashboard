# Finance Dashboard

Personal finance dashboard. React + TypeScript + Tailwind on the client, Express + TypeScript + PostgreSQL on the server. Currency: INR (₹). Single-user, no auth.

## Prerequisites
- Node 20+
- PostgreSQL 15+ running locally

## Setup
```bash
cp .env.example .env                          # edit DATABASE_URL if needed
createdb finance_dashboard
npm install
npm run migrate                                # creates tables + seeds default categories
npm run dev                                    # server :4000, client :5173
```

Open http://localhost:5173.

## Layout
- `client/` — Vite + React + TS + Tailwind + Recharts + TanStack Query
- `server/` — Express + TS + pg + Zod
- `server/migrations/` — plain SQL, applied in order

## CSV import format
`date,description,amount,category`
- `date`: `YYYY-MM-DD`
- `amount`: rupees (decimal). Negative = expense, positive = income.
- `category`: matched by name; unknown names import as uncategorized.

## Money
Stored as integer **paise** in `BIGINT` columns. Formatted on the client via `Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })`.
