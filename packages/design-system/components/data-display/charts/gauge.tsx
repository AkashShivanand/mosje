import * as React from "react";
import { ChartFrame, type ChartStateProps } from "./internal/chart-frame";
import { formatIndian } from "./internal/format";
import type { ValueFormat } from "./internal/format";

export interface GaugeProps extends ChartStateProps {
  value: number;
  max?: number;
  min?: number;
  title: string;
  /** Optional unit shown under the value (e.g. "occupancy"). */
  unit?: string;
  /** Arc colour. Defaults to primary; pass a status colour for thresholds. */
  color?: string;
  valueFormat?: ValueFormat;
  className?: string;
}

const W = 200;
const H = 120;
const CX = 100;
const CY = 104;
const R = 84;

function pointOnArc(angleDeg: number): [number, number] {
  const a = (angleDeg * Math.PI) / 180;
  return [CX + R * Math.cos(a), CY + R * Math.sin(a)];
}

/** Semicircular gauge (180°). Dependency-free SVG with a screen-reader table. */
export function Gauge({
  value,
  max = 100,
  min = 0,
  title,
  unit,
  color = "var(--sa-chart-cat-1)",
  valueFormat = formatIndian,
  className,
  state,
  onRetry,
  filterLabel,
  tableView,
}: GaugeProps) {
  /*
   * THIS HAD NO GUARD AT ALL, and the failure was silent rather than ugly: a
   * non-finite `value` puts `NaN` into `pointOnArc`, which makes `d="M NaN NaN
   * A …"` — an invalid path every browser drops without a word — so the gauge
   * rendered as an empty track that looked like a real zero, and `NaN` was
   * written into the screen-reader table where nothing at all was drawn.
   *
   * `Number.isFinite` rather than a null check: `undefined`, `null` coerced,
   * `NaN` and `Infinity` all produce the same invalid arc, and only one of them
   * is caught by asking whether the value is missing.
   */
  const resolved =
    state ??
    (!Number.isFinite(value) || !Number.isFinite(max) || !Number.isFinite(min)
      ? "empty"
      : undefined);
  if (resolved)
    return (
      <ChartFrame
        title={title}
        viewBox={`0 0 ${W} ${H}`}
        className={className}
        state={resolved}
        onRetry={onRetry}
        filterLabel={filterLabel}
      >
        {null}
      </ChartFrame>
    );

  const span = max - min || 1;
  const frac = Math.max(0, Math.min(1, (value - min) / span));
  // 180° (left) → 360°/0° (right), sweeping the top half.
  const startA = 180;
  const endA = 180 + frac * 180;
  const [sx, sy] = pointOnArc(180);
  const [tx, ty] = pointOnArc(360);
  const [ex, ey] = pointOnArc(endA);
  const largeArc = endA - startA > 180 ? 1 : 0;

  return (
    <ChartFrame
      title={title}
      summary={`${valueFormat(value)} of ${valueFormat(max)}`}
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      table={{ columns: ["Metric", "Value", "Max"], rows: [[title, value, max]] }}
      tableView={tableView}
    >
      <path
        d={`M ${sx} ${sy} A ${R} ${R} 0 0 1 ${tx} ${ty}`}
        fill="none"
        stroke="var(--sa-chart-grid)"
        strokeWidth={14}
        strokeLinecap="round"
      />
      <path
        d={`M ${sx} ${sy} A ${R} ${R} 0 ${largeArc} 1 ${ex} ${ey}`}
        fill="none"
        stroke={color}
        strokeWidth={14}
        strokeLinecap="round"
      />
      <text x={CX} y={CY - 14} textAnchor="middle" className="ds-chart__center-value">
        {valueFormat(value)}
      </text>
      {unit && (
        <text x={CX} y={CY + 4} textAnchor="middle" className="ds-chart__center-sub">
          {unit}
        </text>
      )}
    </ChartFrame>
  );
}
