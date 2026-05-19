import type { RequestHandler } from 'express';
import type { ZodTypeAny, z } from 'zod';

type Sources = { body?: ZodTypeAny; query?: ZodTypeAny; params?: ZodTypeAny };

export function validate<S extends Sources>(schemas: S): RequestHandler {
  return (req, _res, next) => {
    try {
      if (schemas.body) req.body = schemas.body.parse(req.body);
      if (schemas.query) (req as any).validatedQuery = schemas.query.parse(req.query);
      if (schemas.params) (req as any).validatedParams = schemas.params.parse(req.params);
      next();
    } catch (e) {
      next(e);
    }
  };
}

export type Infer<T extends ZodTypeAny> = z.infer<T>;
