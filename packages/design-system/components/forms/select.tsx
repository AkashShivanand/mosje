"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { resolveFieldStatus, type FieldSize, type FieldStatus } from "./field-types";
import "./forms.css";

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export type SelectAppearance = "field" | "filter";

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  /**
   * `field` (default) is the full-height form control. `filter` is the compact
   * chip used in dashboard headers — 40px tall, hairline border, 14px label —
   * matching the Filters component in the Figma handoff. It is the same native
   * `<select>`, so keyboard and screen-reader behaviour are unchanged; only the
   * skin differs.
   */
  appearance?: SelectAppearance;
  /** The condition the field is in. Takes precedence over `invalid`. */
  status?: FieldStatus;
  /** Legacy alias for `status="error"`. Prefer `status`. */
  invalid?: boolean;
  /** Control height, matching the Input scale. Ignored by `appearance="filter"`. @default "md" */
  size?: FieldSize;
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
 *
 * There is no read-only select: HTML has no `readonly` for `<select>`, and
 * faking one with `disabled` removes it from the tab order and from the
 * accessible name of the form. A select whose value cannot change should be
 * rendered as text.
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    {
      status,
      invalid,
      size = "md",
      appearance = "field",
      options,
      placeholder,
      className,
      children,
      defaultValue,
      value,
      ...rest
    },
    ref,
  ) {
    const resolved = resolveFieldStatus(status, invalid);
    return (
      <span
        className={cn("ds-select", appearance === "filter" && "ds-select--filter")}
        data-status={resolved}
      >
        <select
          ref={ref}
          className={cn(
            "ds-select__el",
            appearance === "field" && `ds-select__el--${size}`,
            className,
          )}
          data-status={resolved}
          data-size={appearance === "field" ? size : undefined}
          aria-invalid={resolved === "error" || undefined}
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
