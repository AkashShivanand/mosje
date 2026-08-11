import * as React from "react";
import { cn } from "../../utils/cn";
import { MetricCard, type MetricCardProps } from "../data-display/metric-card";
import "./dashboard.css";

export interface KpiRowProps {
  /** KPI tiles. Each item is forwarded to `MetricCard`. */
  items: (MetricCardProps & { key?: React.Key })[];
  /** Column span (1–12) inside a `DashboardGrid` at ≥768px. */
  span?: number;
  className?: string;
}

/**
 * MoSJE / SAMAVESH KpiRow — a responsive row of `MetricCard` KPI tiles. Reuses
 * the existing `MetricCard` (not a re-implementation).
 */
export function KpiRow({ items, span, className }: KpiRowProps) {
  const style = span ? ({ ["--cmp-card-span" as string]: String(span) } as React.CSSProperties) : undefined;
  return (
    <div className={cn("ds-kpi-row", className)} style={style}>
      {items.map(({ key, ...item }, i) => (
        <MetricCard key={key ?? item.label ?? i} {...item} />
      ))}
    </div>
  );
}
