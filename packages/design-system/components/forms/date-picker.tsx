"use client";

import * as React from "react";

import { cn } from "../../utils/cn";
import { Icon } from "../utilities/icon";
import "./date-picker.css";

export interface DatePickerProps {
  /** Always visible. A date field with only a placeholder is a guess. */
  label: string;
  /** ISO `yyyy-mm-dd` — the canonical value. Empty string when unset. */
  value: string;
  onChange: (iso: string) => void;
  /** ISO bounds. A date outside them cannot be typed or chosen. */
  min?: string;
  max?: string;
  hint?: string;
  /** Shown under the field, and announced. */
  error?: string;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  className?: string;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
/** Monday-first: the Government of India's week starts on Monday. */
const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const pad = (n: number) => String(n).padStart(2, "0");
const toIso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** ISO → the form a citizen reads and types. */
function toDisplay(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : "";
}

/**
 * `dd/mm/yyyy` → ISO, or "" when it is not a real date.
 *
 * Checked by round-trip rather than by range: `31/02/2026` passes every
 * field-by-field bounds test and is not a date. Constructing it and asking
 * whether the month survived is the only check that catches it.
 */
function fromDisplay(text: string): string {
  const m = /^(\d{1,2})\s*\/\s*(\d{1,2})\s*\/\s*(\d{4})$/.exec(text.trim());
  if (!m) return "";
  const [dd, mm, yyyy] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const d = new Date(yyyy, mm - 1, dd);
  return d.getFullYear() === yyyy && d.getMonth() === mm - 1 && d.getDate() === dd ? toIso(d) : "";
}

const parseIso = (iso: string): Date | null => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? null : d;
};

/**
 * SAMAVESH DatePicker — a typed date field, with a calendar as the second way in.
 *
 * **The text input is the primary control, and that ordering is the whole
 * design.** Every calendar-first picker on this estate's forms would be asking a
 * pensioner to page back four hundred and eighty months to reach a date of
 * birth. Typing `14/08/1962` takes seconds; the calendar exists for "next
 * Tuesday", which is the case it is actually good at.
 *
 * `<input type="date">` was the obvious alternative and is rejected: its
 * rendering, its keyboard model and its date ORDER are the browser's and the
 * operating system's, so the same government form shows `mm/dd/yyyy` to one
 * citizen and `dd/mm/yyyy` to the next, with no way to correct it. A form that
 * cannot state its own date order will collect wrong dates.
 *
 * ── THE KEYBOARD MODEL ──────────────────────────────────────────────────────
 *
 * In the field   type `dd/mm/yyyy`; the value commits on blur, so a half-typed
 *                date is never read as a wrong one
 *   Down / Alt+Down  open the calendar
 *
 * In the calendar (WAI-ARIA's date picker dialog, with a roving grid)
 *   arrows       day by day, week by week
 *   PageUp/Down  month by month · Shift with it, year by year
 *   Home / End   first and last day of the week
 *   Enter/Space  choose the focused day and close
 *   Escape       close WITHOUT choosing, and return focus to the field
 *
 * Escape restoring focus is the half that gets skipped, and it is the half a
 * keyboard reader notices: a dialog that unmounts while focus is inside it drops
 * them to `<body>`.
 */
