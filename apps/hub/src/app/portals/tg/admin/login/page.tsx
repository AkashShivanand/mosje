// DS Audit: PortalLoginTemplate ✅ (via TgLogin)

import { TgLogin } from "@/components/tg/tg-login";

/** The Transgender Portal login, opening on the Admin tab. */
export default function AdminLoginPage() {
  return <TgLogin defaultRoleId="admin" />;
}
