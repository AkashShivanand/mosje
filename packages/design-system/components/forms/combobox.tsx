"use client";

import * as React from "react";

import { cn } from "../../utils/cn";
import { Icon } from "../utilities/icon";
import "./combobox.css";

export interface ComboboxOption {
  value: string;
  label: string;
  /** Shown after the label, quietly — a district's state, a scheme's code. */
  hint?: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  /** Always visible. */
  label: string;
  options: ComboboxOption[];
  /** The selected option's `value`, or "" when nothing is chosen. */
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Wording for "your search matched nothing", which is not "there is nothing". */
  noMatchLabel?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  className?: string;
}

/** Case- and diacritic-insensitive contains. */
function matches(option: ComboboxOption, query: string): boolean {
  if (!query) return true;
  const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  return norm(option.label).includes(norm(query)) || norm(option.hint ?? "").includes(norm(query));
}

/**
 * SAMAVESH Combobox — type to narrow a long list, then choose.
 *
 * **Reach for this when the list is longer than a person will scroll.** Seven
 * hundred and odd districts, every scheme in the estate, a beneficiary by name.
 * Below roughly twenty options a `Select` is better: it needs no typing and
 * every assistive technology already knows it.
 *
 * ── HOW IT DIFFERS FROM `FilterSelect`, WHICH LOOKS THE SAME ────────────────
 *
 * `FilterSelect` is a BUTTON that opens a listbox: focus moves to the list and
 * the button shows the current value. This is a real TEXT INPUT that filters —
 * focus never leaves it, and `aria-activedescendant` points at the highlighted
 * row. That is WAI-ARIA's combobox pattern, and the distinction is not cosmetic:
 * a screen reader announces a combobox as editable and tells the user how many
 * options remain after each keystroke, which is the entire point of typing.
 *
 * Use `FilterSelect` for a dashboard filter with a handful of options; use this
 * when the reader has to search.
 *
 * ── THE KEYBOARD MODEL ──────────────────────────────────────────────────────
 *
 *   type          filter; the list opens on the first character
 *   Down / Up     move the highlighted option (wrapping), opening if closed
 *   Home / End    first / last match
 *   Enter         choose the highlighted option
 *   Escape        close, keeping what is typed; again clears the field
 *   Tab           close and move on — a field that traps is worse than one that closes
 *
 * ── WHAT IT REFUSES TO DO ───────────────────────────────────────────────────
 *
 * **It never silently accepts unmatched text.** On blur, a query matching no
 * option reverts to the last chosen value. A combobox that keeps "Bankuraa" in
 * the box and "" in the form is how a district goes missing between the screen
 * and the database.
 */
