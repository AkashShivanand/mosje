import type { Metadata } from "next";
import * as React from "react";

import { ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";

import { Specimen } from "./specimen";

export const metadata: Metadata = {
  title: "Segmented Control — Design System",
  description: "A single-select toggle for a dashboard period or view.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    status: "verified",
    evidence: "It renders an ARIA radiogroup, so a screen reader announces the set, the selected member and the count — not a row of unrelated buttons.",
    description: "A segmented control is a radio group wearing different clothes.",
  },
];

export default function Page(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Segmented Control"
      status="Stable"
      summary="A single-select toggle, commonly a dashboard period switch — financial year, quarter, month. It renders an ARIA radiogroup rather than a row of buttons, because that is what it actually is."
      figma={{ absent: "Part of the filter-bar set; no separate node." }}
      specimen={<Specimen />}
      propsFrom="SegmentedControlProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "Two to about five mutually exclusive views of the same data.",
          "A period switch above a chart.",
        ],
        avoid: [
          "More than about five options — that is a Select or a Filter Select.",
          "Options that are not mutually exclusive: those are checkboxes or chips.",
          "Actions rather than views — a segmented control selects, it does not do.",
        ],
      }}
      related={[
        { label: "Radio", href: "/design-system/components/forms/radio", reason: "the same semantics in a form" },
        { label: "Filter Select", href: "/design-system/components/forms/filter-select", reason: "more options than fit on a row" },
      ]}
    />
  );
}
