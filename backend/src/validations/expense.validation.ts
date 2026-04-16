import { ExpenseCategory } from "@prisma/client";
import { z } from "zod";

const expenseCategoryEnum = z.nativeEnum(ExpenseCategory);

export const createExpenseSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1).max(120),
    amount: z.coerce.number().positive(),
    category: expenseCategoryEnum,
    date: z.coerce.date()
  })
});

export const updateExpenseSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1).max(120).optional(),
    amount: z.coerce.number().positive().optional(),
    category: expenseCategoryEnum.optional(),
    date: z.coerce.date().optional()
  })
});

export const expenseQuerySchema = z.object({
  query: z.object({
    category: expenseCategoryEnum.optional(),
    search: z.string().trim().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10)
  })
});
