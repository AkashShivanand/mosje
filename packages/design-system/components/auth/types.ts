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
 * Custom display option for a specific login method under a role.
 */
export interface PortalAuthModeOption {
  /** Authentication workflow mode key */
  mode: PortalAuthMode;
  /** Custom display label, e.g. "Login via Password", "Login with DARPAN ID", "Login via Mobile OTP" */
  label: string;
  /** Optional subtext or description for radio / dropdown list items */
  description?: string;
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
}

/**
 * Portal-specific brand asset paths.
 */
export interface PortalBrandAssets {
  /** National Emblem SVG path — defaults to "/brand/national-emblem.svg" */
  emblemSrc?: string;
  /** Digital India logo path — defaults to "/brand/digital-india.svg" */
  digitalIndiaSrc?: string;
  /** SAMAVESH logo path — defaults to "/brand/samavesh-logo.svg" */
  samaveshLogoSrc?: string;
  /** Optional portal-specific icon / seal path */
  portalLogoSrc?: string;
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
  /** Authentication mode used for submission */
  authMode: PortalAuthMode;
  /** Entered credentials object */
  credentials: {
    username?: string;
    password?: string;
    /** Set only when `authMode === "pin"`. The PIN never arrives as `password`. */
    pin?: string;
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
  /** Optional mission tagline displayed in the hero left panel */
  portalTagline?: string;
  /** Optional subtitle or description text */
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
