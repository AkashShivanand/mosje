"use client";

import * as React from "react";
import { Icon } from "../utilities/icon";
import { cn } from "../../utils/cn";
import "./search.css";

export type SearchSize = "sm" | "md" | "lg";

/** One autocomplete row. Deliberately flat — the field renders it, nothing more. */
export interface SearchSuggestion {
  /** Stable identity. The href is a good one; anything unique will do. */
  id: string;
  label: string;
  description?: string;
  /** Grouping heading, e.g. "Schemes". Adjacent rows sharing one are grouped. */
  group?: string;
  iconName?: string;
}

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
  /**
   * Autocomplete rows for the current value. Presentational: this component
   * neither fetches nor debounces. The owner does both, because what a
   * suggestion IS differs per surface and the field should not know.
   *
   * Passing `undefined` (rather than `[]`) means "this field has no
   * autocomplete", and no combobox semantics are attached at all — a plain
   * filter field must not announce itself to a screen reader as a combobox that
   * never has options.
   */
  suggestions?: SearchSuggestion[];
  /** A suggestion was chosen, by click or by Enter on the highlighted row. */
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void;
  /** Accessible name for the suggestion list. @default "Search suggestions" */
  suggestionsLabel?: string;
}

/** Wrap the matched run of `query` in `<mark>`. Case-insensitive, first hit only. */
function highlight(text: string, query: string): React.ReactNode {
  const needle = query.trim();
  if (!needle) return text;
  const at = text.toLowerCase().indexOf(needle.toLowerCase());
  if (at === -1) return text;
  return (
    <>
      {text.slice(0, at)}
      <mark className="ds-search__mark">{text.slice(at, at + needle.length)}</mark>
      {text.slice(at + needle.length)}
    </>
  );
}

/**
 * MoSJE / UX4G Search atom.
 *
 * A real `<input type="search">` with a leading search icon and an optional
 * clear button. Rounded (radius-md) with a focus ring matching the DS pattern.
 *
 * AUTOCOMPLETE follows the ARIA 1.2 combobox pattern, which is the part most
 * often got wrong. Three rules it holds to:
 *
 *  - FOCUS NEVER LEAVES THE INPUT. Arrow keys move `aria-activedescendant`, not
 *    focus. Moving focus into the list is what breaks typing mid-selection and
 *    what makes voice control lose the field.
 *  - ESCAPE CLOSES THE LIST AND KEEPS THE TEXT. It does not clear the field.
 *    A second Escape is the browser's to handle. `[WCAG 1.4.13]`
 *  - THE LIST IS NEVER THE ONLY ROUTE. Enter with nothing highlighted submits
 *    what was typed, so a reader who ignores the suggestions is not stuck.
 *    `[DBIM 9.viii]`
 *
 * The list also stays open while the pointer is over it — it closes on blur, not
 * on mouseleave — so it can be read without being dismissed. `[WCAG 1.4.13]`
 */
