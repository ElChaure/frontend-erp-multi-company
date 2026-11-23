import * as React from "react";
import { cn } from "@/lib/utils";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-offset-0",
          error
            ? "border-red-400 focus:border-red-500 focus:ring-red-200"
            : "border-slate-300 focus:border-blue-500 focus:ring-blue-200",
          className,
        )}
        {...props}
      >
        {children}
      </select>
    );
  },
);

Select.displayName = "Select";