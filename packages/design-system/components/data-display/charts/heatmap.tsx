"use client";

import * as React from "react";
import { ChartFrame } from "./internal/chart-frame";
import { ChartTooltip, useChartTooltip } from "./internal/tooltip";
import { sequentialColor, divergingColor } from "./internal/palette";
import { formatIndian } from "./internal/format";
import type { ValueFormat } from "./internal/format";

export interface HeatmapProps {
  xLabels: string[];
  yLabels: string[];
  /** Row-major values: matrix[y][x]. */
  matrix: number[][];
  title: string;
  valueFormat?: ValueFormat;
  /** "sequential" (default) ramps low→high; "diverging" centres on the midpoint. */
  scale?: "sequential" | "diverging";
  className?: string;
}

const CELL = 34;
const GUT_L = 96;
const GUT_T = 26;

/** MoSJE / SAMAVESH Heatmap — token-driven matrix using the sequential ramp. */
export function Heatmap({
  xLabels,
  yLabels,
  matrix,
  title,
  valueFormat = formatIndian,
  scale = "sequential",
  className,
}: HeatmapProps) {
  const { canvasRef, tip, show, hide } = useChartTooltip();
  const flat = matrix.flat();
  if (flat.length === 0) return <p className="ds-chart__empty">No data to display.</p>;

  const min = Math.min(...flat);
  const max = Math.max(...flat);
  const span = max - min || 1;
  const mid = (max + min) / 2;
  const half = Math.max(Math.abs(max - mid), Math.abs(min - mid)) || 1;

  const colorFor = (v: number) =>
    scale === "diverging" ? divergingColor((v - mid) / half) : sequentialColor((v - min) / span);

  const width = GUT_L + xLabels.length * CELL;
  const height = GUT_T + yLabels.length * CELL;

  return (
    <ChartFrame
      title={title}
      summary={`${yLabels.length}×${xLabels.length} matrix, values ${valueFormat(min)}–${valueFormat(max)}`}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      canvasRef={canvasRef}
      overlay={<ChartTooltip tip={tip} />}
      table={{
        columns: ["Row", ...xLabels],
        rows: yLabels.map((yl, yi) => [yl, ...xLabels.map((_, xi) => matrix[yi]?.[xi] ?? 0)]),
      }}
    >
      {xLabels.map((xl, xi) => (
        <text key={xl} x={GUT_L + xi * CELL + CELL / 2} y={GUT_T - 8} textAnchor="middle" className="ds-chart__axis">
          {xl.length > 6 ? `${xl.slice(0, 5)}…` : xl}
        </text>
      ))}
      {yLabels.map((yl, yi) => (
        <text key={yl} x={GUT_L - 8} y={GUT_T + yi * CELL + CELL / 2 + 3} textAnchor="end" className="ds-chart__axis">
          {yl.length > 13 ? `${yl.slice(0, 12)}…` : yl}
        </text>
      ))}
      {yLabels.map((yl, yi) =>
        xLabels.map((xl, xi) => {
          const v = matrix[yi]?.[xi] ?? 0;
          return (
            <rect
              key={`${yi}-${xi}`}
              x={GUT_L + xi * CELL + 1}
              y={GUT_T + yi * CELL + 1}
              width={CELL - 2}
              height={CELL - 2}
              rx={3}
              fill={colorFor(v)}
              className="ds-chart__cell"
              tabIndex={0}
              role="img"
              aria-label={`${yl}, ${xl}: ${valueFormat(v)}`}
              onPointerMove={(e) =>
                show(
                  <>
                    <div className="ds-chart__tooltip-title">{`${yl} · ${xl}`}</div>
                    <div>{valueFormat(v)}</div>
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
                    <div className="ds-chart__tooltip-title">{`${yl} · ${xl}`}</div>
                    <div>{valueFormat(v)}</div>
                  </>,
                  r.left + r.width / 2,
                  r.top,
                );
              }}
              onBlur={hide}
            />
          );
        }),
      )}
    </ChartFrame>
  );
}
