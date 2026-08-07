"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import {
  slaConsumed,
  slaStatus,
  slaSummary,
  slaTone,
  slaValueText,
  type SlaStatus,
  type SlaThresholds,
} from "../../utils/sla";
import "./sla-progress-indicator.css";

export type SlaVariant = "circular" | "linear" | "badge";

export interface SlaProgressIndicatorProps {
  /** What the guarantee is for, e.g. "Income certificate". Always shown or read out. */
  label: React.ReactNode;
  /** Total time the SLA allows, in any consistent unit. */
  total: number;
  /** Time consumed so far, same unit. May exceed `total` — that is a breach. */
  elapsed: number;
  /**
   * Unit name, singular. Pluralised automatically. RTS Acts are usually written in WORKING
   * days — count them however your Act requires and pass the number in. @default "day"
   */
  unit?: string;
  /** @default "linear" */
  variant?: SlaVariant;
  /** Clock stopped, typically awaiting the applicant. Renders neutral, not escalating. */
  paused?: boolean;
  /** Service delivered; `elapsed` is how long it took. Freezes the indicator. */
  completed?: boolean;
  thresholds?: SlaThresholds;
  /** Force a status instead of deriving it. Escape hatch — prefer the derived value. */
  status?: SlaStatus;
  /** Secondary line (linear variant), e.g. the applicant or the officer holding it. */
  description?: React.ReactNode;
  /** Trailing control on the linear variant, e.g. a "View" link. */
  action?: React.ReactNode;
  className?: string;
  id?: string;
}

const RADIUS = 26;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * MoSJE / SAMAVESH SLA progress indicator. (UX4G 3.0 "SLA Progress Indicator")
 *
 * Tracks time remaining against a service guarantee. Right to Service Acts give a citizen a
 * maximum time for a service and attach the consequences of missing it to a named officer, so
 * this is not a decorative progress bar — it is the promise, rendered.
 *
 * Three variants, matching UX4G:
 * - `linear` (default) — a case detail row or a queue: label, bar, time remaining.
 * - `circular` — a dashboard tile: a ring with the number of units left in the middle.
 * - `badge` — a compact pill for a table cell, where a bar would not fit.
 *
 * **It always states a concrete time.** UX4G explicitly calls out a vague "Processing…" as a
 * Don't, and rightly: an unspecific status is exactly what erodes confidence in a guarantee.
 * Every state here names a number and a unit, including breach ("3 days overdue") and pause.
 *
 * **Colour is never the only signal.** Every state carries text as well as a hue, and the
 * whole thing is a `role="progressbar"` with an `aria-valuetext` sentence that gives a screen
 * reader what a sighted user reads off the ring — not a bare percentage.
 *
 * **A paused clock renders neutral, not escalating.** When the department is waiting on the
 * applicant, nothing is being consumed; showing an officer a reddening bar for time they are
 * not accountable for is both wrong and corrosive to trust in the number.
 *
 * @example
 * <SlaProgressIndicator label="Income certificate" total={21} elapsed={16} />
 * <SlaProgressIndicator label="Grievance #4471" total={30} elapsed={34} variant="badge" />
 */
export function SlaProgressIndicator({
  label,
  total,
  elapsed,
  unit = "day",
  variant = "linear",
  paused = false,
  completed = false,
  thresholds,
  status: statusOverride,
  description,
  action,
  className,
  id,
}: SlaProgressIndicatorProps): React.JSX.Element {
  const reactId = React.useId();
  const rootId = id ?? reactId;
  const labelId = `${rootId}-label`;

  const input = { total, elapsed, paused, completed, thresholds };
  const status = statusOverride ?? slaStatus(input);
  const tone = slaTone(status);
  const summary = slaSummary(input, unit);
  const valueText = slaValueText(input, unit);
  const pct = Math.round(Math.min(1, slaConsumed(input)) * 100);

  // `aria-valuenow` is the consumed percentage, clamped: a progressbar's value may not exceed
  // its max, so a breach reports 100 and the overdue amount is carried in aria-valuetext.
  const bar = {
    role: "progressbar" as const,
    "aria-valuenow": pct,
    "aria-valuemin": 0,
    "aria-valuemax": 100,
    "aria-valuetext": valueText,
    "aria-labelledby": labelId,
  };

  const root = cn(
    "ds-sla",
    `ds-sla--${variant}`,
    `ds-sla--${tone}`,
    status === "paused" && "ds-sla--paused",
    className,
  );

  if (variant === "circular") {
    // strokeDashoffset draws the consumed arc clockwise from 12 o'clock.
    const offset = CIRCUMFERENCE * (1 - Math.min(1, slaConsumed(input)));
    return (
      <div className={root} id={rootId}>
        <div className="ds-sla__ring" {...bar}>
          <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
            <circle className="ds-sla__track" cx="32" cy="32" r={RADIUS} />
            <circle
              className="ds-sla__fill"
              cx="32"
              cy="32"
              r={RADIUS}
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
            />
          </svg>
          <span className="ds-sla__ring-value" aria-hidden="true">
            {status === "paused" ? "❙❙" : Math.abs(Math.round(total - elapsed))}
          </span>
        </div>
        <p className="ds-sla__label" id={labelId}>
          {label}
        </p>
        <p className="ds-sla__summary">{summary}</p>
      </div>
    );
  }

  if (variant === "badge") {
    return (
      <span className={root} id={rootId} {...bar}>
        <span className="ds-sla__dot" aria-hidden="true" />
        <span className="ds-sla__label" id={labelId}>
          {label}
        </span>
        <span className="ds-sla__divider" aria-hidden="true" />
        <span className="ds-sla__summary">{summary}</span>
      </span>
    );
  }

  return (
    <div className={root} id={rootId}>
      <div className="ds-sla__head">
        <span className="ds-sla__label" id={labelId}>
          {label}
        </span>
        <span className="ds-sla__summary">{summary}</span>
      </div>
      <div className="ds-sla__track-wrap" {...bar}>
        <span className="ds-sla__bar" style={{ inlineSize: `${pct}%` }} />
      </div>
      {(description != null || action != null) && (
        <div className="ds-sla__foot">
          {description != null && <span className="ds-sla__description">{description}</span>}
          {action != null && <span className="ds-sla__action">{action}</span>}
        </div>
      )}
    </div>
  );
}
