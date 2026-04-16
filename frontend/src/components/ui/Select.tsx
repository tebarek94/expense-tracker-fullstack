import { SelectHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

interface Option {
  label: string;
  value: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Option[];
}

export const Select = ({ label, error, options, className, ...props }: SelectProps) => (
  <label className="flex w-full flex-col gap-2 text-sm text-slate-700 dark:text-slate-200">
    {label ? <span className="font-medium">{label}</span> : null}
    <select
      className={cn(
        "rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100",
        "dark:border-slate-700 dark:bg-slate-900 dark:focus:border-slate-500 dark:focus:ring-slate-700",
        className
      )}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error ? <span className="text-xs text-red-500">{error}</span> : null}
  </label>
);
