import type { Metadata } from "next";
import * as React from "react";

import { ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";

import { Specimen } from "./specimen";

export const metadata: Metadata = {
  title: "India Bubble Map — Design System",
  description: "One circle per state, area proportional to the value.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.1.1 Non-text Content",
    level: "A",
    status: "verified",
    evidence: "It renders through the shared chart frame, which carries a screen-reader data table and a “View as Table” control alongside the drawing.",
    description: "A map is never the only route to the figures.",
  },
];

export default function Page(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="India Bubble Map"
      status="Beta"
      summary="One circle per state, with AREA proportional to the value. Use it when the figure is a count rather than a rate — a choropleth gives each state the ink of its land area, so Rajasthan shouts and Delhi disappears whatever the figures say."
      figma={{ node: "mapOfIndiaDoc" }}
      specimen={<Specimen />}
      propsFrom="IndiaBubbleMapProps"
      a11y={A11Y}
      whenToUse={{
        use: ["A COUNT per state — applications, sanctioned units, beneficiaries.", "Any figure where a small state can hold a large number."],
        avoid: [
          "A rate or a percentage — that is India Map, where shading the state itself is honest.",
          "More points than states: real coordinates belong on India Point Map.",
        ],
      }}
      related={[
        { label: "India Map", href: "/design-system/components/data-display/india-map", reason: "for rates and percentages" },
        { label: "India Point Map", href: "/design-system/components/data-display/india-point-map", reason: "for real coordinates" },
      ]}
    />
  );
}
