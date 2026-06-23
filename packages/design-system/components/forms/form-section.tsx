import * as React from "react";
import { cn } from "../../utils/cn";
import "./form-section.css";

export interface FormSectionProps {
  /** Section heading (left-aligned, matching the Figma form sections). */
  title: React.ReactNode;
  /** Optional sub-heading below the title. */
  description?: React.ReactNode;
  /** Responsive field-grid columns. @default 3 */
  columns?: 1 | 2 | 3;
  children: React.ReactNode;
  className?: string;
}

/**
 * MoSJE / SAMAVESH FormSection — a titled card wrapping a responsive field grid.
 *
 * The shared form-layout primitive: a surface card with a left-aligned section
 * title (+ optional description) over a 1/2/3-column field grid that collapses
 * on smaller screens. Token-driven CSS.
 */
export function FormSection({ title, description, columns = 3, children, className }: FormSectionProps) {
  const headingId = React.useId();
  return (
    <section aria-labelledby={headingId} className={cn("ds-form-section", className)}>
      <div className="ds-form-section__head">
        <h2 id={headingId} className="ds-form-section__title">
          {title}
        </h2>
        {description && <p className="ds-form-section__desc">{description}</p>}
      </div>
      <div className={cn("ds-form-section__grid", `ds-form-section__grid--${columns}`)}>{children}</div>
    </section>
  );
}
