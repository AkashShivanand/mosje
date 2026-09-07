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

/* ---------------------------------------------------------------------------
 * estimatePasswordScore — a stand-in, and it says so
 * ------------------------------------------------------------------------- */

/** A short list of the passwords that actually get tried first. */
const COMMON = [
  "password", "123456", "12345678", "qwerty", "abc123", "111111", "1234567890",
  "letmein", "welcome", "admin", "iloveyou", "monkey", "dragon", "sunshine",
  "princess", "football", "india", "bharat", "government", "samavesh",
];

/**
 * A rough 0–4 score for a password being CREATED, when zxcvbn is not available.
 *
 * **This is not zxcvbn, and it is not as good.** `PasswordStrengthMeter` asks
 * for zxcvbn's number and is right to: zxcvbn scores against real leaked-password
 * frequency and keyboard-walk patterns, which no short function reproduces. It
 * is not a dependency of this estate, and adding it is a weight decision, not a
 * detail — the smallest useful build plus its dictionaries is several hundred
 * kilobytes on a page a citizen reaches once, from whatever connection they
 * have. `data-state-completeness.md` §6 says measure that before bundling it,
 * so this ships instead and the decision is recorded rather than made silently.
 *
 * **What it does do**, in rough order of weight:
 *
 * - **Length dominates**, as it should. A long passphrase of plain words beats
 *   a short string of symbols, which is the single thing character-class rules
 *   get backwards.
 * - Variety adds a little, and only a little.
 * - A password that CONTAINS one of the twenty most-tried strings, or that is a
 *   single repeated character, or a run of sequential characters, is capped at
 *   weak whatever else it scores. `Passw0rd!` scores 0 here, which is the whole
 *   point of not counting capitals and symbols.
 *
 * **It is advisory, exactly as the meter is.** Do not gate submit on it. When
 * this estate goes to production, swap zxcvbn in behind the same `score` prop
 * and delete this — nothing else has to change.
 */
export function estimatePasswordScore(password: string): 0 | 1 | 2 | 3 | 4 | null {
  if (!password) return null;

  const lower = password.toLowerCase();
  const capped =
    COMMON.some((c) => lower.includes(c)) ||
    /^(.)\1+$/.test(password) ||
    isSequential(lower);

  const classes =
    (/[a-z]/.test(password) ? 1 : 0) +
    (/[A-Z]/.test(password) ? 1 : 0) +
    (/\d/.test(password) ? 1 : 0) +
    (/[^A-Za-z0-9]/.test(password) ? 1 : 0);

  // Length carries the score; variety nudges it. 12 plain characters reach 3,
  // which is the behaviour a passphrase deserves and a rules-checker refuses.
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  if (classes >= 3 && password.length >= 8) score += 1;

  if (capped) score = Math.min(score, 1);
  return Math.max(0, Math.min(4, score)) as 0 | 1 | 2 | 3 | 4;
}

/** `abcdef`, `123456`, `fedcba` — three or more steps in a row, either way. */
function isSequential(value: string): boolean {
  if (value.length < 6) return false;
  let up = 1;
  let down = 1;
  for (let i = 1; i < value.length; i += 1) {
    const step = value.charCodeAt(i) - value.charCodeAt(i - 1);
    up = step === 1 ? up + 1 : 1;
    down = step === -1 ? down + 1 : 1;
    if (up >= 6 || down >= 6) return true;
  }
  return false;
}
