import type { Metadata } from "next";
import * as React from "react";

import { ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";

import { Specimen } from "./specimen";

export const metadata: Metadata = {
  title: "Grid Item — Design System",
  description: "One cell of a Grid.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.2 Meaningful Sequence",
    level: "A",
    status: "verified",
    evidence: "It sets a column span only. It never reorders, so the reading order stays the source order.",
    description: "A layout primitive that could reorder visually would break the sequence a screen reader follows.",
  },
];

export default function Page(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Grid Item"
      status="Stable"
      summary="One cell of a Grid. It is only meaningful as a direct child of Grid — on its own it has no track to span. Spans are clamped to the grid's own column count, so an over-wide span wraps rather than overflowing."
      figma={{ absent: "A layout primitive; no visual node." }}
      specimen={<Specimen />}
      propsFrom="GridItemProps"
      a11y={A11Y}
      whenToUse={{
        use: ["A cell that must span more than one column of a Grid."],
        avoid: ["Outside a Grid, where it has no effect.", "As a general-purpose wrapper — it is a cell, not a box."],
      }}
      related={[{ label: "Grid", href: "/design-system/components/layout/grid", reason: "the parent it belongs to" }]}
    />
  );
}
