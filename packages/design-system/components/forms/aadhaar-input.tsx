"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import type { FieldSize } from "./field-types";
import { digitsOnly, formatAadhaar, isValidAadhaar, maskAadhaar } from "../../utils/india-id";
import "./forms.css";
import "./india-id.css";

export interface AadhaarInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange" | "type" | "maxLength" | "inputMode" | "size"
  > {
  /** The raw 12 digits, no separators. Controlled. */
  value: string;
  /** Called with raw digits (never the formatted string). */
  onValueChange: (digits: string) => void;
  /** Render the error state (sets aria-invalid). @default false */
  invalid?: boolean;
  /**
   * Control height, matching the Input scale. Declared here because the native
   * `size` attribute on an `<input>` means character width, which is not a thing
   * this control has — it is a fixed-length identity number.
   * @default "md"
   */
  size?: FieldSize;
  /**
   * Mask to the last four digits when the field is complete and not focused.
   * Leave this ON unless you have a specific, recorded reason. @default true
   */
  mask?: boolean;
}

/** Count digits in `str` up to `caret` — the position we actually need to preserve. */
function digitsBefore(str: string, caret: number): number {
  let n = 0;
  for (let i = 0; i < caret && i < str.length; i++) if (/\d/.test(str[i]!)) n++;
  return n;
}

/** Index just after the `n`th digit of `str`. */
function caretAfterDigits(str: string, n: number): number {
  if (n <= 0) return 0;
  let seen = 0;
  for (let i = 0; i < str.length; i++) {
    if (/\d/.test(str[i]!)) {
      seen++;
      if (seen === n) return i + 1;
    }
  }
  return str.length;
}

/**
 * MoSJE / SAMAVESH Aadhaar number input. (UX4G 3.0 "Input - Aadhaar")
 *
 * Twelve digits, grouped `XXXX XXXX XXXX` as you type, Verhoeff-checked so a mistyped digit
 * or a swapped pair is caught inline rather than at submission.
 *
 * **It masks by default.** An Aadhaar number is sensitive personal data under the DPDP Act
 * 2023 and UIDAI's guidance is to display only the last four digits; once the field is
 * complete and blurred it renders `XXXX XXXX 2346`. The full value stays in `value`, so the
 * form still works — only the display is masked. Turn `mask` off only with a recorded reason.
 *
 * `onValueChange` always receives RAW DIGITS, never the formatted or masked string, so the
 * separators can never reach your state or your API.
 *
 * @example
 * <FormField label="Aadhaar number" required hint="12 digits, as printed on your Aadhaar"
 *            error={touched && !ok ? "Enter a valid 12-digit Aadhaar number" : undefined}>
 *   {(f) => <AadhaarInput {...f} value={aadhaar} onValueChange={setAadhaar} />}
 * </FormField>
 */
export const AadhaarInput = React.forwardRef<HTMLInputElement, AadhaarInputProps>(
  function AadhaarInput(
    { value, onValueChange, invalid = false, size = "md", mask = true, className, onFocus, onBlur, ...rest },
    forwardedRef,
  ) {
    const innerRef = React.useRef<HTMLInputElement | null>(null);
    const [focused, setFocused] = React.useState(false);
    const pendingCaret = React.useRef<number | null>(null);

    const setRefs = React.useCallback(
      (node: HTMLInputElement | null) => {
        innerRef.current = node;
        if (typeof forwardedRef === "function") forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      },
      [forwardedRef],
    );

    const complete = value.length === 12;
    const masked = mask && complete && !focused;
    const display = masked ? maskAadhaar(value) : formatAadhaar(value);

    // Formatting inserts spaces, which would otherwise throw the caret to the end whenever
    // someone edits the middle of the number. Re-anchor it to the same DIGIT it was on.
    React.useLayoutEffect(() => {
      const el = innerRef.current;
      if (el && pendingCaret.current !== null && !masked) {
        const pos = caretAfterDigits(el.value, pendingCaret.current);
        el.setSelectionRange(pos, pos);
      }
      pendingCaret.current = null;
    }, [display, masked]);

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
      const el = event.target;
      pendingCaret.current = digitsBefore(el.value, el.selectionStart ?? el.value.length);
      onValueChange(digitsOnly(el.value).slice(0, 12));
    }

    return (
      <input
        ref={setRefs}
        type="text"
        className={cn("ds-input", `ds-input--${size}`, "ds-input--aadhaar", className)}
        data-size={size}
        value={display}
        onChange={handleChange}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        // Digits only, but `text` not `number`: a number input strips leading zeros, exposes
        // a spinner, and lets the wheel silently change the value.
        inputMode="numeric"
        autoComplete="off"
        spellCheck={false}
        maxLength={14 /* 12 digits + 2 grouping spaces */}
        aria-invalid={invalid || (complete && !isValidAadhaar(value)) || undefined}
        {...rest}
      />
    );
  },
);
