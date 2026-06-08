"use client";

import * as React from "react";
import { cn } from "../cn";
import "./forms.css";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Render the error state (sets aria-invalid). @default false */
  invalid?: boolean;
}

/**
 * MoSJE / SAMAVESH Textarea atom.
 *
 * A native `<textarea>` styled on the token contract; vertically resizable.
 * Pair with `FormField` for an accessible label, hint, and error message.
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ invalid = false, className, rows = 4, ...rest }, ref) {
    return (
      <textarea
        ref={ref}
        rows={rows}
        className={cn("ds-textarea", className)}
        aria-invalid={invalid || undefined}
        {...rest}
      />
    );
  },
);
