"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { Icon } from "../utilities/icon";
import { useFieldCopy, useFieldPolicy } from "./field-policy";
import type { FieldStatus } from "./field-types";
import "./forms.css";

/**
 * THE COMPOSABLE HALF OF THE FIELD STACK.
 *
 * `FormField` is the ergonomic API and covers almost every field on the estate.
 * These are the parts it is built from, exported so a screen that genuinely
 * needs a different arrangement — a label beside its control, a message in a
 * table cell, a hint shared by three inputs — can assemble one without
 * re-implementing the accessibility.
 *
 * **Ids are DERIVED, not registered.** A compound component that discovers its
 * children through context and an effect cannot compose `aria-describedby`
 * until after hydration, so the server sends a control with no description and
 * a screen reader reaching it first hears nothing. `useFieldIds` computes every
 * id up front from one `useId`, and the caller says which parts exist. It is
 * less magical and it is correct on the first paint, which is the half that
 * matters.
 */

export type FieldPart = "hint" | "help" | "message" | "count";

export interface FieldIds {
  /** For the control, and the label's `htmlFor`. */
  control: string;
  hint: string;
  help: string;
  message: string;
  count: string;
  /**
   * Composes `aria-describedby` from the parts actually rendered, in reading
   * order, merging any ids the caller supplies. Returns `undefined` rather than
   * an empty string, so the attribute is omitted when there is nothing to say.
   */
  describedBy: (present: Partial<Record<FieldPart, boolean>> & { extra?: string }) => string | undefined;
}

/**
 * Every id one field needs, derived from a single `useId`.
 *
 * @param id Supply one to control it yourself — a server-rendered form that
 *   links an error summary to its fields needs stable, known ids.
 */
export function useFieldIds(id?: string): FieldIds {
  const generated = React.useId();
  const base = id ?? generated;
  return React.useMemo<FieldIds>(() => {
    const ids = {
      control: base,
      hint: `${base}-hint`,
      help: `${base}-help`,
      message: `${base}-message`,
      count: `${base}-count`,
    };
    return {
      ...ids,
      describedBy: ({ hint, help, message, count, extra }) =>
        [
          hint === true ? ids.hint : undefined,
          help === true ? ids.help : undefined,
          message === true ? ids.message : undefined,
          count === true ? ids.count : undefined,
          extra,
        ]
          .filter(Boolean)
          .join(" ") || undefined,
    };
  }, [base]);
}

export interface FieldLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /** Append the policy's mandatory marker. */
  required?: boolean;
  /** Append the policy's optional wording. */
  optional?: boolean;
  /** Hide visually, keep for assistive tech. */
  visuallyHidden?: boolean;
}

/**
 * The field's label, carrying whichever necessity mark the form's policy calls
 * for. The mandatory marker is `aria-hidden` because the control's `required`
 * attribute is what a screen reader announces, and it says "required" rather
 * than "star"; the optional wording is left readable, because there is no
 * attribute for it to announce instead.
 */
export const FieldLabel = React.forwardRef<HTMLLabelElement, FieldLabelProps>(
  function FieldLabel({ required, optional, visuallyHidden, className, children, ...rest }, ref) {
    const { necessity, copy } = useFieldPolicy();
    const showMarker = required === true && necessity === "required";
    const showOptional = necessity === "optional" && (optional === true || required !== true);
    return (
      <label
        ref={ref}
        className={cn("ds-field__label", visuallyHidden && "ds-sr-only", className)}
        data-required={required || undefined}
        {...rest}
      >
        {children}
        {showMarker && (
          <span className="ds-field__required" aria-hidden="true">
            {copy.requiredMarker}
          </span>
        )}
        {showOptional && <span className="ds-field__optional">{copy.optionalSuffix}</span>}
      </label>
    );
  },
);

export type FieldHintProps = React.HTMLAttributes<HTMLParagraphElement>;

/** Helper text. Sits below the control, as UX4G's Caption does. */
export const FieldHint = React.forwardRef<HTMLParagraphElement, FieldHintProps>(
  function FieldHint({ className, ...rest }, ref) {
    return <p ref={ref} className={cn("ds-field__hint", className)} {...rest} />;
  },
);

export interface FieldMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  status: FieldStatus;
  /** Replace the leading glyph. Pass `null` to drop it. */
  icon?: React.ReactNode;
}

const DEFAULT_STATUS_ICON: Record<FieldStatus, string> = {
  error: "error",
  warning: "warning",
  success: "check_circle",
};

/**
 * A status message under a field.
 *
 * Three channels, never one: the words themselves, a glyph, and a
 * visually-hidden prefix naming the status, so a screen reader hears
 * "Error: enter a valid…" rather than a sentence whose severity is carried
 * only by a colour it cannot see.
 */
export const FieldMessage = React.forwardRef<HTMLParagraphElement, FieldMessageProps>(
  function FieldMessage({ status, icon, className, children, ...rest }, ref) {
    const copy = useFieldCopy();
    return (
      <p
        ref={ref}
        className={cn("ds-field__message", `ds-field__message--${status}`, className)}
        data-status={status}
        {...rest}
      >
        {icon === undefined ? (
          <Icon name={DEFAULT_STATUS_ICON[status]} size={20} aria-hidden="true" />
        ) : (
          icon
        )}
        <span className="ds-sr-only">{copy.statusPrefix[status]}</span>
        <span>{children}</span>
      </p>
    );
  },
);

export interface FieldHelpToggleProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "aria-expanded"> {
  open: boolean;
  /** The field's label, used to build the button's accessible name. */
  labelText: string;
  /** Replace the glyph. */
  icon?: React.ReactNode;
}

/**
 * The button that reveals a field's contextual help.
 *
 * A disclosure, not a tooltip: a tooltip cannot be opened by touch, cannot be
 * read at leisure, and vanishes the moment a reader moves to answer the
 * question it was explaining.
 */
export const FieldHelpToggle = React.forwardRef<HTMLButtonElement, FieldHelpToggleProps>(
  function FieldHelpToggle({ open, labelText, icon, className, ...rest }, ref) {
    const copy = useFieldCopy();
    return (
      <button
        ref={ref}
        type="button"
        className={cn("ds-field__help-toggle", className)}
        aria-expanded={open}
        {...rest}
      >
        {icon ?? <Icon name="help" size={20} aria-hidden="true" />}
        <span className="ds-sr-only">{copy.helpToggleLabel(labelText, open)}</span>
      </button>
    );
  },
);

export type FieldHelpProps = React.HTMLAttributes<HTMLParagraphElement>;

/** The revealed help text. Rendered even while shut, so `aria-controls` resolves. */
export const FieldHelp = React.forwardRef<HTMLParagraphElement, FieldHelpProps>(
  function FieldHelp({ className, ...rest }, ref) {
    return <p ref={ref} className={cn("ds-field__help", className)} {...rest} />;
  },
);
