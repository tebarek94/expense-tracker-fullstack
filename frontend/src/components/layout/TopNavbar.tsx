import { LogOut, Palette } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { ThemeCustomizer } from "../shared/ThemeCustomizer";
import { Button } from "../ui/Button";

export const TopNavbar = () => {
  const [showCustomizer, setShowCustomizer] = useState(false);
  const { user, logout } = useAuth();

  return (
    <header className="space-y-4 border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-slate-500 dark:text-slate-400">Welcome back</p>
          <h1 className="truncate text-xl font-semibold text-slate-900 dark:text-slate-100">
            {user?.name ?? "Expense Tracker"}
          </h1>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <Button
            variant="secondary"
            className="w-full sm:w-auto"
            onClick={() => setShowCustomizer((prev) => !prev)}
          >
            <Palette size={16} className="mr-2" />
            Theme
          </Button>
          <Button variant="danger" className="w-full sm:w-auto" onClick={logout}>
            <LogOut size={16} className="mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {showCustomizer ? <ThemeCustomizer /> : null}
    </header>
  );
};
