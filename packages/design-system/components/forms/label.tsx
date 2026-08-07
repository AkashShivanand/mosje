import * as React from "react";
import { cn } from "../../utils/cn";
import "./label.css";

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /** Appends a required marker (`*`) after the text. */
  required?: boolean;
  /** Secondary text rendered after the label in a lighter weight. */
  hint?: React.ReactNode;
}

/**
 * MoSJE / SAMAVESH Label atom.
 *
 * A standalone `<label>` for controls that are NOT wrapped in `<FormField>`
 * (which renders its own label and does the aria wiring for you). Reach for
 * this only when you are hand-wiring `htmlFor`/`aria-describedby` yourself —
 * e.g. labelling a checkbox row, a filter control, or a toolbar select.
 *
 * Renders a real `<label>`; no Radix, no Tailwind, no deps. The visual
 * language matches `.ds-field__label` so a standalone label and a FormField
 * label are indistinguishable side by side.
 */
export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  function Label({ required, hint, className, children, ...rest }, ref) {
    return (
      <label ref={ref} className={cn("ds-label", className)} {...rest}>
        {children}
        {required && (
          <span className="ds-label__required" aria-hidden="true">
            *
          </span>
        )}
        {hint != null && <span className="ds-label__hint">{hint}</span>}
      </label>
    );
  },
);
