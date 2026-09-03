import type { Metadata } from "next";
import * as React from "react";

import { ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";

import { Specimen } from "./specimen";

export const metadata: Metadata = {
  title: "Account Prompt — Design System",
  description: "The registration route at the foot of a sign-in form.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "2.4.4 Link Purpose (In Context)",
    level: "A",
    status: "verified",
    evidence:
      "Each option carries its own label naming WHO it is for — “Register as a Volunteer”, “Register as a SAGE Organisation” — rather than a shared “Create Account”.",
    description: "The label is the whole point of the component: it is what stops an applicant guessing which route is theirs.",
  },
];

export default function Page(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Account Prompt"
      status="Stable"
      summary="The registration route at the foot of a sign-in form. It takes a LIST of options because some portals register two genuinely different kinds of applicant, and making someone guess which “Create Account” means them is the failure this exists to prevent."
      figma={{ absent: "Part of the auth-parts set; no separate Figma node." }}
      specimen={<Specimen />}
      propsFrom="AccountPromptProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A portal where a citizen can register themselves.",
          "A portal registering two genuinely different applicant types — SCW takes an individual Volunteer and a SAGE Organisation, and they are not the same journey.",
        ],
        avoid: [
          "Two options for two brands of the same thing — that is a choice the reader should not have to make.",
          "A portal with no self-registration at all: pass an empty list and the prompt does not render. NMBA and the Grievance portal are both in that position.",
        ],
      }}
      related={[
        { label: "Portal Login Template", href: "/design-system/components/auth/portal-login-template", reason: "the screen this sits at the foot of" },
        { label: "SSO Button", href: "/design-system/components/auth/sso-button", reason: "the other way into an account" },
      ]}
    />
  );
}
