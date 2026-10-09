import type { Metadata } from "next";
import * as React from "react";

import { ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";

import { Specimen } from "./specimen";

export const metadata: Metadata = {
  title: "Headline Figure — Design System",
  description: "A figure in display type with the phrase it completes.",
};

const A11Y: A11yItem[] = [
  { criterion: "1.3.1 Info and Relationships", level: "A", status: "verified", description: "The figure, its phrase and its context are paragraphs in reading order.", evidence: "Rendered as three `<p>`s inside one container." },
  { criterion: "1.4.3 Contrast (Minimum)", level: "AA", status: "verified", description: "Inverse tone sits on a filled Card, whose two gradient stops are chosen so white clears 4.5:1 in every tone.", evidence: "card.css tone stops, measured 5 Oct 2026: primary 6.4/4.6, success 6.7/4.8, danger 6.7/4.9, secondary 8.7/5.0, warning 5.7 at 600, info 6.0 at 600." },
];

export default function Page(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Headline Figure"
      status="Beta"
      summary="A figure set in display type with the phrase it completes and, where a published denominator exists, its human scale. No frame: it belongs on a hero panel or an open page, where a card would box in what should read as a sentence."
      figma={{ node: "headlineFigure" }}
      specimen={<Specimen />}
      propsFrom="HeadlineFigureProps"
      a11y={A11Y}
      whenToUse={{
        use: ["The one number a page or a panel leads with.", "On a filled Card or a brand Band: `tone=\"inverse\"`."],
        avoid: ["A row of figures that are read together. Use Metric Card in a KPI Row.", "A figure with no phrase. Without one it is a number, not a fact."],
      }}
      related={[
        { label: "Metric Card", href: "/design-system/components/data-display/metric-card", reason: "for a figure in a row of tiles" },
      ]}
    />
  );
}
