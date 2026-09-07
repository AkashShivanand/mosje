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
    /* The handoff's Portal Hero photograph (52380:187201), exported from the
       design at its native 1254 square — the source's ceiling, so it is shipped
       whole rather than upscaled. Served from the shared login-hero directory
       beside SMILE's, because a hero photograph belongs to the SCHEME and any
       portal's login may want it. */
    heroImageSrc: "/portals/login-hero/e-anudaan.jpg",
  },
  /*
   * FOLLOWING THE HANDOFF — `E-Anudaan | NGO` and `| Admin`, LOGIN &
   * AUTHENTICATION (52368:232012) in MoSJE Portal — Handoff. Everything below
   * that differs from the estate default is drawn there.
   *
   * The two roles ask for DIFFERENT identifiers, which is the whole reason
   * `identifierLabel` exists: an NGO's username is issued with its registration,
   * an officer signs in with their own mobile number. The generic
   * "Username / Email / Mobile" asked both to guess.
   *
   * NO `description` on either role. The handoff draws a clean gap between "Log
   * in to your account" and the first control; the sentences that used to sit
   * there were ours, not the department's.
   */
  roles: [
    {
      id: "ngo",
      audience: "organisation",
      label: "NGO",
      identifierLabel: "Username",
      identifierPlaceholder: "Enter your username",
      // The handoff puts the DigiLocker card above the credentials divider on the
      // NGO tab and on neither Officer screen — a per-role fact, not an audience one.
      digilocker: true,
      // "I am not a robot" with a Security check, drawn on all three NGO frames.
      // Switched on here because the alternative WCAG 2.2 3.3.8 requires is
      // real: `botCheck.helpHref` below routes a blocked applicant to a person.
      captcha: true,
      authModeOptions: [
        { mode: "password", label: "Login with Credentials" },
        { mode: "darpan", label: "Login with DARPAN ID" },
      ],
      defaultMode: "password",
    },
    {
      id: "officer",
      // The handoff's tab reads "Officer", not "Ministry Officer".
      label: "Officer",
      audience: "officer",
      identifierLabel: "Mobile Number",
      identifierPlaceholder: "Enter your mobile number",
      // No DigiLocker, no method tabs, no security check: the Admin frames draw a
      // mobile number, a password and the button, and nothing else.
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
    // Drawn on the label row of every password field in the handoff.
    forgotPasswordHref: `${BASE}/forgot-password`,
    // The DigiLocker card renders only when a role asks for it AND this is set;
    // a CTA with nowhere to go is worse than no CTA.
    digilockerHref: "https://digilocker.gov.in/",
    termsHref: "/website/terms-conditions",
    privacyHref: "/website/privacy-policy",
    /*
     * NO `helpFaqHref`. It renders a visible "Need Help?" line under the account
     * prompt, and the handoff draws none. The bot check's own escape route is
     * `botCheck.helpHref` below — a different thing, shown only inside the check,
     * and the one WCAG 2.2 3.3.8 actually requires.
     */
  },
  /*
   * The checkbox check the handoff draws, not the invisible default. Its
   * `helpHref` is the alternative WCAG 2.2 3.3.8 requires — an applicant the
   * check will not pass reaches a person rather than a dead end.
   */
  botCheck: { mode: "checkbox", helpHref: `${BASE}/help` },
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