export function DatePicker({
  label,
  value,
  onChange,
  min,
  max,
  hint,
  error,
  required = false,
  disabled = false,
  id,
  className,
}: DatePickerProps): React.JSX.Element {
  const reactId = React.useId();
  const baseId = id ?? reactId;
  const inputId = `${baseId}-input`;
  const hintId = `${baseId}-hint`;
  const errorId = `${baseId}-error`;
  const dialogId = `${baseId}-dialog`;

  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState(() => toDisplay(value));
  const selected = parseIso(value);
  const [focusDate, setFocusDate] = React.useState<Date>(() => selected ?? new Date());

  const rootRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const gridRef = React.useRef<HTMLDivElement>(null);

  // The field is controlled from outside too — a form reset or a prefill has to
  // reach the text, not just the value.
  React.useEffect(() => {
    setText(toDisplay(value));
  }, [value]);

  const minDate = min ? parseIso(min) : null;
  const maxDate = max ? parseIso(max) : null;
  const outOfRange = React.useCallback(
    (d: Date) => (minDate !== null && d < minDate) || (maxDate !== null && d > maxDate),
    [minDate, maxDate],
  );

  const close = React.useCallback((returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) inputRef.current?.focus();
  }, []);

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open, close]);

  // Move DOM focus to the active day, so the grid's roving tabindex is real
  // focus rather than a highlight a screen reader cannot follow.
  React.useEffect(() => {
    if (!open) return;
    gridRef.current?.querySelector<HTMLButtonElement>('[data-active="true"]')?.focus();
  }, [open, focusDate]);

  const commitText = () => {
    const iso = fromDisplay(text);
    if (iso && !outOfRange(parseIso(iso)!)) {
      onChange(iso);
    } else if (text.trim() === "") {
      onChange("");
    } else {
      // Put back the last good value rather than leaving nonsense on screen.
      setText(toDisplay(value));
    }
  };

  const shift = (days: number, months = 0, years = 0) => {
    const d = new Date(focusDate);
    d.setFullYear(d.getFullYear() + years, d.getMonth() + months, d.getDate() + days);
    setFocusDate(d);
  };

  const onGridKeyDown = (e: React.KeyboardEvent) => {
    const k = e.key;
    const handled = true;
    switch (k) {
      case "ArrowLeft": shift(-1); break;
      case "ArrowRight": shift(1); break;
      case "ArrowUp": shift(-7); break;
      case "ArrowDown": shift(7); break;
      case "PageUp": shift(0, e.shiftKey ? 0 : -1, e.shiftKey ? -1 : 0); break;
      case "PageDown": shift(0, e.shiftKey ? 0 : 1, e.shiftKey ? 1 : 0); break;
      case "Home": shift(-((focusDate.getDay() + 6) % 7)); break;
      case "End": shift(6 - ((focusDate.getDay() + 6) % 7)); break;
      case "Escape": close(true); break;
      case "Enter":
      case " ":
        if (!outOfRange(focusDate)) {
          onChange(toIso(focusDate));
          close(true);
        }
        break;
      default: return;
    }
    if (handled) e.preventDefault();
  };

  // The grid starts on the Monday of the week containing the 1st.
  const firstOfMonth = new Date(focusDate.getFullYear(), focusDate.getMonth(), 1);
  const lead = (firstOfMonth.getDay() + 6) % 7;
  const gridStart = new Date(firstOfMonth);
  gridStart.setDate(1 - lead);
  const cells = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    return d;
  });

  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ");

  return (
    <div ref={rootRef} className={cn("ds-datepicker", className)}>
      <label className="ds-datepicker__label" htmlFor={inputId}>
        {label}
        {required ? (
          <span className="ds-datepicker__required" aria-hidden="true">
            *
          </span>
        ) : null}
        {required ? <span className="ds-sr-only"> (required)</span> : null}
      </label>

      <div className={cn("ds-datepicker__field", error && "is-invalid", disabled && "is-disabled")}>
        <input
          ref={inputRef}
          id={inputId}
          className="ds-datepicker__input"
          type="text"
          inputMode="numeric"
          // The format is stated in the field itself, not only in a hint: this
          // is the one thing a citizen must know before typing, and a hint can
          // be scrolled past.
          placeholder="dd/mm/yyyy"
          value={text}
          disabled={disabled}
          required={required}
          aria-describedby={describedBy || undefined}
          aria-invalid={error ? true : undefined}
          onChange={(e) => setText(e.target.value)}
          onBlur={commitText}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown" || (e.altKey && e.key === "ArrowDown")) {
              e.preventDefault();
              setFocusDate(parseIso(value) ?? new Date());
              setOpen(true);
            }
          }}
        />
        <button
          type="button"
          className="ds-datepicker__trigger"
          disabled={disabled}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={open ? dialogId : undefined}
          aria-label={`Choose a date${value ? `, currently ${toDisplay(value)}` : ""}`}
          onClick={() => {
            setFocusDate(parseIso(value) ?? new Date());
            setOpen((v) => !v);
          }}
        >
          <Icon name="calendar_month" size={20} />
        </button>
      </div>

      {hint ? (
        <p id={hintId} className="ds-datepicker__hint">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="ds-datepicker__error" role="alert">
          {error}
        </p>
      ) : null}

      {open ? (
        <div id={dialogId} role="dialog" aria-modal="false" aria-label="Choose a date" className="ds-datepicker__dialog">
          <div className="ds-datepicker__nav">
            <button
              type="button"
              className="ds-datepicker__navbtn"
              aria-label="Previous month"
              onClick={() => shift(0, -1)}
            >
              <Icon name="chevron_left" size={20} />
            </button>
            <span className="ds-datepicker__month" aria-live="polite">
              {MONTHS[focusDate.getMonth()]} {focusDate.getFullYear()}
            </span>
            <button
              type="button"
              className="ds-datepicker__navbtn"
              aria-label="Next month"
              onClick={() => shift(0, 1)}
            >
              <Icon name="chevron_right" size={20} />
            </button>
          </div>

          <div
            ref={gridRef}
            role="grid"
            /* A grid is a composite widget: it can take focus itself before
               handing it to a cell. The real tab stop is the roving one on the
               days below — this only stops the role claiming a keyboard model
               the container cannot receive. */
            tabIndex={-1}
            aria-label={`${MONTHS[focusDate.getMonth()]} ${focusDate.getFullYear()}`}
            className="ds-datepicker__grid"
            onKeyDown={onGridKeyDown}
          >
            <div role="row" className="ds-datepicker__weekdays">
              {DAYS.map((d) => (
                <span key={d} role="columnheader" className="ds-datepicker__weekday">
                  {d}
                </span>
              ))}
            </div>
            {Array.from({ length: 6 }, (_, w) => (
              <div role="row" key={w} className="ds-datepicker__week">
                {cells.slice(w * 7, w * 7 + 7).map((d) => {
                  const inMonth = d.getMonth() === focusDate.getMonth();
                  const isSel = selected !== null && toIso(d) === toIso(selected);
                  const isActive = toIso(d) === toIso(focusDate);
                  const blocked = outOfRange(d);
                  return (
                    <button
                      key={toIso(d)}
                      type="button"
                      role="gridcell"
                      data-active={isActive}
                      // ROVING TAB STOP: exactly one day is tabbable, so Tab
                      // leaves the grid instead of walking 42 buttons.
                      tabIndex={isActive ? 0 : -1}
                      aria-selected={isSel}
                      aria-disabled={blocked || undefined}
                      aria-label={`${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`}
                      className={cn(
                        "ds-datepicker__day",
                        !inMonth && "is-outside",
                        isSel && "is-selected",
                        blocked && "is-blocked",
                      )}
                      onClick={() => {
                        if (blocked) return;
                        onChange(toIso(d));
                        close(true);
                      }}
                    >
                      {d.getDate()}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
