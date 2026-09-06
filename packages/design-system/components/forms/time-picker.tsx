"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "../../utils/cn";
import {
  useAnchoredPosition,
  useDismissOnOutside,
} from "../../foundations/anchor";
import "./time-picker.css";

export interface TimePickerProps {
  /** Always visible. A time field with only a placeholder is a guess. */
  label: string;
  /** Canonical 24-hour `HH:MM`. Empty string when unset. */
  value: string;
  onChange: (hhmm: string) => void;
  /** Canonical `HH:MM` bounds. A time outside them cannot be chosen from the list. */
  min?: string;
  max?: string;
  /**
   * Minutes between the times offered in the list. The field itself still
   * accepts any minute — the step governs the shortcut, not the value.
   * @default 30
   */
  step?: number;
  hint?: string;
  /** Shown under the field, and announced. */
  error?: string;
  /**
   * Sets the error state without a message, so spreading `FormField`'s
   * render-prop object onto this component degrades rather than breaks. A
   * message is still better — prefer `error`.
   */
  invalid?: boolean;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  className?: string;
}

const pad = (n: number) => String(n).padStart(2, "0");

/** `HH:MM` if it is a real time of day, else "". */
function normalise(text: string): string {
  const m = /^\s*(\d{1,2})\s*[:.]?\s*(\d{2})\s*$/.exec(text);
  if (!m) return "";
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) return "";
  return `${pad(h)}:${pad(min)}`;
}

const toMinutes = (hhmm: string): number | null => {
  const m = /^(\d{2}):(\d{2})$/.exec(hhmm);
  return m ? Number(m[1]) * 60 + Number(m[2]) : null;
};

/** Every time on the step between `min` and `max`, inclusive. */
function timesBetween(min: string | undefined, max: string | undefined, step: number): string[] {
  const from = min ? (toMinutes(min) ?? 0) : 0;
  const to = max ? (toMinutes(max) ?? 24 * 60 - 1) : 24 * 60 - 1;
  const safeStep = Math.max(1, Math.floor(step));
  const out: string[] = [];
  for (let m = from; m <= to; m += safeStep) {
    out.push(`${pad(Math.floor(m / 60))}:${pad(m % 60)}`);
  }
  return out;
}

/**
 * MoSJE / SAMAVESH TimePicker — a typed time field, with a list as the second
 * way in.
 *
 * **`<input type="time">` was the obvious alternative and is rejected for the
 * same reason `DatePicker` rejects `<input type="date">`.** Its rendering and,
 * critically, its 12-hour-versus-24-hour display are the browser's and the
 * operating system's, so the same government form shows "2:00 PM" to one citizen
 * and "14:00" to the next with no way to correct it. A form that cannot state
 * its own time format will collect wrong times, and every published departmental
 * schedule on this estate is written in 24-hour form.
 *
 * The field is therefore the primary control and it is canonical: the value is
 * always 24-hour `HH:MM` and the format is stated in the hint. Every
 * UNAMBIGUOUS form commits as `09:05` on blur — `9:05`, `09.05`, `0905` — so a
 * citizen is not punished for punctuation.
 *
 * `9:5` is deliberately REFUSED rather than guessed. It could mean 09:05 or
 * 09:50, and a form that quietly picks one will record the wrong time without
 * telling anybody. Unparseable text restores the last good value, which is
 * visible, rather than committing an invention.
 *
 * ── THE KEYBOARD MODEL ──────────────────────────────────────────────────────
 *
 * In the field   type `hh:mm`; the value commits on blur, so a half-typed time
 *                is never read as a wrong one
 *   Down / Alt+Down  open the list
 *
 * In the list    arrows move · Home / End jump to the ends · Enter or Space
 *                chooses and closes · Escape closes WITHOUT choosing and returns
 *                focus to the field
 *
 * Escape restoring focus is the half that gets skipped, and it is the half a
 * keyboard reader notices: a listbox that unmounts while focus is inside it
 * drops them to `<body>`.
 *
 * Where the times on offer are a fixed, bookable set rather than any time of
 * day, reach for `TimeSlot` instead — it shows capacity and is a radio group.
 */
