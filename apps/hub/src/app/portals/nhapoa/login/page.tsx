"use client";

// DS Audit: PortalLoginTemplate ✅ existing · Modal ✅ existing (inside RenameNotice).
// The bespoke navy panel, form and demo listener this replaces are gone: the
// template draws the form, and it already answers the DemoDock's `demo:fill`.

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  PortalLoginTemplate,
  type PortalLoginConfig,
  type PortalLoginFieldErrors,
} from "@mosje/design-system";
import { RenameNotice } from "@/components/nhapoa/rename-notice";
import { roleByUsername } from "@/lib/nhapoa/roles";
import { useNhapoa } from "@/lib/nhapoa/store/store";

const BASE = "/portals/nhapoa";

/**
 * SAMBAL officer login (mock auth), following the handoff's SAMBAL page
 * (`10434:159436`): "Log in to your account", Username + Password, Forgot
 * Password?.
 *
 * Any non-empty password is accepted — the username resolves the role, which is
 * stored in the mock session and decides where the officer lands.
 *
 * NOT BUILT from the handoff: the "Login with OTP" tab. No OTP back end or mock
 * exists for officers, so a second method would be a control that does nothing.
 */
const CONFIG: PortalLoginConfig = {
  portalId: "nhapoa",
  portalName: "SAMBAL",
  portalTagline: "Smart Access for Mainstreaming of Beneficiaries through Augmented Linkages",
  changeHref: "/portals",
  brandAssets: {
    emblemSrc: `${BASE}/brand/national-emblem.svg`,
    digitalIndiaSrc: `${BASE}/brand/digital-india.svg`,
    // org-logo-exempt(portal-local): SAMBAL serves its own copy of the chrome
    // marks from its brand folder, byte-identical to the estate's.
    samaveshLogoSrc: `${BASE}/brand/samavesh-logo.svg`,
  },
  roles: [
    {
      id: "officer",
      audience: "officer",
      label: "Officer",
      authModes: ["password"],
      identifierLabel: "Username",
      identifierPlaceholder: "Enter your username",
    },
  ],
  links: { forgotPasswordHref: `${BASE}/forgot-password` },
};

export default function LoginPage() {
  const router = useRouter();
  const { login } = useNhapoa();
  // Kept in state: the template hides an error once its field is edited, and
  // shows one again only when a NEW object arrives.
  const [fieldErrors, setFieldErrors] = React.useState<PortalLoginFieldErrors | null>(null);

  return (
    <>
      <PortalLoginTemplate
        config={CONFIG}
        fieldErrors={fieldErrors}
        onSubmit={({ credentials }) => {
          const role = roleByUsername(credentials.username ?? "");
          if (!role) {
            setFieldErrors({ identifier: "That username is not registered on SAMBAL." });
            return;
          }
          login(role.id);
          router.push(role.home);
        }}
      />
      {/* The OM (06.07.2026) asks for a pop-up on login announcing the rename,
          and the handoff draws it over this page (`11184:100755`). */}
      <RenameNotice />
    </>
  );
}
