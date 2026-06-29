import * as React from "react";
import { CHART_INK } from "./palette";
import type { ValueFormat } from "./format";

export interface GridTick {
  /** Pixel y (or x) position in the chart's coordinate space. */
  pos: number;
  value: number;
}

/**
 * Horizontal gridlines + left-axis value labels for a vertical chart.
 * Pass the y pixel positions and values (from `niceTicks` + a `linearScale`).
 */
export function Gridlines({
  ticks,
  x0,
  x1,
  format,
  labelGutter = 6,
}: {
  ticks: GridTick[];
  x0: number;
  x1: number;
  format: ValueFormat;
  labelGutter?: number;
}) {
  return (
    <g aria-hidden="true">
      {ticks.map((t) => (
        <g key={t.value}>
          <line
            x1={x0}
            y1={t.pos}
            x2={x1}
            y2={t.pos}
            stroke={CHART_INK.grid}
            strokeWidth={1}
            shapeRendering="crispEdges"
          />
          <text
            x={x0 - labelGutter}
            y={t.pos + 3}
            textAnchor="end"
            className="ds-chart__axis"
            fill={CHART_INK.axis}
          >
            {format(t.value)}
          </text>
        </g>
      ))}
    </g>
  );
}

/**
 * Category labels along the x-axis, with optional rotation for dense/long
 * labels. `band` is the band width used to centre each label.
 */
export function XAxisLabels({
  labels,
  x,
  y,
  rotate = 0,
  maxChars = 14,
}: {
  labels: string[];
  /** Returns the centre x of the band for a label. */
  x: (label: string) => number;
  y: number;
  rotate?: number;
  maxChars?: number;
}) {
  return (
    <g aria-hidden="true">
      {labels.map((label) => {
        const cx = x(label);
        const text = label.length > maxChars ? `${label.slice(0, maxChars - 1)}…` : label;
        return (
          <text
            key={label}
            x={cx}
            y={y}
            textAnchor={rotate ? "end" : "middle"}
            className="ds-chart__axis"
            fill={CHART_INK.axis}
            transform={rotate ? `rotate(${rotate} ${cx} ${y})` : undefined}
          >
            {text}
          </text>
        );
      })}
    </g>
  );
}
