import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { MonthQuery } from '../schemas/index.js';
import { monthlySpend, budgetVsActual, incomeSavingsHistory } from '../services/reports.js';

export const reportsRouter = Router();

reportsRouter.get('/monthly-spend', validate({ query: MonthQuery }), async (req, res, next) => {
  try {
    const { month } = (req as any).validatedQuery as { month: string };
    res.json(await monthlySpend(month));
  } catch (e) { next(e); }
});

reportsRouter.get('/budget-vs-actual', validate({ query: MonthQuery }), async (req, res, next) => {
  try {
    const { month } = (req as any).validatedQuery as { month: string };
    res.json(await budgetVsActual(month));
  } catch (e) { next(e); }
});

reportsRouter.get('/income-savings', validate({ query: MonthQuery }), async (req, res, next) => {
  try {
    const { month } = (req as any).validatedQuery as { month: string };
    res.json(await incomeSavingsHistory(month, 6));
  } catch (e) { next(e); }
});
