import type { Metadata } from "next";
import * as React from "react";

import { ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";

import { Specimen } from "./specimen";

export const metadata: Metadata = {
  title: "Site Page Header — Design System",
  description: "The banner every website page opens with.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "2.4.6 Headings and Labels",
    level: "AA",
    status: "verified",
    evidence: "`headingId` lets the page bind its own landmark to the banner's heading, so the h1 is the title the reader sees.",
    description: "A hero whose heading is decorative leaves the page without a real h1.",
  },
];

export default function Page(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Site Page Header"
      status="Stable"
      summary="The blue band every website page opens with, in two levels. It is a full-bleed banner with a brand gradient, an optional portrait and an overlapping slot beneath — not the portal title row."
      figma={{ absent: "Not yet linked to a Figma node." }}
      specimen={<Specimen />}
      propsFrom="SitePageHeaderProps"
      a11y={A11Y}
      whenToUse={{
        use: ["The opening band of a website page.", "With `reservesOverlap` when a Fact Strip sits across its lower edge."],
        avoid: [
          "A portal screen. That is PageHeader — a heading, a meta line and some buttons on the page's own background.",
        ],
      }}
      related={[
        { label: "Page Header", href: "/design-system/components/layout/page-header", reason: "the portal equivalent" },
        { label: "Fact Strip", href: "/design-system/components/data-display/fact-strip", reason: "what usually overlaps it" },
      ]}
    />
  );
}
