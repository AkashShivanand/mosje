"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { Icon } from "../icon/icon";
import "./visitor-counter.css";

export interface VisitorCounterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visible label before the figure. @default "Total Visits" */
  label?: string;
  /**
   * Count at `since`. The component derives the current figure from this plus
   * elapsed time, so every visitor sees a consistent number rather than a
   * random one.
   */
  baseline?: number;
  /** ISO date the baseline was taken. */
  since?: string;
  /** Visits per day used to extrapolate from the baseline. */
  perDay?: number;
  /**
   * Seconds between visible ticks once mounted. Set 0 to freeze after the
   * first paint. @default 12
   */
  tickSeconds?: number;
}

/** 2026-08-20, the day the counter was seeded. Fixed so the maths is reproducible. */
const DEFAULT_SINCE = "2026-08-20T00:00:00Z";
const DEFAULT_BASELINE = 247_112;
const DEFAULT_PER_DAY = 1_940;

/**
 * VisitorCounter — the "Total Visits" figure in the site footer.
 *
 * ⚠️ MOCK DATA, BY DESIGN. There is no analytics backend on this estate. Rather
 * than print an invented constant, the figure is DERIVED: `baseline` counted at
 * `since`, extrapolated at `perDay`, ticking gently while the page is open. It
 * moves like a real counter and is reproducible from its inputs, but it is not
 * a measurement — swap this component's props for a real feed before the site
 * carries a number anyone might quote.
 *
 * WHY THE FIRST PAINT IS A PLACEHOLDER
 * The value depends on the current clock, so server and client would disagree
 * and React would report a hydration mismatch. The component therefore renders
 * a non-breaking space until mounted, then fills in. That also keeps the figure
 * out of the static HTML, where it would be stale the moment it was built.
 *
 * ACCESSIBILITY
 * The figure is decorative-adjacent: it changes on a timer and carries no task
 * value, so it is deliberately NOT a live region — announcing it every twelve
 * seconds would talk over the page. `aria-label` on the wrapper names it once,
 * and `tabular-nums` stops the digits jittering as they change.
 * Ticking stops under `prefers-reduced-motion`.
 */
export function VisitorCounter({
  label = "Total Visits",
  baseline = DEFAULT_BASELINE,
  since = DEFAULT_SINCE,
  perDay = DEFAULT_PER_DAY,
  tickSeconds = 12,
  className,
  ...rest
}: VisitorCounterProps) {
  const [count, setCount] = React.useState<number | null>(null);

  React.useEffect(() => {
    const origin = new Date(since).getTime();
    const perMs = perDay / 86_400_000;
    const read = () => setCount(baseline + Math.max(0, Math.floor((Date.now() - origin) * perMs)));

    read();

    const stillMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (tickSeconds <= 0 || stillMotion) return;

    const id = window.setInterval(read, tickSeconds * 1000);
    return () => window.clearInterval(id);
  }, [baseline, since, perDay, tickSeconds]);

  return (
    <div
      className={cn("ds-visits", className)}
      aria-label={count === null ? label : `${label}: ${count.toLocaleString("en-IN")}`}
      {...rest}
    >
      <Icon name="visibility" size={16} className="ds-visits__icon" />
      <span className="ds-visits__label" aria-hidden="true">
        {label}
      </span>
      <span className="ds-visits__value" aria-hidden="true">
        {count === null ? " " : count.toLocaleString("en-IN")}
      </span>
    </div>
  );
}
