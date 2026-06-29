import * as React from "react";
import { cn } from "../../../../utils/cn";

export interface LegendItem {
  label: string;
  color: string;
  /** Optional trailing value (e.g. a percentage or count). */
  value?: string;
}

/**
 * Shared chart legend. Decorative for sighted users (the screen-reader data
 * table in `ChartFrame` carries the real values), hence aria-hidden.
 */
export function Legend({
  items,
  className,
  orientation = "horizontal",
}: {
  items: LegendItem[];
  className?: string;
  orientation?: "horizontal" | "vertical";
}) {
  if (items.length === 0) return null;
  return (
    <ul
      className={cn("ds-chart__legend", `ds-chart__legend--${orientation}`, className)}
      aria-hidden="true"
    >
      {items.map((it) => (
        <li key={it.label} className="ds-chart__legend-item">
          <span className="ds-chart__swatch" style={{ backgroundColor: it.color }} />
          <span className="ds-chart__legend-label">{it.label}</span>
          {it.value !== undefined && <span className="ds-chart__legend-pct">{it.value}</span>}
        </li>
      ))}
    </ul>
  );
}
