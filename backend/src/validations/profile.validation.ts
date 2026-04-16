import { z } from "zod";

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(80).optional(),
    email: z.email().toLowerCase().optional(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(64)
      .regex(/[A-Z]/, "Password must include an uppercase letter")
      .regex(/[a-z]/, "Password must include a lowercase letter")
      .regex(/\d/, "Password must include a number")
      .regex(/[^A-Za-z0-9]/, "Password must include a symbol")
      .optional()
  })
});
