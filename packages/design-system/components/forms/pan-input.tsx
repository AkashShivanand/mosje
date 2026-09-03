"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import type { FieldSize } from "./field-types";
import { formatPan, isValidPan } from "../../utils/india-id";
import "./forms.css";
import "./india-id.css";

export interface PanInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange" | "type" | "maxLength" | "size"
  > {
  /** The normalised PAN (uppercase, alphanumeric, ≤10). Controlled. */
  value: string;
  /** Called with the normalised value — already uppercased and stripped. */
  onValueChange: (pan: string) => void;
  /** Render the error state (sets aria-invalid). @default false */
  invalid?: boolean;
  /**
   * Control height, matching the Input scale. Declared here because the native
   * `size` attribute on an `<input>` means character width, which is not a thing
   * this control has — it is a fixed-length identity number.
   * @default "md"
   */
  size?: FieldSize;
}

/**
 * MoSJE / SAMAVESH PAN input. (UX4G 3.0 "Input - Pan Card")
 *
 * Ten characters in the `AAAAA9999A` shape. Uppercases as you type, so nobody is told off
 * for typing their own PAN in lower case, and validates the fourth character against the
 * holder-type codes — a PAN whose fourth character is not one of `PCHFATBLJGE` is malformed
 * no matter how well the rest matches.
 *
 * `onValueChange` receives the normalised value, so what reaches your state is always
 * storage-ready.
 *
 * @example
 * <FormField label="PAN" hint="10 characters, as printed on your PAN card"
 *            error={touched && !ok ? "Enter a valid PAN, e.g. ABCPE1234F" : undefined}>
 *   {(f) => <PanInput {...f} value={pan} onValueChange={setPan} />}
 * </FormField>
 */
export const PanInput = React.forwardRef<HTMLInputElement, PanInputProps>(
  function PanInput({ value, onValueChange, invalid = false, size = "md", className, ...rest }, ref) {
    const complete = value.length === 10;

    return (
      <input
        ref={ref}
        type="text"
        className={cn("ds-input", `ds-input--${size}`, "ds-input--pan", className)}
        data-size={size}
        value={value}
        onChange={(e) => onValueChange(formatPan(e.target.value))}
        inputMode="text"
        // A PAN is not a word: autocorrect and autocapitalise both fight the user here.
        autoComplete="off"
        autoCapitalize="characters"
        autoCorrect="off"
        spellCheck={false}
        maxLength={10}
        placeholder="ABCPE1234F"
        aria-invalid={invalid || (complete && !isValidPan(value)) || undefined}
        {...rest}
      />
    );
  },
);
