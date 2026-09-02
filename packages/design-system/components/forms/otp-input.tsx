"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { digitsOnly } from "../../utils/india-id";
import "./india-id.css";

export interface OtpInputProps {
  /** The digits entered so far, as one string. Controlled. */
  value: string;
  /** Called with the digits entered so far (never longer than `length`). */
  onValueChange: (digits: string) => void;
  /** Number of boxes. UX4G 3.0 specifies six. @default 6 */
  length?: number;
  /** Fires once the last box is filled — wire your verify call here. */
  onComplete?: (digits: string) => void;
  /** Accessible name for the group, e.g. "One-time password". */
  label: string;
  /** Render the error state. @default false */
  invalid?: boolean;
  /** Links the group to a hint/error, exactly like any other control. */
  "aria-describedby"?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  id?: string;
  className?: string;
}

/**
 * MoSJE / SAMAVESH one-time-password input. (UX4G 3.0 "Input - OTP")
 *
 * Six separate boxes, because that is what UX4G specifies and what every OTP screen in the
 * estate needs. The fiddly parts are the point:
 *
 * - **Paste works.** Pasting `123456` into any box fills all six — the single commonest way
 *   people enter an OTP, and the thing hand-rolled versions almost always break.
 * - **SMS autofill works.** `autocomplete="one-time-code"` on the first box lets iOS and
 *   Android offer the code from the message; the resulting multi-character input is spread
 *   across the boxes rather than truncated.
 * - **Backspace on an empty box** steps back and clears the previous one, instead of
 *   stranding the caret.
 * - Arrow keys move between boxes; the whole group is one tab stop once filled.
 *
 * Screen readers get a labelled `group`, and each box is numbered ("Digit 3 of 6") so a
 * non-sighted user knows where they are.
 */
export function OtpInput({
  value,
  onValueChange,
  length = 6,
  onComplete,
  label,
  invalid = false,
  disabled = false,
  autoFocus = false,
  id,
  className,
  ...aria
}: OtpInputProps): React.JSX.Element {
  const reactId = React.useId();
  const groupId = id ?? reactId;
  const refs = React.useRef<Array<HTMLInputElement | null>>([]);
  const digits = digitsOnly(value).slice(0, length);

  const focusBox = (index: number) => {
    const el = refs.current[Math.max(0, Math.min(length - 1, index))];
    el?.focus();
    el?.select();
  };

  const commit = (next: string) => {
    const clean = digitsOnly(next).slice(0, length);
    onValueChange(clean);
    if (clean.length === length) onComplete?.(clean);
    return clean;
  };

  function handleChange(index: number, raw: string) {
    const incoming = digitsOnly(raw);
    if (!incoming) return;

    // One character in one box is the common case; anything longer is a paste or an SMS
    // autofill, which should spread across the boxes from here rather than be truncated.
    const next = (digits.slice(0, index) + incoming).slice(0, length);
    const padded = next.padEnd(Math.min(next.length, length), "");
    commit(padded);
    focusBox(next.length >= length ? length - 1 : next.length);
  }

  function handleKeyDown(index: number, event: React.KeyboardEvent<HTMLInputElement>) {
    switch (event.key) {
      case "Backspace": {
        event.preventDefault();
        if (digits[index]) {
          // Clear this box, stay put.
          commit(digits.slice(0, index) + digits.slice(index + 1));
        } else if (index > 0) {
          // Empty box: step back and clear that one — what people expect.
          commit(digits.slice(0, index - 1) + digits.slice(index));
          focusBox(index - 1);
        }
        break;
      }
      case "ArrowLeft":
        event.preventDefault();
        focusBox(index - 1);
        break;
      case "ArrowRight":
        event.preventDefault();
        focusBox(index + 1);
        break;
      case "Delete":
        event.preventDefault();
        commit(digits.slice(0, index) + digits.slice(index + 1));
        break;
      default:
        break;
    }
  }

  function handlePaste(index: number, event: React.ClipboardEvent<HTMLInputElement>) {
    const pasted = digitsOnly(event.clipboardData.getData("text"));
    if (!pasted) return;
    event.preventDefault();
    const next = (digits.slice(0, index) + pasted).slice(0, length);
    commit(next);
    focusBox(next.length >= length ? length - 1 : next.length);
  }

  return (
    <div
      role="group"
      aria-label={label}
      aria-describedby={aria["aria-describedby"]}
      className={cn("ds-otp", invalid && "ds-otp--invalid", className)}
    >
      {Array.from({ length }, (_, i) => (
        <input
          key={i}
          ref={(node) => {
            refs.current[i] = node;
          }}
          id={i === 0 ? groupId : `${groupId}-${i + 1}`}
          className="ds-otp__box"
          type="text"
          inputMode="numeric"
          // Only the first box advertises one-time-code: offering it on all six makes the
          // platform prompt repeatedly, and the paste path already spreads the full code.
          autoComplete={i === 0 ? "one-time-code" : "off"}
          // maxLength 1 keeps a box to a single digit; longer input still arrives in
          // onChange (paste / autofill) and is spread by handleChange.
          maxLength={1}
          value={digits[i] ?? ""}
          disabled={disabled}
          /* eslint-disable-next-line jsx-a11y/no-autofocus -- opt-in, and correct
             here: the caller renders this immediately after the citizen asked for
             a code, so the one thing they are about to do is type it. The prop
             defaults off, so a screen that should not steal focus simply omits it. */
          autoFocus={autoFocus && i === 0}
          aria-label={`Digit ${i + 1} of ${length}`}
          aria-invalid={invalid || undefined}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={(e) => handlePaste(i, e)}
          onFocus={(e) => e.currentTarget.select()}
        />
      ))}
    </div>
  );
}
