import * as React from "react";
import { cn } from "../../../utils/cn";
import { ChartStateFigure, type ChartStateProps } from "./internal/chart-frame";
import { formatPercent } from "./internal/format";
import "./charts.css";

export interface ProgressProps extends ChartStateProps {
  /**
   * The figure, 0–`max`. **Optional**: a bar with no figure is a real state,
   * and it is not zero.
   *
   * This used to be required, so a caller with nothing to show had one honest
   * option — pass `0` — and the bar then rendered a confident empty track
   * reading `0%`, with `aria-valuenow={0}` telling a screen reader the same
   * thing. "The department reports nought per cent" and "no figure has been
   * published" are different sentences, and one of them was being said for
   * both.
   */
  value?: number;
  max?: number;
  /** Accessible label for the bar. */
  label: string;
  /** Bar colour (defaults to primary series colour). */
  color?: string;
  /** Show the % to the right of the label. */
  showValue?: boolean;
  className?: string;
}

/**
 * Accessible linear progress bar (role="progressbar"). Token-driven track + fill.
 *
 * ── STATE, HANDLED LOCALLY ──────────────────────────────────────────────────
 *
 * This is not a `ChartFrame` chart: it is a label and a track, sized to a row in
 * a list, and replacing that row with a 180px plate the moment the figures are
 * still in flight is a layout jump, not a loading state. So it splits:
 *
 * - **loading**, and **a missing figure**, render INDETERMINATE — the row keeps
 *   its exact height, the value reads "—" rather than "0%", and `aria-valuenow`
 *   is omitted, which is precisely how ARIA spells "in progress, amount
 *   unknown". A `progressbar` carrying `aria-valuenow={0}` is a claim.
 * - **empty, error, no-results, not-published, restricted, offline** need
 *   words, so they render the same `ChartStateFigure` every other chart uses.
 *   Nothing here is hand-rolled.
 */
export function Progress({
  value,
  max = 100,
  label,
  color = "var(--sa-chart-cat-1)",
  showValue = true,
  className,
  state,
  onRetry,
  filterLabel,
}: ProgressProps) {
  if (state && state !== "loading")
    return (
      <ChartStateFigure
        state={state}
        title={label}
        onRetry={onRetry}
        filterLabel={filterLabel}
        className={className}
      />
    );

  // `Number.isFinite`, not a null check: `NaN` and `Infinity` reach the same
  // place as `undefined` and only one of them is caught by asking "is it there".
  const figure = value !== undefined && Number.isFinite(value) ? value : null;
  const known = state !== "loading" && figure !== null && max > 0;
  const pct =
    known && figure !== null ? Math.max(0, Math.min(100, (figure / max) * 100)) : 0;

  return (
    <div className={cn("ds-progress", className)}>
      <div className="ds-progress__head">
        <span className="ds-progress__label">{label}</span>
        {showValue && (
          <span className="ds-progress__value">
            {known ? (
              formatPercent(pct, 0)
            ) : (
              <>
                {/* The dash is the visible answer; the sentence beside it is the
                    one a screen reader needs, because "—" is not a reading. */}
                <span aria-hidden="true">—</span>
                <span className="ds-sr-only">
                  {state === "loading" ? "Loading" : "Not reported"}
                </span>
              </>
            )}
          </span>
        )}
      </div>
      <div
        className={cn("ds-progress__track", !known && "ds-progress__track--indeterminate")}
        role="progressbar"
        aria-label={label}
        /* OMITTED, not zeroed. An indeterminate `progressbar` is defined by the
           ABSENCE of `aria-valuenow`; supplying 0 announces a measured nought. */
        {...(known ? { "aria-valuenow": Math.round(pct) } : {})}
        aria-valuemin={0}
        aria-valuemax={100}
        {...(state === "loading" ? { "aria-busy": true } : {})}
      >
        {known && (
          <div className="ds-progress__fill" style={{ width: `${pct}%`, backgroundColor: color }} />
        )}
      </div>
    </div>
  );
}
