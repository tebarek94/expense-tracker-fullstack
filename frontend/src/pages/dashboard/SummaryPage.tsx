import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import api from "../../api/axios";
import { Card } from "../../components/ui/Card";
import { Loader } from "../../components/ui/Loader";
import { ApiResponse } from "../../types/api";
import { MonthlySummaryItem } from "../../types/expense";
import { formatCurrency, toMonthLabel } from "../../utils/format";

export const SummaryPage = () => {
  const [monthly, setMonthly] = useState<MonthlySummaryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const response = await api.get<ApiResponse<MonthlySummaryItem[]>>("/expenses/monthly");
        setMonthly(response.data.data);
      } catch (error) {
        const message =
          (error as AxiosError<{ message?: string }>).response?.data?.message ??
          "Failed to load monthly summary";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };
    void loadSummary();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <Card className="h-[460px]">
      <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
        Monthly Expense Trend
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={[...monthly]
            .reverse()
            .map((item) => ({ month: toMonthLabel(item.month), total: Number(item.total) }))}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => formatCurrency(Number(value ?? 0))} />
          <Bar dataKey="total" radius={[8, 8, 0, 0]} fill="var(--color-primary)" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
