"use client";

// DS Audit: PortalRecoveryTemplate ✅ existing. The standalone card this replaces
// drew its own heading, field and confirmation outside the login page's chrome.

import { PortalRecoveryTemplate, type PortalRecoveryConfig } from "@mosje/design-system";

const BASE = "/portals/nhapoa";

/**
 * SAMBAL password recovery — the `link` flow: username, then a confirmation that
 * does not say whether the account exists.
 *
 * No `continueHref`: SAMBAL has no reset page for the emailed link to land on,
 * so the confirmation offers only Back to Login.
 */
const CONFIG: PortalRecoveryConfig = {
  portalId: "nhapoa",
  portalName: "SAMBAL",
  portalTagline: "Smart Access for Mainstreaming of Beneficiaries through Augmented Linkages",
  changeHref: "/portals",
  brandAssets: {
    emblemSrc: `${BASE}/brand/national-emblem.svg`,
    digitalIndiaSrc: `${BASE}/brand/digital-india.svg`,
    // org-logo-exempt(portal-local): SAMBAL serves its own copy of the chrome
    // marks from its brand folder, byte-identical to the estate's.
    samaveshLogoSrc: `${BASE}/brand/samavesh-logo.svg`,
  },
  flow: "link",
  identifierKind: "text",
  identifierLabel: "Username",
  loginHref: `${BASE}/login`,
};

export default function ForgotPasswordPage() {
  return <PortalRecoveryTemplate config={CONFIG} />;
}
