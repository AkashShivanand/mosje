"use client";

// DS Audit: PortalLoginTemplate ✅ existing. The bespoke form, its inline quick
// accounts grid, the "Secure sign in" badge and the build footer are gone — the
// DemoDock carries the accounts (registry in @mosje/design-system/demo).

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PortalLoginTemplate, type PortalLoginConfig } from "@mosje/design-system";
import { useApp } from "@/store/smile-admin/app-context";

const RETURN_TO_KEY = "smile.returnTo.v1";

/*
 * Following the handoff's Super Admin frame (8383:55268) where the store allows.
 *
 * The identifier is "Mobile Number", not the handoff's "Email or Mobile Number":
 * `signIn` matches `mobile` only, so an email address never signed anyone in.
 * The label changes when the store accepts one.
 *
 * NOT built from the handoff, deliberately:
 * - the "Your role" select (8383:55528) — the role is resolved from the account,
 *   so the select would be a control that does nothing;
 * - "Implementing Agency? Sign in with OTP" (8383:54485) — the store has no OTP
 *   route. When it gains one this role becomes `authModes: ["password", "otp"]`.
 */
const CONFIG: PortalLoginConfig = {
  portalId: "smile-admin",
  portalName: "SMILE Beggary",
  portalTagline: "Support For Marginalized Individuals For Livelihood & Enterprise",
  portalDescription: "Comprehensive Rehabilitation of Persons Engaged in Begging",
  changeHref: "/portals",
  roles: [
    {
      id: "officer",
      audience: "officer",
      label: "Officer",
      authModes: ["password"],
      identifierKind: "mobile",
      identifierLabel: "Mobile Number",
      identifierPlaceholder: "Enter your registered mobile number",
    },
  ],
  links: { forgotPasswordHref: "/portals/smile-admin/forget-password" },
};

export default function LoginPage() {
  const router = useRouter();
  const { signIn, account } = useApp();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!account) return;
    let next = "/portals/smile-admin/dashboard";
    try {
      const stored = sessionStorage.getItem(RETURN_TO_KEY);
      if (stored && stored.startsWith("/") && !stored.startsWith("/portals/smile-admin/login")) {
        next = stored;
      }
      sessionStorage.removeItem(RETURN_TO_KEY);
    } catch {
      /* ignore */
    }
    router.replace(next);
  }, [account, router]);

  return (
    <PortalLoginTemplate
      config={CONFIG}
      loading={busy}
      error={error}
      onSubmit={({ credentials }) => {
        setError(null);
        setBusy(true);
        setTimeout(() => {
          const res = signIn(credentials.username ?? "", credentials.password ?? "");
          setBusy(false);
          // Card level, and names neither field: saying which one was wrong
          // would tell anyone who asks which mobile numbers hold an account.
          if (!res.ok) setError(res.reason);
          // Success: the effect above redirects once `account` updates.
        }, 350);
      }}
    />
  );
}
