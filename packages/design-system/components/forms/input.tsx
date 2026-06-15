"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import "./forms.css";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Render the error state (sets aria-invalid). @default false */
  invalid?: boolean;
}

/**
 * MoSJE / SAMAVESH Input atom.
 *
 * A native `<input>` styled on the token contract. Pair with `FormField` for an
 * accessible label, hint, and error message. Min height 44px (WCAG 2.2 target size).
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input({ invalid = false, className, type = "text", ...rest }, ref) {
    return (
      <input
        ref={ref}
        type={type}
        className={cn("ds-input", className)}
        aria-invalid={invalid || undefined}
        {...rest}
      />
    );
  },
);
