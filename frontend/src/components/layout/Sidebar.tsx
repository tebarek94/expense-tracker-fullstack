import { ChartColumn, LayoutDashboard, ReceiptText, Scale, UserCircle2 } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "../../utils/cn";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/expenses", label: "Expenses", icon: ReceiptText },
  { to: "/summary", label: "Summary", icon: ChartColumn },
  { to: "/income-outcome", label: "Income & Outcome", icon: Scale }
];

export const Sidebar = () => (
  <aside className="flex h-full min-h-screen w-full flex-col border-r border-slate-200 bg-white p-4 md:w-64 dark:border-slate-800 dark:bg-slate-950">
    <div className="mb-8 rounded-xl p-3 text-lg font-semibold text-white" style={{ backgroundColor: "var(--color-primary)" }}>
      ExpenseFlow
    </div>

    <nav className="space-y-2">
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition",
              isActive
                ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            )
          }
        >
          <Icon size={18} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>

    <div className="mt-auto border-t border-slate-200 pt-4 dark:border-slate-800">
      <NavLink
        to="/profile"
        className={({ isActive }) =>
          cn(
            "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition",
            isActive
              ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100"
              : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          )
        }
      >
        <UserCircle2 size={18} />
        <span>Profile</span>
      </NavLink>
    </div>
  </aside>
);
