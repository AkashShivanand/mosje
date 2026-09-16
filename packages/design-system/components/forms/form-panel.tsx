import * as React from "react";
import { cn } from "../../utils/cn";
import "./form-section.css";

export interface FormPanelProps {
  /**
   * The panel's heading — the step or form name. Omit it only where the page header directly
   * above already names the form (FormScreen); the head band is then not drawn.
   */
  title?: React.ReactNode;
  /** One line under the title. */
  description?: React.ReactNode;
  /** Controls at the right of the head band. */
  actions?: React.ReactNode;
  /** The action band at the foot — Back / Cancel and the primary action. */
  footer?: React.ReactNode;
  /**
   * Attributes for the action band itself — a class, or the data attributes a floating-element
   * rail reads. The Wizard uses it to mark its sticky phone bar as a surface a transient widget
   * must keep clear of (`floating-element-placement.md`). Never a substitute for `footer`.
   */
  footerProps?: React.HTMLAttributes<HTMLDivElement>;
  /** Heading level of the title. A portal screen's h1 is its page header. @default 2 */
  as?: 2 | 3;
  children: React.ReactNode;
  className?: string;
}

/**
 * MoSJE / SAMAVESH FormPanel — the one card a form or wizard step lives in.
 *
 * A tinted head band (title and one line of description), the body holding
 * {@link FormSection}s 32 apart, and a tinted action band. This is the handoff's form
 * grammar: the step is the card, the sub-sections are not.
 */
export function FormPanel({ title, description, actions, footer, footerProps, as = 2, children, className }: FormPanelProps) {
  const headingId = React.useId();
  const Heading = `h${as}` as const;
  return (
    <section aria-labelledby={title ? headingId : undefined} className={cn("ds-form-panel", className)}>
      {title && (
        <div className="ds-form-panel__head">
          <div>
            <Heading id={headingId} className="ds-form-panel__title">
              {title}
            </Heading>
            {description && <p className="ds-form-panel__desc">{description}</p>}
          </div>
          {actions && <div className="ds-form-panel__head-actions">{actions}</div>}
        </div>
      )}
      <div className="ds-form-panel__body">{children}</div>
      {footer && (
        <div {...footerProps} className={cn("ds-form-panel__foot", footerProps?.className)}>
          {footer}
        </div>
      )}
    </section>
  );
}
