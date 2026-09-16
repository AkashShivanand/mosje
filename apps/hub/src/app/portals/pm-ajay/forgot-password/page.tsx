"use client";

// DS Audit: PortalRecoveryTemplate ✅ existing. The bespoke card and its inline
// styles this replaces are gone.

import { PortalRecoveryTemplate, type PortalRecoveryConfig } from "@mosje/design-system";

const BASE = "/portals/pm-ajay";

/**
 * PM-AJAY MIS password recovery — the `contact` flow. The MIS has no
 * self-service reset: passwords are reset by the NIC helpdesk, so the page says
 * who to contact and offers the way back.
 */
const CONFIG: PortalRecoveryConfig = {
  portalId: "pm-ajay",
  portalName: "PM-AJAY",
  portalTagline: "Pradhan Mantri Anusuchit Jaati Abhyuday Yojana",
  changeHref: "/portals",
  flow: "contact",
  loginHref: `${BASE}/login`,
  contact:
    "Passwords for the PM-AJAY MIS are reset by the NIC helpdesk — 1800-111-555, toll-free, 9 am to 6 pm IST, or helpdesk@nic.in.",
};

export default function ForgotPasswordPage() {
  return <PortalRecoveryTemplate config={CONFIG} />;
}
