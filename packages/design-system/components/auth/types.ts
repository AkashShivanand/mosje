import type { BotCheckMode } from "../forms/bot-check";
import type { BotCheckToken } from "../forms/use-bot-check";
import * as React from "react";

/**
 * The audiences a portal signs in. ONE taxonomy for the whole estate.
 *
 * Every portal's own wording maps onto these three: NMBA's "Patient Monitoring",
 * SMILE-Transgender's "Garima Greh" and SCW's "SAGE Organisation" are all
 * `organisation`, renamed via the tab's `label`. Before this existed there were
 * five bespoke taxonomies across nine portals and no way to write a rule about
 * who is signing in that held in more than one of them.
 *
 * **The DigiLocker handoff is not such a rule**, though it was written as one
 * until 2026-09-02. It is narrower than any audience — see
 * `PortalRoleTab.digilocker`. A rule narrower than the audience belongs on the
 * role.
 *
 * Do not add a fourth. A portal that seems to need one is renaming, not adding.
 */
export type PortalAudience = "citizen" | "officer" | "organisation";

/**
 * Supported authentication workflows for MoSJE Portals.
 *
 * **`"darpan"` reinstated 2026-09-03, and the 2026-08-17 removal was unsound.**
 * That removal reasoned: "a full read of the Handoff — 69 auth screens across 10
 * pages — found no DARPAN and no Aadhaar screen in any portal, so both were
 * invented from a written brief." The premise is true and the conclusion does
 * not follow. DARPAN belongs to E-Anudaan, and **E-Anudaan has no login screen
 * in the Handoff at all** — a search of its page returns zero frames matching
 * login, sign-in or auth. An audit cannot find a DARPAN login in a portal whose
 * login was never drawn, so its silence was never evidence either way.
 *
 * What E-Anudaan's designs DO carry, throughout the application wizard:
 * `NGO-Darpan Unique ID *` as a required field, `Auto-populated from DARPAN`,
 * and — the corroborating one — `Pre-filled from your login / NGO-Darpan`. The
 * login already carries DARPAN identity; only the screen for it is missing.
 *
 * `"aadhaar"` stays out. Nothing has been produced for it, and reinstating one
 * mode is not a reason to reinstate the other.
 *
 * **`"digilocker"` removed 2026-09-02.** It was never a mode of the credential
 * form, and carrying it in this union made it one: the template rendered it as a
 * fourth selectable method and suppressed the submit button while it was chosen.
 * The handoff (`10767:71293`, `03 — LOGIN & AUTHENTICATION`) puts it above the
 * credentials divider as a standing CTA, with the form untouched beneath it. It
 * is now `PortalRoleTab.digilocker`, a per-role boolean.
 *
 * **`"pin"` added 2026-09-02**, and it is not a reinstatement of the invented
 * modes above — NOS is PIN-only, and both its auth screens (`2436:15957`) are
 * `Sign In Pin`. The credential form therefore has three modes, and the Figma
 * master's `Auth Method` axis is Password · OTP · PIN to match.
 */
export type PortalAuthMode =
  | "password" // Username / Email / Mobile + Password (+ optional captcha)
  | "otp" // Mobile / Email + 6-digit OTP verification
  | "pin" // Registered identifier + 6-digit numeric PIN
  | "darpan"; // NGO-DARPAN Unique ID — E-Anudaan's organisation applicants

/**
 * What kind of value an identifier field takes. It decides the control's
 * `type`, `inputMode`, `autoComplete` and whether non-digits are stripped — the
 * four things a phone keyboard and a password manager read.
 *
 * - `text` — a username, login ID, Project Id, employee ID. Nothing stripped.
 * - `mobile` — a 10-digit Indian mobile number. Digits only, number pad.
 * - `email` — an email address. `type="email"`, the email keyboard.
 *
 * **Added 2026-09-14, from the portals rather than a brief.** The OTP route was
 * fixed to a 10-digit mobile, and three of the logins moving onto the template
 * send a code to something else: the Transgender Portal to an email address
 * (`10767:101718`, "Email/Mobile"; Garima Greh "Email"), and NMBA's treatment
 * centres to the mobile registered against a Project Id (`9884:112146`). None of
 * them could be expressed without forking the OTP stack.
 */
