import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type Variant = "default" | "outline" | "ghost" | "danger" | "success";
type Size = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variantStyles: Record<Variant, string> = {
  default:
    "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400 focus:ring-blue-500",
  outline:
    "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-60 focus:ring-slate-400",
  ghost:
    "text-slate-700 hover:bg-slate-100 disabled:opacity-60 focus:ring-slate-300",
  danger:
    "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400 focus:ring-red-500",
  success:
    "bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-emerald-400 focus:ring-emerald-500",
};

const sizeStyles: Record<Size, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
  icon: "h-9 w-9",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      loading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed",
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";