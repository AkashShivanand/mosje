"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { FormField } from "../forms/form-field";
import { Input } from "../forms/input";
import { OtpInput } from "../forms/otp-input";
import { PasswordInput } from "../forms/password-input";
import { MaskedContactRow, ResendTimer } from "./auth-parts";
import "./credential-fields.css";

/* ---------------------------------------------------------------------------
 * The swappable region of AuthFormCard
 *
 * `AuthFormCard` draws eight regions and SEVEN of them are the same whatever
 * mode a portal signs in with — role tabs, header, the DigiLocker handoff, the
 * method tabs, the primary action, the consent line, the account prompt. Only
 * the region between the method tabs and the button changes.
 *
 * Until 2026-09-06 that was expressed as a variant axis, in Figma and in a
 * four-armed conditional here. It did not survive its fourth value: `Password`,
 * `PIN` and `DARPAN` were structurally identical drawings, differing by a field
 * label and one hidden control, because the axis was asking two questions at
 * once — *what identifies you* (a username, a DARPAN ID) and *how do you prove
 * it* (a password, a PIN, a code). Two questions on one axis multiply: five
 * identifiers against four secrets is twenty variants of an eight-region card.
 *
 * So the region is a SLOT, and these are the stacks that go in it. Adding a
 * credential mode adds one small component here; it does not clone the card.
 *
 * **One slot, not two.** Splitting identifier from secret would model the
 * taxonomy more purely and would offer combinations that cannot ship — this
 * estate has no DARPAN-ID-plus-OTP route, and a design system that draws one is
 * lying about the department. The pairs that exist are named; the rest are not
 * generated. Same reasoning that refused the 90-variant matrix in
 * `FIGMA-SPEC.md` §2.
 *
 * Each stack is CONTROLLED and holds no state. The state machine — which mode
 * is active, whether an OTP has been sent, what the submit payload looks like —
 * stays in `PortalLoginTemplate`, because that is the part a portal must not be
 * able to get wrong. A slot that exported the auth logic to twenty portal teams
 * would be a security posture change wearing a refactor's clothes.
 * ------------------------------------------------------------------------- */

/** The stack's own vertical rhythm. Every stack uses it, so they are interchangeable. */
function Stack({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}): React.JSX.Element {
  return <div className={cn("ds-authfields", className)}>{children}</div>;
}

/**
 * A field label with its recovery route on the same row.
 *
 * The reference (`56693:8704`) puts "Forgot Password?" on the label line rather
 * than under the input — where a citizen looks BEFORE they have failed rather
 * than after. Passed as `FormField`'s `label`, so associating it with the
 * control is still `FormField`'s job.
 */
function LabelWithLink({
  text,
  href,
  linkText,
}: {
  text: string;
  href?: string;
  linkText: string;
}): React.JSX.Element {
  if (!href) return <>{text}</>;
  return (
    <span className="ds-authfields__labelrow">
      <span>{text}</span>
      <a href={href}>{linkText}</a>
    </span>
  );
}

/* ---------------------------------------------------------------------------
 * PasswordFields
 * ------------------------------------------------------------------------- */

export interface PasswordFieldsProps {
  /** The identifier's value — username, email or mobile. */
  identifier: string;
  onIdentifierChange: (value: string) => void;
  /** The secret's value. */
  password: string;
  onPasswordChange: (value: string) => void;
  /** @default "Username / Email / Mobile" */
  identifierLabel?: React.ReactNode;
  /** @default "Enter User ID or Registered Email" */
  identifierPlaceholder?: string;
  /** @default "Password" */
  passwordLabel?: string;
  /** @default "Enter Password" */
  passwordPlaceholder?: string;
  /** Where "Forgot Password?" goes. Omit it and no link is drawn. */
  forgotHref?: string;
  /**
   * The bot check, rendered UNDER the password field.
   *
   * **It belongs to this stack, not to the card.** It was a region of the card
   * until 2026-09-06, which put it on every mode including DARPAN — where the
   * department's own screen has none — and left it positioned but never
   * rendered on any of them. A check guards a typed secret; a stack with no
   * secret has nothing for it to guard.
   *
   * Pass `null` (the default) and nothing renders. The card never constructs
   * one: `PortalLoginTemplate` owns the hook, because the token has to reach
   * the submit payload.
   */
  botCheck?: React.ReactNode;
  className?: string;
}

/**
 * Identifier + password. The mode most portals sign in with.
 *
 * `autoComplete` is `username` / `current-password` so a password manager fills
 * both. Do not "improve" this by renaming the fields — a manager that cannot
 * recognise a login form is a manager that trains people to type secrets by
 * hand.
 */
