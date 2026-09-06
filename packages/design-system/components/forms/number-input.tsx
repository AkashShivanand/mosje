"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import "./number-input.css";

export interface NumberInputProps {
  /** Always visible. A number field with only a placeholder is a guess. */
  label: string;
  /** The value, or `null` when the field is empty. Empty is not zero. */
  value: number | null;
  onValueChange: (value: number | null) => void;
  min?: number;
  max?: number;
  /** How much the steppers and the arrow keys move. @default 1 */
  step?: number;
  /** Decimal places the value is held and shown to. @default 0 */
  precision?: number;
  /** Rendered inside the field before the number — "₹". Decorative; the label carries the meaning. */
  prefix?: string;
  /** Rendered inside the field after the number — "%", "km". Decorative. */
  suffix?: string;
  hint?: string;
  /** Shown under the field, and announced. */
  error?: string;
  /** Sets the error state without a message, so spreading FormField's object degrades rather than breaks. */
  invalid?: boolean;
  required?: boolean;
  disabled?: boolean;
  /** Hide the increment and decrement buttons. @default false */
  hideSteppers?: boolean;
  id?: string;
  className?: string;
}

const clamp = (n: number, min?: number, max?: number) => {
  if (min !== undefined && n < min) return min;
  if (max !== undefined && n > max) return max;
  return n;
};

/**
 * MoSJE / SAMAVESH Number input.
 *
 * A quantity, an amount, a count — a value the reader types and the system has
 * to store as a number.
 *
 * **It is not `<input type="number">`, and that is deliberate.** The native
 * number input silently discards what it cannot parse, so a citizen who types
 * "1,50,000" — the way an amount is written in India — submits an empty field
 * and is told nothing. It also scrolls the value on a mouse wheel over a
 * focused field, which has changed figures on forms without anybody touching
 * the keyboard. This is a text field carrying `role="spinbutton"` with the
 * ARIA value properties, so assistive technology gets the same information the
 * native control would give it and none of the behaviour that harms.
 *
 * **Empty is not zero.** `value` is `number | null`, and a cleared field
 * reports `null`. A form that stores zero for "the applicant did not answer"
 * has invented a figure, and on a grant application that figure is money.
 *
 * The steppers are a convenience, never the only route: `hideSteppers` removes
 * them and the field still works, because a citizen entering ₹4,50,000 is not
 * going to press an arrow four hundred and fifty thousand times.
 */
export function NumberInput({
  label,
  value,
  onValueChange,
  min,
  max,
  step = 1,
  precision = 0,
  prefix,
  suffix,
  hint,
  error,
  invalid = false,
  required = false,
  disabled = false,
  hideSteppers = false,
  id,
  className,
}: NumberInputProps): React.JSX.Element {
  const reactId = React.useId();
  const baseId = id ?? reactId;
  const inputId = `${baseId}-input`;
  const hintId = `${baseId}-hint`;
  const errorId = `${baseId}-error`;

  const format = React.useCallback(
    (n: number) => n.toFixed(precision),
    [precision],
  );
  const [text, setText] = React.useState(value === null ? "" : format(value));
  React.useEffect(() => {
    setText(value === null ? "" : format(value));
  }, [value, format]);

  /** Commit on blur, never on keystroke — "1," is not a number, and it is also not empty. */
  const commit = () => {
    const cleaned = text.replace(/[\s,]/g, "");
    if (cleaned === "") {
      if (value !== null) onValueChange(null);
      setText("");
      return;
    }
    const parsed = Number(cleaned);
    if (Number.isNaN(parsed)) {
      setText(value === null ? "" : format(value));
      return;
    }
    const next = clamp(Number(parsed.toFixed(precision)), min, max);
    setText(format(next));
    if (next !== value) onValueChange(next);
  };

  const nudge = (direction: 1 | -1) => {
    const from = value ?? min ?? 0;
    const next = clamp(Number((from + direction * step).toFixed(precision)), min, max);
    onValueChange(next);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (e.key === "ArrowUp") { e.preventDefault(); nudge(1); }
    if (e.key === "ArrowDown") { e.preventDefault(); nudge(-1); }
  };

  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined;
  const isInvalid = Boolean(error) || invalid;

  return (
    <div className={cn("ds-number", className)}>
      <label htmlFor={inputId} className="ds-number__label">
        {label}
        {required ? <span className="ds-number__required" aria-hidden>*</span> : null}
      </label>
      {hint ? <p id={hintId} className="ds-number__hint">{hint}</p> : null}

      <div className={cn("ds-number__control", isInvalid && "ds-number__control--error", disabled && "ds-number__control--disabled")}>
        {prefix ? <span className="ds-number__affix" aria-hidden>{prefix}</span> : null}
        <input
          id={inputId}
          type="text"
          className="ds-number__input"
          // `decimal` rather than `numeric`: a decimal keypad carries the
          // separator, and an amount may have one.
          inputMode="decimal"
          autoComplete="off"
          // The spinbutton role gives assistive technology the same value, range
          // and step the native control would — without its silent discarding.
          role="spinbutton"
          aria-valuenow={value ?? undefined}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-describedby={describedBy}
          aria-invalid={isInvalid || undefined}
          value={text}
          disabled={disabled}
          required={required}
          onChange={(e) => setText(e.target.value)}
          onBlur={commit}
          onKeyDown={onKeyDown}
        />
        {suffix ? <span className="ds-number__affix" aria-hidden>{suffix}</span> : null}
        {!hideSteppers ? (
          <span className="ds-number__steppers">
            <button
              type="button"
              className="ds-number__step"
              // The steppers duplicate the arrow keys, which the spinbutton role
              // already advertises — so they are hidden from assistive technology
              // rather than announced twice.
              aria-hidden
              tabIndex={-1}
              disabled={disabled || (max !== undefined && value !== null && value >= max)}
              onClick={() => nudge(1)}
            >
              +
            </button>
            <button
              type="button"
              className="ds-number__step"
              aria-hidden
              tabIndex={-1}
              disabled={disabled || (min !== undefined && value !== null && value <= min)}
              onClick={() => nudge(-1)}
            >
              −
            </button>
          </span>
        ) : null}
      </div>

      {error ? <p id={errorId} className="ds-number__error" role="alert">{error}</p> : null}
    </div>
  );
}
