"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { IconButton } from "../actions/icon-button";
import { Loader } from "../feedback/loader";
import { Icon } from "../utilities/icon";
import { Checkbox } from "./checkbox";
import { Input } from "./input";
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
 * - `challenge` — the legacy distorted-characters test. **Deprecated.** It is
 *   both the least accessible and the least effective option; see the component
 *   docstring for the measurements.
 */
export type BotCheckMode = "invisible" | "checkbox" | "challenge";

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
  /** `challenge` mode — what the server issued. */
  challenge?:
    | { type: "image"; src: string; alt?: string }
    | { type: "text"; characters: string };
  /** `challenge` mode — the typed answer. Controlled. */
  value?: string;
  onValueChange?: (next: string) => void;
  /** `challenge` mode — asks for a new challenge. It MUST also clear `value`. */
  onRefresh?: () => void;
  /** Shown when the check failed. A red border on its own is not an error. */
  error?: string;
  /**
   * What the check is CALLED. It names the group for assistive technology and
   * is printed beside the shield mark, so a citizen can tell what the box on
   * their form is for.
   *
   * It is not the text beside the tick box — see `gestureLabel`. Those were one
   * prop until the Figma master and the code were compared side by side: a
   * checkbox labelled "Security check" reads as a heading rather than as the
   * statement the citizen is agreeing to.
   *
   * @default "Security check"
   */
  label?: string;
  /**
   * The statement beside the tick box in `checkbox` mode — what the citizen is
   * asserting by ticking it. Keep it a first-person claim.
   * @default "I am not a robot"
   */
  gestureLabel?: string;
  /** `challenge` mode placeholder. @default "Enter the characters" */
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
}

const DEFAULT_HELP = "Cannot complete this check? Contact support";
const DEFAULT_GESTURE = "I am not a robot";

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
 * have one.
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
 * 4. **`challenge`** — only where a legacy backend can issue nothing else.
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
 * `failed` always draws, in every mode, because a form that will not submit and
 * will not say why is the failure this component exists to prevent.
 */
export function BotCheck({
  mode = "invisible",
  status = "idle",
  helpHref,
  helpLabel = DEFAULT_HELP,
  onVerify,
  challenge,
  value = "",
  onValueChange,
  onRefresh,
  error,
  label = "Security check",
  gestureLabel = DEFAULT_GESTURE,
  placeholder = "Enter the characters",
  disabled = false,
  id,
  className,
}: BotCheckProps): React.JSX.Element | null {
  const reactId = React.useId();
  const fieldId = id ?? reactId;
  const errorId = `${fieldId}-error`;
  const statusId = `${fieldId}-status`;
  const failed = status === "failed";
  const verifying = status === "verifying";
  const verified = status === "verified";

  // The escape hatch. Rendered wherever the check is visible, and whenever it
  // has failed — including in `invisible` mode, which is the one case where the
  // citizen has no other way to understand why the form will not go through.
  // It sits OUTSIDE the card, because a route out of a failed check should not
  // be drawn inside the thing that failed.
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

  // `idle` says nothing: there is nothing to report until the citizen or the
  // server has done something. The spinner and the tick are `aria-hidden`
  // because the sentence beside them already carries the meaning, and the
  // Loader's own `role="status"` would otherwise nest inside this one.
  const statusLine =
    verifying || verified ? (
      <p className="ds-botcheck__status" id={statusId} role="status">
        {verifying ? (
          <Loader size="sm" label="" aria-hidden="true" />
        ) : (
          <Icon name="check_circle" size={20} aria-hidden />
        )}
        <span>{verifying ? "Checking…" : "Verified"}</span>
      </p>
    ) : null;

  // The mark that says WHAT this box is. Without it a tick box on a government
  // form is unexplained, and the citizen is being asked to agree to nothing in
  // particular. It is a label, not a badge: no logo, no vendor, no wordmark.
  const mark = (
    <span className="ds-botcheck__mark">
      <Icon name="verified_user" size={20} aria-hidden />
      <span>{label}</span>
    </span>
  );

  const describedBy = failed ? errorId : verifying || verified ? statusId : undefined;

  // One card, whatever the mode. It is what makes the check read as a single
  // object rather than as a loose control that wandered into the form, and it
  // is where the status colour lives.
  const card = (control: React.ReactNode, below?: React.ReactNode) => (
    <div className="ds-botcheck__card" data-status={status}>
      <div className="ds-botcheck__main">
        {control != null && <div className="ds-botcheck__control">{control}</div>}
        {mark}
      </div>
      {below}
      {statusLine}
      {message}
    </div>
  );

  const shell = (modifier: string, children: React.ReactNode) => (
    <div
      className={cn("ds-botcheck", modifier, className)}
      role="group"
      aria-label={label}
    >
      {children}
      {escape}
    </div>
  );

  if (mode === "invisible") {
    // Nothing to show and nothing to do — so nothing is drawn. A "verified"
    // tick here would be the interface narrating its own construction.
    if (!failed) return null;
    return shell("ds-botcheck--invisible", card(null));
  }

  if (mode === "checkbox") {
    return shell(
      "ds-botcheck--checkbox",
      card(
        <Checkbox
          id={fieldId}
          checked={verified}
          disabled={disabled || verifying}
          label={gestureLabel}
          aria-describedby={describedBy}
          onChange={() => onVerify?.()}
        />,
      ),
    );
  }

  // `challenge` — deprecated. Kept so a legacy backend is not a blocker, and
  // deliberately last so nobody reaches it by accident.
  return shell(
    "ds-botcheck--challenge",
    card(
      <div className="ds-botcheck__row">
        {challenge?.type === "image" ? (
          <span className="ds-botcheck__challenge">
            <img src={challenge.src} alt={challenge.alt ?? "Security check image"} />
          </span>
        ) : (
          <span
            className="ds-botcheck__challenge"
            role="img"
            aria-label="Security check characters"
          >
            {challenge?.type === "text" ? challenge.characters : ""}
          </span>
        )}
        <IconButton
          type="button"
          variant="neutral"
          appearance="outlined"
          size="lg"
          onClick={onRefresh}
          disabled={disabled}
          aria-label="Get a new security check. This clears anything you have typed."
          icon={<Icon name="refresh" size={24} aria-hidden />}
        />
      </div>,
      <Input
        id={fieldId}
        aria-label={label}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        invalid={failed}
        autoComplete="off"
        aria-describedby={describedBy}
        onChange={(e) => onValueChange?.(e.target.value)}
      />,
    ),
  );
}