export function Combobox({
  label,
  options,
  value,
  onChange,
  placeholder = "Start typing to search",
  noMatchLabel = "No match. Check the spelling, or clear the box to see everything.",
  hint,
  error,
  required = false,
  disabled = false,
  id,
  className,
}: ComboboxProps): React.JSX.Element {
  const reactId = React.useId();
  const baseId = id ?? reactId;
  const inputId = `${baseId}-input`;
  const listId = `${baseId}-list`;
  const hintId = `${baseId}-hint`;
  const errorId = `${baseId}-error`;
  const countId = `${baseId}-count`;

  const selected = options.find((o) => o.value === value);
  const [query, setQuery] = React.useState(() => selected?.label ?? "");
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);

  const rootRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);

  React.useEffect(() => {
    setQuery(options.find((o) => o.value === value)?.label ?? "");
  }, [value, options]);

  // Only filter once the query differs from the chosen label — otherwise
  // opening a settled field shows exactly one option, which reads as a broken
  // list rather than a filtered one.
  const filtered = React.useMemo(() => {
    const q = selected && query === selected.label ? "" : query;
    return options.filter((o) => matches(o, q));
  }, [options, query, selected]);

  React.useEffect(() => {
    setActiveIndex((i) => Math.min(i, Math.max(0, filtered.length - 1)));
  }, [filtered.length]);

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) commitOrRevert();
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  });

  React.useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector<HTMLElement>('[data-active="true"]')?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex]);

  function commitOrRevert() {
    setOpen(false);
    // See the note above: unmatched text must never survive as a value.
    setQuery(options.find((o) => o.value === value)?.label ?? "");
  }

  const choose = (index: number) => {
    const option = filtered[index];
    if (!option || option.disabled) return;
    onChange(option.value);
    setQuery(option.label);
    setOpen(false);
    inputRef.current?.focus();
  };

  /**
   * The first or last option a reader can actually choose.
   *
   * Home and End used to set the index directly, so `End` on a list whose last
   * entry is disabled parked the highlight on something Enter would refuse —
   * the reader presses Enter, nothing happens, and nothing explains why.
   */
  const edge = (from: "start" | "end"): number => {
    const order =
      from === "start"
        ? filtered.map((_, i) => i)
        : filtered.map((_, i) => filtered.length - 1 - i);
    for (const i of order) if (!filtered[i]?.disabled) return i;
    return activeIndex;
  };

  const step = (delta: number) => {
    const n = filtered.length;
    if (n === 0) return;
    setActiveIndex((i) => {
      for (let k = 1; k <= n; k += 1) {
        const next = (i + delta * k + n * n) % n;
        if (!filtered[next]?.disabled) return next;
      }
      return i;
    });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!open) setOpen(true);
        else step(1);
        return;
      case "ArrowUp":
        e.preventDefault();
        if (!open) setOpen(true);
        else step(-1);
        return;
      case "Home":
        if (!open) return;
        e.preventDefault();
        setActiveIndex(edge("start"));
        return;
      case "End":
        if (!open) return;
        e.preventDefault();
        setActiveIndex(edge("end"));
        return;
      case "Enter":
        if (!open) return;
        e.preventDefault();
        choose(activeIndex);
        return;
      case "Escape":
        e.preventDefault();
        // First Escape closes; a second clears. Two steps, because closing and
        // clearing are different intents and one key should not do both at once.
        if (open) setOpen(false);
        else {
          setQuery("");
          onChange("");
        }
        return;
      case "Tab":
        if (open) commitOrRevert();
        return;
      default:
        break;
    }
  };

  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ");

  return (
    <div ref={rootRef} className={cn("ds-combobox", className)}>
      <label className="ds-combobox__label" htmlFor={inputId}>
        {label}
        {required ? <span className="ds-combobox__required" aria-hidden="true">*</span> : null}
        {required ? <span className="ds-sr-only"> (required)</span> : null}
      </label>

      <div className={cn("ds-combobox__field", error && "is-invalid", disabled && "is-disabled")}>
        <input
          ref={inputRef}
          id={inputId}
          className="ds-combobox__input"
          type="text"
          role="combobox"
          autoComplete="off"
          placeholder={placeholder}
          value={query}
          disabled={disabled}
          required={required}
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-autocomplete="list"
          aria-activedescendant={open && filtered.length > 0 ? `${baseId}-opt-${activeIndex}` : undefined}
          aria-describedby={[describedBy, open ? countId : null].filter(Boolean).join(" ") || undefined}
          aria-invalid={error ? true : undefined}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActiveIndex(0);
          }}
          onKeyDown={onKeyDown}
          onBlur={(e) => {
            // Blur into our own list is not leaving the field.
            if (!rootRef.current?.contains(e.relatedTarget as Node)) commitOrRevert();
          }}
        />
        <button
          type="button"
          className="ds-combobox__trigger"
          disabled={disabled}
          tabIndex={-1}
          aria-label={open ? "Hide suggestions" : "Show suggestions"}
          onClick={() => {
            setOpen((v) => !v);
            inputRef.current?.focus();
          }}
        >
          <Icon name={open ? "expand_less" : "expand_more"} size={20} />
        </button>
      </div>

      {hint ? <p id={hintId} className="ds-combobox__hint">{hint}</p> : null}
      {error ? <p id={errorId} className="ds-combobox__error" role="alert">{error}</p> : null}

      {/*
        THE COUNT IS ANNOUNCED, and it is the reason to prefer a combobox over a
        plain field: a reader who cannot see the list shrink is typing blind.
      */}
      {open ? (
        <span id={countId} className="ds-sr-only" role="status">
          {filtered.length === 0
            ? "No matches"
            : `${filtered.length} ${filtered.length === 1 ? "match" : "matches"}`}
        </span>
      ) : null}

      {open ? (
        <ul ref={listRef} id={listId} role="listbox" aria-label={label} className="ds-combobox__list">
          {filtered.length === 0 ? (
            <li className="ds-combobox__nomatch">{noMatchLabel}</li>
          ) : (
            filtered.map((option, index) => (
              <li
                key={option.value}
                id={`${baseId}-opt-${index}`}
                data-active={index === activeIndex}
                role="option"
                aria-selected={option.value === value}
                aria-disabled={option.disabled || undefined}
                className={cn(
                  "ds-combobox__option",
                  index === activeIndex && "is-active",
                  option.value === value && "is-selected",
                  option.disabled && "is-disabled",
                )}
                // Pointer, not click: the field's blur would close the list
                // before a click handler ever fired.
                onPointerDown={(e) => {
                  e.preventDefault();
                  choose(index);
                }}
                onPointerEnter={() => !option.disabled && setActiveIndex(index)}
              >
                <span className="ds-combobox__option-label">{option.label}</span>
                {option.hint ? <span className="ds-combobox__option-hint">{option.hint}</span> : null}
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}
