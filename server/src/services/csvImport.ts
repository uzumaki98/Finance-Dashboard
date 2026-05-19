import { parse } from 'csv-parse/sync';
import { z } from 'zod';
import { pool } from '../db.js';

const Row = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  description: z.string().min(1),
  amount: z.string().min(1),
  category: z.string().optional().default(''),
});

export async function importCsv(buf: Buffer) {
  const records = parse(buf, { columns: true, skip_empty_lines: true, trim: true }) as unknown[];
  const client = await pool.connect();
  let inserted = 0;
  const errors: { row: number; message: string }[] = [];
  try {
    await client.query('BEGIN');
    const { rows: cats } = await client.query('SELECT id, name FROM categories');
    const byName = new Map<string, number>(cats.map((c: any) => [c.name.toLowerCase(), c.id]));

    for (let i = 0; i < records.length; i++) {
      const raw = records[i];
      try {
        const r = Row.parse(raw);
        const amt = Number(r.amount.replace(/[, ]/g, ''));
        if (!Number.isFinite(amt)) throw new Error(`invalid amount: ${r.amount}`);
        const paise = Math.round(amt * 100);
        const categoryId = r.category ? byName.get(r.category.toLowerCase()) ?? null : null;
        await client.query(
          `INSERT INTO transactions (occurred_on, description, amount_paise, category_id)
           VALUES ($1, $2, $3, $4)`,
          [r.date, r.description, paise, categoryId],
        );
        inserted++;
      } catch (e: any) {
        errors.push({ row: i + 2, message: e?.message ?? String(e) }); // +2: header + 1-indexed
      }
    }
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
  return { inserted, errors };
}
