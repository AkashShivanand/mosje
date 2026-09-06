"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { DatePicker } from "./date-picker";
import "./date-range-picker.css";

/** A named span a reader can take in one press — "Last 30 days", "This financial year". */
export interface DateRangePreset {
  id: string;
  label: string;
  /** ISO `yyyy-mm-dd`. */
  from: string;
  /** ISO `yyyy-mm-dd`. */
  to: string;
}

export interface DateRange {
  /** ISO `yyyy-mm-dd`. Empty string when unset. */
  from: string;
  /** ISO `yyyy-mm-dd`. Empty string when unset. */
  to: string;
}

export interface DateRangePickerProps {
  /** The group's name — "Period", "Sanction date". Always visible. */
  label: string;
  value: DateRange;
  onChange: (value: DateRange) => void;
  /** @default "From" */
  fromLabel?: string;
  /** @default "To" */
  toLabel?: string;
  /** ISO bounds applied to both ends. A date outside them cannot be typed or chosen. */
  min?: string;
  max?: string;
  /**
   * Named spans offered above the fields. A dashboard's period filter is chosen
   * from a preset far more often than it is typed.
   */
  presets?: DateRangePreset[];
  hint?: string;
  /** Shown under the group and announced. Overrides the component's own ordering message. */
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

function isOrdered(range: DateRange): boolean {
  if (!range.from || !range.to) return true;
  return range.from <= range.to;
}

/**
 * A period — the two dates a report, a filter or a sanction window runs between.
 *
 * Two `DatePicker`s in a named group, plus the presets a dashboard actually uses.
 * It is not a second calendar implementation: everything about typing a date,
 * the bounds, and the calendar itself comes from `DatePicker`, so a reader meets
 * one date field on this estate rather than two that behave differently.
 *
 * Four rules:
 *
 * 1. **An out-of-order range is REPORTED, never silently swapped.** If a reader
 *    types 30 September to 1 September, the component says so and leaves both
 *    dates alone. Swapping them quietly means the report runs over a period
 *    nobody asked for, and the reader has no way to know.
 * 2. **The end is bounded by the start, and the start by the end.** Once one is
 *    set the other's calendar cannot offer a date that would invert the range,
 *    so the error above is reachable only by typing.
 * 3. **A preset is a real button, not a select.** "Last 30 days" is one press;
 *    behind a dropdown it is three, on the control a dashboard's reader uses
 *    most.
 * 4. **The group is named, and both fields are named inside it.** "From" and
 *    "To" alone are meaningless to a screen-reader user moving between two
 *    period filters on one page; each field's accessible name carries the
 *    group's name with it.
 */
export function DateRangePicker({
  label,
  value,
  onChange,
  fromLabel = "From",
  toLabel = "To",
  min,
  max,
  presets,
  hint,
  error,
  required,
  disabled,
  className,
}: DateRangePickerProps): React.JSX.Element {
  const id = React.useId();
  const ordered = isOrdered(value);
  const message =
    error ?? (ordered ? undefined : "The end of the period is before its start. Check both dates.");
  const activePreset = presets?.find((preset) => preset.from === value.from && preset.to === value.to);

  return (
    <fieldset
      className={cn("ds-daterange", className)}
      aria-describedby={hint || message ? `${id}-msg` : undefined}
      disabled={disabled}
    >
      <legend className="ds-daterange__legend">
        {label}
        {required ? <span className="ds-daterange__req" aria-hidden="true"> *</span> : null}
      </legend>

      {presets && presets.length > 0 ? (
        <div className="ds-daterange__presets" role="group" aria-label={`${label} — quick periods`}>
          {presets.map((preset) => {
            const isActive = activePreset?.id === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                className={cn("ds-daterange__preset", isActive && "is-active")}
                aria-pressed={isActive}
                onClick={() => onChange({ from: preset.from, to: preset.to })}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      ) : null}

      <div className="ds-daterange__fields">
        <DatePicker
          label={`${fromLabel} — ${label}`}
          value={value.from}
          onChange={(from) => onChange({ ...value, from })}
          min={min}
          // The start can never be after an end that is already set.
          max={value.to || max}
          invalid={!ordered}
          required={required}
          disabled={disabled}
        />
        <DatePicker
          label={`${toLabel} — ${label}`}
          value={value.to}
          onChange={(to) => onChange({ ...value, to })}
          // The end can never be before a start that is already set.
          min={value.from || min}
          max={max}
          invalid={!ordered}
          required={required}
          disabled={disabled}
        />
      </div>

      {hint || message ? (
        <p
          id={`${id}-msg`}
          className={cn("ds-daterange__msg", message && "is-error")}
          role={message ? "alert" : undefined}
        >
          {message ?? hint}
        </p>
      ) : null}
    </fieldset>
  );
}