export function PasswordFields({
  identifier,
  onIdentifierChange,
  password,
  onPasswordChange,
  identifierLabel = "Username / Email / Mobile",
  identifierPlaceholder = "Enter User ID or Registered Email",
  passwordLabel = "Password",
  passwordPlaceholder = "Enter Password",
  forgotHref,
  botCheck = null,
  className,
}: PasswordFieldsProps): React.JSX.Element {
  return (
    <Stack className={className}>
      <FormField label={identifierLabel} required>
        {(control) => (
          <Input
            {...control}
            type="text"
            autoComplete="username"
            value={identifier}
            onChange={(e) => onIdentifierChange(e.target.value)}
            placeholder={identifierPlaceholder}
          />
        )}
      </FormField>

      <FormField
        label={<LabelWithLink text={passwordLabel} href={forgotHref} linkText="Forgot Password?" />}
        labelText={passwordLabel}
        required
      >
        {(control) => (
          <PasswordInput
            {...control}
            autoComplete="current-password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder={passwordPlaceholder}
          />
        )}
      </FormField>

      {botCheck}
    </Stack>
  );
}

/* ---------------------------------------------------------------------------
 * PinFields
 * ------------------------------------------------------------------------- */

export interface PinFieldsProps {
  identifier: string;
  onIdentifierChange: (value: string) => void;
  /** The PIN. Non-digits are stripped before this is called. */
  pin: string;
  onPinChange: (value: string) => void;
  /** @default "Username / Email / Mobile" */
  identifierLabel?: React.ReactNode;
  /** @default "Enter User ID or Registered Mobile" */
  identifierPlaceholder?: string;
  /** How many digits. @default 6 */
  length?: number;
  /** Where "Forgot PIN?" goes. */
  forgotHref?: string;
  /** The bot check, under the PIN field. See `PasswordFieldsProps.botCheck`. */
  botCheck?: React.ReactNode;
  className?: string;
}

/**
 * Identifier + numeric PIN. NOS signs in this way and only this way.
 *
 * The same anatomy as `PasswordFields`, because that is what the handoff draws —
 * only the secret and its recovery link differ. It is a separate component
 * rather than a prop on that one because the two disagree on four things a
 * shared component would have to branch on anyway: `inputMode`, `maxLength`,
 * digit stripping, and `autoComplete="off"` (a PIN must never be offered to a
 * password manager as a website password).
 *
 * **A PIN never leaves as `password`.** `PortalLoginTemplate` puts it on
 * `credentials.pin`; a consumer that receives one under the other name would
 * store it in the wrong column.
 */
export function PinFields({
  identifier,
  onIdentifierChange,
  pin,
  onPinChange,
  identifierLabel = "Username / Email / Mobile",
  identifierPlaceholder = "Enter User ID or Registered Mobile",
  length = 6,
  forgotHref,
  botCheck = null,
  className,
}: PinFieldsProps): React.JSX.Element {
  return (
    <Stack className={className}>
      <FormField label={identifierLabel} required>
        {(control) => (
          <Input
            {...control}
            type="text"
            autoComplete="username"
            value={identifier}
            onChange={(e) => onIdentifierChange(e.target.value)}
            placeholder={identifierPlaceholder}
          />
        )}
      </FormField>

      <FormField
        label={<LabelWithLink text="PIN" href={forgotHref} linkText="Forgot PIN?" />}
        labelText="PIN"
        required
      >
        {(control) => (
          <PasswordInput
            {...control}
            inputMode="numeric"
            autoComplete="off"
            maxLength={length}
            value={pin}
            onChange={(e) => onPinChange(e.target.value.replace(/\D/g, ""))}
            placeholder={`Enter your ${length}-digit PIN`}
          />
        )}
      </FormField>

      {botCheck}
    </Stack>
  );
}

/* ---------------------------------------------------------------------------
 * DarpanFields
 * ------------------------------------------------------------------------- */

export interface DarpanFieldsProps {
  /** The NGO-DARPAN Unique ID, e.g. `DL/2018/0123456`. Upper-cased as typed. */
  darpanId: string;
  onDarpanIdChange: (value: string) => void;
  /** The organisation's PAN. Upper-cased as typed. */
  pan: string;
  onPanChange: (value: string) => void;
  /**
   * The sentence under the button naming the roles this route does NOT serve.
   *
   * **Portal copy, not the design system's.** E-Anudaan's other roles are DWO,
   * State, Ministry, Finance and PMU; another portal's would be different ones,
   * and a default here would put E-Anudaan's org chart on every portal that
   * ever adopts DARPAN. Omit it and nothing renders.
   */
  note?: React.ReactNode;
  className?: string;
}

