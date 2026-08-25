"use client";

import * as React from "react";
import { Icon } from "../utilities/icon";
import { cn } from "../../utils/cn";
import "./search.css";

export type SearchSize = "sm" | "md" | "lg";

export interface SearchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "onChange" | "onSubmit"> {
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
  /**
   * Submit handler — Enter in the field, or a click on the leading icon.
   *
   * This is what lets the masthead reuse THIS component instead of shipping a
   * second, header-only search. A masthead search does not filter in place; it
   * hands the query to a results page. That is a submit, not a different atom.
   */
  onSubmit?: (value: string) => void;
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
      onSubmit,
      disabled = false,
      placeholder,
      className,
      "aria-label": ariaLabel,
      ...rest
    },
    ref,
  ) {
    const showClear = onClear != null && value.length > 0 && !disabled;
    const canSubmit = onSubmit != null && !disabled;

    return (
      <div
        className={cn(
          "ds-search",
          `ds-search--${size}`,
          disabled && "ds-search--disabled",
          className,
        )}
      >
        {canSubmit ? (
          <button
            type="button"
            className="ds-search__icon ds-search__icon--action"
            onClick={() => onSubmit!(value)}
            aria-label="Search"
          >
            <Icon name="search" size={20} />
          </button>
        ) : (
          <span className="ds-search__icon" aria-hidden="true">
            <Icon name="search" size={20} />
          </span>
        )}
        <input
          ref={ref}
          type="search"
          className="ds-search__input"
          /* `auto`, not inherited.

             A search field holds two different languages at once: the placeholder
             is in the interface's language, and what the reader types is in
             whatever language they think in. Inheriting `dir` from <html> gets
             both wrong half the time.

             Concretely: with the estate in Urdu, <html dir="rtl"> made this input
             RTL, and an English placeholder longer than the field then clipped
             from the START — "Search Schemes, Services, Documents" rendered as
             "n Schemes, Services, Documents", losing the one word that says what
             the field is for. LTR clips the tail, which is harmless; RTL clips
             the head, which is not.

             `dir="auto"` lets the browser read the first strong character and
             decide per string, so an English placeholder stays LTR inside an RTL
             page, an Urdu one is RTL, and a reader typing Devanagari into an
             English page gets their own direction rather than ours. */
          dir="auto"
          value={value}
          onChange={onChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && canSubmit) {
              e.preventDefault();
              onSubmit!(value);
            }
            rest.onKeyDown?.(e);
          }}
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
            <Icon name="close" size={16} />
          </button>
        )}
      </div>
    );
  },
);
