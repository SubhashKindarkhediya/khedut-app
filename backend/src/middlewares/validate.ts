import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodTypeAny } from 'zod';

export interface RequestValidationSchema {
  body?: ZodTypeAny;
  params?: ZodTypeAny;
  query?: ZodTypeAny;
}

/**
 * Reusable validation middleware that validates body, params, and query
 * using Zod schemas and replaces request values with the parsed results.
 */
export const validate = (schema: RequestValidationSchema | ZodTypeAny): RequestHandler => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if ('parseAsync' in schema || 'parse' in schema) {
        // Schema is a ZodObject/ZodType covering { body, params, query }
        const parsed = (await (schema as ZodTypeAny).parseAsync({
          body: req.body,
          params: req.params,
          query: req.query,
        })) as { body?: unknown; params?: unknown; query?: unknown };

        if (parsed.body !== undefined) req.body = parsed.body;
        if (parsed.params !== undefined) req.params = parsed.params as typeof req.params;
        if (parsed.query !== undefined) req.query = parsed.query as typeof req.query;
      } else {
        // Schema is an object containing separate zod schemas for body/params/query
        if (schema.body) {
          req.body = await schema.body.parseAsync(req.body);
        }
        if (schema.params) {
          req.params = (await schema.params.parseAsync(req.params)) as typeof req.params;
        }
        if (schema.query) {
          req.query = (await schema.query.parseAsync(req.query)) as typeof req.query;
        }
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default validate;
