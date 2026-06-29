import * as React from "react";
import { cn } from "../../utils/cn";
import "./metric-card.css";

export type MetricCardSize = "sm" | "md";
export type MetricCardChange = "up" | "down" | "flat";

export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Descriptor label (small, muted). */
  label: string;
  /** The primary metric value — pass a pre-formatted string (e.g. "22,75,906"). */
  value: string;
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
 * reference design tokens (--ds-*). No Tailwind, no hardcoded values.
 */
export const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
  function MetricCard(
    {
      label,
      value,
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
    return (
      <div
        ref={ref}
        className={cn("ds-metric-card", size !== "md" && `ds-metric-card--${size}`, className)}
        aria-label={`${label}: ${value}`}
        {...rest}
      >
        <div className="ds-metric-card__inner">
          <div className="ds-metric-card__body">
            <div className="ds-metric-card__label">{label}</div>
            <div className="ds-metric-card__value">{value}</div>
          </div>
          {icon != null && (
            <div className="ds-metric-card__icon" aria-hidden="true">
              {icon}
            </div>
          )}
        </div>
        {changeValue != null && changeDirection !== "flat" ? (
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
