import { NextFunction, Request, Response } from "express";

const sanitizeValue = (value: unknown): unknown => {
  if (typeof value === "string") {
    return value.replace(/[<>$]/g, "").trim();
  }

  if (Array.isArray(value)) {
    return value.map((entry) => sanitizeValue(entry));
  }

  if (value && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>).reduce<
      Record<string, unknown>
    >((acc, [key, nestedValue]) => {
      acc[key] = sanitizeValue(nestedValue);
      return acc;
    }, {});
  }

  return value;
};

const sanitizeObjectInPlace = (target: unknown): void => {
  if (!target || typeof target !== "object") {
    return;
  }

  const source = target as Record<string, unknown>;
  for (const key of Object.keys(source)) {
    source[key] = sanitizeValue(source[key]);
  }
};

export const sanitizeRequest = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  req.body = sanitizeValue(req.body) as Request["body"];
  sanitizeObjectInPlace(req.query);
  sanitizeObjectInPlace(req.params);
  next();
};