export type PortalIdentifierKind = "text" | "mobile" | "email";

/**
 * A choice WITHIN a role tab — "Your role" on the handoff's SCW Citizen tab
 * (`9453:255070`: Volunteer / SAGE Organisation) and on SMILE Beggary
 * (`8383:55528`).
 *
 * **Not a fourth audience and not a second row of tabs.** The tab says which of
 * the estate's three audiences is signing in; this says which register inside
 * that audience holds the account. SCW drew it as two pill toggles under the
 * tabs until the handoff replaced them with one labelled select, which is what
 * this renders.
 */
export interface PortalSubRole {
  id: string;
  label: string;
}

/**
 * The answer to a request the template makes on the portal's behalf — sending a
 * code, checking a recovery identifier.
 *
 * `ok: false` carries the sentence the reader sees, shown against the field that
 * caused it (WCAG 3.3.1). `ok: true` may carry the ALREADY-MASKED destination
 * the code went to, because only the portal knows it: a Project Id does not say
 * which handset it is registered to.
 */
export type AuthStepResult =
  | { ok: true; maskedDestination?: string; channel?: "phone" | "email" }
  | { ok: false; error: string };

/**
 * What `onRequestOtp` receives when the reader presses Send OTP (or Resend).
 */
export interface OtpRequest {
  roleId: string;
  subRoleId?: string;
  /** Exactly what was typed — digits only for `mobile`. */
  identifier: string;
  identifierKind: PortalIdentifierKind;
  /** `true` on a resend, so a portal can rate-limit the second send differently. */
  resend: boolean;
}

/**
 * Errors a portal attaches to individual fields after a submit.
 *
 * `secret` is whichever proof the active mode asks for — the password, the PIN,
 * or the PAN on the DARPAN route — because a portal reporting "incorrect
 * credentials" should not have to know which of the three it was.
 *
 * **An error hides itself once the reader edits that field.** A message that
 * stays put while the citizen fixes the thing it complains about reads as a
 * second, unrelated failure. It returns only when the portal passes a new
 * `fieldErrors` object.
 */
export type PortalLoginFieldErrors = Partial<
  Record<"identifier" | "secret" | "otp" | "subRole", React.ReactNode>
>;

/**
 * Custom display option for a specific login method under a role.
 */
export interface PortalAuthModeOption {
  /** Authentication workflow mode key */
  mode: PortalAuthMode;
  /** Custom display label, e.g. "Login with Password", "Login with DARPAN ID", "Login with OTP" */
  label: string;
  /** Optional subtext or description for radio / dropdown list items */
  description?: string;
}

/**
 * A federated sign-in offered on one role's tab — an identity provider other
 * than DigiLocker that the portal hands the reader off to and that returns them
 * signed in.
 *
 * **Added 2026-09-17 for NGO-DARPAN on E-Anudaan.** Organisations applying for
 * grant-in-aid already hold a registration on NGO-DARPAN, and signing in with it
 * replaces a password-and-captcha login — no cognitive function test, which is
 * what WCAG 2.2 3.3.8 Accessible Authentication asks for.
 *
 * It renders exactly where the DigiLocker card does — above the "or sign in with
 * credentials" divider — through the same `SSOButton`. It is a separate field
 * rather than a second `digilocker` because the card's wording and mark belong
 * to the provider, and DigiLocker's defaults must never be drawn for another.
 */
