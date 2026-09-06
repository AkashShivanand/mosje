"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import "./time-slot.css";

export interface TimeSlotOption {
  /** Stable identity, and what `onChange` receives. */
  id: string;
  /** The window as the reader should read it — "10:00 – 10:30". */
  label: string;
  /**
   * How many places are left. `0` renders the slot as full and unselectable.
   * Omit it where capacity is not tracked; the slot is then simply available.
   */
  remaining?: number;
  /** Unselectable for a reason other than being full — a holiday, a closed centre. */
  disabled?: boolean;
  /** Why it cannot be taken. Shown under the label and announced with it. */
  unavailableReason?: string;
}

export interface TimeSlotGroup {
  /** "Morning", "Afternoon" — or a date, where the picker spans days. */
  label: string;
  slots: TimeSlotOption[];
}

export interface TimeSlotProps {
  /** The windows on offer, in the order they occur. */
  groups: TimeSlotGroup[];
  /** The chosen slot's `id`, or `null`. */
  value: string | null;
  onChange: (id: string) => void;
  /**
   * Names the whole set — "Appointment time". Required: a grid of times with no
   * name tells a screen-reader user twenty numbers and not what they are for.
   */
  label: string;
  /** One line under the group name, where a rule applies to the whole set. */
  description?: string;
  /** The form field name, so the choice submits without JavaScript. */
  name?: string;
  className?: string;
}

/**
 * MoSJE / SAMAVESH Time Slot picker.
 *
 * A grid of bookable windows — the shape behind Garima Greh's daily programme,
 * SCW's events, and any appointment a citizen has to choose.
 *
 * **It is a radio group, and it is built from real radios.** Each slot is an
 * `<input type="radio">` visually replaced by its label, so the arrow keys move
 * between slots, only one can be chosen, the choice submits with the form, and
 * a screen reader announces "3 of 12" without any of that being written here.
 * A grid of buttons with a `selected` class has none of it.
 *
 * **A full slot stays on the page.** It renders as unavailable rather than
 * disappearing, because "10:30 is taken" and "there is no 10:30" are different
 * facts, and a citizen deciding when to travel needs the first one. The reason
 * sits inside the slot's own `<label>`, so it is part of the control's
 * accessible name and is read when the slot is reached in browse mode.
 *
 * Unlike `Menu`, an unavailable slot takes the NATIVE `disabled` attribute
 * rather than `aria-disabled`. The two components reach opposite conclusions
 * for the same reason: a radio group selects on arrow, so an `aria-disabled`
 * slot would still be chosen the moment the arrow key landed on it. `disabled`
 * is what makes the arrow keys step over it, and the label text remains on the
 * page and in the accessibility tree either way.
 */
export function TimeSlot({
  groups,
  value,
  onChange,
  label,
  description,
  name,
  className,
}: TimeSlotProps): React.JSX.Element {
  const auto = React.useId();
  const fieldName = name ?? `slot-${auto}`;
  const labelId = `${auto}-label`;
  const descId = description ? `${auto}-desc` : undefined;

  return (
    <fieldset
      className={cn("ds-slot", className)}
      aria-labelledby={labelId}
      aria-describedby={descId}
    >
      <legend id={labelId} className="ds-slot__legend">
        {label}
      </legend>
      {description ? (
        <p id={descId} className="ds-slot__description">
          {description}
        </p>
      ) : null}

      {groups.map((group) => (
        <div key={group.label} className="ds-slot__group">
          <span className="ds-slot__groupLabel">{group.label}</span>
          <div className="ds-slot__grid">
            {group.slots.map((slot) => {
              const full = slot.remaining === 0;
              const unavailable = full || Boolean(slot.disabled);
              const reason =
                slot.unavailableReason ?? (full ? "Full" : undefined);
              const id = `${auto}-${slot.id}`;
              return (
                <div key={slot.id} className="ds-slot__cell">
                  <input
                    type="radio"
                    id={id}
                    className="ds-slot__input"
                    name={fieldName}
                    value={slot.id}
                    checked={value === slot.id}
                    disabled={unavailable}
                    onChange={() => onChange(slot.id)}
                  />
                  <label
                    htmlFor={id}
                    className={cn(
                      "ds-slot__label",
                      unavailable && "ds-slot__label--unavailable",
                    )}
                  >
                    <span className="ds-slot__time">{slot.label}</span>
                    {reason ? (
                      <span className="ds-slot__meta">{reason}</span>
                    ) : slot.remaining !== undefined ? (
                      <span className="ds-slot__meta">
                        {slot.remaining} left
                      </span>
                    ) : null}
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </fieldset>
  );
}
