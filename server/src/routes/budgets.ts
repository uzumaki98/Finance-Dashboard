import { Router } from 'express';
import { pool } from '../db.js';
import { validate } from '../middleware/validate.js';
import { BudgetUpsert, MonthQuery, monthBounds } from '../schemas/index.js';

export const budgetsRouter = Router();

budgetsRouter.get('/', validate({ query: MonthQuery }), async (req, res, next) => {
  try {
    const { month } = (req as any).validatedQuery as { month: string };
    const { start } = monthBounds(month);
    const { rows } = await pool.query(
      `SELECT b.id,
              b.category_id  AS "categoryId",
              c.name         AS "categoryName",
              c.color        AS "categoryColor",
              to_char(b.month, 'YYYY-MM') AS month,
              b.amount_paise AS "amountPaise"
         FROM budgets b
         JOIN categories c ON c.id = b.category_id
        WHERE b.month = $1
        ORDER BY c.name`,
      [start],
    );
    res.json(rows);
  } catch (e) { next(e); }
});

budgetsRouter.put('/', validate({ body: BudgetUpsert }), async (req, res, next) => {
  try {
    const { categoryId, month, amountPaise } = req.body as {
      categoryId: number; month: string; amountPaise: number;
    };
    const { start } = monthBounds(month);
    const { rows } = await pool.query(
      `INSERT INTO budgets (category_id, month, amount_paise)
       VALUES ($1, $2, $3)
       ON CONFLICT (category_id, month)
       DO UPDATE SET amount_paise = EXCLUDED.amount_paise
       RETURNING id, category_id AS "categoryId", to_char(month, 'YYYY-MM') AS month, amount_paise AS "amountPaise"`,
      [categoryId, start, amountPaise],
    );
    res.status(200).json(rows[0]);
  } catch (e) { next(e); }
});
