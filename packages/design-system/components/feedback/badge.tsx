import * as React from "react";
import { cn } from "../../utils/cn";
import "./badge.css";

export type BadgeStatus =
  | "primary"
  | "info"
  | "success"
  | "danger"
  | "warning"
  | "neutral";
export type BadgeSize = "sm" | "lg";
/** Fill strength (Portal DS emphasis). subtle = tonal bg, solid = filled source bg. */
export type BadgeEmphasis = "subtle" | "solid";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Semantic colour role. Drives the background + text. @default "neutral" */
  status?: BadgeStatus;
  /** Pill size. @default "sm" */
  size?: BadgeSize;
  /** Fill strength. @default "subtle" */
  emphasis?: BadgeEmphasis;
  /** Show a leading status dot (Portal DS Dot badge). */
  dot?: boolean;
  /** Animate the leading dot. Implies `dot`. */
  pulse?: boolean;
}

/**
 * MoSJE / UX4G Badge atom.
 *
 * A small pill label used for counts, statuses and tags. Tonal background of
 * the status colour with readable text. Styled entirely via semantic CSS
 * classes that reference design tokens (--sa-*). No Tailwind, no deps.
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  function Badge(
    {
      status = "neutral",
      size = "sm",
      emphasis = "subtle",
      dot = false,
      pulse = false,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const showDot = dot || pulse;
    return (
      <span
        ref={ref}
        className={cn(
          "ds-badge",
          `ds-badge--${status}`,
          `ds-badge--${size}`,
          `ds-badge--${emphasis}`,
          className,
        )}
        {...rest}
      >
        {showDot && (
          <span
            className={cn("ds-badge__dot", pulse && "ds-badge__dot--pulse")}
            aria-hidden="true"
          />
        )}
        {children}
      </span>
    );
  },
);
