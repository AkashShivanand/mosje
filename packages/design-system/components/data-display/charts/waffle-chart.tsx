import * as React from "react";
import { cn } from "../../../utils/cn";
import { ChartStateFigure, type ChartStateProps } from "./internal/chart-frame";
import { categoricalColor } from "./internal/palette";
import "./waffle-chart.css";

export interface WaffleCategory {
  id: string;
  label: string;
  /** A `--sa-chart-cat-*` slot. Defaults to the categories' order. */
  color?: string;
}

export interface WaffleRow {
  label: string;
  /** How many units each category holds in this row. */
  counts: Record<string, number>;
}

export interface WaffleChartProps extends ChartStateProps {
  title: string;
  categories: WaffleCategory[];
  rows: WaffleRow[];
  /**
   * `count` draws one square per unit — 42 indicators are 42 squares. `percent` draws each
   * row as 100 squares in proportion, for a share. @default "count"
   */
  scale?: "count" | "percent";
  /** What one square is, for the accessible name: "indicator", "student". */
  unit?: string;
  /** Hide the legend, where the surface around the chart already names the colours. */
  hideLegend?: boolean;
  className?: string;
}

/** Largest-remainder rounding to whole squares that sum to exactly 100. */
function toHundred(values: number[]): number[] {
  const total = values.reduce((t, v) => t + v, 0);
  if (total <= 0) return values.map(() => 0);
  const raw = values.map((v) => (v / total) * 100);
  const out = raw.map(Math.floor);
  let left = 100 - out.reduce((t, v) => t + v, 0);
  const order = raw
    .map((r, i) => ({ i, r: r - Math.floor(r) }))
    .sort((a, b) => b.r - a.r);
  for (let k = 0; left > 0; k++, left--) out[order[k % order.length]!.i]! += 1;
  return out;
}

/**
 * MoSJE / SAMAVESH WaffleChart — a unit chart: squares, coloured by category.
 *
 * For a count small enough to SEE as units — 87 indicators, of which 53 have no feed — or a
 * share read as "61 in every 100". Each square stands for something a reader can name,
 * which is what a waffle has over a donut. Rows compare groups on one scale.
 */
export function WaffleChart({
  title,
  categories,
  rows,
  scale = "count",
  unit = "unit",
  hideLegend = false,
  className,
  state,
  onRetry,
  filterLabel,
}: WaffleChartProps) {
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
  const colour = (i: number) => categories[i]?.color ?? categoricalColor(i);
  const totals = categories.map((c) =>
    rows.reduce((t, r) => t + (r.counts[c.id] ?? 0), 0),
  );
  return (
    <figure className={cn("ds-waffle", className)} aria-label={title}>
      <ul className="ds-waffle__rows">
        {rows.map((r) => {
          const counts = categories.map((c) => r.counts[c.id] ?? 0);
          const squares = scale === "percent" ? toHundred(counts) : counts;
          const n = counts.reduce((t, v) => t + v, 0);
          const spoken = categories
            .map((c, i) =>
              counts[i]
                ? `${counts[i]!.toLocaleString("en-IN")} ${c.label}`
                : "",
            )
            .filter(Boolean)
            .join(", ");
          return (
            // The list item keeps its role; the row inside it is the named image.
            <li key={r.label}>
              <div
                className="ds-waffle__row"
                role="img"
                aria-label={`${r.label ? `${r.label}: ` : ""}${n.toLocaleString("en-IN")} ${unit}${n === 1 ? "" : "s"} — ${spoken}`}
              >
                {rows.length > 1 || r.label ? (
                  <span className="ds-waffle__label" aria-hidden="true">
                    {r.label}
                    <span className="ds-waffle__count">
                      {n.toLocaleString("en-IN")}
                    </span>
                  </span>
                ) : null}
                <span
                  className={cn(
                    "ds-waffle__cells",
                    scale === "percent" && "ds-waffle__cells--hundred",
                  )}
                  aria-hidden="true"
                >
                  {squares.flatMap((k, i) =>
                    Array.from({ length: k }, (_, j) => (
                      <span
                        key={`${i}-${j}`}
                        className="ds-waffle__cell"
                        style={{ backgroundColor: colour(i) }}
                      />
                    )),
                  )}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
      {hideLegend ? null : (
        <figcaption className="ds-waffle__legend">
          {categories.map((c, i) => (
            <span key={c.id} className="ds-waffle__key">
              <span
                className="ds-waffle__swatch"
                style={{ backgroundColor: colour(i) }}
                aria-hidden="true"
              />
              {c.label}
              <b>
                {scale === "percent" ? "" : totals[i]!.toLocaleString("en-IN")}
              </b>
            </span>
          ))}
        </figcaption>
      )}
    </figure>
  );
}
