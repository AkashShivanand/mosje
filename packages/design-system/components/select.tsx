"use client";

import * as React from "react";
import { cn } from "../cn";
import "./forms.css";

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  /** Render the error state (sets aria-invalid). @default false */
  invalid?: boolean;
  /** Convenience option list. Omit and pass <option> children instead if preferred. */
  options?: SelectOption[];
  /** Optional placeholder rendered as a disabled first option. */
  placeholder?: string;
}

/**
 * MoSJE / SAMAVESH Select atom.
 *
 * A native `<select>` (full keyboard + screen-reader behaviour) with a custom
 * chevron. Pass `options` or `<option>` children. Pair with `FormField`.
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    { invalid = false, options, placeholder, className, children, defaultValue, value, ...rest },
    ref,
  ) {
    return (
      <span className="ds-select">
        <select
          ref={ref}
          className={cn("ds-select__el", className)}
          aria-invalid={invalid || undefined}
          defaultValue={defaultValue ?? (placeholder && value === undefined ? "" : undefined)}
          value={value}
          {...rest}
        >
          {placeholder != null && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options
            ? options.map((o) => (
                <option key={o.value} value={o.value} disabled={o.disabled}>
                  {o.label}
                </option>
              ))
            : children}
        </select>
        <svg
          className="ds-select__chevron"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  },
);