export interface PortalIdentityProvider {
  /** The card's title, naming the provider. e.g. "Sign in with NGO-DARPAN" */
  title: string;
  /** One line under it. @default "Secured Government Login" */
  subtitle?: string;
  /**
   * Where the handoff starts. Usually a route on the portal that records the
   * request and then redirects to the provider, so the return can be checked
   * against it. A card with no destination renders nothing.
   */
  href: string;
  /** The provider's mark as an image path the portal serves. */
  markSrc?: string;
  /**
   * A Material Symbols glyph drawn when there is no `markSrc`. @default "shield_person"
   *
   * A prototype that may not use the provider's own mark uses this, rather than
   * borrowing DigiLocker's.
   */
  icon?: string;
}

/**
 * Definition for a role navigation tab.
 */
export interface PortalRoleTab {
  /** Unique ID for the role, e.g. "citizen", "ngo", "officer" */
  id: string;
  /**
   * Which of the three estate audiences this tab is, regardless of its label.
   * Rules key off this, not off `label`, and it must keep working when a portal
   * calls its officer tab "Admin" or its organisation tab "Garima Greh".
   */
  audience?: PortalAudience;
  /** Display label in the segmented control tab pill */
  label: string;
  /**
   * Offer the DigiLocker handoff on this tab. @default false
   *
   * It renders as a card above the credentials divider — not as a login method,
   * and not inside the form. The divider ("or sign in with credentials") belongs
   * to the card and appears only with it.
   *
   * **A per-role boolean, not an audience rule.** The handoff carries the card on
   * SMILE-Transgender's Citizen tab and on neither Admin nor Garima Greh, so it
   * is narrower than "not an officer" — an audience-keyed default would have put
   * it on the organisation tab. Which roles a portal offers it to is the
   * portal's decision to state, because it is the portal that holds the
   * agreement with the identity provider.
   *
   * Nothing renders unless `config.links.digilockerHref` is also set: a CTA with
   * nowhere to go is worse than no CTA.
   */
  digilocker?: boolean;
  /**
   * Offer a federated sign-in other than DigiLocker on this tab — see
   * `PortalIdentityProvider`. Rendered above the credentials divider; when the
   * role also sets `digilocker`, both cards render, DigiLocker first.
   */
  identityProvider?: PortalIdentityProvider;
  /**
   * Show the security captcha for THIS role. Falls back to `config.captcha`, and
   * to `false` when neither is set.
   *
   * **Per role, because that is how the handoff uses it.** SMILE-Transgender
   * asks a Garima Greh organisation for a captcha and asks the same portal's
   * citizen for none — a portal-wide boolean can express neither of those
   * without imposing it on the other. An organisation signing in on behalf of a
   * shelter home is a different risk from a citizen checking their own
   * application, and the register is entitled to treat them differently.
   *
   * **The default stays `false`, and that default is load-bearing.** A captcha
   * is a cognitive function test, and WCAG 2.2 3.3.8 Accessible Authentication
   * (AA) forbids one without an alternative. Switching it on for a role commits
   * the portal to offering that alternative to that role — say which, in the
   * same change.
   */
  captcha?: boolean;
  /** Supported authentication modes for this specific role */
  authModes?: PortalAuthMode[];
  /** Custom-labeled authentication method options for this role */
  authModeOptions?: PortalAuthModeOption[];
  /** Visual presentation style for the sub-selector ("segmented" pills, "radio" group, or "dropdown") */
  authSelectorType?: "segmented" | "radio" | "dropdown";
  /** Default active authentication mode when selecting this tab */
  defaultMode?: PortalAuthMode;
  /** Subtitle or help text displayed under the form heading for this role */
  description?: string;
  /**
   * What this role's identifier field is called. @default "Username / Email / Mobile"
   *
   * **It is per ROLE because the roles genuinely differ.** E-Anudaan's handoff
   * asks an NGO for a "Username" and a Ministry officer for a "Mobile Number" on
   * the same page — one is issued with the organisation's registration, the other
   * is the officer's own number. A single estate-wide label is wrong for both, and
   * the generic "Username / Email / Mobile" asks the reader to guess which of the
   * three their portal actually wants.
   */
  identifierLabel?: string;
  /** The placeholder under that label. Say what to type, not what the field is. */
  identifierPlaceholder?: string;
  /**
   * What the password and PIN routes' identifier takes. @default "text"
   *
   * NMBA's Admin tab and SCW sign in with a mobile number, so a phone should
   * offer the number pad and a pasted "+91 98100 07001" should arrive as ten
   * digits. A username field must not do either.
   */
  identifierKind?: PortalIdentifierKind;
  /**
   * Where the OTP route sends its code. @default "mobile"
   *
   * Separate from `identifierKind` because one role can offer both routes with
   * different identifiers — SAMBAL's handoff (`10434:159436`) signs in with a
   * Username by password, and a code cannot be sent to a username.
   *
   * `mobile` masks as `+91 98••••1234` and `email` as `a•••••s@gmail.com` without
   * the portal's help. `text` (a Project Id) needs `onRequestOtp` to return
   * `maskedDestination`; without it the row says "your registered mobile number".
   */
  otpIdentifierKind?: PortalIdentifierKind;
  /** The OTP route's identifier label. @default "Registered Mobile Number", "Email Address" or "Registered ID" by kind */
  otpIdentifierLabel?: string;
  /** The OTP route's identifier placeholder. */
  otpIdentifierPlaceholder?: string;
  /**
   * A choice within this tab, rendered as one labelled select above the
   * credential fields. See `PortalSubRole`. The chosen id arrives as
   * `LoginSubmitPayload.subRoleId`.
   */
  subRoles?: PortalSubRole[];
  /** The select's label. @default "Your role" — the handoff's wording. */
  subRoleLabel?: string;
  /** Which sub-role is selected when the tab opens. @default the first */
  defaultSubRoleId?: string;
}

