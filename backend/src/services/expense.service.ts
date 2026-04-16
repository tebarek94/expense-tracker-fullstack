import { ExpenseCategory, Prisma } from "@prisma/client";
import { prisma } from "../config/db";
import { ApiError } from "../utils/apiError";

interface ExpensePayload {
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: Date;
}

interface ExpenseQueryFilters {
  category?: ExpenseCategory;
  search?: string;
  startDate?: Date;
  endDate?: Date;
  page: number;
  limit: number;
}

const toDecimal = (value: number) => new Prisma.Decimal(value);

export const createExpense = async (userId: string, payload: ExpensePayload) => {
  return prisma.expense.create({
    data: {
      ...payload,
      amount: toDecimal(payload.amount),
      userId
    }
  });
};

export const getExpenses = async (userId: string, filters: ExpenseQueryFilters) => {
  const where: Prisma.ExpenseWhereInput = {
    userId,
    ...(filters.category ? { category: filters.category } : {}),
    ...(filters.search
      ? {
          title: {
            contains: filters.search,
            mode: "insensitive"
          }
        }
      : {}),
    ...(filters.startDate || filters.endDate
      ? {
          date: {
            ...(filters.startDate ? { gte: filters.startDate } : {}),
            ...(filters.endDate ? { lte: filters.endDate } : {})
          }
        }
      : {})
  };

  const [items, total] = await Promise.all([
    prisma.expense.findMany({
      where,
      orderBy: { date: "desc" },
      take: filters.limit,
      skip: (filters.page - 1) * filters.limit
    }),
    prisma.expense.count({ where })
  ]);

  return {
    items,
    pagination: {
      page: filters.page,
      limit: filters.limit,
      total,
      totalPages: Math.ceil(total / filters.limit)
    }
  };
};

export const getExpenseById = async (userId: string, id: string) => {
  const expense = await prisma.expense.findFirst({
    where: { id, userId }
  });

  if (!expense) {
    throw new ApiError(404, "Expense not found");
  }

  return expense;
};

export const updateExpense = async (
  userId: string,
  id: string,
  payload: Partial<ExpensePayload>
) => {
  await getExpenseById(userId, id);

  return prisma.expense.update({
    where: { id },
    data: {
      ...payload,
      ...(payload.amount !== undefined ? { amount: toDecimal(payload.amount) } : {})
    }
  });
};

export const deleteExpense = async (userId: string, id: string) => {
  await getExpenseById(userId, id);
  await prisma.expense.delete({ where: { id } });
};

export const getExpenseSummary = async (userId: string) => {
  const [totalResult, categoryBreakdown] = await Promise.all([
    prisma.expense.aggregate({
      where: { userId },
      _sum: {
        amount: true
      }
    }),
    prisma.expense.groupBy({
      by: ["category"],
      where: { userId },
      _sum: {
        amount: true
      }
    })
  ]);

  return {
    totalExpenses: totalResult._sum.amount ?? new Prisma.Decimal(0),
    categoryBreakdown: categoryBreakdown.map((item) => ({
      category: item.category,
      total: item._sum.amount ?? new Prisma.Decimal(0)
    }))
  };
};

type MonthlyRow = {
  month: Date;
  total: Prisma.Decimal;
};

export const getMonthlySummary = async (userId: string) => {
  const data = await prisma.$queryRaw<MonthlyRow[]>`
    SELECT date_trunc('month', "date") AS month, SUM("amount")::numeric AS total
    FROM "Expense"
    WHERE "userId" = ${userId}::uuid
    GROUP BY month
    ORDER BY month DESC
  `;

  return data;
};
