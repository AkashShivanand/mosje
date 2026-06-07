import * as React from "react";
import { cn } from "../cn";
import "./feedback.css";

export type LoaderSize = "sm" | "md" | "lg";
export type LoaderVariant = "primary" | "secondary";

export interface LoaderProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Spinner diameter. @default "md" */
  size?: LoaderSize;
  /** Colour role. @default "primary" */
  variant?: LoaderVariant;
  /** Accessible label, visually hidden. @default "Loading…" */
  label?: string;
}

/**
 * MoSJE / UX4G Loader atom.
 *
 * Accessible CSS spinner. Announces via `role="status"` + `aria-live="polite"`
 * with a visually-hidden label. Styled via `.ds-loader*` semantic classes.
 */
export const Loader = React.forwardRef<HTMLSpanElement, LoaderProps>(
  function Loader(
    { size = "md", variant = "primary", label = "Loading…", className, ...rest },
    ref,
  ) {
    return (
      <span
        ref={ref}
        role="status"
        aria-live="polite"
        className={cn(
          "ds-loader",
          `ds-loader--${size}`,
          `ds-loader--${variant}`,
          className,
        )}
        {...rest}
      >
        <span className="ds-loader__spinner" aria-hidden="true" />
        <span className="ds-loader__label">{label}</span>
      </span>
    );
  },
);
