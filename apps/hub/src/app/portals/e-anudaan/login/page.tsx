"use client";

// DS Audit: PortalLoginTemplate ✅ existing · useToast ✅ existing. Nothing is
// hand-rolled here any more — the two bespoke pages this replaces carried their
// own tabs, their own captcha and their own forgot-password rows.

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  PortalLoginTemplate,
  useToast,
  type DemoFillDetail,
  type LoginSubmitPayload,
  type PortalLoginConfig,
} from "@mosje/design-system";
import { ROLES, roleByLoginId } from "@/lib/e-anudaan/roles";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";

const BASE = "/portals/e-anudaan";

/**
 * ONE login for both of E-Anudaan's audiences, as the Portal Login Template
 * draws it: the audiences are role tabs on one page, not two pages.
 *
 * The live deployment runs the NGO and officer surfaces as two apps on two
 * hosts, and this portal used to mirror that with `/sign-in` for NGOs and
 * `/login` for officers — two hand-built forms that agreed on nothing, one of
 * them with a distorted-character captcha the estate has retired. Both routes
 * still resolve: `/sign-in` and the old landing page redirect here with the
 * role in the URL, so every link that ever went out keeps working.
 *
 * Roles map onto the estate's three audiences: the NGO is an `organisation`,
 * every Ministry grade — Programme Division, Integrated Finance Division, the
 * Programme Director and the PMU field officer — is an `officer`, told apart
 * by the mobile number they sign in with rather than by a tab each.
 */
const CONFIG: PortalLoginConfig = {
  portalId: "e-anudaan",
  portalName: "E-Anudaan",
  changeHref: "/portals",
  defaultRoleId: "ngo",
  brandAssets: {
    emblemSrc: `${BASE}/brand/national-emblem.svg`,
    digitalIndiaSrc: `${BASE}/brand/digital-india.svg`,
    samaveshLogoSrc: `${BASE}/brand/samavesh-logo.svg`,
  },
  roles: [
    {
      id: "ngo",
      audience: "organisation",
      label: "NGO",
      description:
        "Voluntary organisations applying for grant-in-aid under SHRESHTA Mode 2, AVYAY, NAPDDR and SMILE.",
      authModeOptions: [
        { mode: "password", label: "Credentials" },
        { mode: "darpan", label: "DARPAN ID" },
      ],
      defaultMode: "password",
    },
    {
      id: "officer",
      audience: "officer",
      label: "Ministry Officer",
      description:
        "Programme Division, Integrated Finance Division, the Programme Director and PMU field officers.",
      authModes: ["password"],
    },
  ],
  // The sentence the department's own DARPAN screen carries under the fields.
  // It lives here rather than in the design system because those five roles are
  // E-Anudaan's org chart; a default would print them on every portal that ever
  // adopts the DARPAN route.
  darpanNote:
    "Other login roles (DWO, State, Ministry, Finance, PMU) use Ministry-issued credentials — separate login flow",
  links: {
    termsHref: "/website/terms-conditions",
    privacyHref: "/website/privacy-policy",
  },
};

export default function EAnudaanLoginPage() {
  const router = useRouter();
  const { login } = useEAnudaan();
  const { toast } = useToast();
  const [error, setError] = React.useState<string | null>(null);
  // Set only by the demo console: choosing an NGO account on the officer tab
  // (or the reverse) moves the reader to the tab that account can sign in on.
  // Left undefined otherwise, so the URL's `?role=` keeps deciding.
  const [roleId, setRoleId] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    const handler = (e: Event) => {
      const { id } = (e as CustomEvent<DemoFillDetail>).detail;
      const role = roleByLoginId(id);
      setRoleId(role?.id === "ngo" ? "ngo" : "officer");
      setError(null);
    };
    window.addEventListener("demo:fill", handler);
    return () => window.removeEventListener("demo:fill", handler);
  }, []);

  const handleSubmit = (payload: LoginSubmitPayload) => {
    const id = (payload.credentials.username ?? "").trim();
    setError(null);

    if (payload.roleId === "officer") {
      const role = roleByLoginId(id);
      if (!role || role.id === "ngo") {
        setError("That mobile number is not a registered officer account.");
        return;
      }
      login(role.id);
      router.push(role.home);
      return;
    }

    if (payload.authMode === "darpan") {
      // Both identifiers, because the form now asks for both — the DARPAN route
      // stopped being the password form with a different label on 2026-09-06.
      // The wording matches the field labels; "NGO-DARPAN Unique ID" named a
      // field that no longer exists on the screen.
      if (!id) {
        setError("Enter your DARPAN ID.");
        return;
      }
      if (!payload.credentials.pan) {
        setError("Enter the organisation's PAN Number.");
        return;
      }
    } else if (id.toUpperCase() !== ROLES.ngo.loginId) {
      setError("Unknown username or login ID for this demo.");
      return;
    }
    login("ngo");
    router.push(ROLES.ngo.home);
  };

  return (
    <PortalLoginTemplate
      config={CONFIG}
      roleId={roleId}
      onRoleChange={() => {
        setRoleId(undefined);
        setError(null);
      }}
      error={error}
      onSubmit={handleSubmit}
      onFooterLinkClick={(link) => toast(`Viewing ${link} policy.`, "info")}
    />
  );
}
