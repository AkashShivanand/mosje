import * as React from "react";
import { cn } from "../../../../utils/cn";
import type { ChartTable } from "../types";
import "../charts.css";

export interface ChartFrameProps {
  /** Accessible name — rendered as <title> and the SR table caption. */
  title: string;
  /** Short SR summary rendered as <desc> (e.g. "Male 56%, Female 44%"). */
  summary?: string;
  /** Optional visible caption under the chart. */
  caption?: React.ReactNode;
  /** SVG internal coordinate system, e.g. "0 0 480 240". */
  viewBox: string;
  /** Screen-reader data-table equivalent (the accessible source of truth). */
  table?: ChartTable;
  /** Decorative legend node (rendered below the canvas). */
  legend?: React.ReactNode;
  /** Floating overlay inside the positioned canvas (e.g. <ChartTooltip />). */
  overlay?: React.ReactNode;
  /** Ref forwarded to the positioned canvas (for tooltip coordinate maths). */
  canvasRef?: React.Ref<HTMLDivElement>;
  /**
   * Ref forwarded to the <svg> itself.
   *
   * For charts that map a pointer BACK into viewBox units — `IndiaPointMap`
   * resolves which of ~1,000 hex bins is under the cursor without giving each
   * one a DOM node, which needs `getScreenCTM()` on the element that owns the
   * coordinate system.
   */
  svgRef?: React.Ref<SVGSVGElement>;
  className?: string;
  /** Extra class on the <svg>. */
  svgClassName?: string;
  /** SVG content. */
  children: React.ReactNode;
}

/**
 * Shared accessible chart shell. Standardises the figure → relative canvas →
 * role="img" SVG (with <title>/<desc>) → screen-reader <table> pattern so every
 * chart in the catalogue is WCAG 2.1 AA / GIGW compliant by construction.
 */
export function ChartFrame({
  title,
  summary,
  caption,
  viewBox,
  table,
  legend,
  overlay,
  canvasRef,
  svgRef,
  className,
  svgClassName,
  children,
}: ChartFrameProps) {
  const titleId = React.useId();
  const descId = React.useId();
  const labelledBy = summary ? `${titleId} ${descId}` : titleId;

  return (
    <figure className={cn("ds-chart", className)}>
      <div className="ds-chart__canvas" ref={canvasRef}>
        <svg
          ref={svgRef}
          viewBox={viewBox}
          className={cn("ds-chart__svg", svgClassName)}
          role="img"
          preserveAspectRatio="xMidYMid meet"
          aria-labelledby={labelledBy}
        >
          <title id={titleId}>{title}</title>
          {summary && <desc id={descId}>{summary}</desc>}
          {children}
        </svg>
        {overlay}
      </div>
      {legend}
      {caption && <figcaption className="ds-chart__caption">{caption}</figcaption>}
      {table && (
        <table className="ds-sr-only">
          <caption>{title}</caption>
          <thead>
            <tr>
              {table.columns.map((c) => (
                <th key={c} scope="col">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td key={ci}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </figure>
  );
}
