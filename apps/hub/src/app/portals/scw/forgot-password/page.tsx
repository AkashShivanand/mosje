"use client";

// DS Audit: PortalRecoveryTemplate ✅ existing. Replaces the standalone card that
// sent a "reset link" with the handoff's code-based flow on the login page's own
// chrome.

import { PortalRecoveryTemplate, type PortalRecoveryConfig } from "@mosje/design-system";
import { SCW_LOGIN_CHROME } from "@/lib/scw/login";

/*
 * The handoff's four steps: mobile number (9465:35397) → code (:35904) → new
 * password (:36412) → done (:36977). Keyed on Mobile Number because that is what
 * the SCW login asks for.
 */
const CONFIG: PortalRecoveryConfig = {
  ...SCW_LOGIN_CHROME,
  flow: "otp",
  identifierKind: "mobile",
  loginHref: "/portals/scw/login",
};

export default function ForgotPasswordPage() {
  return (
    <PortalRecoveryTemplate
      config={CONFIG}
      // Refuses a malformed number only — never says whether it is registered.
      onRequest={(mobile) =>
        mobile.length === 10 ? { ok: true } : { ok: false, error: "Enter a 10-digit mobile number." }
      }
      // Prototype: no SMS is sent, so any six digits verify.
      onVerify={(otp) => (otp.length === 6 ? { ok: true } : { ok: false, error: "Enter the 6-digit OTP." })}
    />
  );
}
