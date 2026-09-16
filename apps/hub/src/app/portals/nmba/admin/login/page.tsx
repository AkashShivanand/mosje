// DS Audit: PortalLoginTemplate ✅ (via NmbaLogin)

import { NmbaLogin } from "@/components/nmba/nmba-login";

/** The NMBA login, opening on the Admin tab. */
export default function AdminLoginPage() {
  return <NmbaLogin defaultRoleId="admin" />;
}
