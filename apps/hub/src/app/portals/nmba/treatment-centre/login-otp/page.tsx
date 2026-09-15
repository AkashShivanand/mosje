// DS Audit: PortalLoginTemplate ✅ (via NmbaLogin)

import { NmbaLogin } from "@/components/nmba/nmba-login";

/** The NMBA login, opening on the Patient Monitoring tab. */
export default function TreatmentCentreLoginPage() {
  return <NmbaLogin defaultRoleId="monitoring" />;
}
