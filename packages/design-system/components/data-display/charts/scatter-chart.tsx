"use client";

import * as React from "react";
import { ChartFrame, type ChartStateProps } from "./internal/chart-frame";
import { Legend } from "./internal/legend";
import { Gridlines } from "./internal/axis";
import { ChartTooltip, useChartTooltip } from "./internal/tooltip";
import { linearScale, niceTicks } from "./internal/scales";
import { seriesColor, categoricalColor } from "./internal/palette";
import { formatIndian } from "./internal/format";
import type { ValueFormat } from "./internal/format";

export interface ScatterPoint {
  x: number;
  y: number;
  label?: string;
}
export interface ScatterSeries {
  name: string;
  points: ScatterPoint[];
  color?: string;
}
export interface ScatterChartProps extends ChartStateProps {
  series: ScatterSeries[];
  title: string;
  xLabel?: string;
  yLabel?: string;
  valueFormat?: ValueFormat;
  width?: number;
  height?: number;
  className?: string;
}

/** MoSJE / SAMAVESH ScatterChart — dependency-free SVG scatter with tooltips. */
export function ScatterChart({
  series,
  title,
  xLabel,
  yLabel,
  valueFormat = formatIndian,
  width = 480,
  height = 300,
  className,
  state,
  onRetry,
  filterLabel,
  tableView,
}: ScatterChartProps) {
  const { canvasRef, tip, show, hide } = useChartTooltip();
  const all = series.flatMap((s) => s.points);
  // One expression, resolved before the scales are built.
  const resolved = state ?? (all.length === 0 ? "empty" : undefined);
  if (resolved)
    return (
      <ChartFrame
        marksAreFocusable
        title={title}
        viewBox={`0 0 ${width} ${height}`}
        className={className}
        state={resolved}
        onRetry={onRetry}
        filterLabel={filterLabel}
      >
        {null}
      </ChartFrame>
    );

  const colors = series.map((s, i) => seriesColor(s.color, i));
  const xs = all.map((p) => p.x);
  const ys = all.map((p) => p.y);
  const xTicks = niceTicks(Math.min(0, ...xs), Math.max(...xs));
  const yTicks = niceTicks(Math.min(0, ...ys), Math.max(...ys));
  const xMin = xTicks[0] ?? 0;
  const xMax = xTicks[xTicks.length - 1] ?? 1;
  const yMin = yTicks[0] ?? 0;
  const yMax = yTicks[yTicks.length - 1] ?? 1;

  const padL = 48;
  const padR = 16;
  const padT = 12;
  const padB = xLabel ? 44 : 30;
  const x = linearScale([xMin, xMax], [padL, width - padR]);
  const y = linearScale([yMin, yMax], [height - padB, padT]);

  return (
    <ChartFrame
      marksAreFocusable
      title={title}
      summary={`${all.length} points across ${series.length} series`}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      canvasRef={canvasRef}
      overlay={<ChartTooltip tip={tip} />}
      onDismiss={hide}
      legend={series.length > 1 ? <Legend items={series.map((s, i) => ({ label: s.name, color: colors[i] ?? categoricalColor(i) }))} /> : undefined}
      table={{
        columns: ["Series", xLabel ?? "X", yLabel ?? "Y", "Label"],
        rows: series.flatMap((s) => s.points.map((p) => [s.name, p.x, p.y, p.label ?? ""])),
      }}
      tableView={tableView}
    >
      <Gridlines ticks={yTicks.map((v) => ({ pos: y(v), value: v }))} x0={padL} x1={width - padR} format={valueFormat} />
      {xTicks.map((v) => (
        <text key={v} x={x(v)} y={height - padB + 16} textAnchor="middle" className="ds-chart__axis">
          {valueFormat(v)}
        </text>
      ))}
      {xLabel && (
        <text x={(padL + width - padR) / 2} y={height - 6} textAnchor="middle" className="ds-chart__axis-title">
          {xLabel}
        </text>
      )}
      {yLabel && (
        <text x={12} y={(height - padB + padT) / 2} textAnchor="middle" transform={`rotate(-90 12 ${(height - padB + padT) / 2})`} className="ds-chart__axis-title">
          {yLabel}
        </text>
      )}
      {series.map((s, si) =>
        s.points.map((p, pi) => (
          <circle
            key={`${si}-${pi}`}
            cx={x(p.x)}
            cy={y(p.y)}
            r={5}
            fill={colors[si] ?? categoricalColor(si)}
            fillOpacity={0.78}
            className="ds-chart__mark"
            tabIndex={0}
            role="img"
            aria-label={`${s.name}${p.label ? ` ${p.label}` : ""}: ${xLabel ?? "x"} ${valueFormat(p.x)}, ${yLabel ?? "y"} ${valueFormat(p.y)}`}
            onPointerMove={(e) =>
              show(
                <>
                  <div className="ds-chart__tooltip-title">{p.label ?? s.name}</div>
                  <div>{`${valueFormat(p.x)}, ${valueFormat(p.y)}`}</div>
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
                  <div className="ds-chart__tooltip-title">{p.label ?? s.name}</div>
                  <div>{`${valueFormat(p.x)}, ${valueFormat(p.y)}`}</div>
                </>,
                r.left + r.width / 2,
                r.top,
              );
            }}
            onBlur={hide}
          />
        )),
      )}
    </ChartFrame>
  );
}
