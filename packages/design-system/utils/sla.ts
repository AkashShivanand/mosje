/**
 * Service-level-agreement status logic.
 *
 * Right to Service Acts give a citizen a guaranteed maximum time for a service, and the
 * consequences of missing it attach to a named officer. So the arithmetic behind "how long
 * is left" is not decoration — it is the thing being promised. It lives here as pure
 * functions so it can be unit-tested and reused server-side (escalation jobs, reports,
 * reminder emails) rather than living inside a chart.
 *
 * UNIT-AGNOSTIC BY DESIGN. `total` and `elapsed` are plain numbers in whatever unit the
 * statute uses. RTS Acts are usually written in WORKING days, which needs a state holiday
 * calendar to compute — that is an application concern, not a presentational one. Count the
 * days however your Act requires, then pass the numbers in.
 */

export type SlaStatus =
  /** Comfortably within the allowance. */
  | "on-track"
  /** Past the due-soon threshold — worth a nudge. */
  | "due-soon"
  /** Past the at-risk threshold — breach is imminent. */
  | "at-risk"
  /** The allowance has been exceeded and the service is still not delivered. */
  | "breached"
  /** Delivered within the allowance. */
  | "met"
  /** Delivered late — kept distinct from `breached` so reports can separate
   *  "still failing" from "failed, now closed". */
  | "missed"
  /** The clock is stopped, typically because the department is awaiting the applicant. */
  | "paused";

export interface SlaThresholds {
  /** Fraction of the allowance consumed at which the SLA becomes due-soon. @default 0.75 */
  dueSoonAt?: number;
  /** Fraction consumed at which it becomes at-risk. @default 0.9 */
  atRiskAt?: number;
}

export interface SlaInput {
  /** Total time allowed by the SLA, in any consistent unit. Must be > 0. */
  total: number;
  /** Time consumed so far, same unit. May exceed `total` — that is a breach. */
  elapsed: number;
  /** Clock stopped (e.g. a query was raised with the applicant). */
  paused?: boolean;
  /** The service has been delivered; `elapsed` is the time it took. */
  completed?: boolean;
  thresholds?: SlaThresholds;
}

export const SLA_DEFAULT_THRESHOLDS: Required<SlaThresholds> = {
  dueSoonAt: 0.75,
  atRiskAt: 0.9,
};

/**
 * Thresholds are FRACTIONS, not absolute days, because "5 days left" means something very
 * different against a 7-day allowance than against a 90-day one. Where a rule really is
 * written in absolute terms ("warn at 5 days remaining of 30"), convert it with this.
 *
 * @example thresholds={{ dueSoonAt: slaFractionForRemaining(30, 5) }}
 */
export function slaFractionForRemaining(total: number, remaining: number): number {
  if (total <= 0) return 1;
  return Math.max(0, Math.min(1, (total - remaining) / total));
}

/** Fraction of the allowance consumed. Not clamped at 1 — a breach reads above 1. */
export function slaConsumed({ total, elapsed }: Pick<SlaInput, "total" | "elapsed">): number {
  if (total <= 0) return 1;
  return Math.max(0, elapsed / total);
}

/** Time left. Negative means overdue by that much. */
export function slaRemaining({ total, elapsed }: Pick<SlaInput, "total" | "elapsed">): number {
  return total - elapsed;
}

/**
 * Resolve the status.
 *
 * Order matters: a completed SLA is finished regardless of the clock, and a paused clock
 * outranks the thresholds because nothing is being consumed while it is stopped — showing an
 * officer an escalating warning for time they are not responsible for is both wrong and
 * corrosive to trust in the number.
 */
export function slaStatus(input: SlaInput): SlaStatus {
  const { total, elapsed, paused = false, completed = false } = input;
  const overdue = elapsed > total;

  if (completed) return overdue ? "missed" : "met";
  if (paused) return "paused";
  if (overdue) return "breached";

  const { dueSoonAt, atRiskAt } = { ...SLA_DEFAULT_THRESHOLDS, ...input.thresholds };
  const consumed = slaConsumed(input);
  if (consumed >= atRiskAt) return "at-risk";
  if (consumed >= dueSoonAt) return "due-soon";
  return "on-track";
}

/** Which semantic colour family a status maps to. Never the only signal — text always says it too. */
export function slaTone(status: SlaStatus): "primary" | "success" | "warning" | "danger" | "neutral" {
  switch (status) {
    case "met":
      return "success";
    case "due-soon":
      return "warning";
    case "at-risk":
    case "breached":
    case "missed":
      return "danger";
    case "paused":
      return "neutral";
    default:
      return "primary";
  }
}

/** Pluralise a whole-number unit: 1 day / 2 days. */
function plural(n: number, unit: string): string {
  const rounded = Math.abs(Math.round(n * 10) / 10);
  const value = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
  return `${value} ${rounded === 1 ? unit : `${unit}s`}`;
}

/**
 * The short line a citizen or officer reads. UX4G's guidance is explicit that this component
 * must never render without a concrete value — "Processing…" is called out as a Don't,
 * because a vague status is exactly what erodes confidence in a service guarantee.
 */
export function slaSummary(input: SlaInput, unit = "day"): string {
  const status = slaStatus(input);
  const remaining = slaRemaining(input);

  switch (status) {
    case "met":
      return `Delivered in ${plural(input.elapsed, unit)}`;
    case "missed":
      return `Delivered late — ${plural(-remaining, unit)} over`;
    case "breached":
      return `${plural(-remaining, unit)} overdue`;
    case "paused":
      return `Paused — ${plural(remaining, unit)} left when resumed`;
    default:
      return `${plural(remaining, unit)} left`;
  }
}

/**
 * The full sentence for `aria-valuetext`. A screen-reader user gets the same information a
 * sighted user reads off the ring, not just a bare percentage — WCAG 1.4.1, since colour and
 * arc length are the visual carriers here.
 */
export function slaValueText(input: SlaInput, unit = "day"): string {
  const pct = Math.round(Math.min(1, slaConsumed(input)) * 100);
  return `${slaSummary(input, unit)}. ${plural(input.elapsed, unit)} of ${plural(
    input.total,
    unit,
  )} used (${pct}%).`;
}
