import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { MonthQuery } from '../schemas/index.js';
import { alertStatus } from '../services/alerts.js';

export const alertsRouter = Router();

alertsRouter.get('/status', validate({ query: MonthQuery }), async (req, res, next) => {
  try {
    const { month } = (req as any).validatedQuery as { month: string };
    res.json(await alertStatus(month));
  } catch (e) { next(e); }
});
