"use client";

// DS Audit: PortalRecoveryTemplate ✅ existing. Replaces two hand-built routes —
// this page's "OTP sent" card and `reset-password`'s code and new-password
// stages — with the template's one step machine.

import { PortalRecoveryTemplate, type PortalRecoveryConfig } from "@mosje/design-system";

/*
 * The same chrome as the login page's config, restated because a Next page may
 * not export it for the other to import. Change one, change both.
 *
 * `otp` flow: SMILE already ran these four steps, across two routes. No
 * `brandAssets` — the template's defaults are the estate's own marks, which are
 * the files SMILE's login uses too.
 */
const CONFIG: PortalRecoveryConfig = {
  portalId: "smile-admin",
  portalName: "SMILE Beggary",
  portalTagline: "Support For Marginalized Individuals For Livelihood & Enterprise",
  portalDescription: "Comprehensive Rehabilitation of Persons Engaged in Begging",
  changeHref: "/portals",
  flow: "otp",
  identifierKind: "mobile",
  loginHref: "/portals/smile-admin/login",
};

export default function ForgetPasswordPage() {
  return (
    <PortalRecoveryTemplate
      config={CONFIG}
      // Refuses a malformed number only. It must never say whether the number
      // holds an account — that would make this form an account lookup.
      onRequest={(mobile) =>
        mobile.length === 10 ? { ok: true } : { ok: false, error: "Enter a 10-digit mobile number." }
      }
      // Prototype: no SMS is sent, so any six digits verify — as before.
      onVerify={(otp) => (otp.length === 6 ? { ok: true } : { ok: false, error: "Enter the 6-digit OTP." })}
    />
  );
}
