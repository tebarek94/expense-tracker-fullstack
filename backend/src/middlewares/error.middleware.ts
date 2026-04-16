import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { ZodError } from "zod";
import { ApiError } from "../utils/apiError";

export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (error instanceof SyntaxError && "body" in error) {
    res.status(400).json({
      success: false,
      message: "Invalid JSON payload",
      error: error.message
    });
    return;
  }

  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      error: error.flatten().fieldErrors
    });
    return;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    res.status(400).json({
      success: false,
      message: "Database operation failed",
      error: {
        code: error.code,
        meta: error.meta
      }
    });
    return;
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    res.status(400).json({
      success: false,
      message: "Invalid database payload",
      error: error.message
    });
    return;
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    res.status(503).json({
      success: false,
      message: "Database connection failed",
      error: error.message
    });
    return;
  }

  if (error instanceof TokenExpiredError) {
    res.status(401).json({
      success: false,
      message: "Token has expired",
      error: error.name
    });
    return;
  }

  if (error instanceof JsonWebTokenError) {
    res.status(401).json({
      success: false,
      message: "Invalid token",
      error: error.name
    });
    return;
  }

  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      error: error.details ?? null
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: error instanceof Error ? error.message : "Unknown error"
  });
};
