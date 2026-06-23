"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import "./charts.css";

export type ChartDatum = { label: string; value: number };

/** 8-step categorical palette, token-driven via `.ds-chart-fill-N` / `.ds-chart-swatch-N`. */
const PALETTE = [0, 1, 2, 3, 4, 5, 6, 7];

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function arcPath(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  if (endAngle - startAngle >= 359.999) {
    return `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.001} ${cy - r} Z`;
  }
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} Z`;
}

/**
 * MoSJE / SAMAVESH PieChart — dependency-free SVG pie with a screen-reader data
 * table. Colours come from the DS categorical palette. One definition shared
 * across MIS dashboards (NMBA, PM-AJAY previously each hand-rolled their own).
 */
export function PieChart({ data, title }: { data: ChartDatum[]; title: string }) {
  const titleId = React.useId();
  const descId = React.useId();
  const total = data.reduce((sum, d) => sum + d.value, 0);
  if (total === 0) return <p className="ds-chart__empty">No data to display.</p>;

  let cursor = 0;
  const slices = data.map((d, i) => {
    const start = (cursor / total) * 360;
    cursor += d.value;
    const end = (cursor / total) * 360;
    return { ...d, start, end, seg: PALETTE[i % PALETTE.length], pct: (d.value / total) * 100 };
  });
  const summary = slices.map((s) => `${s.label} ${s.pct.toFixed(1)}%`).join(", ");

  return (
    <figure className="ds-chart ds-chart--pie">
      <svg viewBox="0 0 200 200" className="ds-chart__pie-svg" role="img" aria-labelledby={`${titleId} ${descId}`}>
        <title id={titleId}>{title}</title>
        <desc id={descId}>{summary}</desc>
        {slices.map((s) => (
          <path key={s.label} d={arcPath(100, 100, 92, s.start, s.end)} className={cn(`ds-chart-fill-${s.seg}`, "ds-chart__pie-slice")} />
        ))}
      </svg>
      <ul className="ds-chart__legend" aria-hidden="true">
        {slices.map((s) => (
          <li key={s.label} className="ds-chart__legend-item">
            <span className={cn("ds-chart__swatch", `ds-chart-swatch-${s.seg}`)} />
            <span className="ds-chart__legend-label">{s.label}</span>
            <span className="ds-chart__legend-pct">{s.pct.toFixed(1)}%</span>
          </li>
        ))}
      </ul>
      <table className="ds-sr-only">
        <caption>{title}</caption>
        <thead><tr><th scope="col">Category</th><th scope="col">Count</th><th scope="col">Share</th></tr></thead>
        <tbody>
          {slices.map((s) => (
            <tr key={s.label}><td>{s.label}</td><td>{s.value}</td><td>{s.pct.toFixed(1)}%</td></tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

/**
 * MoSJE / SAMAVESH BarChart — dependency-free SVG bars with a screen-reader
 * data table.
 */
export function BarChart({ data, title, yLabel }: { data: ChartDatum[]; title: string; yLabel?: string }) {
  const titleId = React.useId();
  const descId = React.useId();
  const max = Math.max(1, ...data.map((d) => d.value));
  if (data.length === 0) return <p className="ds-chart__empty">No data to display.</p>;

  const width = 480;
  const height = 240;
  const padL = 32;
  const padB = 56;
  const chartW = width - padL - 8;
  const chartH = height - padB - 12;
  const barGap = 10;
  const barW = Math.max(8, chartW / data.length - barGap);
  const summary = data.map((d) => `${d.label}: ${d.value}`).join(", ");

  return (
    <figure className="ds-chart">
      <svg viewBox={`0 0 ${width} ${height}`} className="ds-chart__bar-svg" role="img" aria-labelledby={`${titleId} ${descId}`}>
        <title id={titleId}>{title}</title>
        <desc id={descId}>{summary}</desc>
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const y = 12 + chartH - chartH * t;
          return (
            <g key={t}>
              <line x1={padL} y1={y} x2={width - 8} y2={y} className="ds-chart__grid" strokeWidth={1} />
              <text x={padL - 6} y={y + 3} textAnchor="end" className="ds-chart__axis">{Math.round(max * t)}</text>
            </g>
          );
        })}
        {yLabel && (
          <text x={10} y={height / 2} textAnchor="middle" transform={`rotate(-90 10 ${height / 2})`} className="ds-chart__axis">{yLabel}</text>
        )}
        {data.map((d, i) => {
          const x = padL + i * (barW + barGap) + barGap / 2;
          const h = (d.value / max) * chartH;
          const y = 12 + chartH - h;
          return (
            <g key={d.label}>
              <rect x={x} y={y} width={barW} height={h} rx={3} className={cn(`ds-chart-fill-${PALETTE[i % PALETTE.length]}`)} />
              <text x={x + barW / 2} y={y - 4} textAnchor="middle" className="ds-chart__value">{d.value}</text>
              <text x={x + barW / 2} y={height - padB + 16} textAnchor="end" transform={`rotate(-35 ${x + barW / 2} ${height - padB + 16})`} className="ds-chart__axis">
                {d.label.length > 14 ? d.label.slice(0, 13) + "…" : d.label}
              </text>
            </g>
          );
        })}
      </svg>
      <table className="ds-sr-only">
        <caption>{title}</caption>
        <thead><tr><th scope="col">Category</th><th scope="col">{yLabel ?? "Value"}</th></tr></thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.label}><td>{d.label}</td><td>{d.value}</td></tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