export function TimePicker({
  label,
  value,
  onChange,
  min,
  max,
  step = 30,
  hint,
  error,
  invalid = false,
  required = false,
  disabled = false,
  id,
  className,
}: TimePickerProps): React.JSX.Element {
  const reactId = React.useId();
  const baseId = id ?? reactId;
  const inputId = `${baseId}-input`;
  const hintId = `${baseId}-hint`;
  const errorId = `${baseId}-error`;
  const listId = `${baseId}-list`;

  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState(value);
  React.useEffect(() => setText(value), [value]);

  const wrapRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const options = React.useMemo(() => timesBetween(min, max, step), [min, max, step]);
  const [activeIndex, setActiveIndex] = React.useState(0);

  const coords = useAnchoredPosition({
    open,
    side: "bottom",
    align: "start",
    offset: 4,
    triggerRef: wrapRef,
    panelRef: listRef,
  });

  useDismissOnOutside(
    open,
    React.useMemo(() => [listRef, wrapRef], []),
    React.useCallback(() => setOpen(false), []),
  );

  const openList = React.useCallback(() => {
    const at = options.indexOf(value);
    setActiveIndex(at >= 0 ? at : 0);
    setOpen(true);
  }, [options, value]);

  const closeAndRestore = React.useCallback(() => {
    setOpen(false);
    inputRef.current?.focus();
  }, []);

  const choose = (hhmm: string) => {
    onChange(hhmm);
    setText(hhmm);
    closeAndRestore();
  };

  /** Commit on blur, never on keystroke — a half-typed time is not a wrong one. */
  const commit = () => {
    const normalised = normalise(text);
    if (normalised) {
      setText(normalised);
      if (normalised !== value) onChange(normalised);
    } else if (text.trim() === "") {
      if (value !== "") onChange("");
    } else {
      // Unparseable: put the last good value back rather than silently keeping
      // characters that are not a time.
      setText(value);
    }
  };

  const describedBy =
    [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined;
  const isInvalid = Boolean(error) || invalid;

  const onFieldKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (!open) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        openList();
      }
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, options.length - 1));
        return;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        return;
      case "Home":
        e.preventDefault();
        setActiveIndex(0);
        return;
      case "End":
        e.preventDefault();
        setActiveIndex(options.length - 1);
        return;
      case "Enter": {
        // Space is NOT a chooser here: it is a printable character in a field a
        // citizen is typing into, and stealing it would make the space bar
        // unusable while the list happens to be open.
        e.preventDefault();
        const picked = options[activeIndex];
        if (picked) choose(picked);
        return;
      }
      case "Escape":
        e.preventDefault();
        e.stopPropagation();
        closeAndRestore();
        return;
      default:
    }
  };

  // Keep the active option in view as the arrows move through a long list.
  React.useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector<HTMLElement>('[data-active="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex]);

  // Focus stays in the FIELD the whole time. `aria-activedescendant` reports
  // which option the arrows are on, so a citizen can keep typing while the list
  // is open — which is the point of a field whose list is only a shortcut.

  return (
    <div className={cn("ds-timepicker", className)}>
      <label htmlFor={inputId} className="ds-timepicker__label">
        {label}
        {required ? (
          <span className="ds-timepicker__required" aria-hidden>
            *
          </span>
        ) : null}
      </label>
      {hint ? (
        <p id={hintId} className="ds-timepicker__hint">
          {hint}
        </p>
      ) : null}

      <div className="ds-timepicker__control" ref={wrapRef}>
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          className={cn(
            "ds-timepicker__input",
            isInvalid && "ds-timepicker__input--error",
          )}
          // `numeric`, not `decimal`: a time has no decimal separator, and the
          // numeric keypad is the one a citizen wants on a phone.
          inputMode="numeric"
          autoComplete="off"
          placeholder="hh:mm"
          value={text}
          disabled={disabled}
          required={required}
          aria-describedby={describedBy}
          aria-invalid={isInvalid || undefined}
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          role="combobox"
          aria-haspopup="listbox"
          aria-autocomplete="none"
          aria-activedescendant={open ? `${listId}-${activeIndex}` : undefined}
          onChange={(e) => setText(e.target.value)}
          onBlur={commit}
          onKeyDown={onFieldKeyDown}
        />
        <button
          type="button"
          className="ds-timepicker__trigger"
          aria-label={`Choose a time for ${label}`}
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          disabled={disabled}
          onClick={() => (open ? closeAndRestore() : openList())}
        >
          <span aria-hidden>&#9711;</span>
        </button>
      </div>

      {error ? (
        <p id={errorId} className="ds-timepicker__error" role="alert">
          {error}
        </p>
      ) : null}

      {mounted && open
        ? createPortal(
            <ul
              ref={listRef}
              id={listId}
              role="listbox"
              aria-label={label}
              className="ds-timepicker__list"
              style={{
                top: coords?.top ?? 0,
                left: coords?.left ?? 0,
                width: wrapRef.current?.getBoundingClientRect().width,
                visibility: coords ? "visible" : "hidden",
              }}
            >
              {options.map((time, i) => (
                <li
                  key={time}
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={time === value}
                  data-active={i === activeIndex}
                  className={cn(
                    "ds-timepicker__option",
                    i === activeIndex && "ds-timepicker__option--active",
                    time === value && "ds-timepicker__option--selected",
                  )}
                  onMouseEnter={() => setActiveIndex(i)}
                  // Pointer, not click: the field's blur would close the list
                  // before a click handler ever fired.
                  onPointerDown={(e) => {
                    e.preventDefault();
                    choose(time);
                  }}
                >
                  {time}
                </li>
              ))}
            </ul>,
            document.body,
          )
        : null}
    </div>
  );
}
