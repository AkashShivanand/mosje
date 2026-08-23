"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { Icon } from "../utilities/icon";
import { Input } from "./input";
import "./auth-fields.css";

export interface CaptchaFieldProps {
  /** The challenge the server issued: an image URL, or the characters for a text fallback. */
  challenge: { type: "image"; src: string; alt?: string } | { type: "text"; characters: string };
  /** Current answer. Controlled. */
  value: string;
  onValueChange: (next: string) => void;
  /** Asks the server for a new challenge. It MUST also clear `value`. */
  onRefresh: () => void;
  /** Error message shown under the field. Presence of a string renders the error state. */
  error?: string;
  /** Accessible name for the answer input. @default "Security check" */
  label?: string;
  /** Placeholder inside the answer input. @default "Enter the characters" */
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
}

/**
 * MoSJE / SAMAVESH security-check (captcha) field — a challenge, a refresh control, an answer.
 *
 * **Read this before adding one.** A captcha is an accessibility *risk*, not a feature.
 * WCAG 2.2 SC 3.3.8 *Accessible Authentication (Minimum)* is Level AA, and this estate
 * targets AA — so a cognitive-function test with no alternative is a conformance failure,
 * not a hardening measure. Prefer rate limiting, a server-side signal, or nothing at all.
 * If you must ship one, ship an audio alternative alongside it.
 *
 * Only one surface in the estate uses this today (SMILE-Transgender / Garima Greh). Adding
 * it to another portal is a decision someone should be able to justify.
 *
 * Refresh replaces the challenge **and** clears the answer — say so rather than wiping the
 * field silently. An error needs the message; a red border alone is not an error.
 */
export function CaptchaField({
  challenge,
  value,
  onValueChange,
  onRefresh,
  error,
  label = "Security check",
  placeholder = "Enter the characters",
  disabled = false,
  id,
  className,
}: CaptchaFieldProps): React.JSX.Element {
  const reactId = React.useId();
  const fieldId = id ?? reactId;
  const errorId = `${fieldId}-error`;

  return (
    <div className={cn("ds-captcha", className)}>
      <div className="ds-captcha__row">
        {challenge.type === "image" ? (
          <span className="ds-captcha__challenge">
            <img src={challenge.src} alt={challenge.alt ?? "Security check image"} />
          </span>
        ) : (
          <span className="ds-captcha__challenge" role="img" aria-label="Security check characters">
            {challenge.characters}
          </span>
        )}
        <button
          type="button"
          className="ds-captcha__refresh"
          onClick={onRefresh}
          disabled={disabled}
          aria-label="Get a new security check. This clears anything you have typed."
        >
          <Icon name="refresh" size={24} aria-hidden />
        </button>
      </div>
      <Input
        id={fieldId}
        aria-label={label}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        invalid={Boolean(error)}
        autoComplete="off"
        aria-describedby={error ? errorId : undefined}
        onChange={(e) => onValueChange(e.target.value)}
      />
      {error ? (
        <p className="ds-captcha__error" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
