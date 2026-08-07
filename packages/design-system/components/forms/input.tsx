"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import "./forms.css";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Render the error state (sets aria-invalid). @default false */
  invalid?: boolean;
  /**
   * Decorative icon rendered inside the field, before the text. Purely visual —
   * it is `aria-hidden`, so the field still needs a real label.
   */
  leftIcon?: React.ReactNode;
  /**
   * Trailing slot inside the field. Unlike `leftIcon` this is NOT hidden from
   * assistive tech, because it is commonly an interactive control (a
   * show/hide-password toggle, a clear button). Give that control its own
   * accessible name. For a plain password reveal, prefer `<PasswordInput>`.
   */
  rightIcon?: React.ReactNode;
}

/**
 * MoSJE / SAMAVESH Input atom.
 *
 * A native `<input>` styled on the token contract. Pair with `FormField` for an
 * accessible label, hint, and error message. Min height 44px — past the 24px
 * Level AA minimum (SC 2.5.8) and meeting the 44px Level AAA size (SC 2.5.5).
 *
 * With `leftIcon`/`rightIcon` the input is wrapped in a positioned shell and
 * padded to clear the adornments. Without them it renders a bare `<input>` —
 * no wrapper — so existing layouts are untouched.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input(
    { invalid = false, leftIcon, rightIcon, className, type = "text", ...rest },
    ref,
  ) {
    const field = (
      <input
        ref={ref}
        type={type}
        className={cn(
          "ds-input",
          leftIcon != null && "ds-input--has-left",
          rightIcon != null && "ds-input--has-right",
          className,
        )}
        aria-invalid={invalid || undefined}
        {...rest}
      />
    );

    if (leftIcon == null && rightIcon == null) return field;

    return (
      <div className="ds-input-shell">
        {leftIcon != null && (
          <span className="ds-input-shell__icon ds-input-shell__icon--left" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        {field}
        {rightIcon != null && (
          <span className="ds-input-shell__icon ds-input-shell__icon--right">
            {rightIcon}
          </span>
        )}
      </div>
    );
  },
);
