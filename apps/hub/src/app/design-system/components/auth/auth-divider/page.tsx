import type { Metadata } from "next";
import * as React from "react";

import { ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";

import { Specimen } from "./specimen";

export const metadata: Metadata = {
  title: "Auth Divider — Design System",
  description: "A labelled rule separating two ways of signing in.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    status: "verified",
    evidence:
      "The rule is `aria-hidden`. The two routes it separates are already distinct controls, so announcing a divider between them adds nothing and interrupts the reading.",
    description: "Decorative to assistive technology, on purpose.",
  },
];

export default function Page(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Auth Divider"
      status="Stable"
      summary="A labelled rule between two ways of doing the same thing — typically the DigiLocker button above and the credential form below. The label NAMES the second route, because “or” on its own tells the reader nothing about the choice they are being offered."
      figma={{ absent: "Part of the auth-parts set; no separate Figma node." }}
      specimen={<Specimen />}
      propsFrom="AuthDividerProps"
      a11y={A11Y}
      whenToUse={{
        use: ["Between two genuinely different routes into the same account — federated sign-in above, credentials below."],
        avoid: [
          "As a generic section separator — that is a Divider.",
          "With the bare label “or”, which describes nothing. Name the route that follows.",
        ],
      }}
      related={[
        { label: "Divider", href: "/design-system/components/layout/divider", reason: "separating sections generally" },
        { label: "SSO Button", href: "/design-system/components/auth/sso-button", reason: "what usually sits above it" },
      ]}
    />
  );
}
