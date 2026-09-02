"use client";

import * as React from "react";
import { cn } from "../../../utils/cn";
import { linearScale } from "./internal/scales";
import type { ChartStateProps } from "./internal/chart-frame";
import "./charts.css";

export interface SparklineProps extends ChartStateProps {
  data: number[] | null | undefined;
  /** Stroke colour (any CSS colour / var). Defaults to the primary series colour. */
  color?: string;
  /** Fill the area below the line. */
  fill?: boolean;
  width?: number;
  height?: number;
  min?: number;
  max?: number;
  /** Accessible label. When omitted the sparkline is decorative (aria-hidden). */
  label?: string;
  className?: string;
}

/** What a sparkline says when it has no trend to draw. One line each — there is no room for more. */
const STATE_NOTE: Record<string, string> = {
  loading: "Loading",
  empty: "No trend data",
  "no-results": "No trend matches the filters applied",
  "not-published": "Trend not published",
  error: "Trend could not be loaded",
  restricted: "Trend not available to view",
  offline: "Offline",
};

/**
 * Compact trend sparkline (dependency-free SVG). Decorative by default — pass
 * `label` to expose it to assistive tech. Absorbs PM-AJAY's Sparkline.
 *
 * ── STATE, HANDLED LOCALLY ──────────────────────────────────────────────────
 *
 * 96×32 of inline trend has no room for a plate, a headline and a button, so
 * this does not render `ChartStateFigure`. It draws a flat baseline at the
 * chart's own size and names it — which is the same contract in the space
 * available.
 *
 * Fewer than two points USED TO RETURN A BLANK `aria-hidden` SVG. That is two
 * defects in one line: a hole in the layout the reader cannot interpret, and —
 * worse — `aria-hidden` applied unconditionally, so a sparkline the caller had
 * deliberately LABELLED vanished from assistive technology the moment its feed
 * went short. A labelled sparkline is announced in every state now; an unlabelled
 * one stays decorative in every state, because a decorative mark should not start
 * talking merely because it is empty.
 */
export function Sparkline({
  data,
  color = "var(--sa-chart-cat-1)",
  fill = true,
  width = 96,
  height = 32,
  min,
  max,
  label,
  className,
  state,
  // `onRetry` is accepted for symmetry with every other chart and deliberately
  // unused: 96×32 has no room for a button, and the card around it is where a
  // retry belongs.
  filterLabel,
}: SparklineProps) {
  const gid = React.useId();
  // One expression. A caller's `state` outranks the length of the array, which
  // cannot tell "still arriving" from "arrived, and there is nothing".
  const resolved = state ?? (!data || data.length < 2 ? "empty" : undefined);
  // The `data` half is repeated in the condition rather than folded into
  // `resolved`, so the compiler narrows it away for the drawing path below.
  if (resolved || !data || data.length < 2) {
    const shown = resolved ?? "empty";
    const note =
      shown === "no-results" && filterLabel
        ? `No trend matches the current ${filterLabel}`
        : (STATE_NOTE[shown] ?? "No trend data");
    const announced = label ? `${label}: ${note}` : note;
    return (
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className={cn("ds-sparkline--state", className)}
        role={label ? "img" : undefined}
        aria-label={label ? announced : undefined}
        aria-hidden={label ? undefined : true}
        preserveAspectRatio="none"
      >
        <title>{announced}</title>
        {/* A baseline, not a blank. The reader can see that a trend belongs here
            and that it is not being drawn — which is the whole message. */}
        <path
          d={`M 2 ${height / 2} L ${width - 2} ${height / 2}`}
          className="ds-sparkline__flat"
        />
      </svg>
    );
  }

  const lo = min ?? Math.min(...data);
  const hi = max ?? Math.max(...data);
  const pad = 2;
  const x = linearScale([0, data.length - 1], [pad, width - pad]);
  const y = linearScale([lo, hi === lo ? lo + 1 : hi], [height - pad, pad]);

  const line = data.map((v, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(2)} ${y(v).toFixed(2)}`).join(" ");
  const area = `${line} L ${x(data.length - 1).toFixed(2)} ${height - pad} L ${x(0).toFixed(2)} ${height - pad} Z`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      preserveAspectRatio="none"
    >
      {fill && (
        <>
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.24} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <path d={area} fill={`url(#${gid})`} />
        </>
      )}
      <path d={line} fill="none" stroke={color} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
