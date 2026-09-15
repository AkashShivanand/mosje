"use client";

// DS Audit: PortalLoginTemplate ✅ existing. The bespoke navy panel, the role
// toggle, the Volunteer / SAGE pills and the page's own `demo:fill` listener are
// gone — the template reads `extra.tab` and `extra.subRole` itself.

import * as React from "react";
import { useRouter } from "next/navigation";
import { PortalLoginTemplate, type PortalLoginConfig } from "@mosje/design-system";
import { SCW_LOGIN_CHROME, scwSignIn } from "@/lib/scw/login";

const BASE = "/portals/scw";

/*
 * Following the handoff: Citizen (9453:255070) and Officer (9508:52655).
 *
 * - The tabs read "Citizen" / "Admin", as drawn. The officer tab keeps the id
 *   `officer`, so `?role=officer` and the demo registry's `extra.tab` still work.
 * - Volunteer / SAGE Organisation is the handoff's "Your role" select, not pills.
 * - Consent is portal-wide, so it shows on the Admin tab too, which the handoff's
 *   Admin frame omits.
 * - NO DigiLocker card, although the Citizen frame draws one: nothing exists for
 *   it to hand off to.
 */
const CONFIG: PortalLoginConfig = {
  ...SCW_LOGIN_CHROME,
  consent: true,
  roles: [
    {
      id: "citizen",
      audience: "citizen",
      label: "Citizen",
      authModes: ["password"],
      identifierKind: "mobile",
      identifierLabel: "Mobile Number",
      identifierPlaceholder: "Enter your registered mobile number",
      subRoles: [
        { id: "volunteer", label: "Volunteer" },
        { id: "sage", label: "SAGE Organisation" },
      ],
    },
    {
      id: "officer",
      audience: "officer",
      label: "Admin",
      authModes: ["password"],
      identifierKind: "mobile",
      identifierLabel: "Mobile Number",
      identifierPlaceholder: "Enter your registered mobile number",
    },
  ],
  links: {
    forgotPasswordHref: `${BASE}/forgot-password`,
    registerOptions: [
      { label: "Volunteer", href: `${BASE}/volunteer` },
      { label: "SAGE Organisation", href: `${BASE}/sage-registration` },
    ],
    termsHref: "/website/terms-conditions",
    privacyHref: "/website/privacy-policy",
  },
};

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);

  return (
    <PortalLoginTemplate
      config={CONFIG}
      error={error}
      onRoleChange={() => setError(null)}
      onSubmit={({ roleId, subRoleId, credentials }) => {
        setError(null);
        const home = scwSignIn({
          roleId,
          subRoleId,
          mobile: credentials.username ?? "",
          password: credentials.password ?? "",
        });
        if (!home) {
          setError("Invalid mobile number or password.");
          return;
        }
        router.push(home);
      }}
    />
  );
}
