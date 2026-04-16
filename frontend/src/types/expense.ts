export const expenseCategories = [
  "FOOD",
  "TRANSPORT",
  "ENTERTAINMENT",
  "BILLS",
  "OTHER"
] as const;

export type ExpenseCategory = (typeof expenseCategories)[number];

export interface Expense {
  id: string;
  title: string;
  amount: number | string;
  category: ExpenseCategory;
  date: string;
  createdAt: string;
  userId: string;
}

export interface ExpenseInput {
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
}

export interface ExpenseSummary {
  totalExpenses: number | string;
  categoryBreakdown: Array<{
    category: ExpenseCategory;
    total: number | string;
  }>;
}

export interface MonthlySummaryItem {
  month: string;
  total: number | string;
}
