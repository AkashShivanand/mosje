import * as React from "react";
import { cn } from "../../../utils/cn";
import { formatPercent } from "./internal/format";
import "./charts.css";

export interface ProgressProps {
  value: number;
  max?: number;
  /** Accessible label for the bar. */
  label: string;
  /** Bar colour (defaults to primary series colour). */
  color?: string;
  /** Show the % to the right of the label. */
  showValue?: boolean;
  className?: string;
}

/**
 * Accessible linear progress bar (role="progressbar"). Token-driven track + fill.
 */
export function Progress({
  value,
  max = 100,
  label,
  color = "var(--ds-chart-cat-1)",
  showValue = true,
  className,
}: ProgressProps) {
  const pct = max <= 0 ? 0 : Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={cn("ds-progress", className)}>
      <div className="ds-progress__head">
        <span className="ds-progress__label">{label}</span>
        {showValue && <span className="ds-progress__value">{formatPercent(pct, 0)}</span>}
      </div>
      <div
        className="ds-progress__track"
        role="progressbar"
        aria-label={label}
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="ds-progress__fill" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}
