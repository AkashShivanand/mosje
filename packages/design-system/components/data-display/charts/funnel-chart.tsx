import * as React from "react";
import { cn } from "../../../utils/cn";
import { ChartStateFigure, type ChartStateProps } from "./internal/chart-frame";
import { categoricalColor } from "./internal/palette";
import { formatIndian, formatPercent } from "./internal/format";
import type { ValueFormat } from "./internal/format";
import "./charts.css";

export interface FunnelStage {
  label: string;
  value: number;
  color?: string;
}

export interface FunnelChartProps extends ChartStateProps {
  stages: FunnelStage[];
  title: string;
  valueFormat?: ValueFormat;
  className?: string;
}

/**
 * MoSJE / SAMAVESH FunnelChart — workflow conversion funnel (e.g. proposal →
 * approval → release). Absorbs PM-AJAY `Funnel`. Each stage's bar width is its
 * share of the first stage; the trailing value shows the conversion %.
 */
export function FunnelChart({
  stages,
  title,
  valueFormat = formatIndian,
  className,
  state,
  onRetry,
  filterLabel,
}: FunnelChartProps) {
  /*
   * HANDLED LOCALLY, IN THE SAME SHAPE. A funnel is a DOM list rather than an
   * SVG, so it has no `ChartFrame` and no viewBox to take proportions from —
   * but it renders the frame's own `ChartStateFigure`, so a funnel with nothing
   * to show is the same object on the page as a bar chart with nothing to show.
   * With no viewBox the figure falls back to a height floor instead of an
   * aspect ratio; see `.ds-chart__canvas--state-floor`.
   */
  const resolved = state ?? (stages.length === 0 ? "empty" : undefined);
  if (resolved)
    return (
      <ChartStateFigure
        state={resolved}
        title={title}
        onRetry={onRetry}
        filterLabel={filterLabel}
        className={className}
      />
    );
  const top = stages[0]?.value || 1;

  return (
    <figure className={cn("ds-chart", className)}>
      <div className="ds-funnel" role="img" aria-label={title}>
        {stages.map((s, i) => {
          const pct = Math.max(0, Math.min(100, (s.value / top) * 100));
          const color = s.color ?? categoricalColor(i);
          return (
            <div key={s.label} className="ds-funnel__row">
              <span className="ds-funnel__label">{s.label}</span>
              <span className="ds-funnel__bar-track">
                <span className="ds-funnel__bar" style={{ width: `${pct}%`, backgroundColor: color }} />
              </span>
              <span className="ds-funnel__value">
                {valueFormat(s.value)} · {formatPercent(pct, 0)}
              </span>
            </div>
          );
        })}
      </div>
      <table className="ds-sr-only">
        <caption>{title}</caption>
        <thead>
          <tr>
            <th scope="col">Stage</th>
            <th scope="col">Value</th>
            <th scope="col">Conversion</th>
          </tr>
        </thead>
        <tbody>
          {stages.map((s) => (
            <tr key={s.label}>
              <td>{s.label}</td>
              <td>{valueFormat(s.value)}</td>
              <td>{formatPercent((s.value / top) * 100, 0)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
