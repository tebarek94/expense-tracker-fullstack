import { AxiosError } from "axios";
import { DollarSign, PieChart, TrendingUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Cell, Pie, PieChart as RePieChart, ResponsiveContainer, Tooltip } from "recharts";
import api from "../../api/axios";
import { StatCard } from "../../components/shared/StatCard";
import { Card } from "../../components/ui/Card";
import { Loader } from "../../components/ui/Loader";
import { ApiResponse } from "../../types/api";
import { ExpenseSummary, MonthlySummaryItem } from "../../types/expense";
import { formatCurrency, toMonthLabel } from "../../utils/format";

const chartColors = ["#4f46e5", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444"];

export const DashboardPage = () => {
  const [summary, setSummary] = useState<ExpenseSummary | null>(null);
  const [monthly, setMonthly] = useState<MonthlySummaryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [summaryResponse, monthlyResponse] = await Promise.all([
          api.get<ApiResponse<ExpenseSummary>>("/expenses/summary"),
          api.get<ApiResponse<MonthlySummaryItem[]>>("/expenses/monthly")
        ]);
        setSummary(summaryResponse.data.data);
        setMonthly(monthlyResponse.data.data);
      } catch (error) {
        const message =
          (error as AxiosError<{ message?: string }>).response?.data?.message ??
          "Failed to load dashboard data";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    void fetchDashboard();
  }, []);

  const currentMonthTotal = useMemo(() => {
    if (!monthly.length) {
      return 0;
    }
    return Number(monthly[0].total);
  }, [monthly]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Total Expenses"
          value={formatCurrency(summary?.totalExpenses ?? 0)}
          icon={DollarSign}
          subtitle="All-time spending"
        />
        <StatCard
          title="This Month"
          value={formatCurrency(currentMonthTotal)}
          icon={TrendingUp}
          subtitle={monthly[0]?.month ? toMonthLabel(monthly[0].month) : "No data"}
        />
        <StatCard
          title="Categories"
          value={String(summary?.categoryBreakdown.length ?? 0)}
          icon={PieChart}
          subtitle="Tracked expense groups"
        />
      </div>

      <Card className="h-96">
        <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
          Category Breakdown
        </h2>
        {!summary?.categoryBreakdown.length ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">No chart data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <RePieChart>
              <Pie
                data={summary.categoryBreakdown.map((item) => ({
                  ...item,
                  total: Number(item.total)
                }))}
                dataKey="total"
                nameKey="category"
                innerRadius={70}
                outerRadius={120}
              >
                {summary.categoryBreakdown.map((item, index) => (
                  <Cell key={item.category} fill={chartColors[index % chartColors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(Number(value ?? 0))} />
            </RePieChart>
          </ResponsiveContainer>
        )}
      </Card>
    </div>
  );
};
