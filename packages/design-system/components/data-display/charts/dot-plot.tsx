import * as React from "react";
import { cn } from "../../../utils/cn";
import { ChartStateFigure, type ChartStateProps } from "./internal/chart-frame";
import type { ValueFormat } from "./internal/format";
import "./dot-plot.css";

export interface DotPlotRow {
  label: string;
  value: number;
  /** One line under the label — the two figures a share is made of ("₹162 Cr of ₹380 Cr"). */
  detail?: string;
}

export interface DotPlotProps extends ChartStateProps {
  /** Accessible name of the whole plot. */
  title: string;
  rows: DotPlotRow[];
  /** The scale's end. @default 100 */
  max?: number;
  /**
   * One line drawn across every row — the share of the year elapsed, a target, a national
   * figure — so each dot is read against it, not against the end of the scale.
   */
  reference?: { value: number; label: string };
  valueFormat?: ValueFormat;
  /** `sm` drops the scale row and tightens the rows, for a thumbnail in a card. @default "md" */
  size?: "sm" | "md";
  className?: string;
}

const pct = (n: number) => `${Math.round(n).toLocaleString("en-IN")}%`;

/**
 * MoSJE / SAMAVESH DotPlot — one dot per row on a shared scale, with an optional reference
 * line through every row.
 *
 * The chart for PACE: spending against the share of the year elapsed, coverage against a
 * target. A bar fills from zero and the eye reads its length; here only the position
 * matters, and the gap between dot and line is the finding. Built in HTML rather than SVG
 * so a row's label wraps and stays at reading size at any width.
 */
export function DotPlot({
  title,
  rows,
  max = 100,
  reference,
  valueFormat = pct,
  size = "md",
  className,
  state,
  onRetry,
  filterLabel,
}: DotPlotProps) {
  const resolved = state ?? (rows.length === 0 ? "empty" : undefined);
  if (resolved)
    return (
      <ChartStateFigure
        title={title}
        state={resolved}
        onRetry={onRetry}
        filterLabel={filterLabel}
      />
    );
  const at = (v: number) => `${Math.max(0, Math.min(100, (v / max) * 100))}%`;
  return (
    <figure
      className={cn("ds-dotplot", `ds-dotplot--${size}`, className)}
      aria-label={title}
    >
      <ul className="ds-dotplot__rows">
        {rows.map((r) => (
          // The list item keeps its role; the row inside it is the named image.
          <li key={r.label}>
            <div
              className="ds-dotplot__row"
              role="img"
              aria-label={`${r.label}: ${valueFormat(r.value)}${r.detail ? `, ${r.detail}` : ""}${reference ? `; ${reference.label} ${valueFormat(reference.value)}` : ""}`}
            >
              <span className="ds-dotplot__label" aria-hidden="true">
                {r.label}
                {r.detail && size === "md" ? (
                  <span className="ds-dotplot__detail">{r.detail}</span>
                ) : null}
              </span>
              <span className="ds-dotplot__track" aria-hidden="true">
                {reference ? (
                  <span
                    className="ds-dotplot__ref"
                    style={{ insetInlineStart: at(reference.value) }}
                  />
                ) : null}
                <span
                  className="ds-dotplot__stem"
                  style={{ inlineSize: at(r.value) }}
                />
                <span
                  className="ds-dotplot__dot"
                  style={{ insetInlineStart: at(r.value) }}
                />
              </span>
              <span className="ds-dotplot__value" aria-hidden="true">
                {valueFormat(r.value)}
              </span>
            </div>
          </li>
        ))}
      </ul>
      {reference && size === "md" ? (
        <figcaption className="ds-dotplot__scale" aria-hidden="true">
          <span className="ds-dotplot__scale-track">
            <span
              className="ds-dotplot__scale-ref"
              style={{ insetInlineStart: at(reference.value) }}
            >
              {reference.label} {valueFormat(reference.value)}
            </span>
          </span>
        </figcaption>
      ) : null}
    </figure>
  );
}
