"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import "./auth-fields.css";

/** The four strengths we name, plus the resting state before anything is typed. */
export type PasswordStrength = "none" | "weak" | "fair" | "good" | "strong";

export interface PasswordStrengthMeterProps {
  /**
   * A zxcvbn score, 0–4, or `null` when the field is empty.
   *
   * Pass zxcvbn's own number — do NOT compute this from character classes
   * ("one capital, one symbol"). Those rules measure the wrong thing: they
   * fail a strong passphrase and pass `Passw0rd!`.
   */
  score: 0 | 1 | 2 | 3 | 4 | null;
  /** Label to the left of the strength word. @default "Password strength" */
  caption?: string;
  /** Links the meter to the password field it describes, for screen readers. */
  "aria-describedby"?: string;
  id?: string;
  className?: string;
}

const SEGMENTS = 4;

/** zxcvbn 0–4 collapses to four named buckets; 0 and 1 are both "weak". */
export function strengthFromScore(score: 0 | 1 | 2 | 3 | 4 | null): PasswordStrength {
  if (score === null) return "none";
  if (score <= 1) return "weak";
  if (score === 2) return "fair";
  if (score === 3) return "good";
  return "strong";
}

const FILLED: Record<PasswordStrength, number> = { none: 0, weak: 1, fair: 2, good: 3, strong: 4 };
const WORD: Record<PasswordStrength, string> = {
  none: "—",
  weak: "Weak",
  fair: "Fair",
  good: "Good",
  strong: "Strong",
};

/**
 * MoSJE / SAMAVESH password strength meter.
 *
 * Four segments and a word, shown under a password the user is **creating**.
 *
 * **When not to use it.** Never next to a password someone is *entering* — on a sign-in
 * screen it tells an attacker how close a guess is, and tells a legitimate user something
 * they cannot act on. Registration and password-reset only.
 *
 * **It is advisory, not a gate.** Do not block submit on a Fair score. If a policy minimum
 * exists, enforce it in the field's own error message, where it can say what to change;
 * a colour bar cannot.
 *
 * The word carries the meaning, not the colour — a red bar and an amber bar are the same
 * bar to a colour-blind user. Changes are announced politely so a screen-reader user is not
 * interrupted mid-word.
 */
export function PasswordStrengthMeter({
  score,
  caption = "Password strength",
  id,
  className,
  ...aria
}: PasswordStrengthMeterProps): React.JSX.Element {
  const strength = strengthFromScore(score);
  const filled = FILLED[strength];

  return (
    <div className={cn("ds-pwmeter", className)} id={id}>
      <div className="ds-pwmeter__track" aria-hidden="true">
        {Array.from({ length: SEGMENTS }, (_, i) => (
          <span
            key={i}
            className={cn("ds-pwmeter__seg", i < filled && `ds-pwmeter__seg--${strength}`)}
          />
        ))}
      </div>
      <p className="ds-pwmeter__legend">
        <span className="ds-pwmeter__caption">{caption}</span>
        <span
          className={cn("ds-pwmeter__level", `ds-pwmeter__level--${strength}`)}
          aria-live="polite"
          aria-describedby={aria["aria-describedby"]}
        >
          {WORD[strength]}
        </span>
      </p>
    </div>
  );
}
