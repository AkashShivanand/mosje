import type { Metadata } from "next";
import * as React from "react";

import { ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";

import { Specimen } from "./specimen";

export const metadata: Metadata = {
  title: "Fact Strip — Design System",
  description: "The row of standing facts under a page hero.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    status: "verified",
    evidence: "`ariaLabel` is required, so the strip is always announced as a named group rather than as a run of loose numbers.",
    description: "Three numbers with no group name are three unexplained numbers.",
  },
];

export default function Page(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Fact Strip"
      status="Stable"
      summary="The row of standing facts that sits under a page hero — where the office is, how many components a scheme has, the year it started. These are FACTS, not metrics: they never trend, which is exactly what separates this from a Metric Card."
      figma={{ absent: "Composed under the site page header; no separate node." }}
      specimen={<Specimen />}
      propsFrom="FactStripProps"
      a11y={A11Y}
      whenToUse={{
        use: ["Standing facts under a hero — a founding year, a component count, a head office."],
        avoid: [
          "Anything that moves. A measurement that changes and may carry a trend is a Metric Card, which has the change pill to prove it.",
        ],
      }}
      related={[
        { label: "Metric Card", href: "/design-system/components/data-display/metric-card", reason: "for a figure that moves" },
        { label: "Site Page Header", href: "/design-system/components/layout/site-page-header", reason: "the hero it sits under" },
      ]}
    />
  );
}
