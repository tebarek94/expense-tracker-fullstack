import { Menu } from "lucide-react";
import { PropsWithChildren, useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopNavbar } from "./TopNavbar";

export const DashboardLayout = ({ children }: PropsWithChildren) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-100 dark:bg-slate-950">
      <div className="sticky top-0 z-30 px-3 pt-3 md:hidden">
        <button
          className="rounded-lg border border-slate-200 bg-white p-2 shadow dark:border-slate-700 dark:bg-slate-900"
          onClick={() => setOpen((prev) => !prev)}
          type="button"
        >
          <Menu size={20} />
        </button>
      </div>

      <div className="flex">
        {open ? (
          <button
            type="button"
            aria-label="Close menu overlay"
            className="fixed inset-0 z-40 bg-slate-950/40 md:hidden"
            onClick={() => setOpen(false)}
          />
        ) : null}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 md:static md:z-auto md:w-auto md:translate-x-0 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar onNavigate={() => setOpen(false)} />
        </div>
        <main className="min-w-0 flex-1">
          <TopNavbar />
          <section className="p-3 sm:p-4 md:p-6">{children}</section>
        </main>
      </div>
    </div>
  );
};
