import { PropsWithChildren } from "react";
import { cn } from "../../utils/cn";

interface CardProps extends PropsWithChildren {
  className?: string;
}

export const Card = ({ className, children }: CardProps) => (
  <div
    className={cn(
      "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900",
      className
    )}
  >
    {children}
  </div>
);
