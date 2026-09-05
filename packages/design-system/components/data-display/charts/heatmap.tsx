"use client";

import * as React from "react";
import { ChartFrame, type ChartStateProps } from "./internal/chart-frame";
import { ChartTooltip, useChartTooltip } from "./internal/tooltip";
import { sequentialColor, divergingColor } from "./internal/palette";
import { formatIndian } from "./internal/format";
import type { ValueFormat } from "./internal/format";
import { withheldLabel, type ChartWithheld } from "./types";

/** A cell is a figure, or the reason there is none. */
export type HeatmapCell = number | ChartWithheld;

export interface HeatmapProps extends ChartStateProps {
  xLabels: string[];
  yLabels: string[];
  /**
   * Row-major values: matrix[y][x]. A cell may be a `ChartWithheld` instead of
   * a number — it is then drawn as a hatched, empty cell, named in the tooltip
   * and the table with its reason, and left out of the colour scale's domain.
   */
  matrix: HeatmapCell[][];
  title: string;
  valueFormat?: ValueFormat;
  /** "sequential" (default) ramps low→high; "diverging" centres on the midpoint. */
  scale?: "sequential" | "diverging";
  className?: string;
}

const CELL = 34;
const GUT_L = 96;
const GUT_T = 26;

const isWithheld = (c: HeatmapCell | undefined): c is ChartWithheld => typeof c === "object" && c !== null;

/** MoSJE / SAMAVESH Heatmap — token-driven matrix using the sequential ramp. */
export function Heatmap({
  xLabels,
  yLabels,
  matrix,
  title,
  valueFormat = formatIndian,
  scale = "sequential",
  className,
  state,
  onRetry,
  filterLabel,
  tableView,
}: HeatmapProps) {
  const { canvasRef, tip, show, hide } = useChartTooltip();
  const flat = matrix.flat();
  const known = flat.filter((c): c is number => typeof c === "number");
  // One expression, resolved before the colour ramp or the axes read anything.
  const resolved = state ?? (flat.length === 0 ? "empty" : undefined);
  if (resolved)
    return (
      <ChartFrame
        marksAreFocusable
        title={title}
        /* The matrix the caller ASKED for, so the state occupies the space the
           cells will — not a square guess that shifts when the figures land. */
        viewBox={`0 0 ${GUT_L + Math.max(1, xLabels.length) * CELL} ${
          GUT_T + Math.max(1, yLabels.length) * CELL
        }`}
        className={className}
        state={resolved}
        onRetry={onRetry}
        filterLabel={filterLabel}
      >
        {null}
      </ChartFrame>
    );

  const min = known.length ? Math.min(...known) : 0;
  const max = known.length ? Math.max(...known) : 0;
  const span = max - min || 1;
  const mid = (max + min) / 2;
  const half = Math.max(Math.abs(max - mid), Math.abs(min - mid)) || 1;

  const colorFor = (v: number) =>
    scale === "diverging" ? divergingColor((v - mid) / half) : sequentialColor((v - min) / span);
  const cellText = (c: HeatmapCell | undefined): string =>
    isWithheld(c) ? withheldLabel(c) : valueFormat(typeof c === "number" ? c : 0);

  const width = GUT_L + xLabels.length * CELL;
  const height = GUT_T + yLabels.length * CELL;
  const withheldCount = flat.length - known.length;

  return (
    <ChartFrame
      marksAreFocusable
      title={title}
      summary={`${yLabels.length}×${xLabels.length} matrix, values ${valueFormat(min)}–${valueFormat(max)}${
        withheldCount ? `, ${withheldCount} cell${withheldCount === 1 ? "" : "s"} withheld` : ""
      }`}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      canvasRef={canvasRef}
      overlay={<ChartTooltip tip={tip} />}
      onDismiss={hide}
      table={{
        columns: ["Row", ...xLabels],
        rows: yLabels.map((yl, yi) => [
          yl,
          ...xLabels.map((_, xi) => {
            const c = matrix[yi]?.[xi];
            return isWithheld(c) ? withheldLabel(c) : typeof c === "number" ? c : 0;
          }),
        ]),
      }}
      tableView={tableView}
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
          const c = matrix[yi]?.[xi];
          const withheld = isWithheld(c);
          const v = typeof c === "number" ? c : 0;
          const text = cellText(c);
          const tooltip = (
            <>
              <div className="ds-chart__tooltip-title">{`${yl} · ${xl}`}</div>
              <div>{text}</div>
            </>
          );
          return (
            <rect
              key={`${yi}-${xi}`}
              x={GUT_L + xi * CELL + 1}
              y={GUT_T + yi * CELL + 1}
              width={CELL - 2}
              height={CELL - 2}
              rx={3}
              /* A withheld cell is hatched and unfilled — it keeps its place in
                 the grid and cannot be read as the lowest rung of the ramp. */
              fill={withheld ? undefined : colorFor(v)}
              className={withheld ? "ds-chart__cell ds-chart__mark--withheld" : "ds-chart__cell"}
              tabIndex={0}
              role="img"
              aria-label={`${yl}, ${xl}: ${text}`}
              onPointerMove={(e) => show(tooltip, e.clientX, e.clientY)}
              onPointerLeave={hide}
              onFocus={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                show(tooltip, r.left + r.width / 2, r.top);
              }}
              onBlur={hide}
            />
          );
        }),
      )}
    </ChartFrame>
  );
}
