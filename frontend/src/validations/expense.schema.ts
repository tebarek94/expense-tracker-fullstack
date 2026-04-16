import { z } from "zod";
import { expenseCategories } from "../types/expense";

export const expenseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  amount: z.number().positive("Amount must be greater than 0"),
  category: z.enum(expenseCategories),
  date: z.string().min(1, "Date is required")
});

export type ExpenseSchema = z.infer<typeof expenseSchema>;
