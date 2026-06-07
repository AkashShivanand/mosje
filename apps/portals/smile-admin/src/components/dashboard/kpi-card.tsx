import { cn, formatINR, formatNumber } from "@/lib/utils";
import {
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  ClipboardCheck,
  Home,
  PiggyBank,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export interface KpiSpec {
  key: string;
  label: string;
  value: number;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  labelColor: string;
  format?: "number" | "currency";
  delta?: string;
  meta?: string;
}

export const KPI_ICONS = {
  identified: ClipboardCheck,
  mobilised: Users,
  shelter: Home,
  rehab: CheckCircle2,
  disbursed: Wallet,
  utilised: PiggyBank,
};

export function KpiCard({ spec }: { spec: KpiSpec }) {
  const Icon = spec.icon;
  const value =
    spec.format === "currency" ? formatINR(spec.value, true) : formatNumber(spec.value);
  const trend = spec.delta?.startsWith("-") ? "down" : "up";

  return (
    <article
      aria-label={spec.label}
      className="group relative isolate flex h-full flex-col justify-between gap-sm overflow-hidden rounded-lg border border-stroke-200 bg-white p-md shadow-xs transition-all duration-200 ease-swift-out hover:-translate-y-px hover:border-stroke-300 hover:shadow-md md:gap-md md:p-lg"
    >
      {/* Accent bar */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-x-0 top-0 h-1 rounded-t-lg opacity-80 transition-opacity duration-200 group-hover:opacity-100",
          spec.iconColor.replace("text-", "bg-"),
        )}
      />

      <div className="flex items-start justify-between gap-sm md:gap-md">
        <div className="min-w-0 space-y-1">
          <div
            className={cn(
              "text-label-3 font-semibold uppercase tracking-[0.08em] md:tracking-[0.1em]",
              spec.labelColor,
            )}
          >
            {spec.label}
          </div>
          <div
            aria-live="polite"
            className="text-num-lg font-bold tabular-nums leading-none text-foreground md:text-num-xl"
          >
            {value}
          </div>
        </div>
        <div
          className={cn(
            "grid h-9 w-9 shrink-0 place-items-center rounded-md ring-1 ring-inset ring-black/5 transition-transform duration-200 group-hover:scale-105 md:h-11 md:w-11",
            spec.iconBg,
          )}
        >
          <Icon
            aria-hidden
            className={cn("h-[18px] w-[18px] md:h-[22px] md:w-[22px]", spec.iconColor)}
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-xs text-label-3 md:text-label-2">
        <div className="hidden truncate text-foreground-hint sm:block">
          {spec.meta ?? "All-time · all states"}
        </div>
        {spec.delta ? (
          <div
            aria-label={`Change ${trend === "up" ? "up" : "down"} ${spec.delta}`}
            className={cn(
              "inline-flex shrink-0 items-center gap-xxs rounded-full px-2 py-0.5 font-semibold ring-1 ring-inset",
              trend === "up"
                ? "bg-success-50 text-success-600 ring-success-100"
                : "bg-danger-50 text-danger-600 ring-danger-100",
            )}
          >
            {trend === "up" ? (
              <ArrowUpRight aria-hidden className="h-3 w-3" />
            ) : (
              <ArrowDownRight aria-hidden className="h-3 w-3" />
            )}
            {spec.delta}
          </div>
        ) : null}
      </div>
    </article>
  );
}
