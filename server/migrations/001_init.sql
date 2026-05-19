CREATE TABLE IF NOT EXISTS categories (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL UNIQUE,
  color       TEXT NOT NULL DEFAULT '#888888',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS transactions (
  id           SERIAL PRIMARY KEY,
  occurred_on  DATE NOT NULL,
  description  TEXT NOT NULL,
  amount_paise BIGINT NOT NULL,
  category_id  INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  notes        TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_tx_occurred_on ON transactions (occurred_on DESC);
CREATE INDEX IF NOT EXISTS idx_tx_category    ON transactions (category_id);

CREATE TABLE IF NOT EXISTS budgets (
  id           SERIAL PRIMARY KEY,
  category_id  INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  month        DATE NOT NULL,
  amount_paise BIGINT NOT NULL CHECK (amount_paise >= 0),
  UNIQUE (category_id, month)
);
