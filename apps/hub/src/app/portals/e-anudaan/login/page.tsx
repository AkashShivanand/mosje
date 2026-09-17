"use client";

// DS Audit: PortalLoginTemplate ✅ existing · PortalRoleTab.identityProvider ➕ added for the
// NGO-DARPAN card. Nothing is hand-rolled here — the two bespoke pages this replaces carried
// their own tabs, their own captcha and their own forgot-password rows.

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  PortalLoginTemplate,
  type DemoFillDetail,
  type LoginSubmitPayload,
  type PortalLoginConfig,
} from "@mosje/design-system";
import { EANUDAAN_LOGIN_CHROME } from "@/components/e-anudaan/login-chrome";
import { DARPAN_ROUTES } from "@/lib/e-anudaan/darpan-sign-in";
import { ROLES, roleByLoginId } from "@/lib/e-anudaan/roles";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { takeFailure } from "@/lib/e-anudaan/error-catalogue";
import { failureOf, serviceErrorText } from "@/components/e-anudaan/service-error";

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
  ...EANUDAAN_LOGIN_CHROME,
  defaultRoleId: "ngo",
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
      // NO DigiLocker. The handoff's NGO frames (52380:187221, :187235, :187249 and
      // the phone frames) draw `Auth / AuthFormCard` with Show DigiLocker OFF.
      /*
       * SIGN IN WITH NGO-DARPAN — §D item 1 of the 17 Sep 2026 plan, replacing both the
       * "I am not a robot" check and the "Login with DARPAN ID" tab.
       *
       * The tab asked for a DARPAN ID and a PAN: two identifiers that are PUBLIC, so it proved
       * nothing about who was typing them. The captcha beside the password was a cognitive
       * function test (WCAG 2.2 SC 3.3.8). A redirect to NGO-DARPAN proves control of the
       * organisation's registration and asks the applicant to remember nothing, so both go.
       * The username and password stay beneath the card as the fallback for an organisation
       * whose NGO-DARPAN sign-in is unavailable — with no captcha on them either.
       */
      identityProvider: {
        title: "Sign in with NGO-DARPAN",
        subtitle: "For registered organisations",
        href: DARPAN_ROUTES.start,
        // A generic mark, never the registry's own: this is a prototype stand-in.
        icon: "corporate_fare",
      },
      authModes: ["password"],
    },
    {
      id: "officer",
      // The handoff's tab reads "Officer", not "Ministry Officer".
      label: "Officer",
      audience: "officer",
      identifierLabel: "Mobile Number",
      identifierPlaceholder: "Enter your mobile number",
      // No DigiLocker, no method tabs, no security check: the Admin frames draw a
      // mobile number, a password and the button, and nothing else. No second factor is
      // drawn either; when one is added it is an OTP (paste allowed,
      // autocomplete="one-time-code"), which the template's OTP stack already is.
      authModes: ["password"],
    },
  ],
  links: {
    // Drawn on the label row of every password field in the handoff.
    forgotPasswordHref: `${BASE}/forgot-password`,
    // No DigiLocker and no consent line on this portal (the handoff draws
    // neither), so neither the handoff link nor the Terms and Privacy links are set.
    // NO `helpFaqHref`. It renders a visible "Need Help?" line under the account
    // prompt, and the handoff draws none.
  },
  /* No `botCheck`. Neither tab asks for one any more (WCAG 2.2 SC 3.3.8). */
};

export default function EAnudaanLoginPage() {
  const router = useRouter();
  const { login } = useEAnudaan();
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

    // The simulated request layer. The template's error slot takes one sentence, so the catalogued
    // failure is written through the shared helper rather than worded here (error-catalogue.ts).
    const occasion = payload.roleId !== "officer" && payload.authMode === "darpan" ? "darpan" : "sign-in";
    const failed = takeFailure(occasion) ?? (occasion === "darpan" ? takeFailure("sign-in") : null);
    if (failed) {
      setError(serviceErrorText(failureOf(failed, occasion)));
      return;
    }

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

    if (id.toUpperCase() !== ROLES.ngo.loginId) {
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
    />
  );
}
