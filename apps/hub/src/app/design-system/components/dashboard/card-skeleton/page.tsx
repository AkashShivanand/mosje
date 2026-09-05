import type { Metadata } from "next";
import * as React from "react";

import { ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";

import { Specimen } from "./specimen";

export const metadata: Metadata = {
  title: "Card Skeleton — Design System",
  description: "A shaped loading placeholder for a dashboard card.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    status: "verified",
    evidence: "The skeleton takes the SHAPE of the result — bars for a bar chart, a ring for a donut — so the layout does not jump when the figures land.",
    description: "A skeleton in the shape of the answer is what stops the page reflowing under the reader.",
  },
];

export default function Page(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Card Skeleton"
      status="Stable"
      summary="A shaped loading placeholder. Every shape shimmers on the same clock and staggers on the same 90ms step, so a dashboard of six loading cards reads as one page arriving rather than six independent spinners."
      figma={{ node: "chartsChartCard" }}
      specimen={<Specimen />}
      propsFrom="CardSkeletonProps"
      a11y={A11Y}
      whenToUse={{
        use: ["Outside a card, where you are building the loading state yourself."],
        avoid: [
          "Inside a ChartCard — it renders this from its own `skeleton` prop, and reaching for it directly there duplicates the work.",
          "A spinner in a void: the whole point is that the placeholder has the result's shape.",
        ],
      }}
      related={[
        { label: "Chart Card", href: "/design-system/components/dashboard/chart-card", reason: "renders this for you" },
        { label: "Card State", href: "/design-system/components/dashboard/card-state", reason: "when the load finishes with nothing" },
      ]}
    />
  );
}
