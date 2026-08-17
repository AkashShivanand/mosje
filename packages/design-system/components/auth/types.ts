import * as React from "react";

/**
 * The audiences a portal signs in. ONE taxonomy for the whole estate.
 *
 * Every portal's own wording maps onto these three: NMBA's "Patient Monitoring",
 * SMILE-Transgender's "Garima Greh" and SCW's "SAGE Organisation" are all
 * `organisation`, renamed via the tab's `label`. Before this existed there were
 * five bespoke taxonomies across nine portals and no way to write a rule — such
 * as "hide DigiLocker for officers" — that held in more than one of them.
 *
 * Do not add a fourth. A portal that seems to need one is renaming, not adding.
 */
export type PortalAudience = "citizen" | "officer" | "organisation";

/**
 * Supported authentication workflows for MoSJE Portals.
 *
 * **Corrected 2026-08-17.** This union previously carried `"darpan"` (NGO DARPAN
 * ID) and `"aadhaar"` (Aadhaar e-KYC). Neither exists: a full read of the
 * MoSJE Portal handoff — 69 auth screens across 10 pages — found no DARPAN and
 * no Aadhaar screen anywhere, in any portal. They were invented from a written
 * brief before the design file was available, and the matching Figma variant
 * axis has been retired too.
 *
 * `digilocker` is kept, but note what it is: a CTA that hands off to a
 * government identity provider, sitting ABOVE the credentials divider. It is
 * not a mode of the credential form. The form itself has exactly two modes.
 */
export type PortalAuthMode =
  | "password" // Username / Email / Mobile + Password (+ optional captcha)
  | "otp" // Mobile / Email + 6-digit OTP verification
  | "digilocker"; // DigiLocker SSO — a handoff, not a form mode

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
   * Rules key off this, not off `label` — `audience === "officer"` is what hides
   * the DigiLocker button, and it must keep working when a portal calls its
   * officer tab "Admin" or its organisation tab "Garima Greh".
   */
  audience?: PortalAudience;
  /** Display label in the segmented control tab pill */
  label: string;
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
    mobile?: string;
    otp?: string;
    captcha?: string;
  };
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
  };
}
