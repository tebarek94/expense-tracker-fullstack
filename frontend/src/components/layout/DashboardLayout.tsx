import { Menu } from "lucide-react";
import { PropsWithChildren, useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopNavbar } from "./TopNavbar";

export const DashboardLayout = ({ children }: PropsWithChildren) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <div className="md:hidden">
        <button
          className="m-4 rounded-lg bg-white p-2 shadow dark:bg-slate-900"
          onClick={() => setOpen((prev) => !prev)}
          type="button"
        >
          <Menu size={20} />
        </button>
      </div>

      <div className="flex">
        <div
          className={`${open ? "block" : "hidden"} fixed inset-y-0 left-0 z-40 w-64 md:static md:block`}
        >
          <Sidebar />
        </div>
        <main className="flex-1">
          <TopNavbar />
          <section className="p-4 md:p-6">{children}</section>
        </main>
      </div>
    </div>
  );
};
