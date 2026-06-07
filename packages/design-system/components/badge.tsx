import * as React from "react";
import { cn } from "../cn";
import "./badge.css";

export type BadgeStatus = "primary" | "success" | "danger" | "warning" | "neutral";
export type BadgeSize = "sm" | "lg";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Semantic colour role. Drives the tonal background + text. @default "neutral" */
  status?: BadgeStatus;
  /** Pill size. @default "sm" */
  size?: BadgeSize;
}

/**
 * MoSJE / UX4G Badge atom.
 *
 * A small pill label used for counts, statuses and tags. Tonal background of
 * the status colour with readable text. Styled entirely via semantic CSS
 * classes that reference design tokens (--ds-*). No Tailwind, no deps.
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  function Badge(
    { status = "neutral", size = "sm", className, children, ...rest },
    ref,
  ) {
    return (
      <span
        ref={ref}
        className={cn(
          "ds-badge",
          `ds-badge--${status}`,
          `ds-badge--${size}`,
          className,
        )}
        {...rest}
      >
        {children}
      </span>
    );
  },
);
