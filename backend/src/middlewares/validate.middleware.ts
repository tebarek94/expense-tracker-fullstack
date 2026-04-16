import { NextFunction, Request, Response } from "express";
import { ZodError, ZodTypeAny } from "zod";

const replaceObjectValues = (
  target: Record<string, unknown>,
  source: Record<string, unknown>
) => {
  for (const key of Object.keys(target)) {
    delete target[key];
  }
  Object.assign(target, source);
};

export const validate =
  (schema: ZodTypeAny) =>
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = (await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params
      })) as {
        body?: unknown;
        query?: Record<string, unknown>;
        params?: Record<string, unknown>;
      };

      if (parsed?.body !== undefined) {
        req.body = parsed.body;
      }
      if (parsed?.query && typeof parsed.query === "object") {
        replaceObjectValues(req.query as Record<string, unknown>, parsed.query);
      }
      if (parsed?.params && typeof parsed.params === "object") {
        replaceObjectValues(req.params as Record<string, unknown>, parsed.params);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(error);
        return;
      }
      next(error);
    }
  };
