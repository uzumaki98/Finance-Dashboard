INSERT INTO categories (name, color) VALUES
  ('Groceries',      '#10b981'),
  ('Rent',           '#6366f1'),
  ('Utilities',      '#f59e0b'),
  ('Transport',      '#0ea5e9'),
  ('Dining',         '#ef4444'),
  ('Entertainment',  '#a855f7'),
  ('Health',         '#14b8a6'),
  ('Shopping',       '#ec4899'),
  ('Income',         '#22c55e'),
  ('Other',          '#888888')
ON CONFLICT (name) DO NOTHING;
