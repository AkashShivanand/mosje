"use client";

import * as React from "react";

import { cn } from "../../utils/cn";
import "./filter-select.css";

export interface FilterSelectOption {
  value: string;
  label: string;
  /** Shown after the label, quietly — a count, a code, a unit. */
  hint?: string;
  disabled?: boolean;
}

export interface FilterSelectProps {
  /** The control's name, always visible. A dashboard filter with no label is a mystery chip. */
  label: string;
  options: FilterSelectOption[];
  /** Controlled selection. */
  value: string;
  onChange: (value: string) => void;
  /** Shown when `value` matches no option. @default "Select" */
  placeholder?: string;
  disabled?: boolean;
  /** Constrain the trigger's width; the popup matches it. */
  width?: number | string;
  className?: string;
  id?: string;
}

/**
 * SAMAVESH FilterSelect — the compact dashboard filter, as a real listbox.
 *
 * **Why this exists beside `Select`.** `Select` is a native `<select>`, and a
 * native select is the right answer for a form field: it is the control every
 * assistive technology and every mobile keyboard already knows. What it cannot
 * do is carry a hint beside an option, sit at a dashboard's 32px filter height
 * on every platform, or be styled at all on iOS. So four portals hand-rolled a
 * button-plus-listbox instead — `pm-ajay`, `nhapoa`, `tg` and `scw` — and every
 * accessibility fix shipped to this package for three months reached none of
 * them. `check:shadow-ui` counts them; this is what lets them be deleted.
 *
 * **Prefer `Select` in a form.** Reach for this only in a dashboard filter row,
 * where the control is a query rather than an answer the citizen submits.
 *
 * ── THE KEYBOARD MODEL, and why focus stays on the listbox ──────────────────
 *
 * WAI-ARIA's listbox pattern, not a menu and not a combobox: there is no text
 * input, so focus moves to the LISTBOX and the active option is named by
 * `aria-activedescendant`. Moving DOM focus onto each option instead is the
 * common mistake — it works with a mouse and makes the list unreadable to a
 * screen reader, which then announces a focus change rather than a selection.
 *
 *   Down / Up     open, then move the active option (wrapping)
 *   Home / End    first / last
 *   Enter / Space select the active option and close
 *   Escape        close WITHOUT selecting, and return focus to the trigger
 *   Tab           close and move on — a filter must never trap
 *   a-z           type-ahead, resetting after a second's pause
 *
 * Escape restoring focus is the half that gets skipped, and it is the half a
 * keyboard reader notices: a popup that unmounts while focus is inside it drops
 * the reader to `<body>` and makes them tab from the top of the document.
 */
export function FilterSelect({
  label,
  options,
  value,
  onChange,
  placeholder = "Select",
  disabled = false,
  width,
  className,
  id,
}: FilterSelectProps): React.JSX.Element {
  const reactId = React.useId();
  const baseId = id ?? reactId;
  const triggerId = `${baseId}-trigger`;
  const listId = `${baseId}-list`;
  const labelId = `${baseId}-label`;

  const [open, setOpen] = React.useState(false);
  const selectedIndex = options.findIndex((o) => o.value === value);
  const [activeIndex, setActiveIndex] = React.useState(() => Math.max(0, selectedIndex));

  const rootRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const typeahead = React.useRef<{ query: string; at: number }>({ query: "", at: 0 });

  const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined;

  /** Open with the current selection active — never at the top of an unrelated list. */
  const openList = React.useCallback(() => {
    if (disabled) return;
    setActiveIndex(Math.max(0, options.findIndex((o) => o.value === value)));
    setOpen(true);
  }, [disabled, options, value]);

  const close = React.useCallback(
    (returnFocus: boolean) => {
      setOpen(false);
      if (returnFocus) triggerRef.current?.focus();
    },
    [],
  );

  // Focus the listbox on open, so the keyboard model starts where it belongs.
  React.useEffect(() => {
    if (open) listRef.current?.focus();
  }, [open]);

  // Keep the active option in view when it moves beyond the popup's scroll.
  React.useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex]);

  React.useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, close]);

  const step = (from: number, delta: number): number => {
    const n = options.length;
    for (let i = 1; i <= n; i += 1) {
      const next = (from + delta * i + n * Math.abs(delta) * n) % n;
      if (!options[next]?.disabled) return next;
    }
    return from;
  };

  const commit = (index: number) => {
    const option = options[index];
    if (!option || option.disabled) return;
    onChange(option.value);
    close(true);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
        event.preventDefault();
        openList();
      }
      return;
    }
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((i) => step(i, 1));
        return;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((i) => step(i, -1));
        return;
      case "Home":
        event.preventDefault();
        setActiveIndex(step(-1, 1));
        return;
      case "End":
        event.preventDefault();
        setActiveIndex(step(options.length, -1));
        return;
      case "Enter":
      case " ":
        event.preventDefault();
        commit(activeIndex);
        return;
      case "Escape":
        event.preventDefault();
        close(true);
        return;
      case "Tab":
        // Close and let the Tab through. A filter that traps is worse than one
        // that closes.
        close(false);
        return;
      default:
        break;
    }
    // Type-ahead. A district list is long and a reader who knows the name should
    // not have to arrow through forty of them.
    if (event.key.length === 1 && /\S/.test(event.key)) {
      const now = Date.now();
      const t = typeahead.current;
      t.query = now - t.at > 1000 ? event.key : t.query + event.key;
      t.at = now;
      const q = t.query.toLowerCase();
      const found = options.findIndex((o) => !o.disabled && o.label.toLowerCase().startsWith(q));
      if (found >= 0) setActiveIndex(found);
    }
  };

  return (
    <div
      ref={rootRef}
      className={cn("ds-filter-select", disabled && "ds-filter-select--disabled", className)}
      style={width ? { width: typeof width === "number" ? `${width}px` : width } : undefined}
    >
      <span className="ds-filter-select__label" id={labelId}>
        {label}
      </span>
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        className="ds-filter-select__trigger"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        // The trigger's accessible name is "<label> <current value>", so a
        // screen reader hears what the filter is AND what it is set to, which is
        // the whole question a reader has about a filter chip.
        aria-labelledby={`${labelId} ${triggerId}`}
        onClick={() => (open ? close(false) : openList())}
        onKeyDown={onKeyDown}
      >
        <span className="ds-filter-select__value">{selected?.label ?? placeholder}</span>
        <span className="ds-filter-select__caret" aria-hidden="true">
          ▾
        </span>
      </button>

      {open ? (
        <div
          ref={listRef}
          id={listId}
          role="listbox"
          tabIndex={-1}
          aria-labelledby={labelId}
          aria-activedescendant={`${baseId}-opt-${activeIndex}`}
          className="ds-filter-select__list"
          onKeyDown={onKeyDown}
        >
          {options.map((option, index) => (
            <div
              key={option.value}
              id={`${baseId}-opt-${index}`}
              data-index={index}
              role="option"
              aria-selected={option.value === value}
              aria-disabled={option.disabled || undefined}
              className={cn(
                "ds-filter-select__option",
                index === activeIndex && "is-active",
                option.value === value && "is-selected",
                option.disabled && "is-disabled",
              )}
              // Pointer, not click: the listbox is closed on document
              // pointerdown, so a click handler here would never fire.
              onPointerDown={(event) => {
                event.preventDefault();
                commit(index);
              }}
              onPointerEnter={() => !option.disabled && setActiveIndex(index)}
            >
              <span className="ds-filter-select__option-label">{option.label}</span>
              {option.hint ? (
                <span className="ds-filter-select__option-hint">{option.hint}</span>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
