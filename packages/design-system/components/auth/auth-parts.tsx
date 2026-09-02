"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { Icon } from "../utilities/icon";
import { Button } from "../actions/button";
import "./auth-parts.css";

/* ---------------------------------------------------------------------------
 * AuthDivider
 * ------------------------------------------------------------------------- */

export interface AuthDividerProps {
  /**
   * Names the route BELOW the rule, never a bare "or".
   * @default "or sign in with credentials"
   */
  label?: string;
  className?: string;
}

/**
 * A labelled rule separating two ways of doing the same thing — typically the
 * DigiLocker button above from the credential form below.
 *
 * The label names the second route so the choice is legible before you make it;
 * "or" alone tells the reader nothing. Decorative to assistive tech: the two
 * routes are already separate controls, so the rule itself is `aria-hidden`.
 */
export function AuthDivider({
  label = "or sign in with credentials",
  className,
}: AuthDividerProps): React.JSX.Element {
  return (
    <p className={cn("ds-auth-divider", className)} aria-hidden="true">
      <span className="ds-auth-divider__label">{label}</span>
    </p>
  );
}

/* ---------------------------------------------------------------------------
 * ConsentLine
 * ------------------------------------------------------------------------- */

export interface ConsentLineProps {
  /** Where the Terms of Use page lives. @default "/terms" */
  termsHref?: string;
  /** Where the Privacy Policy page lives. @default "/privacy" */
  privacyHref?: string;
  className?: string;
}

/**
 * The standing consent sentence under every authentication form.
 *
 * **The wording is fixed estate-wide and deliberately not a prop.** It is legal
 * copy, so changing it is a legal decision rather than a design one; only the
 * two hrefs vary. GIGW requires the disclosure, so never drop it to save
 * vertical space, and never convert it into a checkbox unless legal asks —
 * it is a statement of consequence, not a thing to tick.
 */
export function ConsentLine({
  termsHref = "/terms",
  privacyHref = "/privacy",
  className,
}: ConsentLineProps): React.JSX.Element {
  return (
    <p className={cn("ds-auth-consent", className)}>
      By continuing, you agree to the <a href={termsHref}>Terms of Use</a> and{" "}
      <a href={privacyHref}>Privacy Policy</a>
    </p>
  );
}

/* ---------------------------------------------------------------------------
 * ResendTimer
 * ------------------------------------------------------------------------- */

export interface ResendTimerProps {
  /** Seconds left on the cooldown. `0` (or less) renders the active state. */
  secondsRemaining: number;
  /** Fires when the active link is pressed. */
  onResend: () => void;
  /** Prompt shown while counting down. @default "Resend OTP in" */
  waitingLabel?: string;
  /** Prompt shown once resending is allowed. @default "Didn't receive it?" */
  readyLabel?: string;
  /** The link text. @default "Resend OTP" */
  actionLabel?: string;
  className?: string;
}

const mmss = (total: number): string => {
  const s = Math.max(0, Math.floor(total));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
};

/**
 * The resend affordance under an OTP field.
 *
 * The cooldown is **text, not a disabled button**: a disabled control that
 * silently becomes enabled on a timer is announced badly and invites clicking.
 *
 * **The rule most often got wrong:** on an incorrect-OTP error, go straight to
 * the active state — pass `secondsRemaining={0}`. It does *not* wait out the
 * remaining cooldown, because the code the user holds is now known-bad and
 * making them sit out a timer for the system's benefit is the wrong trade.
 *
 * Do not put the countdown itself in a live region; it would announce every
 * second. Announce the switch to active, once.
 */
export function ResendTimer({
  secondsRemaining,
  onResend,
  waitingLabel = "Resend OTP in",
  readyLabel = "Didn't receive it?",
  actionLabel = "Resend OTP",
  className,
}: ResendTimerProps): React.JSX.Element {
  const ready = secondsRemaining <= 0;
  return (
    <p className={cn("ds-auth-resend", className)}>
      {ready ? (
        <>
          <span>{readyLabel}</span>
          <button type="button" className="ds-auth-resend__action" onClick={onResend}>
            {actionLabel}
          </button>
        </>
      ) : (
        <>
          <span>{waitingLabel}</span>
          <span className="ds-auth-resend__count">{mmss(secondsRemaining)}</span>
        </>
      )}
    </p>
  );
}

/* ---------------------------------------------------------------------------
 * MaskedContactRow
 * ------------------------------------------------------------------------- */

