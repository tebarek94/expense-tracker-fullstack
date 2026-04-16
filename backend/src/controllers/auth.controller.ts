import { Request, Response } from "express";
import { env } from "../config/env";
import { catchAsync } from "../utils/catchAsync";
import * as authService from "../services/auth.service";

const setRefreshCookie = (res: Response, refreshToken: string): void => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};

const clearRefreshCookie = (res: Response): void => {
  res.clearCookie("refreshToken");
};

export const register = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.register(req.body);
  setRefreshCookie(res, result.tokens.refreshToken);
  res.status(201).json({
    success: true,
    message: "Registration successful",
    data: {
      user: result.user,
      accessToken: result.tokens.accessToken,
      refreshToken: result.tokens.refreshToken
    }
  });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.login(req.body);
  setRefreshCookie(res, result.tokens.refreshToken);
  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      user: result.user,
      accessToken: result.tokens.accessToken,
      refreshToken: result.tokens.refreshToken
    }
  });
});

export const refresh = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.body.refreshToken ?? req.cookies?.refreshToken;
  const result = await authService.refreshAuthToken(refreshToken);

  setRefreshCookie(res, result.tokens.refreshToken);
  res.status(200).json({
    success: true,
    message: "Token refreshed successfully",
    data: {
      user: result.user,
      accessToken: result.tokens.accessToken,
      refreshToken: result.tokens.refreshToken
    }
  });
});

export const logout = catchAsync(async (_req: Request, res: Response) => {
  const result = await authService.logout();
  clearRefreshCookie(res);

  res.status(200).json({
    success: true,
    message: result.message
  });
});
