"use client";

import * as React from "react";
import { cn } from "../cn";
import "./controls.css";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  /** Controlled checked state. */
  checked: boolean;
  /** Render the indeterminate (mixed) state. @default false */
  indeterminate?: boolean;
  /** Optional text label rendered beside the box (associated via htmlFor/id). */
  label?: React.ReactNode;
  /** Change handler — receives the native input event. */
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

/**
 * MoSJE / UX4G Checkbox atom.
 *
 * A real `<input type="checkbox">` (visually hidden) paired with a styled box,
 * so it is fully keyboard- and screen-reader-accessible. Supports an
 * indeterminate (mixed) visual state.
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    {
      checked,
      indeterminate = false,
      disabled = false,
      label,
      id,
      className,
      onChange,
      ...rest
    },
    forwardedRef,
  ) {
    const innerRef = React.useRef<HTMLInputElement>(null);

    // Merge the forwarded ref with the local one.
    React.useImperativeHandle(forwardedRef, () => innerRef.current!, []);

    // `indeterminate` is a DOM-only property — sync it on every render.
    React.useEffect(() => {
      if (innerRef.current) {
        innerRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    const reactId = React.useId();
    const inputId = id ?? reactId;

    return (
      <span
        className={cn("ds-checkbox", disabled && "ds-checkbox--disabled", className)}
      >
        <span className="ds-checkbox__control">
          <input
            ref={innerRef}
            id={inputId}
            type="checkbox"
            className="ds-checkbox__input"
            checked={checked}
            disabled={disabled}
            onChange={onChange}
            aria-checked={indeterminate ? "mixed" : checked}
            {...rest}
          />
          <span className="ds-checkbox__box" aria-hidden="true">
            {indeterminate ? (
              <svg
                className="ds-checkbox__mark"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.5 8h9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg
                className="ds-checkbox__mark"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13 4.5 6.5 11.5 3 8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </span>
        </span>
        {label != null && (
          <label htmlFor={inputId} className="ds-checkbox__label">
            {label}
          </label>
        )}
      </span>
    );
  },
);
