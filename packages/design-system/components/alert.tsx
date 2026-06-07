"use client";

import * as React from "react";
import { cn } from "../cn";
import "./feedback.css";

export type AlertStatus = "success" | "warning" | "info" | "error";

export interface AlertProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Semantic status. Maps info→primary, success→success, warning→warning, error→danger. @default "info" */
  status?: AlertStatus;
  /** Bold heading line. */
  title?: React.ReactNode;
  /** Description / body content. */
  children?: React.ReactNode;
  /** Show a close button. */
  dismissible?: boolean;
  /** Called when the close button is activated. */
  onDismiss?: () => void;
  /** Optional inline action(s) (e.g. text buttons) shown under the body. */
  action?: React.ReactNode;
  /** Optional timestamp shown top-right. */
  timestamp?: string;
}

const ICONS: Record<AlertStatus, React.ReactNode> = {
  success: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
      <path
        d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"
        fill="currentColor"
        opacity="0.16"
      />
      <path
        d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1.2 14.2-4-4 1.4-1.4 2.6 2.6 5.6-5.6L17.8 9l-7 7.2Z"
        fill="currentColor"
      />
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
      <path
        d="M12 3 2 20h20L12 3Z"
        fill="currentColor"
        opacity="0.16"
      />
      <path
        d="M12 3 1 21h22L12 3Zm1 14h-2v-2h2v2Zm0-4h-2V9h2v4Z"
        fill="currentColor"
      />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
      <path
        d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"
        fill="currentColor"
        opacity="0.16"
      />
      <path
        d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15h-2v-6h2v6Zm0-8h-2V7h2v2Z"
        fill="currentColor"
      />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
      <path
        d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"
        fill="currentColor"
        opacity="0.16"
      />
      <path
        d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15h-2v-2h2v2Zm0-4h-2V7h2v6Z"
        fill="currentColor"
      />
    </svg>
  ),
};

/**
 * MoSJE / UX4G Alert atom.
 *
 * Status-coloured banner with a leading icon, tinted left border + surface,
 * optional title, description, inline action, timestamp and dismiss control.
 * Renders `role="alert"`; styled via `.ds-alert*` semantic classes.
 */
export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  function Alert(
    {
      status = "info",
      title,
      children,
      dismissible = false,
      onDismiss,
      action,
      timestamp,
      className,
      ...rest
    },
    ref,
  ) {
    return (
      <div
        ref={ref}
        role="alert"
        className={cn("ds-alert", `ds-alert--${status}`, className)}
        {...rest}
      >
        <span className="ds-alert__icon" aria-hidden="true">
          {ICONS[status]}
        </span>

        <div className="ds-alert__content">
          {(title != null || timestamp != null) && (
            <div className="ds-alert__head">
              {title != null && <p className="ds-alert__title">{title}</p>}
              {timestamp != null && (
                <span className="ds-alert__timestamp">{timestamp}</span>
              )}
            </div>
          )}
          {children != null && (
            <div className="ds-alert__body">{children}</div>
          )}
          {action != null && <div className="ds-alert__action">{action}</div>}
        </div>

        {dismissible && (
          <button
            type="button"
            className="ds-alert__close"
            onClick={onDismiss}
            aria-label="Dismiss"
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M6 6l12 12M18 6 6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </div>
    );
  },
);
