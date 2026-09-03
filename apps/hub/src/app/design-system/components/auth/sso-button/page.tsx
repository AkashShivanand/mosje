import type { Metadata } from "next";
import * as React from "react";

import { ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";

import { Specimen } from "./specimen";

export const metadata: Metadata = {
  title: "SSO Button — Design System",
  description: "The federated sign-in entry point — today, DigiLocker.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "2.4.4 Link Purpose (In Context)",
    level: "A",
    status: "verified",
    evidence: "The button names the provider and what it is — “Continue with DigiLocker”, “Secured Government Login” — rather than showing a mark alone.",
    description: "A federated button identified only by a logo is unusable to anyone who does not recognise the logo.",
  },
];

export default function Page(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="SSO Button"
      status="Stable"
      summary="The federated sign-in entry point. Today that means DigiLocker. It belongs ABOVE the credentials divider, because it is an alternative to the form rather than a field inside it."
      figma={{ absent: "Part of the auth-parts set; no separate Figma node." }}
      specimen={<Specimen />}
      propsFrom="SSOButtonProps"
      a11y={A11Y}
      whenToUse={{
        use: ["On a citizen-facing login, above the credential form and its divider."],
        avoid: [
          "Whenever the Officer or Admin role tab is active. Officers do not hold DigiLocker accounts, so offering it is a dead end — this is the single rule most often missed when a portal login is built.",
          "Wiring that condition to the PORTAL rather than to the active tab. It is the tab that decides.",
          "Below the credential form, which reverses the choice it is offering.",
        ],
      }}
      related={[
        { label: "Auth Divider", href: "/design-system/components/auth/auth-divider", reason: "what separates it from the form below" },
        { label: "Portal Login Template", href: "/design-system/components/auth/portal-login-template", reason: "the screen it belongs to" },
      ]}
    />
  );
}
