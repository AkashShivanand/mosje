import * as React from "react";
import { cn } from "../../utils/cn";
import "./feedback.css";

export interface EmptyStateProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Optional illustration or icon. */
  icon?: React.ReactNode;
  /** Headline. */
  title: React.ReactNode;
  /** Supporting description. */
  description?: React.ReactNode;
  /** Optional call-to-action (e.g. a button). */
  action?: React.ReactNode;
}

/**
 * MoSJE / UX4G EmptyState atom.
 *
 * Centered placeholder for empty collections / zero-result views:
 * optional icon, title, description and action. Styled via `.ds-empty*`.
 */
export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  function EmptyState(
    { icon, title, description, action, className, ...rest },
    ref,
  ) {
    return (
      <div ref={ref} className={cn("ds-empty", className)} {...rest}>
        {icon != null && (
          <div className="ds-empty__icon" aria-hidden="true">
            {icon}
          </div>
        )}
        <p className="ds-empty__title">{title}</p>
        {description != null && (
          <p className="ds-empty__description">{description}</p>
        )}
        {action != null && <div className="ds-empty__action">{action}</div>}
      </div>
    );
  },
);
