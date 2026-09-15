import * as React from "react";
import { cn } from "../../utils/cn";
import { FormSectionHead, type FormHeadingLevel } from "./form-section-head";
import "./form-section.css";

export interface FormSectionProps {
  /**
   * Sub-section label, rendered uppercase with a hairline rule filling the rest of the row.
   * Omit it only when the panel holds this one section and the panel's own title already names it.
   */
  title?: React.ReactNode;
  /** One sentence under the head — only where it changes what the applicant enters. */
  description?: React.ReactNode;
  /** Responsive field-grid columns. Wide fields take `className="ds-form-span-full"`. @default 3 */
  columns?: 1 | 2 | 3 | 4;
  /** Heading level. A sub-section sits under its panel's h2. @default 3 */
  as?: FormHeadingLevel;
  /** A badge between the label and the rule — "DigiLocker", "Verified". */
  badge?: React.ReactNode;
  /** Controls at the end of the head row — "Edit" on a review step. */
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/**
 * MoSJE / SAMAVESH FormSection — one sub-section of a form: an uppercase label with a rule,
 * over a 1–4 column field grid that collapses on smaller screens.
 *
 * It is NOT a card. The card is the {@link FormPanel} (or the Wizard's step panel) that holds
 * the sub-sections, as every form in the handoff draws it.
 */
export function FormSection({
  title,
  description,
  columns = 3,
  as = 3,
  badge,
  actions,
  children,
  className,
}: FormSectionProps) {
  const headingId = React.useId();
  return (
    <section aria-labelledby={title ? headingId : undefined} className={cn("ds-form-section", className)}>
      {title && <FormSectionHead id={headingId} title={title} as={as} badge={badge} actions={actions} />}
      {description && <p className="ds-form-section__desc">{description}</p>}
      <div className={cn("ds-form-section__grid", `ds-form-section__grid--${columns}`)}>{children}</div>
    </section>
  );
}
