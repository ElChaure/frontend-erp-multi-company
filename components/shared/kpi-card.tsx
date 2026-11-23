import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Variant = "primary" | "success" | "warning" | "danger" | "info";

const variants: Record<Variant, string> = {
  primary: "bg-blue-50 text-blue-600",
  success: "bg-emerald-50 text-emerald-600",
  warning: "bg-amber-50 text-amber-600",
  danger: "bg-red-50 text-red-600",
  info: "bg-sky-50 text-sky-600",
};

interface Props {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variant?: Variant;
  hint?: string;
}

export function KpiCard({
  title,
  value,
  icon: Icon,
  variant = "primary",
  hint,
}: Props) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-slate-500">{title}</span>
          <div className={cn("rounded-lg p-2", variants[variant])}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <div className="text-3xl font-bold text-slate-900">{value}</div>
        {hint && <div className="mt-1 text-xs text-slate-500">{hint}</div>}
      </CardContent>
    </Card>
  );
}