import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { ApiError } from "../utils/apiError";
import { Role } from "../utils/rbac";

const extractBearerToken = (authorization?: string): string | null => {
  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }
  return authorization.split(" ")[1] ?? null;
};

export const authenticateUser = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const token = extractBearerToken(req.headers.authorization);

  if (!token) {
    next(new ApiError(401, "Authentication token is missing"));
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role
    };
    next();
  } catch {
    next(new ApiError(401, "Invalid or expired access token"));
  }
};

export const authorizeRoles =
  (...allowedRoles: Role[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const user = req.user;
    if (!user || !allowedRoles.includes(user.role)) {
      next(new ApiError(403, "You are not allowed to access this resource"));
      return;
    }
    next();
  };
