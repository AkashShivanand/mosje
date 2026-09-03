import type { Metadata } from "next";
import * as React from "react";

import { ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";

import { Specimen } from "./specimen";

export const metadata: Metadata = {
  title: "Signing Into Bar — Design System",
  description: "Tells the citizen which portal they are about to sign into.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "2.4.2 Page Titled",
    level: "A",
    status: "verified",
    evidence: "The bar names the destination scheme in full, so a login screen reached from a search result or a shared link identifies itself.",
    description: "Every portal login in the estate looks alike; this is what distinguishes them.",
  },
];

export default function Page(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Signing Into Bar"
      status="Stable"
      summary="Tells the citizen which portal they are about to sign into, and offers the way to change it. `portalName` is the SCHEME name, not the acronym — every portal in the estate shows “Senior Citizens Welfare” rather than “SCW”."
      figma={{ absent: "Part of the auth-parts set; no separate Figma node." }}
      specimen={<Specimen />}
      propsFrom="SigningIntoBarProps"
      a11y={A11Y}
      whenToUse={{
        use: ["At the top of any portal login screen."],
        avoid: [
          "Passing an acronym. NHAPOA shows “SAMBAL (NHAA 2.0)”, not “NHAPOA”.",
          "Choosing `tone` from the brand instead of the surface. It follows what is BEHIND the bar: `hero` over the photograph scrim, `surface` anywhere else.",
        ],
      }}
      related={[
        { label: "Portal Login Template", href: "/design-system/components/auth/portal-login-template", reason: "the screen it sits at the top of" },
        { label: "Org Logo", href: "/design-system/components/brand/org-logo", reason: "the mark it can carry" },
      ]}
    />
  );
}
