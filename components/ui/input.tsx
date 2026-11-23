import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm transition placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-60",
          error
            ? "border-red-400 focus:border-red-500 focus:ring-red-200"
            : "border-slate-300 focus:border-blue-500 focus:ring-blue-200",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";