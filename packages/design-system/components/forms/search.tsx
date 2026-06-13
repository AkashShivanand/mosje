"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import "./search.css";

export type SearchSize = "sm" | "md" | "lg";

export interface SearchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "onChange"> {
  /** Controlled value. */
  value: string;
  /** Change handler — receives the native input event. */
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  /** Control size. sm ≈ 40px (Portal), md ≈ 44px, lg ≈ 56px. @default "md" */
  size?: SearchSize;
  /**
   * When provided, a clear (×) button is shown while `value` is non-empty.
   * Invoked when the user clicks it.
   */
  onClear?: () => void;
}

/**
 * MoSJE / UX4G Search atom.
 *
 * A real `<input type="search">` with a leading search icon and an optional
 * clear button. Rounded (radius-md) with a focus ring matching the DS pattern.
 */
export const Search = React.forwardRef<HTMLInputElement, SearchProps>(
  function Search(
    {
      value,
      onChange,
      size = "md",
      onClear,
      disabled = false,
      placeholder,
      className,
      "aria-label": ariaLabel,
      ...rest
    },
    ref,
  ) {
    const showClear = onClear != null && value.length > 0 && !disabled;

    return (
      <div
        className={cn(
          "ds-search",
          `ds-search--${size}`,
          disabled && "ds-search--disabled",
          className,
        )}
      >
        <span className="ds-search__icon" aria-hidden="true">
          <svg
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="9"
              cy="9"
              r="6"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <path
              d="m17 17-3.5-3.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </span>
        <input
          ref={ref}
          type="search"
          className="ds-search__input"
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          aria-label={ariaLabel ?? placeholder ?? "Search"}
          {...rest}
        />
        {showClear && (
          <button
            type="button"
            className="ds-search__clear"
            onClick={onClear}
            aria-label="Clear search"
          >
            <svg
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M4 4l8 8M12 4l-8 8"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </div>
    );
  },
);
