"use client";

import * as React from "react";
import { linearScale } from "./internal/scales";
import "./charts.css";

export interface SparklineProps {
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

/**
 * Compact trend sparkline (dependency-free SVG). Decorative by default — pass
 * `label` to expose it to assistive tech. Absorbs PM-AJAY's `Sparkline`.
 */
export function Sparkline({
  data,
  color = "var(--ds-chart-cat-1)",
  fill = true,
  width = 96,
  height = 32,
  min,
  max,
  label,
  className,
}: SparklineProps) {
  const gid = React.useId();
  if (!data || data.length < 2) {
    return <svg width={width} height={height} className={className} aria-hidden="true" />;
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