/**
 * Portal-specific brand asset paths.
 */
export interface PortalBrandAssets {
  /** National Emblem SVG path — defaults to "/design-system/national-emblem.svg" */
  emblemSrc?: string;
  /** Digital India logo path — defaults to "/website/images/digital-india-logo.svg" */
  digitalIndiaSrc?: string;
  /** SAMAVESH logo path — defaults to "/design-system/samavesh-logo.svg" */
  samaveshLogoSrc?: string;
  /** Optional portal-specific icon / seal path */
  portalLogoSrc?: string;
  /**
   * The photograph behind the desktop hero — the Figma organism's `Portal Hero`
   * slot, passed straight to `PortalLoginShell.heroImageSrc`.
   *
   * **It had no way through until 2026-09-07.** `PortalLoginShell` accepted a
   * photograph from the day it was written, but this interface never carried
   * one, so every portal built on `PortalLoginTemplate` — which is how a portal
   * is supposed to build a login — got the empty slot and no means of filling
   * it. E-Anudaan's hero was blank for that reason and not by choice.
   *
   * Still NO DEFAULT. An unset slot is the solid brand column, which is what the
   * library master draws with nothing dropped in; defaulting it would put one
   * scheme's photograph behind every other scheme's sign-in.
   */
  heroImageSrc?: string;
  /**
   * DigiLocker's own mark, for the handoff card's logo slot.
   *
   * **Deliberately has no default, even though the estate now holds a copy.**
   * The mark is at `/design-system/digilocker-mark.png` for the documentation
   * surfaces, but every portal mounts under its own `basePath`, so a default
   * would resolve to the wrong path on most of them. Pass the path the portal
   * actually serves.
   *
   * Leave it unset and the card renders its wording and arrow alone, which is
   * complete and honest — the mark is a partner's, not ours to substitute a
   * padlock glyph for.
   */
  digilockerLogoSrc?: string;
}

/**
 * Payload returned on login form submission.
 */
