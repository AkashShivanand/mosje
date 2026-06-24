import * as React from "react";
import { cn } from "../../utils/cn";
import "./form-section.css";

export interface FormCardProps {
  /** Section heading — styled identically to {@link FormSection}'s title. */
  title: React.ReactNode;
  /** Optional sub-heading below the title. */
  description?: React.ReactNode;
  /** Append the accessible required marker (*) to the title. */
  required?: boolean;
  /** Explicit heading id — pass this when a child needs `aria-labelledby`. */
  headingId?: string;
  /** Optional right-aligned controls in the header row (e.g. a small action). */
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/**
 * MoSJE / SAMAVESH FormCard — a titled surface card with a custom body.
 *
 * The sibling of {@link FormSection}: same card chrome and section-title styling,
 * but the body is arbitrary children instead of a field grid. Use it for sections
 * whose layout isn't a simple 1/2/3-column grid — repeatable cards, tables, or
 * mixed content — so every section header across the estate stays visually
 * identical. Token-driven CSS (shares `form-section.css`).
 */
export function FormCard({
  title,
  description,
  required,
  headingId,
  actions,
  children,
  className,
}: FormCardProps) {
  const reactId = React.useId();
  const id = headingId ?? reactId;
  return (
    <section aria-labelledby={id} className={cn("ds-form-section", className)}>
      <div className="ds-form-section__head">
        <div className="ds-form-section__head-row">
          <h2 id={id} className="ds-form-section__title">
            {title}
            {required && (
              <span className="ds-field__required" aria-hidden="true">
                *
              </span>
            )}
          </h2>
          {actions && <div className="ds-form-section__actions">{actions}</div>}
        </div>
        {description && <p className="ds-form-section__desc">{description}</p>}
      </div>
      {children}
    </section>
  );
}
