"use client";

import * as React from "react";
import { cn } from "../cn";
import "./forms.css";

/** Wiring passed to the control rendered inside a FormField. */
export interface FormFieldControlProps {
  id: string;
  invalid: boolean;
  "aria-describedby"?: string;
}

export interface FormFieldProps {
  /** Visible field label (associated with the control via htmlFor). */
  label: React.ReactNode;
  /** Control id; auto-generated when omitted. */
  id?: string;
  /** Helper text rendered below the label, linked via aria-describedby. */
  hint?: React.ReactNode;
  /** Error message; when set the field renders the error state + role="alert". */
  error?: React.ReactNode;
  /** Mark the field as required (adds a marker + `required` to the control). */
  required?: boolean;
  className?: string;
  /**
   * Render-prop receiving the wiring for the control:
   * `{ id, invalid, "aria-describedby" }`. Spread it onto Input/Select/Textarea.
   */
  children: (control: FormFieldControlProps) => React.ReactNode;
}

/**
 * MoSJE / SAMAVESH FormField molecule.
 *
 * Accessibly wires a label, optional hint, and optional error to any control:
 * - label `htmlFor` ↔ control `id`
 * - `aria-describedby` links hint + error to the control
 * - `aria-invalid` + `role="alert"` on the error so screen readers announce it
 */
export function FormField({
  label,
  id,
  hint,
  error,
  required = false,
  className,
  children,
}: FormFieldProps): React.JSX.Element {
  const reactId = React.useId();
  const fieldId = id ?? reactId;
  const hintId = hint != null ? `${fieldId}-hint` : undefined;
  const errorId = error != null ? `${fieldId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("ds-field", className)}>
      <label htmlFor={fieldId} className="ds-field__label">
        {label}
        {required && (
          <span className="ds-field__required" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {hint != null && (
        <p id={hintId} className="ds-field__hint">
          {hint}
        </p>
      )}

      {children({
        id: fieldId,
        invalid: error != null,
        "aria-describedby": describedBy,
      })}

      {error != null && (
        <p id={errorId} className="ds-field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
