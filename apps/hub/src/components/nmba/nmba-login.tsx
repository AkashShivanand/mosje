"use client";

// DS Audit: PortalLoginTemplate ✅ existing. The two pages this replaces drew
// the shell by hand around their own fields, alert, OTP step and resend button.

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  PortalLoginTemplate,
  type LoginSubmitPayload,
  type OtpRequest,
  type PortalLoginConfig,
  type PortalLoginFieldErrors,
} from "@mosje/design-system";
import { useToast } from "@/components/nmba/toast";
import { accountFromMobile } from "@/lib/nmba/committee/masters";
import { massPledgeAccountFromMobile } from "@/lib/nmba/mass-pledge/masters";
import { PORTAL_SESSION_COOKIE, encodeSession } from "@/lib/nmba/committee/session";
import {
  TC_SESSION_COOKIE,
  encodeSession as encodeTcSession,
  sessionFromProjectId,
} from "@/lib/nmba/treatment-centre/roles";

const BASE = "/portals/nmba";
const DEMO_OTP = "123456";
const EIGHT_HOURS = 60 * 60 * 8;

/** Landing route per role after sign-in. */
const LANDING: Record<string, string> = {
  ADMIN: `${BASE}/admin/dashboard`,
  STATE: `${BASE}/admin/napddr/state`,
  DISTRICT: `${BASE}/admin/napddr/district`,
  // Block and organisation logins exist for Mass Pledge only, so they land there.
  BLOCK: `${BASE}/admin/mass-pledge`,
  ENTITY: `${BASE}/admin/mass-pledge`,
};

/**
 * NMBA's ONE login, as the handoff draws it (`9884:112146` / `:112417`): Admin
 * and Patient Monitoring as role tabs on one page. `/admin/login` and
 * `/treatment-centre/login-otp` both render it, opening on their own tab, and
 * each `(protected)` layout still redirects to its own route.
 *
 * No Forgot Password? link: no NMBA recovery page exists, and the old link was
 * a "coming soon" toast.
 */
function config(defaultRoleId: string): PortalLoginConfig {
  return {
    portalId: "nmba",
    portalName: "Nasha Mukt Bharat Abhiyaan",
    changeHref: "/portals",
    defaultRoleId,
    brandAssets: {
      emblemSrc: `${BASE}/brand/national-emblem.svg`,
      digitalIndiaSrc: `${BASE}/brand/digital-india.svg`,
      // org-logo-exempt(portal-local): NMBA serves its own copy under its brand folder.
      samaveshLogoSrc: `${BASE}/brand/samavesh-logo.svg`,
    },
    roles: [
      {
        id: "admin",
        audience: "officer",
        label: "Admin",
        authModes: ["password"],
        identifierKind: "mobile",
        identifierLabel: "Mobile Number",
        identifierPlaceholder: "10-digit mobile number",
      },
      {
        id: "monitoring",
        audience: "organisation",
        label: "Patient Monitoring",
        authModes: ["otp"],
        otpIdentifierKind: "text",
        otpIdentifierLabel: "Project Id",
        otpIdentifierPlaceholder: "e.g. IRCA001",
      },
    ],
  };
}

export function NmbaLogin({ defaultRoleId }: { defaultRoleId: "admin" | "monitoring" }) {
  const router = useRouter();
  const { toast } = useToast();
  const cfg = React.useMemo(() => config(defaultRoleId), [defaultRoleId]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  // In state, not inline: the template hides an error once its field is edited
  // and shows it again only when a NEW object arrives.
  const [fieldErrors, setFieldErrors] = React.useState<PortalLoginFieldErrors | null>(null);

  const clearErrors = () => {
    setError(null);
    setFieldErrors(null);
  };

  const signInAdmin = (mobile: string, password: string) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const account = accountFromMobile(mobile) ?? massPledgeAccountFromMobile(mobile);
      if (account && password.length > 0) {
        document.cookie = `${PORTAL_SESSION_COOKIE}=${encodeSession(account.session)}; path=/; max-age=${EIGHT_HOURS}`;
        toast("Logged in successfully.", "success");
        router.push(LANDING[account.session.role] ?? `${BASE}/admin/dashboard`);
      } else if (mobile.length === 10 && password.length > 0) {
        // Unknown-but-valid-looking number → default Admin (prototype convenience).
        document.cookie = `${PORTAL_SESSION_COOKIE}=mock-session-token; path=/; max-age=${EIGHT_HOURS}`;
        toast("Logged in successfully.", "success");
        router.push(`${BASE}/admin/dashboard`);
      } else {
        setError("Invalid credentials. Please check your mobile number and password.");
      }
    }, 600);
  };

  const signInTreatmentCentre = (projectId: string, otp: string) => {
    const session = sessionFromProjectId(projectId);
    if (!session) {
      setFieldErrors({ identifier: "No treatment centre is registered with that Project Id." });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (otp.trim() === DEMO_OTP) {
        document.cookie = `${TC_SESSION_COOKIE}=${encodeTcSession(session)}; path=/; max-age=${EIGHT_HOURS}`;
        toast("Logged in successfully.", "success");
        router.push(`${BASE}/treatment-centre/dashboard`);
      } else {
        setFieldErrors({ otp: "The code entered is incorrect." });
      }
    }, 500);
  };

  // A Project Id does not say which handset it is registered to, so the portal
  // supplies the masked number the live site shows.
  const onRequestOtp = async ({ identifier, resend }: OtpRequest) => {
    if (!sessionFromProjectId(identifier)) {
      return { ok: false, error: "No treatment centre is registered with that Project Id." } as const;
    }
    await new Promise((r) => setTimeout(r, 500));
    toast(
      resend
        ? `OTP resent (demo OTP: ${DEMO_OTP}).`
        : `OTP sent to your registered mobile (demo OTP: ${DEMO_OTP}).`,
      "info",
    );
    return { ok: true, maskedDestination: "99******40" } as const;
  };

  const onSubmit = ({ roleId, credentials }: LoginSubmitPayload) => {
    clearErrors();
    if (roleId === "admin") signInAdmin(credentials.username ?? "",credentials.password ?? "");
    else signInTreatmentCentre(credentials.username ?? "", credentials.otp ?? "");
  };

  return (
    <PortalLoginTemplate
      config={cfg}
      loading={loading}
      error={error}
      fieldErrors={fieldErrors}
      onRequestOtp={onRequestOtp}
      onRoleChange={clearErrors}
      onSubmit={onSubmit}
    />
  );
}