/**
 * NGO-DARPAN Unique ID + PAN. E-Anudaan's organisation applicants.
 *
 * **This is not the password form with a different label**, which is what both
 * the library and this package drew until 2026-09-06. The department's own
 * screen asks an organisation for two identifiers it holds on file — the DARPAN
 * ID issued by NITI Aayog and the organisation's PAN — and asks for no password
 * and no security check at all. Two identifiers matched against a register is a
 * different proof from a secret only the holder knows, and drawing it as a
 * password form told a designer it was the same thing.
 *
 * **No bot check, deliberately.** The department's screen has none, and this
 * stack takes no prop for one — an organisation typing two registry numbers is
 * not typing a secret, so there is nothing here for a check to protect. If a
 * portal ever needs one on this route it is a change to this component, made
 * once, with the WCAG 2.2 3.3.8 alternative named in the same change.
 *
 * `autoComplete="organization"` on the ID, `off` on the PAN: a PAN is a tax
 * identifier and does not belong in a browser's autofill store.
 */
export function DarpanFields({
  darpanId,
  onDarpanIdChange,
  pan,
  onPanChange,
  note,
  className,
}: DarpanFieldsProps): React.JSX.Element {
  return (
    <Stack className={className}>
      <FormField label="DARPAN ID" required>
        {(control) => (
          <Input
            {...control}
            type="text"
            autoComplete="organization"
            value={darpanId}
            onChange={(e) => onDarpanIdChange(e.target.value.toUpperCase())}
            placeholder="e.g. DL/2018/0123456"
          />
        )}
      </FormField>

      <FormField label="PAN Number" required>
        {(control) => (
          <Input
            {...control}
            type="text"
            autoComplete="off"
            maxLength={10}
            value={pan}
            onChange={(e) => onPanChange(e.target.value.toUpperCase())}
            placeholder="e.g. ABCDE1234F"
          />
        )}
      </FormField>

      {note ? <p className="ds-authfields__note">{note}</p> : null}
    </Stack>
  );
}

/* ---------------------------------------------------------------------------
 * OtpRequestFields
 * ------------------------------------------------------------------------- */

export interface OtpRequestFieldsProps {
  /** The 10-digit mobile number. Non-digits are stripped before this is called. */
  mobile: string;
  onMobileChange: (value: string) => void;
  /** @default "Registered Mobile Number" */
  label?: React.ReactNode;
  className?: string;
}

/**
 * Step one of the OTP route: the destination, alone.
 *
 * The OTP mode is TWO stacks rather than one, which is the clearest argument
 * for the slot. A variant axis has to pretend a two-step journey is one drawing;
 * a slot simply swaps the second stack in when the code has been sent, and the
 * card around it never changes.
 *
 * The primary action beneath it reads "Send OTP" at this step — one primary
 * action per step, never a small outlined Send button beside the field.
 */
export function OtpRequestFields({
  mobile,
  onMobileChange,
  label = "Registered Mobile Number",
  className,
}: OtpRequestFieldsProps): React.JSX.Element {
  return (
    <Stack className={className}>
      <FormField label={label} required>
        {(control) => (
          <Input
            {...control}
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            maxLength={10}
            value={mobile}
            onChange={(e) => onMobileChange(e.target.value.replace(/\D/g, ""))}
            placeholder="10-digit mobile number"
          />
        )}
      </FormField>
    </Stack>
  );
}

/* ---------------------------------------------------------------------------
 * OtpVerifyFields
 * ------------------------------------------------------------------------- */

export interface OtpVerifyFieldsProps {
  /**
   * The ALREADY-MASKED destination the code went to. This component does not
   * mask for you — see `MaskedContactRow`.
   */
  maskedValue: string;
  /** Which channel, for the row's own documentation. @default "phone" */
  channel?: "phone" | "email";
  /** Back to step one with the value pre-filled. Must NOT send a fresh code. */
  onEdit: () => void;
  /** The code. */
  otp: string;
  onOtpChange: (value: string) => void;
  /** Seconds left on the resend cooldown. `0` renders the active state. */
  secondsRemaining: number;
  onResend: () => void;
  className?: string;
}

/**
 * Step two of the OTP route: where it went, the boxes, and the way to try again.
 *
 * On an INCORRECT code, pass `secondsRemaining={0}` — do not make the citizen
 * sit out a cooldown for a code that is already known to be wrong. The rule is
 * `ResendTimer`'s and it is the one most often got wrong.
 */
export function OtpVerifyFields({
  maskedValue,
  channel = "phone",
  onEdit,
  otp,
  onOtpChange,
  secondsRemaining,
  onResend,
  className,
}: OtpVerifyFieldsProps): React.JSX.Element {
  return (
    <Stack className={className}>
      <MaskedContactRow channel={channel} maskedValue={maskedValue} onEdit={onEdit} />
      <FormField label="Enter OTP" required>
        {(control) => (
          <OtpInput
            aria-describedby={control["aria-describedby"]}
            invalid={control.invalid}
            label="One-time password"
            value={otp}
            onValueChange={onOtpChange}
          />
        )}
      </FormField>
      <ResendTimer secondsRemaining={secondsRemaining} onResend={onResend} />
    </Stack>
  );
}
