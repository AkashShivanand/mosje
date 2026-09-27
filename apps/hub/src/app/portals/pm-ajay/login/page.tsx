"use client";

// DS Audit: PortalLoginTemplate ✅ existing. The bespoke card, its inline demo
// accounts grid, the scheme panel and the page footer this replaces are gone.

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  PortalLoginTemplate,
  type PortalLoginConfig,
  type PortalLoginFieldErrors,
} from "@mosje/design-system";
import { useAuth } from "@/store/pm-ajay/auth-context";

const BASE = "/portals/pm-ajay";

/**
 * PM-AJAY MIS officer login. The handoff's PM-AJAY page draws no login frames
 * (read 2026-09-14), so this follows the estate template as it stands.
 *
 * `useAuth().signIn` still owns the session: the `localStorage` record and the
 * `pmajay_session` cookie the proxy gates on. Demo accounts come from the
 * DemoDock, which the template answers on its own.
 */
const CONFIG: PortalLoginConfig = {
  portalId: "pm-ajay",
  portalName: "PM-AJAY",
  portalTagline: "Pradhan Mantri Anusuchit Jaati Abhyuday Yojana",
  changeHref: "/portals",
  roles: [
    {
      id: "officer",
      audience: "officer",
      label: "Officer",
      authModes: ["password"],
      identifierLabel: "Employee ID",
      identifierPlaceholder: "Enter your employee ID",
    },
  ],
  links: { forgotPasswordHref: `${BASE}/forgot-password` },
};

export default function LoginPage() {
  const router = useRouter();
  const { account, signIn } = useAuth();
  const [fieldErrors, setFieldErrors] = useState<PortalLoginFieldErrors | null>(null);
  const [busy, setBusy] = useState(false);

  /* Signing in lands where the ROLE works, not on one shared home: the MIS accounts
     open the ministry dashboards, the Adarsh Gram district officer opens the district
     workspace. `account.home` carries it, so the login page holds no route table. */
  useEffect(() => {
    if (account) router.replace(BASE + account.home);
  }, [account, router]);

  return (
    <PortalLoginTemplate
      config={CONFIG}
      loading={busy}
      fieldErrors={fieldErrors}
      onSubmit={({ credentials }) => {
        setFieldErrors(null);
        setBusy(true);
        setTimeout(() => {
          const res = signIn(credentials.username ?? "", credentials.password ?? "");
          setBusy(false);
          if (!res.ok) {
            // The store says which half failed; the page says it in the
            // department's register, against the field that caused it.
            setFieldErrors(
              res.reason?.startsWith("Employee ID")
                ? { identifier: "That employee ID is not registered." }
                : { secret: "The password is incorrect." }
            );
          }
          // Success: the effect above fires when `account` updates.
        }, 350);
      }}
    />
  );
}
