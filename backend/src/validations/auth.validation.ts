import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(80),
    email: z.email().toLowerCase(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(64)
      .regex(/[A-Z]/, "Password must include an uppercase letter")
      .regex(/[a-z]/, "Password must include a lowercase letter")
      .regex(/\d/, "Password must include a number")
      .regex(/[^A-Za-z0-9]/, "Password must include a symbol")
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.email().toLowerCase(),
    password: z.string().min(1, "Password is required")
  })
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().optional()
  })
});
