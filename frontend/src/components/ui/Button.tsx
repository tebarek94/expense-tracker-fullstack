import { ButtonHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  isLoading?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary: "text-white shadow-md hover:opacity-90",
  secondary:
    "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800",
  ghost:
    "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
  danger: "bg-red-600 text-white shadow-md hover:bg-red-700"
};

export const Button = ({
  children,
  className,
  variant = "primary",
  isLoading,
  disabled,
  style,
  ...props
}: ButtonProps) => (
  <button
    className={cn(
      "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition",
      "disabled:cursor-not-allowed disabled:opacity-60",
      variantStyles[variant],
      className
    )}
    disabled={disabled || isLoading}
    style={{
      ...(variant === "primary" ? { backgroundColor: "var(--color-primary)" } : {}),
      ...style
    }}
    {...props}
  >
    {isLoading ? "Please wait..." : children}
  </button>
);
