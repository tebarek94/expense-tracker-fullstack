import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("A valid email is required"),
  password: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (value) =>
        !value ||
        (value.length >= 8 &&
          /[A-Z]/.test(value) &&
          /[a-z]/.test(value) &&
          /\d/.test(value) &&
          /[^A-Za-z0-9]/.test(value)),
      "Password must include uppercase, lowercase, number, symbol and be at least 8 chars"
    )
});

export type ProfileSchema = z.infer<typeof profileSchema>;
