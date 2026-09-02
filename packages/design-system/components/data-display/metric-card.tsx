import * as React from "react";
import { cn } from "../../utils/cn";
import { cardStateCopy, type CardStateKind } from "../dashboard/card-state";
import "./metric-card.css";

export type MetricCardSize = "sm" | "md";
export type MetricCardChange = "up" | "down" | "flat";

export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Descriptor label (small, muted). */
  label: string;
  /**
   * The primary metric value — a pre-formatted string (e.g. "22,75,906").
   *
   * **Optional**, and it was not. A required string made "still arriving" and
   * "did not arrive" inexpressible, so every call site with no figure passed
   * `"—"` — and the card then announced *"Total beneficiaries: —"*, which is
   * not a reading of anything. Pass `loading` or `state` instead and leave this
   * out; the card writes both the visible answer and the spoken one.
   */
  value?: string;
  /**
   * The figure is still arriving. The tile keeps its exact height and shimmers
   * where the value will be, so a row of six does not reflow when they land.
   */
  loading?: boolean;
  /**
   * Why there is no figure. Uses `CardState`'s own words, so a tile and the
   * chart beside it describe one failed request with one sentence.
   *
   * `loading` wins where both are given: a card cannot be waiting AND finished.
   */
  state?: CardStateKind;
  /** Optional icon rendered in a tinted badge top-right. */
  icon?: React.ReactNode;
  /** Optional change direction arrow + label (e.g. "+12% vs last month"). */
  changeLabel?: string;
  /**
   * Optional delta shown in a tinted pill before `changeLabel` (e.g. "12%").
   * When set with a non-flat direction, the arrow + this value render as a
   * success/danger pill and `changeLabel` becomes a muted suffix — matching the
   * SAMAVESH KPI card. Omit for the legacy inline-text treatment.
   */
  changeValue?: string;
  /** Visual direction of the change. @default "flat" */
  changeDirection?: MetricCardChange;
  /** Control density. @default "md" */
  size?: MetricCardSize;
}

/** Screen-reader text so trend direction isn't conveyed by colour/arrow alone (WCAG 1.4.1 / 1.1.1). */
const CHANGE_LABELS: Record<MetricCardChange, string> = {
  up: "Increase",
  down: "Decrease",
  flat: "No change",
};

const CHANGE_ARROWS: Record<MetricCardChange, React.ReactNode> = {
  up: (
    <svg viewBox="0 0 16 16" width="12" height="12" fill="none" aria-hidden="true">
      <path d="M8 12V4M4 8l4-4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  down: (
    <svg viewBox="0 0 16 16" width="12" height="12" fill="none" aria-hidden="true">
      <path d="M8 4v8M4 8l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  flat: (
    <svg viewBox="0 0 16 16" width="12" height="12" fill="none" aria-hidden="true">
      <path d="M3 8h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
};

/**
 * MoSJE / SAMAVESH MetricCard — stat display tile.
 *
 * Shows a label + a large formatted value + an optional icon badge and optional
 * change indicator. Styled via `.ds-metric-card*` semantic CSS classes that
 * reference design tokens (--sa-*). No Tailwind, no hardcoded values.
 */
export const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
  function MetricCard(
    {
      label,
      value,
      loading = false,
      state,
      icon,
      changeLabel,
      changeValue,
      changeDirection = "flat",
      size = "md",
      className,
      ...rest
    },
    ref,
  ) {
    /*
     * ONE EXPRESSION, and everything below reads it — the value, the accessible
     * name, and whether the change indicator is drawn at all. A tile that shows
     * "could not be loaded" above "+12% vs last month" is contradicting itself
     * about the same request.
     */
    const copy = !loading && state ? cardStateCopy(state) : null;
    const settled = !loading && copy === null;
    /* What the tile is actually saying, in the words a screen reader gets. The
       old `${label}: ${value}` announced "Total beneficiaries: —" whenever a
       call site had nothing, which is a punctuation mark read as a figure. */
    const spoken = loading ? "Loading" : (copy?.title ?? value ?? "Not reported");
    return (
      <div
        ref={ref}
        className={cn("ds-metric-card", size !== "md" && `ds-metric-card--${size}`, className)}
        aria-label={`${label}: ${spoken}`}
        {...(loading ? { "aria-busy": true } : {})}
        {...rest}
      >
        <div className="ds-metric-card__inner">
          <div className="ds-metric-card__body">
            <div className="ds-metric-card__label">{label}</div>
            {loading ? (
              <div
                className="ds-metric-card__value ds-metric-card__value--loading"
                aria-hidden="true"
              />
            ) : copy ? (
              /* The state's HEADLINE, at reading size rather than figure size —
                 a sentence set in 24px bold reads as a number and is the wrong
                 shape for the tile it is in. */
              <div className="ds-metric-card__value ds-metric-card__value--state">
                {copy.title}
              </div>
            ) : (
              <div className="ds-metric-card__value">{value ?? "—"}</div>
            )}
          </div>
          {icon != null && (
            <div className="ds-metric-card__icon" aria-hidden="true">
              {icon}
            </div>
          )}
        </div>
        {/* SUPPRESSED WHERE THERE IS NO FIGURE. "+12% vs last month" under "This
            could not be loaded" is indistinguishable from a live finding — the
            same reason `ChartCard` drops its footer and its export control. */}
        {!settled ? null : changeValue != null && changeDirection !== "flat" ? (
          <div className="ds-metric-card__change">
            <span className={cn("ds-metric-card__pill", `ds-metric-card__pill--${changeDirection}`)}>
              <span className="ds-sr-only">{CHANGE_LABELS[changeDirection]}: </span>
              {CHANGE_ARROWS[changeDirection]}
              {changeValue}
            </span>
            {changeLabel != null && <span className="ds-metric-card__suffix">{changeLabel}</span>}
          </div>
        ) : (
          changeLabel != null && (
            <div className={cn("ds-metric-card__change", `ds-metric-card__change--${changeDirection}`)}>
              <span className="ds-sr-only">{CHANGE_LABELS[changeDirection]}: </span>
              {CHANGE_ARROWS[changeDirection]}
              {changeLabel}
            </div>
          )
        )}
      </div>
    );
  },
);
