import type { Metadata } from "next";
import * as React from "react";

import { ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";

import { Specimen } from "./specimen";

export const metadata: Metadata = {
  title: "Dot Plot — Design System",
  description: "One dot per row on a shared scale, read against a reference line.",
};

const A11Y: A11yItem[] = [
  { criterion: "1.1.1 Non-text Content", level: "A", status: "verified", description: "Each row is announced with its label, value, detail and the reference line.", evidence: "Each `<li role='img'>` carries an `aria-label` with all four." },
  { criterion: "1.4.10 Reflow", level: "AA", status: "verified", description: "Below 768px the label sits above its track, so nothing scrolls sideways at 320px.", evidence: "A media query in dot-plot.css restacks the row grid." },
];

export default function Page(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Dot Plot"
      status="Beta"
      summary="One dot per row on a shared scale, with an optional reference line through every row. The chart for pace — spending against the share of the year elapsed, coverage against a target — where the gap between dot and line is the finding."
      figma={{ absent: "Not yet drawn in the Figma library. Added for the proposed website Dashboard, 6 Oct 2026; the code is authoritative until a counterpart exists." }}
      specimen={<Specimen />}
      propsFrom="DotPlotProps"
      a11y={A11Y}
      whenToUse={{
        use: ["Each row's share of something, read against one shared line — the year elapsed, a target, the national figure."],
        avoid: ["Amounts to be compared by size. Use a Bar Chart: a dot's position is not its magnitude.", "A single figure against a target. Use Progress."],
      }}
      related={[
        { label: "Progress", href: "/design-system/components/data-display/progress", reason: "for one bar against a target" },
        { label: "Bar Chart", href: "/design-system/components/data-display/bar-chart", reason: "for amounts compared by length" },
      ]}
    />
  );
}