export interface LoginSubmitPayload {
  /** Selected role ID */
  roleId: string;
  /** The sub-role chosen in the tab's "Your role" select, when the tab has one. */
  subRoleId?: string;
  /** Authentication mode used for submission */
  authMode: PortalAuthMode;
  /** Entered credentials object */
  credentials: {
    /**
     * The identifier of the active route: the username on the password and PIN
     * routes, the DARPAN ID on that route, and on the OTP route the email or ID
     * the code was sent to when `otpIdentifierKind` is not `mobile`.
     */
    username?: string;
    password?: string;
    /** Set only when `authMode === "pin"`. The PIN never arrives as `password`. */
    pin?: string;
    /**
     * The organisation's PAN. Set only when `authMode === "darpan"`, where it is
     * the second identifier rather than a secret — the DARPAN route sends no
     * `password` at all.
     *
     * It has its own name for the same reason `pin` does. While the DARPAN form
     * was a clone of the password form it arrived as `password`, so a consumer
     * doing the obvious thing hashed a public tax identifier into a credentials
     * table and compared it against nothing.
     */
    pan?: string;
    mobile?: string;
    otp?: string;
  };
  /**
   * The proof-of-work receipt, when a bot check ran. `null` when the role did
   * not ask for one.
   *
   * **The server must verify this, not trust it.** It has to recompute the
   * hash, confirm the difficulty, confirm it issued that exact challenge, burn
   * it so it cannot be replayed, and reject anything stale. A token the server
   * did not issue proves only that somebody did some arithmetic.
   */
  botCheck?: BotCheckToken | null;
}

/**
 * Complete declarative configuration for the Portal Login Template.
 */
export interface PortalLoginConfig {
  /** Unique portal identifier, e.g. "smile-admin", "pm-ajay", "nos", "e-utthan" */
  portalId: string;
  /** Portal human-readable name, e.g. "Nasha Mukt Bharat Abhiyaan" */
  portalName: string;
  /**
   * Optional, large screens only. A line under the portal name in the Signing Into strip — usually the
   * scheme's expanded name ("Support For Marginalized Individuals For Livelihood &
   * Enterprise" under "SMILE Beggary"). Omit it where the name says enough.
   */
  portalTagline?: string;
  /**
   * Optional. A muted line under the tagline saying what the portal is for, e.g.
   * "Comprehensive Rehabilitation of Persons Engaged in Begging". Shown without a
   * tagline too. One sentence. Large screens only; the phone strip shows the name alone.
   */
  portalDescription?: string;
  /** Href for changing selected portal — defaults to "/" */
  changeHref?: string;
  /** Role tabs configuration */
  roles: PortalRoleTab[];
  /** Default active role ID — defaults to the first role in `roles` */
  defaultRoleId?: string;
  /**
   * The portal's default for the security captcha on the password and PIN
   * forms. **A role's own `captcha` wins over this**, so set it here only for
   * the answer that is right for every role the portal has.
   *
   * **Defaults to `false`, and that default is load-bearing:** a captcha is a
   * cognitive function test, and WCAG 2.2 3.3.8 Accessible Authentication (AA)
   * forbids one without an alternative. Switch it on only where that
   * alternative exists. Mirrors `Show captcha` on the Figma
   * `Auth / AuthFormCard`.
   */
  captcha?: boolean;
  /**
   * Show the consent line — "By continuing, you agree to the Terms of Use and
   * Privacy Policy" — under the submit button. @default false
   *
   * **Optional, per portal.** A portal whose sign-in is for the public turns it
   * on; one that signs in only organisations and officers — E-Anudaan's NGO and
   * Ministry tabs — leaves it off. It renders only when at least one of
   * `links.termsHref` or `links.privacyHref` is also set, because a disclosure
   * pointing nowhere is worse than none. Mirrors `Show consent` on the Figma
   * `Auth / AuthFormCard`, whose default is off to match.
   */
  consent?: boolean;
  /** Brand asset path overrides */
  brandAssets?: PortalBrandAssets;
  /** Optional custom form fields or controls to inject */
  extraFields?: React.ReactNode;
  /** Optional content block below form (e.g., Portal Switcher Grid) */
  extraContent?: React.ReactNode;
  /** Help link URLs */
  links?: {
    forgotPasswordHref?: string;
    registerHref?: string;
    /**
     * More than one way to register — SCW's "Don't have an account? Register as"
     * Volunteer / SAGE Organisation (`9453:255070`). Wins over `registerHref`.
     * `AccountPrompt` draws two side by side and changes its question to match;
     * do not use it to offer two brands of the same account.
     */
    registerOptions?: { label: string; href: string }[];
    helpFaqHref?: string;
    /**
     * Where the DigiLocker card hands off to. Required for the card to render at
     * all — see `PortalRoleTab.digilocker`. It is a real navigation to the
     * identity provider, so the card is an `<a>`, not a button.
     */
    digilockerHref?: string;
    /** Terms of Use, for the consent line GIGW requires under the button. */
    termsHref?: string;
    /** Privacy Policy, same line. */
    privacyHref?: string;
  };
  /**
   * How this portal proves a request came from a person.
   *
   * Omit it and a role asking for a check falls back to `invisible` with the
   * portal's `links.helpFaqHref` as the escape route. Omit BOTH and no check
   * renders at all — a bot check with nowhere for a blocked citizen to go has no
   * accessible alternative, which is the failure the escape route exists to
   * prevent.
   */
  botCheck?: {
    /** @default "invisible" */
    mode?: BotCheckMode;
    /** Where a citizen the check will not pass goes instead. */
    helpHref: string;
  };
}

