import { Router } from 'express';
import { pool } from '../db.js';
import { validate } from '../middleware/validate.js';
import { CategoryCreate, CategoryUpdate, IdParams } from '../schemas/index.js';

export const categoriesRouter = Router();

categoriesRouter.get('/', async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, name, color, created_at AS "createdAt" FROM categories ORDER BY name',
    );
    res.json(rows);
  } catch (e) { next(e); }
});

categoriesRouter.post('/', validate({ body: CategoryCreate }), async (req, res, next) => {
  try {
    const { name, color } = req.body as { name: string; color?: string };
    const { rows } = await pool.query(
      'INSERT INTO categories (name, color) VALUES ($1, COALESCE($2, DEFAULT)) RETURNING id, name, color',
      [name, color ?? null],
    );
    res.status(201).json(rows[0]);
  } catch (e) { next(e); }
});

categoriesRouter.patch('/:id', validate({ params: IdParams, body: CategoryUpdate }), async (req, res, next) => {
  try {
    const { id } = (req as any).validatedParams as { id: number };
    const { name, color } = req.body as { name?: string; color?: string };
    const { rows } = await pool.query(
      `UPDATE categories
         SET name = COALESCE($2, name),
             color = COALESCE($3, color)
       WHERE id = $1
       RETURNING id, name, color`,
      [id, name ?? null, color ?? null],
    );
    if (!rows[0]) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Category not found' } });
    res.json(rows[0]);
  } catch (e) { next(e); }
});

categoriesRouter.delete('/:id', validate({ params: IdParams }), async (req, res, next) => {
  try {
    const { id } = (req as any).validatedParams as { id: number };
    await pool.query('DELETE FROM categories WHERE id = $1', [id]);
    res.status(204).end();
  } catch (e) { next(e); }
});
