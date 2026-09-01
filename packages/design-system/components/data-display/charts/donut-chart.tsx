"use client";

import * as React from "react";
import { ChartFrame, type ChartState, type ChartStateProps } from "./internal/chart-frame";
import { Legend } from "./internal/legend";
import { ChartTooltip, useChartTooltip } from "./internal/tooltip";
import { categoricalColor } from "./internal/palette";
import { ringPath, polarToCartesian } from "./internal/geometry";
import { formatIndian, formatPercent } from "./internal/format";
import type { ValueFormat } from "./internal/format";
import type { ChartDatum } from "./types";

interface DonutBase extends ChartStateProps {
  title: string;
  className?: string;
  valueFormat?: ValueFormat;
}

/** Segmented donut (like a pie with a hole + interactive tooltip). */
interface DonutSegments extends DonutBase {
  data: ChartDatum[];
  /** Centre text (defaults to the total). */
  center?: React.ReactNode;
  centerSub?: string;
}

/** Single-value progress ring with an optional target tick. */
interface DonutProgress extends DonutBase {
  value: number;
  max?: number;
  color?: string;
  /** Target threshold (0–max) drawn as a tick on the ring. */
  target?: number;
  center?: React.ReactNode;
  centerSub?: string;
}

export type DonutChartProps = DonutSegments | DonutProgress;

const SIZE = 200;
const C = SIZE / 2;
const R1 = 92;
const R0 = 60;

function isSegments(p: DonutChartProps): p is DonutSegments {
  return Array.isArray((p as DonutSegments).data);
}

/**
 * MoSJE / SAMAVESH DonutChart. Two modes: a segmented donut (`data`) or a
 * single-value progress ring (`value`/`max`). Absorbs PM-AJAY `Donut` +
 * SMILE `GenderDonut`.
 */
export function DonutChart(props: DonutChartProps) {
  const { title, className, valueFormat = formatIndian, state, onRetry, filterLabel } = props;
  const { canvasRef, tip, show, hide } = useChartTooltip();

  /**
   * Both modes resolve their state through this, so a segmented donut and a
   * progress ring cannot disagree about what "nothing to draw" looks like.
   */
  const stateFrame = (resolved: ChartState) => (
    <ChartFrame
      marksAreFocusable
      title={title}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className={className}
      state={resolved}
      onRetry={onRetry}
      filterLabel={filterLabel}
    >
      {null}
    </ChartFrame>
  );

  if (isSegments(props)) {
    const total = props.data.reduce((s, d) => s + d.value, 0);
    const resolved = state ?? (total === 0 ? "empty" : undefined);
    if (resolved) return stateFrame(resolved);

    let cursor = 0;
    const segs = props.data.map((d, i) => {
      const start = (cursor / total) * 360;
      cursor += d.value;
      const end = (cursor / total) * 360;
      const color = d.color ?? categoricalColor(i);
      return { ...d, start, end, color, pct: (d.value / total) * 100 };
    });

    return (
      <ChartFrame
        marksAreFocusable
        title={title}
        summary={segs.map((s) => `${s.label} ${formatPercent(s.pct)}`).join(", ")}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className={className}
        canvasRef={canvasRef}
        overlay={<ChartTooltip tip={tip} />}
        legend={
          <Legend
            orientation="vertical"
            items={segs.map((s) => ({ label: s.label, color: s.color, value: formatPercent(s.pct) }))}
          />
        }
        table={{
          columns: ["Category", "Count", "Share"],
          rows: segs.map((s) => [s.label, s.value, formatPercent(s.pct)]),
        }}
      >
        {segs.map((s) => (
          <path
            key={s.label}
            d={ringPath(C, C, R0, R1, s.start, s.end)}
            fill={s.color}
            className="ds-chart__mark"
            tabIndex={0}
            role="img"
            aria-label={`${s.label}: ${valueFormat(s.value)} (${formatPercent(s.pct)})`}
            onPointerMove={(e) =>
              show(
                <>
                  <div className="ds-chart__tooltip-title">{s.label}</div>
                  <div>{`${valueFormat(s.value)} · ${formatPercent(s.pct)}`}</div>
                </>,
                e.clientX,
                e.clientY,
              )
            }
            onPointerLeave={hide}
            onFocus={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              show(
                <>
                  <div className="ds-chart__tooltip-title">{s.label}</div>
                  <div>{`${valueFormat(s.value)} · ${formatPercent(s.pct)}`}</div>
                </>,
                r.left + r.width / 2,
                r.top,
              );
            }}
            onBlur={hide}
          />
        ))}
        <text x={C} y={C - 4} textAnchor="middle" className="ds-chart__center-value">
          {props.center ?? valueFormat(total)}
        </text>
        {props.centerSub && (
          <text x={C} y={C + 16} textAnchor="middle" className="ds-chart__center-sub">
            {props.centerSub}
          </text>
        )}
      </ChartFrame>
    );
  }

  // Progress-ring mode
  const max = props.max ?? 100;
  // A ring drawn from a NaN sweeps an invalid arc that browsers drop silently,
  // leaving a card that looks finished and says nothing.
  const ringResolved =
    state ?? (!Number.isFinite(props.value) || !Number.isFinite(max) ? "empty" : undefined);
  if (ringResolved) return stateFrame(ringResolved);
  const frac = max <= 0 ? 0 : Math.max(0, Math.min(1, props.value / max));
  const color = props.color ?? "var(--sa-chart-cat-1)";
  const sweep = frac * 360;

  return (
    <ChartFrame
      marksAreFocusable
      title={title}
      summary={`${valueFormat(props.value)} of ${valueFormat(max)} (${formatPercent(frac * 100)})`}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className={className}
      table={{ columns: ["Metric", "Value", "Max"], rows: [[title, props.value, max]] }}
    >
      <path d={ringPath(C, C, R0, R1, 0, 359.999)} fill="var(--sa-chart-grid)" />
      {sweep > 0 && <path d={ringPath(C, C, R0, R1, 0, sweep)} fill={color} className="ds-chart__mark" />}
      {props.target !== undefined &&
        (() => {
          const ta = (Math.max(0, Math.min(1, props.target! / max)) * 360);
          const a = polarToCartesian(C, C, R1 + 4, ta);
          const b = polarToCartesian(C, C, R0 - 4, ta);
          return <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="var(--sa-color-text-default)" strokeWidth={2} />;
        })()}
      <text x={C} y={C - 4} textAnchor="middle" className="ds-chart__center-value">
        {props.center ?? formatPercent(frac * 100, 0)}
      </text>
      {props.centerSub && (
        <text x={C} y={C + 16} textAnchor="middle" className="ds-chart__center-sub">
          {props.centerSub}
        </text>
      )}
    </ChartFrame>
  );
}
