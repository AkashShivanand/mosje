import * as React from "react";
import { cn } from "../../utils/cn";
import { MetricCard, type MetricCardProps } from "../data-display/metric-card";
import { CardState } from "./card-state";
import "./dashboard.css";

export interface KpiRowProps {
  /** KPI tiles. Each item is forwarded to `MetricCard`. */
  items?: (MetricCardProps & { key?: React.Key })[];
  /**
   * How many tiles are still arriving. Renders that many placeholders instead
   * of `items`.
   *
   * A COUNT, not a boolean, because the row's whole job is to hold its shape:
   * a page that shows nothing and then four tiles has moved everything below it
   * once, and the caller is the only one who knows how many are coming.
   */
  loading?: number;
  /**
   * What to say when the row has no tiles at all. Shown in place of the row.
   * @default "No key figures are published for this selection."
   */
  emptyLabel?: string;
  /** Column span (1–12) inside a `DashboardGrid` at ≥768px. */
  span?: number;
  className?: string;
}

/**
 * MoSJE / SAMAVESH KpiRow — a responsive row of `MetricCard` KPI tiles. Reuses
 * the existing `MetricCard` (not a re-implementation).
 *
 * Three states, because a row of figures can be in three: arriving, holding
 * nothing, and holding figures. It used to have one — `items.map` over an empty
 * array renders an empty `<div>`, which on a dashboard reads as a section that
 * failed to appear rather than as a section with nothing to report.
 */
export function KpiRow({ items, loading, emptyLabel, span, className }: KpiRowProps) {
  const style = span ? ({ ["--cmp-card-span" as string]: String(span) } as React.CSSProperties) : undefined;

  if (loading && loading > 0) {
    return (
      <div className={cn("ds-kpi-row", className)} style={style}>
        {/* One announcement for the row, not one per tile: six tiles saying
            "loading" is six interruptions describing a single wait. */}
        <span className="ds-sr-only" role="status">
          Loading key figures
        </span>
        {Array.from({ length: loading }, (_, i) => (
          <MetricCard key={i} label="" loading aria-hidden="true" />
        ))}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className={cn("ds-kpi-row", "ds-kpi-row--empty", className)} style={style}>
        <CardState
          kind="empty"
          compact
          description={emptyLabel ?? "No key figures are published for this selection."}
        />
      </div>
    );
  }

  return (
    <div className={cn("ds-kpi-row", className)} style={style}>
      {items.map(({ key, ...item }, i) => (
        <MetricCard key={key ?? item.label ?? i} {...item} />
      ))}
    </div>
  );
}
