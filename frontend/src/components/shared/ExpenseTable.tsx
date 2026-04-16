import { Pencil, Trash2 } from "lucide-react";
import { Expense } from "../../types/expense";
import { formatCurrency, formatDate } from "../../utils/format";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { EmptyState } from "../ui/EmptyState";

interface ExpenseTableProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
}

export const ExpenseTable = ({ expenses, onEdit, onDelete }: ExpenseTableProps) => {
  if (!expenses.length) {
    return (
      <Card>
        <EmptyState
          title="No expenses found"
          description="Try changing filters or add a new expense."
        />
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Title</th>
              <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Amount</th>
              <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Category</th>
              <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Date</th>
              <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id} className="border-t border-slate-100 dark:border-slate-800">
                <td className="px-4 py-3 text-slate-900 dark:text-slate-100">{expense.title}</td>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-200">
                  {formatCurrency(expense.amount)}
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{expense.category}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                  {formatDate(expense.date)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" onClick={() => onEdit(expense)}>
                      <Pencil size={14} />
                    </Button>
                    <Button variant="danger" onClick={() => onDelete(expense)}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
