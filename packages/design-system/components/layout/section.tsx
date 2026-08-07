import * as React from "react";
import { cn } from "../../utils/cn";
import "./section.css";

export interface SectionTitleProps {
  /** Small uppercase kicker above the title. */
  eyebrow?: string;
  /** The section heading text. */
  title?: string;
  /** Supporting sentence below the title. */
  description?: string;
  /** Count pill rendered beside the title (e.g. number of rows). */
  count?: number | string;
  /**
   * Heading level. Pick the one that keeps the page outline sequential —
   * a section inside an `<h1>` page should be `h2`. @default 2
   */
  as?: 2 | 3 | 4;
  /** Set on the heading so a table/list can point `aria-labelledby` at it. */
  headingId?: string;
  /** Trailing actions (buttons, filters) aligned to the right. */
  children?: React.ReactNode;
  className?: string;
}

/**
 * MoSJE / SAMAVESH SectionTitle.
 *
 * The standard heading row for a content section: eyebrow, heading, optional
 * count pill, description, and right-aligned actions. Use it instead of
 * hand-rolling a `<div className="flex justify-between">` with its own heading
 * classes, so section headers stay identical estate-wide.
 *
 * For a *form* section use `<FormSection>`/`<FormCard>` — those own the card
 * chrome and the fieldset semantics. This is the plain-content equivalent.
 */
export function SectionTitle({
  eyebrow,
  title,
  description,
  count,
  as = 2,
  headingId,
  children,
  className,
}: SectionTitleProps): React.JSX.Element {
  const Heading = `h${as}` as const;

  return (
    <div className={cn("ds-section-title", className)}>
      <div className="ds-section-title__text">
        {eyebrow != null && (
          <div className="ds-section-title__eyebrow">{eyebrow}</div>
        )}

        {title != null && (
          <div className="ds-section-title__headline">
            <Heading id={headingId} className="ds-section-title__heading">
              {title}
            </Heading>
            {count !== undefined && (
              <span className="ds-section-title__count">{count}</span>
            )}
          </div>
        )}

        {description != null && (
          <p className="ds-section-title__description">{description}</p>
        )}
      </div>

      {children != null && (
        <div className="ds-section-title__actions">{children}</div>
      )}
    </div>
  );
}
