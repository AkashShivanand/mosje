"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { Checkbox } from "./checkbox";
import "./declaration-checkbox.css";

export interface DeclarationCheckboxProps {
  /** Controlled checked state. */
  checked: boolean;
  /** Called with the next checked state. */
  onChange: (checked: boolean) => void;
  /**
   * The certification statement. Use a `<ul>` when the declaration covers
   * several points, so each is separately readable.
   */
  children: React.ReactNode;
  /** Panel heading. @default "Declaration" */
  title?: React.ReactNode;
  /** Leading line above the statement. @default "I certify that:" */
  lead?: React.ReactNode;
  /** Error message shown when submission was attempted unchecked. */
  error?: React.ReactNode;
  /**
   * Sets the error state without supplying a message. It exists so that
   * spreading `FormField`'s render-prop object onto this component degrades
   * rather than breaks: `FormField` hands over `invalid`, this component asks
   * for `error`, and before this alias the field simply lost its error state.
   * A message is still better — prefer `error`.
   */
  invalid?: boolean;
  disabled?: boolean;
  id?: string;
  className?: string;
}

/**
 * MoSJE / SAMAVESH DeclarationCheckbox.
 *
 * The statutory certification block that closes a government form: a bordered
 * panel carrying the declaration text with a single required checkbox.
 *
 * Kept as its own component because the wording is legal text the user is
 * attesting to — it needs to read as a distinct, deliberate act rather than
 * one more field in a grid, and it must be announced to screen readers with
 * the statement bound to the control.
 */
export function DeclarationCheckbox({
  checked,
  onChange,
  children,
  title = "Declaration",
  lead = "I certify that:",
  error,
  invalid = false,
  disabled = false,
  id,
  className,
}: DeclarationCheckboxProps): React.JSX.Element {
  const reactId = React.useId();
  const controlId = id ?? reactId;
  const statementId = `${controlId}-statement`;
  const errorId = error != null ? `${controlId}-error` : undefined;

  return (
    <section
      className={cn("ds-declaration", error != null && "is-invalid", className)}
      aria-labelledby={`${controlId}-title`}
    >
      <h3 id={`${controlId}-title`} className="ds-declaration__title">
        {title}
      </h3>

      <div id={statementId} className="ds-declaration__statement">
        {lead && <p className="ds-declaration__lead">{lead}</p>}
        {children}
      </div>

      <Checkbox
        id={controlId}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        aria-describedby={[statementId, errorId].filter(Boolean).join(" ")}
        aria-invalid={error != null || invalid || undefined}
        label={<span className="ds-declaration__confirm">I agree to the declaration above</span>}
      />

      {error != null && (
        <p id={errorId} className="ds-declaration__error" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}
