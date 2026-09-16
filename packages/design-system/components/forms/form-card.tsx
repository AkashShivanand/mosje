import * as React from "react";
import { cn } from "../../utils/cn";
import { FormSectionHead, type FormHeadingLevel } from "./form-section-head";
import "./form-section.css";

export interface FormCardProps {
  /** Sub-section label — the same head as {@link FormSection}. */
  title: React.ReactNode;
  /** One sentence under the head. */
  description?: React.ReactNode;
  /** Append the accessible required marker (*) to the title. */
  required?: boolean;
  /** Explicit heading id — pass this when a child needs `aria-labelledby`. */
  headingId?: string;
  /** Heading level. @default 3 */
  as?: FormHeadingLevel;
  /** A badge between the label and the rule. */
  badge?: React.ReactNode;
  /** Controls at the end of the head row. */
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/**
 * MoSJE / SAMAVESH FormCard — a sub-section whose body is arbitrary content rather than a
 * field grid: repeatable entries (`FormInset`), a table, document tiles.
 *
 * Kept under its historical name; since the form-wizard visual language it draws no card of
 * its own — the surrounding {@link FormPanel} is the card.
 */
export function FormCard({
  title,
  description,
  required,
  headingId,
  as = 3,
  badge,
  actions,
  children,
  className,
}: FormCardProps) {
  const reactId = React.useId();
  const id = headingId ?? reactId;
  return (
    <section aria-labelledby={id} className={cn("ds-form-section", className)}>
      <FormSectionHead id={id} title={title} as={as} required={required} badge={badge} actions={actions} />
      {description && <p className="ds-form-section__desc">{description}</p>}
      {children}
    </section>
  );
}
