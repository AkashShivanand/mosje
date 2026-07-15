import type { LucideIcon } from "lucide-react";
import { cn, formatNumber } from "@/lib/smile-admin/utils";

export function StatPill({
  label,
  value,
  icon: Icon,
  tone = "primary",
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  tone?: "primary" | "info" | "danger" | "success" | "warning";
}) {
  const TONES = {
    primary: "bg-primary-50 text-primary ring-primary-100",
    info: "bg-info-50 text-info-600 ring-info-100",
    danger: "bg-danger-50 text-danger-600 ring-danger-100",
    success: "bg-success-50 text-success-600 ring-success-100",
    warning: "bg-warning-50 text-warning-600 ring-warning-100",
  } as const;
  return (
    <article
      aria-label={`${label}: ${formatNumber(value)}`}
      className="flex items-center gap-md rounded-lg border border-stroke-200 bg-white p-md shadow-xs transition-all duration-150 hover:-translate-y-px hover:border-stroke-300 hover:shadow-s"
    >
      <div
        aria-hidden
        className={cn(
          "grid h-11 w-11 shrink-0 place-items-center rounded-md ring-1 ring-inset",
          TONES[tone],
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 leading-tight">
        <div className="text-label-3 font-semibold uppercase tracking-[0.08em] text-foreground-muted">
          {label}
        </div>
        <div className="text-title-1 font-bold tabular-nums text-foreground">
          {formatNumber(value)}
        </div>
      </div>
    </article>
  );
}
