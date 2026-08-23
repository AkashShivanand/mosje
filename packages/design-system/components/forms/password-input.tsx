"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { Icon } from "../utilities/icon";
import { Input, type InputProps } from "./input";
import "./password-input.css";

export interface PasswordInputProps extends Omit<InputProps, "type"> {
  /** Accessible name for the reveal button when the password is hidden. */
  showLabel?: string;
  /** Accessible name for the reveal button when the password is visible. */
  hideLabel?: string;
  /** Hide the reveal button entirely (renders a plain password field). */
  hideToggle?: boolean;
}

/**
 * MoSJE / SAMAVESH password field with a reveal toggle.
 *
 * Typing a password blind is the single biggest cause of failed sign-ins, and
 * every login in the estate needs the same affordance — hence a design-system
 * atom rather than a per-portal one-off.
 *
 * The details that matter:
 *
 * - **It is a real `<button type="button">`.** Inside a form, a bare `<button>`
 *   defaults to `type="submit"`, so revealing the password would submit the
 *   form. This is the commonest bug in hand-rolled versions.
 * - **The accessible name states the action, not the state** ("Show password" /
 *   "Hide password"), so a screen-reader user hears what pressing it will do.
 *   `aria-pressed` carries the current state alongside it.
 * - **It is not a tab trap.** The toggle sits after the field in DOM order, so
 *   tabbing goes field → toggle → submit, which is the order people expect.
 * - **The browser's own reveal control is suppressed.** Chromium, Edge and
 *   Safari each inject one; left alone the user gets two competing buttons.
 * - **Autofill still works** — the field stays a real `<input>` whose `type`
 *   flips, which is what password managers key on. Always pass `autoComplete`
 *   ("current-password" to sign in, "new-password" to set one).
 *
 * Revealing resets to hidden on unmount only — a password left visible is the
 * user's explicit choice, and re-hiding it mid-typing would be worse.
 *
 * @example
 * <FormField label="Password" required>
 *   {(control) => (
 *     <PasswordInput {...control} name="password" autoComplete="current-password" required />
 *   )}
 * </FormField>
 */
export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(
    {
      showLabel = "Show password",
      hideLabel = "Hide password",
      hideToggle = false,
      className,
      disabled,
      ...rest
    },
    ref,
  ) {
    const [revealed, setRevealed] = React.useState(false);

    if (hideToggle) {
      return (
        <Input
          ref={ref}
          type="password"
          className={className}
          disabled={disabled}
          {...rest}
        />
      );
    }

    return (
      <div className={cn("ds-password", className)}>
        <Input ref={ref} type={revealed ? "text" : "password"} disabled={disabled} {...rest} />
        <button
          type="button"
          className="ds-password__toggle"
          onClick={() => setRevealed((v) => !v)}
          aria-label={revealed ? hideLabel : showLabel}
          aria-pressed={revealed}
          disabled={disabled}
          // Keeps the caret where it was: without this the field loses focus to
          // the button on click, and the user has to click back into it.
          onMouseDown={(event) => event.preventDefault()}
        >
          <Icon name={revealed ? "visibility_off" : "visibility"} size={20} aria-hidden />
        </button>
      </div>
    );
  },
);
