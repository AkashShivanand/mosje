// DS Audit: PortalLoginTemplate ✅ (via TgLogin)

import { TgLogin } from "@/components/tg/tg-login";

/** The Transgender Portal login, opening on the Citizen tab. */
export default function CitizenSignInPage() {
  return <TgLogin defaultRoleId="citizen" />;
}