export const Search = React.forwardRef<HTMLInputElement, SearchProps>(
  function Search(
    {
      value,
      onChange,
      size = "md",
      onClear,
      onSubmit,
      suggestions,
      onSuggestionSelect,
      suggestionsLabel = "Search suggestions",
      disabled = false,
      placeholder,
      className,
      id,
      "aria-label": ariaLabel,
      ...rest
    },
    ref,
  ) {
    const showClear = onClear != null && value.length > 0 && !disabled;
    const canSubmit = onSubmit != null && !disabled;

    const hasAutocomplete = suggestions != null;
    const reactId = React.useId();
    const fieldId = id ?? `ds-search-${reactId}`;
    const listId = `${fieldId}-listbox`;

    /** Escape hides the list without clearing it; typing again brings it back. */
    const [dismissed, setDismissed] = React.useState(false);
    const [focused, setFocused] = React.useState(false);
    const [activeIndex, setActiveIndex] = React.useState(-1);

    const rows = suggestions ?? [];
    const open = hasAutocomplete && focused && !dismissed && rows.length > 0;
    const active = open && activeIndex >= 0 ? rows[activeIndex] : undefined;

    // A changed suggestion set invalidates the highlight — index 2 of the old
    // list is not index 2 of the new one, and silently keeping it is how Enter
    // ends up opening something the reader never saw.
    React.useEffect(() => {
      setActiveIndex(-1);
    }, [suggestions]);

    const listRef = React.useRef<HTMLUListElement>(null);
    React.useEffect(() => {
      if (!open || activeIndex < 0) return;
      listRef.current
        ?.querySelector(`[data-index="${activeIndex}"]`)
        ?.scrollIntoView({ block: "nearest" });
    }, [open, activeIndex]);

    const choose = (suggestion: SearchSuggestion) => {
      setDismissed(true);
      setActiveIndex(-1);
      onSuggestionSelect?.(suggestion);
    };

    const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (hasAutocomplete && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
        event.preventDefault();
        if (dismissed) setDismissed(false);
        if (rows.length === 0) return;
        setActiveIndex((current) => {
          if (event.key === "ArrowDown") return current + 1 >= rows.length ? 0 : current + 1;
          return current - 1 < 0 ? rows.length - 1 : current - 1;
        });
        return;
      }

      if (event.key === "Escape" && open) {
        event.preventDefault();
        // Close the list, keep the text. Clearing here would punish a reader who
        // pressed Escape only to get the suggestions out of the way.
        setDismissed(true);
        setActiveIndex(-1);
        return;
      }

      if (event.key === "Enter") {
        if (active) {
          event.preventDefault();
          choose(active);
          return;
        }
        if (canSubmit) {
          event.preventDefault();
          setDismissed(true);
          onSubmit!(value);
          return;
        }
      }

      rest.onKeyDown?.(event);
    };

    let lastGroup: string | undefined;

    return (
      <div
        className={cn(
          "ds-search",
          `ds-search--${size}`,
          disabled && "ds-search--disabled",
          open && "ds-search--open",
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
          id={fieldId}
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
          /* SPREAD FIRST, and it has to be. It used to come last, which meant a
             consumer's `onKeyDown` REPLACED this component's — silently taking out
             Enter-to-submit and the whole combobox arrow-key path, on a component
             that goes to the trouble of chaining `rest.onKeyDown?.(event)` at the
             end of its own handler. That chaining was unreachable. `onFocus` and
             `onBlur` chain the same way and were broken the same way, and a
             consumer could also overwrite `role="combobox"` by accident. Anything
             derived from a named prop is written after this, so it still wins. */
          {...rest}
          dir="auto"
          value={value}
          onChange={(event) => {
            setDismissed(false);
            onChange(event);
          }}
          onKeyDown={onKeyDown}
          onFocus={(event) => {
            setFocused(true);
            rest.onFocus?.(event);
          }}
          onBlur={(event) => {
            // The list lives inside this wrapper, so a click on a row keeps focus
            // within it. Closing on any blur would race the click and swallow it.
            if (event.currentTarget.parentElement?.contains(event.relatedTarget as Node)) return;
            setFocused(false);
            setActiveIndex(-1);
            rest.onBlur?.(event);
          }}
          disabled={disabled}
          placeholder={placeholder}
          aria-label={ariaLabel ?? placeholder ?? "Search"}
          {...(hasAutocomplete
            ? {
                role: "combobox",
                "aria-expanded": open,
                "aria-controls": listId,
                "aria-autocomplete": "list" as const,
                "aria-activedescendant": active ? `${listId}-${activeIndex}` : undefined,
              }
            : {})}
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

        {hasAutocomplete && (
          <>
            {/*
              Announced on a delay by the browser, so it must describe the state
              AFTER this render. Empty while closed, which is what stops it
              re-announcing a stale count when the list is dismissed.
            */}
            <span className="ds-search__status" role="status" aria-live="polite">
              {open
                ? `${rows.length} suggestion${rows.length === 1 ? "" : "s"} available.`
                : ""}
            </span>

            {open && (
              <ul
                ref={listRef}
                id={listId}
                className="ds-search__listbox"
                role="listbox"
                aria-label={suggestionsLabel}
              >
                {rows.map((suggestion, index) => {
                  const heading = suggestion.group !== lastGroup ? suggestion.group : undefined;
                  lastGroup = suggestion.group;
                  const isActive = index === activeIndex;
                  return (
                    <React.Fragment key={suggestion.id}>
                      {heading && (
                        <li className="ds-search__group" role="presentation">
                          {heading}
                        </li>
                      )}
                      <li
                        id={`${listId}-${index}`}
                        data-index={index}
                        role="option"
                        aria-selected={isActive}
                        className={cn("ds-search__option", isActive && "is-active")}
                        // Pointer-down, not click: mousedown fires before blur, so
                        // the row cannot be closed out from under the pointer.
                        onMouseDown={(event) => {
                          event.preventDefault();
                          choose(suggestion);
                        }}
                        onMouseEnter={() => setActiveIndex(index)}
                      >
                        {suggestion.iconName && (
                          <span className="ds-search__option-icon" aria-hidden="true">
                            <Icon name={suggestion.iconName} size={20} />
                          </span>
                        )}
                        <span className="ds-search__option-body">
                          <span className="ds-search__option-label">
                            {highlight(suggestion.label, value)}
                          </span>
                          {suggestion.description && (
                            <span className="ds-search__option-desc">
                              {suggestion.description}
                            </span>
                          )}
                        </span>
                      </li>
                    </React.Fragment>
                  );
                })}
              </ul>
            )}
          </>
        )}
      </div>
    );
  },
);
