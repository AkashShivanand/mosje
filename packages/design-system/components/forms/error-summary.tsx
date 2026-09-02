"use client";

import * as React from "react";

import { cn } from "../../utils/cn";
import "./error-summary.css";

export interface ErrorSummaryItem {
  /**
   * The `id` of the control this error belongs to.
   *
   * It is the link target AND the element that receives focus, so it must be
   * the id of the CONTROL, not of its wrapper — `FormField` hands you exactly
   * that id in its render prop.
   */
  fieldId: string;
  /** The message, in the citizen's words. See the voice note below. */
  message: React.ReactNode;
}

export interface ErrorSummaryProps {
  /** In the order the fields appear in the form. Empty renders nothing. */
  errors: ErrorSummaryItem[];
  /** @default "There Is a Problem" */
  title?: React.ReactNode;
  /**
   * Move focus to the summary when it appears. @default true
   *
   * This is the whole point of the component, so think hard before turning it
   * off: a submit that fails silently leaves a screen-reader user on the
   * button, with the errors somewhere above them and nothing said.
   */
  autoFocus?: boolean;
  /** Heading level, so the summary fits the page's outline. @default 2 */
  headingLevel?: 2 | 3 | 4;
  className?: string;
  id?: string;
}

/**
 * SAMAVESH ErrorSummary — the list at the top of a form that failed.
 *
 * **What it is for.** `FormField` already marks each bad field and announces
 * its own message. That serves a reader who is AT the field. It does nothing
 * for the reader who just pressed Submit at the bottom of a nineteen-field
 * scheme application and needs to know what went wrong and where. Without a
 * summary the page simply re-renders, focus stays on the button, and a screen
 * reader says nothing at all.
 *
 * **The pattern is GOV.UK's**, and it is the one every government design system
 * converges on because it is the only arrangement that satisfies WCAG 3.3.1
 * (Error Identification) for a long form rather than for a single input.
 *
 * ── THE THREE THINGS THAT MAKE IT WORK ──────────────────────────────────────
 *
 * 1. **It takes focus when it appears.** The container is `tabIndex={-1}` and
 *    is focused when the error set changes — not on every render, which would
 *    yank focus away from someone correcting a field.
 * 2. **Each entry moves focus to the CONTROL**, not merely to an anchor. A bare
 *    `href="#id"` scrolls and, in several browsers, leaves focus behind on the
 *    link; the citizen then tabs from the wrong place. The click handler calls
 *    `focus()` on the target, and the `href` is kept so the entry is still a
 *    real link for anyone who opens it another way.
 * 3. **It is ordered like the form.** The caller passes errors in field order;
 *    this component does not sort. A summary that lists the last field first
 *    sends the reader up and down the page.
 *
 * ── VOICE ───────────────────────────────────────────────────────────────────
 *
 * A message is the citizen's answer, not the validator's. "Enter the date the
 * certificate was issued" — not "dateOfIssue is required", not "Invalid input".
 * `ui-restraint-and-copy.md` governs this and it matters most here, because
 * this is the one place a reader is already frustrated.
 */
export function ErrorSummary({
  errors,
  title = "There Is a Problem",
  autoFocus = true,
  headingLevel = 2,
  className,
  id,
}: ErrorSummaryProps): React.JSX.Element | null {
  const reactId = React.useId();
  const baseId = id ?? reactId;
  const titleId = `${baseId}-title`;
  const ref = React.useRef<HTMLDivElement>(null);

  // Keyed on the ERROR SET, not on every render. Re-focusing whenever the
  // parent re-renders would pull the citizen out of the field they are fixing.
  const signature = errors.map((e) => e.fieldId).join("|");
  React.useEffect(() => {
    if (autoFocus && signature) ref.current?.focus();
  }, [autoFocus, signature]);

  if (errors.length === 0) return null;

  const Heading = `h${headingLevel}` as "h2" | "h3" | "h4";

  return (
    <div
      ref={ref}
      id={baseId}
      // `alert` and not `region`: the summary appears in response to the
      // citizen's own submit, so it is a live message, not a landmark they
      // navigate to.
      role="alert"
      tabIndex={-1}
      aria-labelledby={titleId}
      className={cn("ds-error-summary", className)}
    >
      <Heading id={titleId} className="ds-error-summary__title">
        {title}
      </Heading>
      <ul className="ds-error-summary__list">
        {errors.map((e) => (
          <li key={e.fieldId} className="ds-error-summary__item">
            <a
              href={`#${e.fieldId}`}
              className="ds-error-summary__link"
              onClick={(event) => {
                const target = document.getElementById(e.fieldId);
                if (!target) return; // let the href do whatever it can
                event.preventDefault();
                target.focus();
                target.scrollIntoView({ block: "center", behavior: "smooth" });
              }}
            >
              {e.message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
