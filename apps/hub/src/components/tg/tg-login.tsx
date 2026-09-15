"use client";

// DS Audit: PortalLoginTemplate ✅ existing. Nothing is hand-rolled — the two
// bespoke pages this replaces each drew their own navy hero, email field, OTP
// field and "Dev OTP" hint.

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  PortalLoginTemplate,
  type OtpRequest,
  type LoginSubmitPayload,
  type PortalBrandAssets,
  type PortalLoginConfig,
  type PortalLoginFieldErrors,
} from "@mosje/design-system";
import { roleByEmail } from "@/lib/tg/roles";
import { useTg } from "@/lib/tg/store/store";

const BASE = "/portals/tg";

export const TG_CITIZEN_HOME = `${BASE}/citizen/dashboard`;

/** Shared with the DigiLocker handoff page, so both draw the same chrome. */
export const TG_LOGIN_CHROME = {
  portalName: "SMILE - Transgender",
  portalTagline: "National Portal for Transgender Persons",
  changeHref: "/portals",
  brandAssets: {
    emblemSrc: `${BASE}/brand/national-emblem.svg`,
    digitalIndiaSrc: `${BASE}/brand/digital-india.svg`,
    // org-logo-exempt(portal-local): TG serves its own copy under its brand folder.
    samaveshLogoSrc: `${BASE}/brand/samavesh-logo.svg`,
    heroImageSrc: "/portals/login-hero/smile-transgender.jpg",
    digilockerLogoSrc: "/design-system/digilocker-mark.png",
  } satisfies PortalBrandAssets,
};

/**
 * The Transgender Portal's ONE login, as the handoff draws it (`10767:71293`):
 * role tabs on one page. `/admin/login` and `/citizen/sign-in` both render it
 * and differ only in the tab that opens, so every link already shared keeps
 * working; switching tab rewrites `?role=` on the same path.
 *
 * Following the handoff, with three deliberate gaps:
 * - Email only, where the handoff says "Email/Mobile": the officer role is
 *   resolved by `roleByEmail`, and no account is keyed on a mobile number.
 * - No Garima Greh tab: no Garima Greh portal exists in code.
 * - No Create Account: there is no citizen registration route.
 */
function config(defaultRoleId: string): PortalLoginConfig {
  return {
    portalId: "tg",
    ...TG_LOGIN_CHROME,
    defaultRoleId,
    // Portal-wide, so the line also shows on the Admin tab.
    consent: true,
    roles: [
      {
        id: "citizen",
        audience: "citizen",
        label: "Citizen",
        authModes: ["otp"],
        digilocker: true,
        otpIdentifierKind: "email",
        otpIdentifierLabel: "Email Address",
        otpIdentifierPlaceholder: "name@example.com",
      },
      {
        id: "admin",
        audience: "officer",
        label: "Admin",
        authModes: ["otp"],
        otpIdentifierKind: "email",
        otpIdentifierLabel: "Email Address",
        otpIdentifierPlaceholder: "name@mosje.in",
      },
    ],
    links: {
      digilockerHref: `${BASE}/citizen/sign-in/digilocker`,
      termsHref: "/website/terms-conditions",
      privacyHref: "/website/privacy-policy",
    },
  };
}

const UNREGISTERED_OFFICER = "This email address is not registered for an officer account.";

export function TgLogin({ defaultRoleId }: { defaultRoleId: "admin" | "citizen" }) {
  const router = useRouter();
  const { login } = useTg();
  const cfg = React.useMemo(() => config(defaultRoleId), [defaultRoleId]);
  // In state, not inline: the template hides an error once its field is edited
  // and shows it again only when a NEW object arrives.
  const [fieldErrors, setFieldErrors] = React.useState<PortalLoginFieldErrors | null>(null);

  // A citizen signs in with any email; an officer's email decides the role, so
  // an unknown one is refused before a code is "sent".
  const onRequestOtp = ({ roleId, identifier }: OtpRequest) =>
    roleId === "admin" && !roleByEmail(identifier)
      ? ({ ok: false, error: UNREGISTERED_OFFICER } as const)
      : ({ ok: true } as const);

  // The mock accepts any six-digit code; the template holds Verify until six are typed.
  const onSubmit = ({ roleId, credentials }: LoginSubmitPayload) => {
    if (roleId === "admin") {
      const role = roleByEmail(credentials.username ?? "");
      if (!role) {
        setFieldErrors({ identifier: UNREGISTERED_OFFICER });
        return;
      }
      login(role.id);
      router.push(role.home);
      return;
    }
    login("citizen");
    router.push(TG_CITIZEN_HOME);
  };

  return (
    <PortalLoginTemplate
      config={cfg}
      fieldErrors={fieldErrors}
      onRequestOtp={onRequestOtp}
      onRoleChange={() => setFieldErrors(null)}
      onSubmit={onSubmit}
    />
  );
}
