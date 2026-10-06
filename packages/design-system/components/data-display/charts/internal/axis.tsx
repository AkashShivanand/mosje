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

/** Roughly the width a category label needs at the axis type size (Body 3, 12px Noto Sans). */
const labelWidth = (label: string): number => label.length * 6.8;
/** Breathing room between two flat labels, and the spacing two rotated ones need to clear. */
const FLAT_GAP = 8;
const ROTATED_STEP = 26;

/** Whether every label fits flat in the room between two neighbouring category centres. */
export function labelsFitFlat(labels: readonly string[], step: number): boolean {
  return labels.every((l) => labelWidth(l) + FLAT_GAP <= step);
}

/** The longest label that thins rather than rotates — "2025-26*", "Sep 2026". */
const SHORT_LABEL = 8;

/**
 * Whether an x-axis turns its labels. SHORT LABELS NEVER DO: a year or a month that will not
 * fit side by side is thinned instead (`XAxisLabels` keeps the latest), because tilted text
 * is slower to read and a reader of a year axis needs only every second or third year to
 * place a point. Only long labels — a State/UT, a scheme — rotate, and only when they would
 * collide flat. It used to rotate any axis of more than six labels, which tilted twelve
 * financial years across a 1,250px chart with room to spare.
 */
export function shouldRotate(labels: readonly string[], step: number): boolean {
  if (labels.every((l) => l.length <= SHORT_LABEL)) return false;
  return !labelsFitFlat(labels, step);
}

/**
 * Category labels along the x-axis, with optional rotation for dense/long
 * labels. `band` is the band width used to centre each label.
 *
 * Given `step` — the distance between two category centres — the axis THINS itself where
 * neighbouring labels would collide: every second (or third…) label is drawn, counting back
 * from the last, so the latest period is always named. The marks, the tooltip and the table
 * still carry every category; only the axis text is spaced out.
 */
export function XAxisLabels({
  labels,
  x,
  y,
  rotate = 0,
  maxChars = 14,
  step,
}: {
  labels: string[];
  /** Returns the centre x of the band for a label. */
  x: (label: string) => number;
  y: number;
  rotate?: number;
  maxChars?: number;
  /** Pixels between two neighbouring category centres; enables thinning. */
  step?: number;
}) {
  const need = rotate ? ROTATED_STEP : Math.max(0, ...labels.map(labelWidth)) + FLAT_GAP;
  const every = step && step > 0 ? Math.max(1, Math.ceil(need / step)) : 1;
  const last = labels.length - 1;
  return (
    <g aria-hidden="true">
      {labels.map((label, i) => {
        if ((last - i) % every !== 0) return null;
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
