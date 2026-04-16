import { LucideIcon } from "lucide-react";
import { Card } from "../ui/Card";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  subtitle?: string;
}

export const StatCard = ({ title, value, icon: Icon, subtitle }: StatCardProps) => (
  <Card className="space-y-3">
    <div className="flex items-center justify-between">
      <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
      <div
        className="rounded-lg p-2 text-white"
        style={{ backgroundColor: "var(--color-secondary)" }}
      >
        <Icon size={16} />
      </div>
    </div>
    <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{value}</p>
    {subtitle ? <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p> : null}
  </Card>
);
