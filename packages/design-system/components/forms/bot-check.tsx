"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import "./auth-fields.css";

/**
 * How the check presents itself to the citizen.
 *
 * - `invisible` — the default, and the only one that costs the citizen nothing.
 *   The server decides from a proof-of-work token, a honeypot and rate limiting;
 *   the component draws NOTHING while that is working or has worked. It appears
 *   only when the check has failed, because a form that silently refuses to
 *   submit is the worst outcome of the three.
 * - `checkbox` — one deliberate act ("I am not a robot"). Not a cognitive
 *   function test, so WCAG 2.2 3.3.8 permits it; use it where the server wants a
 *   human gesture on top of the invisible signal.
 *
 * **There is no distorted-characters mode, and adding one back is a conformance
 * decision, not a feature.** This component shipped with a `challenge` mode for
 * one day. It was removed on 2026-09-03 because it was a cognitive function test
 * with no alternative — a WCAG 2.2 AA failure under 3.3.8 — offered from inside
 * the component the estate tells people to reach for, which is how a new portal
 * inherits a conformance failure by default. A legacy backend that can issue
 * nothing else still has `CaptchaField`, which is marked Deprecated and says why
 * on its own page.
 */
export type BotCheckMode = "invisible" | "checkbox";

/** Where the server has got to. `idle` and `verifying` are not the same thing. */
export type BotCheckStatus = "idle" | "verifying" | "verified" | "failed";

export interface BotCheckProps {
  /** @default "invisible" */
  mode?: BotCheckMode;
  /** @default "idle" */
  status?: BotCheckStatus;
  /**
   * Where a citizen goes when the check will not pass them.
   *
   * **Required, and deliberately not optional.** A network-reputation or
   * proof-of-work check has no accessible workaround of its own: a citizen on a
   * shared connection, a screen reader that cannot complete the gesture, or an
   * older device that fails the work factor is simply stuck. This link is the
   * alternative WCAG 2.2 3.3.8 asks for, and making it optional is how it gets
   * dropped from the one portal that needed it.
   */
  helpHref: string;
  /** @default "Cannot complete this check? Contact support" */
  helpLabel?: string;
  /** `checkbox` mode — the citizen's gesture. */
  onVerify?: () => void;
  /** Shown when the check failed. A red border on its own is not an error. */
  error?: string;
  /** Accessible name for the group. @default "Security check" */
  label?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
}

const DEFAULT_HELP = "Cannot complete this check? Contact support";

/**
 * SAMAVESH bot check — the estate's replacement for a captcha field.
 *
 * ## Why this is not a captcha
 *
 * The distorted-characters test fails on both of the two things it is asked to
 * do, and the numbers are not close:
 *
 * | | figure |
 * |---|---|
 * | Audio challenges where three people agree on the answer | **31.2%** |
 * | Audio challenges **bots** solve correctly | **over 85%** |
 * | Time for a blind citizen to complete an audio challenge | **65s** (vs 9.8s visual) |
 * | Blind users who disagree that audio alternatives are accessible to them | **29.5%** |
 *
 * So the "accessible alternative" that a text captcha ships with is harder for
 * the people it is for and easier for the software it exists to stop. Adding one
 * would have made this component worse on both axes, which is why it does not
 * have one — and why it no longer has a characters test to attach one to.
 *
 * **WCAG 2.2 SC 3.3.8 Accessible Authentication (Minimum) is Level AA**, this
 * estate targets AA, and a cognitive function test with no alternative is a
 * conformance failure rather than a hardening measure.
 *
 * ## What to reach for, in order
 *
 * 1. **Nothing.** Server-side rate limiting plus a honeypot handles ordinary
 *    abuse at zero cost to the citizen. This is also the position of the UK
 *    Government Digital Service, and it is the right default for a form that is
 *    not under active attack.
 * 2. **`invisible`** — a self-hosted proof-of-work token (ALTCHA / Cap, SHA-256)
 *    issued and verified by our own server. No third party, no cookies, nothing
 *    leaving the estate, and therefore no consent banner and no data-residency
 *    question. A hosted service such as Turnstile solves the same problem but
 *    sends every visitor's signals to another company's infrastructure, which is
 *    a decision a Government of India property should take deliberately rather
 *    than by importing a script.
 * 3. **`checkbox`** — where the server wants a human gesture as well.
 *
 * There is no fourth step here on purpose. See `BotCheckMode`.
 *
 * ## What this component can and cannot do
 *
 * It renders the presentation and the escape hatch. **It cannot make a check
 * hard to bypass** — that is entirely server-side, and a bot never runs this
 * code. Do not read a passing bot check in the browser as a security guarantee.
 *
 * ## The states
 *
 * `idle` and `verifying` are different, and `invisible` draws nothing for
 * either — there is nothing for the citizen to do and nothing for them to know.
 * `failed` always draws, in both modes, because a form that will not submit and
 * will not say why is the failure this component exists to prevent.
 */
export function BotCheck({
  mode = "invisible",
  status = "idle",
  helpHref,
  helpLabel = DEFAULT_HELP,
  onVerify,
  error,
  label = "Security check",
  disabled = false,
  id,
  className,
}: BotCheckProps): React.JSX.Element | null {
  const reactId = React.useId();
  const fieldId = id ?? reactId;
  const errorId = `${fieldId}-error`;
  const failed = status === "failed";

  // The escape hatch. Rendered wherever the check is visible, and whenever it
  // has failed — including in `invisible` mode, which is the one case where the
  // citizen has no other way to understand why the form will not go through.
  const escape = (
    <a className="ds-botcheck__help" href={helpHref}>
      {helpLabel}
    </a>
  );

  const message = failed ? (
    <p className="ds-botcheck__error" id={errorId} role="alert">
      {error ?? "We could not confirm this request came from a person."}
    </p>
  ) : null;

  if (mode === "invisible") {
    // Nothing to show and nothing to do — so nothing is drawn. A "verified"
    // tick here would be the interface narrating its own construction.
    if (!failed) return null;
    return (
      <div className={cn("ds-botcheck", "ds-botcheck--invisible", className)}>
        {message}
        {escape}
      </div>
    );
  }

  return (
    <div className={cn("ds-botcheck", "ds-botcheck--checkbox", className)}>
      <label className="ds-botcheck__gesture" htmlFor={fieldId}>
        <input
          id={fieldId}
          type="checkbox"
          checked={status === "verified"}
          disabled={disabled || status === "verifying"}
          aria-describedby={failed ? errorId : undefined}
          onChange={() => onVerify?.()}
        />
        <span>{label}</span>
        {status === "verifying" ? (
          <span className="ds-botcheck__status" role="status">
            Checking…
          </span>
        ) : null}
      </label>
      {message}
      {escape}
    </div>
  );
}
