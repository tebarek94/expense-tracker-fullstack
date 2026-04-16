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
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Welcome back</p>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            {user?.name ?? "Expense Tracker"}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setShowCustomizer((prev) => !prev)}>
            <Palette size={16} className="mr-2" />
            Theme
          </Button>
          <Button variant="danger" onClick={logout}>
            <LogOut size={16} className="mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {showCustomizer ? <ThemeCustomizer /> : null}
    </header>
  );
};
