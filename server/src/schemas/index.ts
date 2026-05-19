import { z } from 'zod';

export const MonthQuery = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/, 'month must be YYYY-MM'),
});

export const IdParams = z.object({
  id: z.coerce.number().int().positive(),
});

export const CategoryCreate = z.object({
  name: z.string().min(1).max(60),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
});

export const CategoryUpdate = CategoryCreate.partial();

export const TransactionCreate = z.object({
  occurredOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  description: z.string().min(1).max(200),
  amountPaise: z.number().int(),
  categoryId: z.number().int().positive().nullable().optional(),
  notes: z.string().max(500).optional().nullable(),
});

export const TransactionUpdate = TransactionCreate.partial();

export const TransactionListQuery = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/).optional(),
  limit: z.coerce.number().int().positive().max(1000).default(50),
  offset: z.coerce.number().int().nonnegative().default(0),
});

export const BudgetUpsert = z.object({
  categoryId: z.number().int().positive(),
  month: z.string().regex(/^\d{4}-\d{2}$/),
  amountPaise: z.number().int().nonnegative(),
});

export function monthBounds(month: string): { start: string; nextStart: string } {
  const [y, m] = month.split('-').map(Number);
  const start = `${y}-${String(m).padStart(2, '0')}-01`;
  const ny = m === 12 ? y + 1 : y;
  const nm = m === 12 ? 1 : m + 1;
  const nextStart = `${ny}-${String(nm).padStart(2, '0')}-01`;
  return { start, nextStart };
}
