import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowDownCircle, ArrowUpCircle, Trash2, Wallet } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { StatCard } from "../../components/shared/StatCard";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { EmptyState } from "../../components/ui/EmptyState";
import { Input } from "../../components/ui/Input";
import { Loader } from "../../components/ui/Loader";
import { ApiResponse, PaginatedResponse } from "../../types/api";
import { Expense, ExpenseSummary } from "../../types/expense";
import { IncomeEntry } from "../../types/income";
import { formatCurrency, formatDate } from "../../utils/format";
import { getApiErrorMessage } from "../../utils/apiError";
import { IncomeSchema, incomeSchema } from "../../validations/income.schema";

const INCOME_STORAGE_KEY = "expense_tracker_income_entries";

const readIncomeEntries = (): IncomeEntry[] => {
  const raw = localStorage.getItem(INCOME_STORAGE_KEY);
  if (!raw) {
    return [];
  }
  try {
    return JSON.parse(raw) as IncomeEntry[];
  } catch {
    return [];
  }
};

export const IncomeOutcomePage = () => {
  const [incomeEntries, setIncomeEntries] = useState<IncomeEntry[]>([]);
  const [outcomeTotal, setOutcomeTotal] = useState(0);
  const [recentExpenses, setRecentExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<IncomeSchema>({
    resolver: zodResolver(incomeSchema),
    defaultValues: {
      title: "",
      amount: 0,
      date: new Date().toISOString().slice(0, 10)
    }
  });

  useEffect(() => {
    setIncomeEntries(readIncomeEntries());
  }, []);

  useEffect(() => {
    localStorage.setItem(INCOME_STORAGE_KEY, JSON.stringify(incomeEntries));
  }, [incomeEntries]);

  useEffect(() => {
    const loadOutcomeData = async () => {
      try {
        const [summaryResponse, expensesResponse] = await Promise.all([
          api.get<ApiResponse<ExpenseSummary>>("/expenses/summary"),
          api.get<PaginatedResponse<Expense>>("/expenses", {
            params: { page: 1, limit: 5 }
          })
        ]);
        setOutcomeTotal(Number(summaryResponse.data.data.totalExpenses ?? 0));
        setRecentExpenses(expensesResponse.data.data);
      } catch (error) {
        toast.error(getApiErrorMessage(error, "Failed to load outcome data"));
      } finally {
        setLoading(false);
      }
    };
    void loadOutcomeData();
  }, []);

  const totalIncome = useMemo(
    () => incomeEntries.reduce((acc, entry) => acc + Number(entry.amount), 0),
    [incomeEntries]
  );
  const netBalance = totalIncome - outcomeTotal;

  const addIncomeEntry = async (payload: IncomeSchema) => {
    setIncomeEntries((prev) => [
      {
        id: crypto.randomUUID(),
        title: payload.title,
        amount: Number(payload.amount),
        date: payload.date
      },
      ...prev
    ]);
    reset({
      title: "",
      amount: 0,
      date: new Date().toISOString().slice(0, 10)
    });
    toast.success("Income entry added");
  };

  const removeIncomeEntry = (id: string) => {
    setIncomeEntries((prev) => prev.filter((entry) => entry.id !== id));
    toast.success("Income entry removed");
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Total Income"
          value={formatCurrency(totalIncome)}
          icon={ArrowUpCircle}
          subtitle="Tracked manually"
        />
        <StatCard
          title="Total Outcome"
          value={formatCurrency(outcomeTotal)}
          icon={ArrowDownCircle}
          subtitle="From your expenses"
        />
        <StatCard
          title="Net Balance"
          value={formatCurrency(netBalance)}
          icon={Wallet}
          subtitle={netBalance >= 0 ? "Positive cash flow" : "Negative cash flow"}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Add Income
          </h2>
          <form className="space-y-3" onSubmit={handleSubmit(addIncomeEntry)}>
            <Input label="Title" error={errors.title?.message} {...register("title")} />
            <Input
              label="Amount"
              type="number"
              step="0.01"
              error={errors.amount?.message}
              {...register("amount", { valueAsNumber: true })}
            />
            <Input label="Date" type="date" error={errors.date?.message} {...register("date")} />
            <Button type="submit" isLoading={isSubmitting}>
              Add Income
            </Button>
          </form>
        </Card>

        <Card className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Income Entries
          </h2>
          {!incomeEntries.length ? (
            <EmptyState
              title="No income entries yet"
              description="Add your first income to track balance."
            />
          ) : (
            <div className="space-y-2">
              {incomeEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between rounded-xl border border-slate-200 p-3 dark:border-slate-700"
                >
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">{entry.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {formatDate(entry.date)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-emerald-600">
                      {formatCurrency(entry.amount)}
                    </span>
                    <Button variant="ghost" onClick={() => removeIncomeEntry(entry.id)}>
                      <Trash2 size={15} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Recent Outcome Transactions
        </h2>
        {!recentExpenses.length ? (
          <EmptyState title="No expenses found" description="Add expenses to see outcomes here." />
        ) : (
          <div className="space-y-2">
            {recentExpenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between rounded-xl border border-slate-200 p-3 dark:border-slate-700"
              >
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">{expense.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {expense.category} - {formatDate(expense.date)}
                  </p>
                </div>
                <span className="font-semibold text-red-500">
                  -{formatCurrency(expense.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