export interface MaskedContactRowProps {
  /** Which channel the code went to — changes nothing visually, but documents intent. */
  channel: "phone" | "email";
  /** The ALREADY-MASKED destination. This component does not mask for you. */
  maskedValue: string;
  /** Returns to the previous step with the value pre-filled. */
  onEdit: () => void;
  /** @default "OTP sent to" */
  prompt?: string;
  /** @default "Edit" */
  actionLabel?: string;
  className?: string;
}

/**
 * Confirms where a one-time code was sent, and offers the way back to change it.
 *
 * **Always pass a masked value.** These screens are routinely used on shared and
 * public devices. Keep the last 4 of a phone (`+91 98••••1234`) and the first
 * and last of an email local part (`a•••••••s@gmail.com`) — enough to recognise,
 * not enough to identify.
 *
 * `onEdit` returns to the previous step with the value pre-filled. It must never
 * silently trigger a fresh OTP; the user asked to change the destination, not to
 * spend another send.
 */
export function MaskedContactRow({
  channel,
  maskedValue,
  onEdit,
  prompt = "OTP sent to",
  actionLabel = "Edit",
  className,
}: MaskedContactRowProps): React.JSX.Element {
  return (
    <div className={cn("ds-auth-sentto", className)} data-channel={channel}>
      <span className="ds-auth-sentto__info">
        <span className="ds-auth-sentto__prompt">{prompt}</span>
        <span className="ds-auth-sentto__value">{maskedValue}</span>
      </span>
      <button type="button" className="ds-auth-sentto__action" onClick={onEdit}>
        {actionLabel}
      </button>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * SSOButton
 * ------------------------------------------------------------------------- */

export interface SSOButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "title"> {
  /** @default "Continue with DigiLocker" */
  title?: string;
  /** The trust signal. Do not drop it to save height. @default "Secured Government Login" */
  subtitle?: string;
  /**
   * Where the handoff goes. **Set it and this renders an `<a>`**, which is what
   * a handoff to an external identity provider actually is — a navigation, not
   * a form control. Left unset it stays a `<button>` for a caller that runs the
   * redirect itself in `onClick`.
   */
  href?: string;
  /** The provider's mark as an image path. Wins over `mark`. */
  markSrc?: string;
  /** The provider's mark as a node. Falls back to a Material Symbols glyph. */
  mark?: React.ReactNode;
}

/**
 * Federated sign-in entry point. Today that means DigiLocker.
 *
 * **Offer it per ROLE, not per audience.** The handoff (`10767:71293`) carries
 * this card on SMILE-Transgender's Citizen frames and on neither the Admin nor
 * the Garima Greh ones — so it is narrower than "not an officer", and an
 * audience-keyed rule wrongly puts it on the organisation tab. In
 * `PortalLoginTemplate` that is `PortalRoleTab.digilocker`, and nothing renders
 * unless `links.digilockerHref` is set too: a CTA with nowhere to go is worse
 * than no CTA.
 *
 * It belongs *above* the credentials divider: it is an alternative to the form,
 * not a field inside it. The `AuthDivider` under it belongs to this card — no
 * card, no divider, because a form with nothing above it needs no "or".
 *
 * Pressing it leaves for a government identity provider, so do not open it in a
 * new tab without saying so.
 */
export function SSOButton({
  title = "Continue with DigiLocker",
  subtitle = "Secured Government Login",
  href,
  markSrc,
  mark,
  className,
  ...rest
}: SSOButtonProps): React.JSX.Element {
  const inner = (
    <>
      <span className="ds-auth-sso__mark" aria-hidden="true">
        {markSrc ? (
          // eslint-disable-next-line @next/next/no-img-element -- the DS package
          // has no next/image dependency; the mark is a fixed-size decorative
          // raster already sized by the stylesheet.
          <img src={markSrc} alt="" className="ds-auth-sso__markimg" />
        ) : (
          (mark ?? <Icon name="folder_shared" size={32} aria-hidden />)
        )}
      </span>
      <span className="ds-auth-sso__copy">
        <span className="ds-auth-sso__title">{title}</span>
        <span className="ds-auth-sso__subtitle">{subtitle}</span>
      </span>
      <Icon name="arrow_forward" size={24} className="ds-auth-sso__arrow" aria-hidden />
    </>
  );

  if (href) {
    // `disabled` has no meaning on an anchor — a disabled link is just a link.
    // Everything else a caller passes (id, aria-*, data-*, onClick) is valid on
    // both elements, so it forwards unchanged.
    const { disabled: _disabled, ...anchorRest } = rest;
    return (
      <a
        href={href}
        className={cn("ds-auth-sso", className)}
        {...(anchorRest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {inner}
      </a>
    );
  }

  return (
    <button type="button" className={cn("ds-auth-sso", className)} {...rest}>
      {inner}
    </button>
  );
}

/* ---------------------------------------------------------------------------
 * AccountPrompt
 * ------------------------------------------------------------------------- */

export interface AccountPromptOption {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface AccountPromptProps {
  /**
   * One option renders a single full-width button; two render them side by side.
   * Pass none and the component renders nothing.
   */
  options: AccountPromptOption[];
  /** @default "Don't have an account?" — becomes "…Register as" when there are two. */
  label?: string;
  className?: string;
}

/**
 * The registration route at the foot of a sign-in form.
 *
 * **Two options exist for one reason:** SCW registers two genuinely different
 * kinds of applicant (an individual Volunteer and a SAGE Organisation), and
 * making someone guess which "Create Account" means them is the failure this
 * prevents. Do not use two options to offer two brands of the same thing.
 *
 * Portals with no self-registration (NMBA, Grievance) pass an empty array and
 * get nothing — never ship a disabled Create Account.
 *
 * The buttons are outlined, never filled: the filled button on this screen is
 * Log In, and two filled buttons compete for the same glance.
 */
export function AccountPrompt({
  options,
  label,
  className,
}: AccountPromptProps): React.JSX.Element | null {
  if (options.length === 0) return null;
  const resolved = label ?? (options.length > 1 ? "Don't have an account? Register as" : "Don't have an account?");
  return (
    <div className={cn("ds-auth-prompt", className)}>
      <p className="ds-auth-prompt__label">{resolved}</p>
      <div className="ds-auth-prompt__options">
        {options.map((o) => (
          <Button key={o.label} appearance="outlined" href={o.href} onClick={o.onClick}>
            {o.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * SigningIntoBar
 * ------------------------------------------------------------------------- */

export interface SigningIntoBarProps {
  /** The SCHEME name — "Senior Citizens Welfare", not "SCW". */
  portalName: string;
  /** Portal logo URL. Omit and the logo slot is not rendered. */
  logoSrc?: string;
  /** Opens the portal picker. Omit to render the bar without a Change control. */
  onChange?: () => void;
  /**
   * Which surface the bar sits on. `hero` is the navy photograph scrim,
   * `surface` is any ordinary page background. @default "hero"
   */
  tone?: "hero" | "surface";
  /** @default "SIGNING INTO" */
  eyebrow?: string;
  /** @default "Change" */
  changeLabel?: string;
  className?: string;
}

/**
 * Tells the user which portal they are about to sign into, and offers the way to
 * change it.
 *
 * `portalName` is the **scheme** name, not the acronym — every portal in the
 * estate shows "Senior Citizens Welfare" rather than "SCW", and NHAPOA shows
 * "SAMBAL (NHAA 2.0)".
 *
 * **Tone follows the surface, not the brand.** `hero` over the photograph scrim,
 * `surface` anywhere else. Getting that backwards is the fastest way to fail
 * contrast on this component.
 *
 * `onChange` opens the picker. It never submits, and whatever the user has
 * already typed must survive the round trip.
 */
export function SigningIntoBar({
  portalName,
  logoSrc,
  onChange,
  tone = "hero",
  eyebrow = "SIGNING INTO",
  changeLabel = "Change",
  className,
}: SigningIntoBarProps): React.JSX.Element {
  return (
    <div className={cn("ds-auth-signing", `ds-auth-signing--${tone}`, className)}>
      {logoSrc ? <img className="ds-auth-signing__logo" src={logoSrc} alt="" /> : null}
      <span className="ds-auth-signing__info">
        <span className="ds-auth-signing__eyebrow">{eyebrow}</span>
        <span className="ds-auth-signing__name">{portalName}</span>
      </span>
      {onChange ? (
        <Button
          size="sm"
          appearance={tone === "hero" ? "inverseOutlined" : "outlined"}
          iconLeft={<Icon name="swap_horiz" size={16} aria-hidden />}
          onClick={onChange}
        >
          {changeLabel}
        </Button>
      ) : null}
    </div>
  );
}