/**
 * The shapes a portal's password recovery takes. Three, because the portals
 * moving onto the template recover in three genuinely different ways:
 *
 * - `otp` — identifier → code → new password → done. SCW's handoff draws exactly
 *   this (`9465:35397` → `:35904` → `:36412` → `:36977`), and SMILE Admin's
 *   recovery already runs it across two routes.
 * - `link` — identifier → "a reset link has been sent". The reset itself is a
 *   separate page reached from the emailed link, rendered with
 *   `startAt="reset"`. E-Anudaan and SAMBAL.
 * - `contact` — no self-service at all: the page says who to contact. PM-AJAY's
 *   MIS resets passwords through the NIC helpdesk and has no form to fill.
 *
 * **Why a template and not four more hand-built pages.** Before this, recovery
 * was the one half of sign-in with no code counterpart to the Figma
 * `Auth / CredentialRecovery` (56640:4103): every portal restated the shell's
 * brand props, the step machine and the "do not disclose whether the account
 * exists" wording by hand, and three of them drew the step as a standalone card
 * that looked like a different department.
 */
export type PortalRecoveryFlow = "otp" | "link" | "contact";

/** The steps a recovery flow passes through. `sent` is the link flow's last. */
export type PortalRecoveryStep = "request" | "verify" | "reset" | "sent" | "success";

/**
 * Configuration for `PortalRecoveryTemplate`. The chrome fields are the same
 * ones `PortalLoginConfig` carries, so a portal passes one object's worth of
 * brand to both pages and they cannot drift.
 */
export interface PortalRecoveryConfig
  extends Pick<
    PortalLoginConfig,
    "portalId" | "portalName" | "portalTagline" | "portalDescription" | "changeHref" | "brandAssets"
  > {
  flow: PortalRecoveryFlow;
  /** Where "Back to Login" goes, on every step. */
  loginHref: string;
  /** The identifier field's label. @default by kind — "Registered Mobile Number", "Email Address", "Username" */
  identifierLabel?: string;
  identifierPlaceholder?: string;
  /** @default "mobile" for `otp`, "text" for `link` */
  identifierKind?: PortalIdentifierKind;
  /** The department's minimum new-password length. @default 8 */
  minPasswordLength?: number;
  /**
   * PROTOTYPE ONLY — the `link` flow's confirmation offers a button onward to the
   * reset page, because nothing sends the email. Leave it unset in production.
   */
  continueHref?: string;
  /** The `contact` flow's body: who resets passwords, and how to reach them. */
  contact?: React.ReactNode;
}
