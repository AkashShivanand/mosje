import type { Metadata } from "next";
import * as React from "react";

import { ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";

import { Specimen } from "./specimen";

export const metadata: Metadata = {
  title: "Waffle Chart — Design System",
  description: "A unit chart of coloured squares, for a small count or a share of 100.",
};

const A11Y: A11yItem[] = [
  { criterion: "1.1.1 Non-text Content", level: "A", status: "verified", description: "Each row is announced with its total and every category's count.", evidence: "Each `<li role='img'>` carries the spoken breakdown; the squares are `aria-hidden`." },
];

export default function Page(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Waffle Chart"
      status="Beta"
      summary="A unit chart: squares, coloured by category. For a count small enough to see as units — 87 indicators, of which 53 have no feed — or a share read as &quot;61 in every 100&quot;. Each square stands for something a reader can name."
      figma={{ absent: "Not yet drawn in the Figma library. Added for the proposed website Dashboard, 6 Oct 2026; the code is authoritative until a counterpart exists." }}
      specimen={<Specimen />}
      propsFrom="WaffleChartProps"
      a11y={A11Y}
      whenToUse={{
        use: ["A count under a few hundred, where each unit is a thing a reader can name.", "A share, as `scale=\"percent\"`: ten-by-ten squares."],
        avoid: ["Large counts — a thousand squares is texture, not information.", "Many categories. Past five colours the squares stop being countable."],
      }}
      related={[
        { label: "Donut Chart", href: "/design-system/components/data-display/donut-chart", reason: "for a share where the units do not matter" },
      ]}
    />
  );
}
