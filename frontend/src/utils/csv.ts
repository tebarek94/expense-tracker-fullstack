import { Expense } from "../types/expense";

export const downloadExpensesCsv = (expenses: Expense[]) => {
  const headers = ["Title", "Amount", "Category", "Date"];
  const rows = expenses.map((expense) => [
    expense.title,
    String(expense.amount),
    expense.category,
    expense.date
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `expenses-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};
