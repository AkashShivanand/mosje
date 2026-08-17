import * as React from "react";

/**
 * Supported authentication workflows for MoSJE Portals.
 */
export type PortalAuthMode =
  | "password" // Username / Email / Mobile + Password + Captcha
  | "otp" // Mobile / Email + 6-digit OTP verification
  | "digilocker" // DigiLocker SSO identity & document fetch
  | "darpan" // NGO DARPAN ID verification (NITI Aayog)
  | "aadhaar"; // Aadhaar e-KYC OTP verification

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
    darpanId?: string;
    aadhaarNo?: string;
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
