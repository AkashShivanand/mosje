import * as React from "react";
import "./forms.css";

export type FormHeadingLevel = 2 | 3 | 4;

/**
 * The sub-section head the handoff draws: an uppercase label, an optional badge, a hairline
 * rule filling the rest of the row, and optional actions at its end. Shared by FormSection,
 * FormCard and ReviewSection so every sub-section in the estate opens the same way.
 */
export function FormSectionHead({
  id,
  title,
  as = 3,
  required,
  badge,
  actions,
}: {
  id: string;
  title: React.ReactNode;
  as?: FormHeadingLevel;
  required?: boolean;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  const Heading = `h${as}` as const;
  return (
    <div className="ds-form-section__head-row">
      <Heading id={id} className="ds-form-section__title">
        {title}
        {required && (
          <span className="ds-field__required" aria-hidden="true">
            *
          </span>
        )}
      </Heading>
      {badge && <span className="ds-form-section__badge">{badge}</span>}
      {actions && <div className="ds-form-section__actions">{actions}</div>}
    </div>
  );
}
