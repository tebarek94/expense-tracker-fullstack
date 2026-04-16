import { z } from "zod";

export const incomeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  amount: z.number().positive("Amount must be greater than 0"),
  date: z.string().min(1, "Date is required")
});

export type IncomeSchema = z.infer<typeof incomeSchema>;
