import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({ error: { code: 'VALIDATION', message: err.message, issues: err.issues } });
  }
  console.error(err);
  const status = typeof err?.status === 'number' ? err.status : 500;
  res.status(status).json({ error: { code: err?.code ?? 'INTERNAL', message: err?.message ?? 'Internal error' } });
};
