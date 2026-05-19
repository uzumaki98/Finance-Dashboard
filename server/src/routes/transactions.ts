import { Router } from 'express';
import multer from 'multer';
import { pool } from '../db.js';
import { validate } from '../middleware/validate.js';
import {
  IdParams,
  TransactionCreate,
  TransactionListQuery,
  TransactionUpdate,
  monthBounds,
} from '../schemas/index.js';
import { importCsv } from '../services/csvImport.js';

export const transactionsRouter = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

const SELECT = `
  SELECT t.id,
         t.occurred_on AS "occurredOn",
         t.description,
         t.amount_paise AS "amountPaise",
         t.category_id AS "categoryId",
         c.name AS "categoryName",
         c.color AS "categoryColor",
         t.notes
    FROM transactions t
    LEFT JOIN categories c ON c.id = t.category_id`;

transactionsRouter.get('/', validate({ query: TransactionListQuery }), async (req, res, next) => {
  try {
    const { month, limit, offset } = (req as any).validatedQuery as {
      month?: string; limit: number; offset: number;
    };
    const params: unknown[] = [];
    let where = '';
    if (month) {
      const { start, nextStart } = monthBounds(month);
      params.push(start, nextStart);
      where = ` WHERE t.occurred_on >= $1 AND t.occurred_on < $2`;
    }
    params.push(limit, offset);
    const { rows } = await pool.query(
      `${SELECT}${where} ORDER BY t.occurred_on DESC, t.id DESC LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params,
    );
    res.json(rows);
  } catch (e) { next(e); }
});

transactionsRouter.post('/', validate({ body: TransactionCreate }), async (req, res, next) => {
  try {
    const { occurredOn, description, amountPaise, categoryId, notes } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO transactions (occurred_on, description, amount_paise, category_id, notes)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [occurredOn, description, amountPaise, categoryId ?? null, notes ?? null],
    );
    const { rows: full } = await pool.query(`${SELECT} WHERE t.id = $1`, [rows[0].id]);
    res.status(201).json(full[0]);
  } catch (e) { next(e); }
});

transactionsRouter.patch('/:id', validate({ params: IdParams, body: TransactionUpdate }), async (req, res, next) => {
  try {
    const { id } = (req as any).validatedParams as { id: number };
    const b = req.body as Record<string, unknown>;
    const { rows } = await pool.query(
      `UPDATE transactions
          SET occurred_on  = COALESCE($2, occurred_on),
              description  = COALESCE($3, description),
              amount_paise = COALESCE($4, amount_paise),
              category_id  = COALESCE($5, category_id),
              notes        = COALESCE($6, notes)
        WHERE id = $1
        RETURNING id`,
      [id, b.occurredOn ?? null, b.description ?? null, b.amountPaise ?? null, b.categoryId ?? null, b.notes ?? null],
    );
    if (!rows[0]) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Transaction not found' } });
    const { rows: full } = await pool.query(`${SELECT} WHERE t.id = $1`, [id]);
    res.json(full[0]);
  } catch (e) { next(e); }
});

transactionsRouter.delete('/:id', validate({ params: IdParams }), async (req, res, next) => {
  try {
    const { id } = (req as any).validatedParams as { id: number };
    await pool.query('DELETE FROM transactions WHERE id = $1', [id]);
    res.status(204).end();
  } catch (e) { next(e); }
});

transactionsRouter.post('/import', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: { code: 'NO_FILE', message: 'CSV file required (field "file")' } });
    const result = await importCsv(req.file.buffer);
    res.status(201).json(result);
  } catch (e) { next(e); }
});
