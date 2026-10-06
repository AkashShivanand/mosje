import type { Metadata } from "next";
import * as React from "react";

import { ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";

import { Specimen } from "./specimen";

export const metadata: Metadata = {
  title: "India Tile Map — Design System",
  description: "Every State/UT as an equal tile, placed where it sits on the map.",
};

const A11Y: A11yItem[] = [
  { criterion: "2.1.1 Keyboard", level: "A", status: "verified", description: "Every tile takes focus; with `onSelect` it is a button that Enter and Space activate.", evidence: "Each tile is a `<g tabIndex=0>`, `role='button'` when `onSelect` is given, with a keydown handler for Enter and Space." },
  { criterion: "1.1.1 Non-text Content", level: "A", status: "verified", description: "Each tile is named with its State/UT and figure, and the table carries every figure.", evidence: "`aria-label` is 'Kerala: 12 per 100 people'; ChartFrame renders the data table." },
];

export default function Page(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="India Tile Map"
      status="Beta"
      summary="Every State and Union Territory as one equal tile, placed where it sits on the map. A tile cartogram, so Lakshadweep is as legible as Uttar Pradesh — the right map for a per-person reading, where every State/UT deserves the same room."
      figma={{ absent: "Not yet drawn in the Figma library. Added for the proposed website Dashboard, 6 Oct 2026; the code is authoritative until a counterpart exists." }}
      specimen={<Specimen />}
      propsFrom="IndiaTileMapProps"
      a11y={A11Y}
      whenToUse={{
        use: ["A per-person or per-unit reading, where small States/UTs are often the answer.", "A State/UT picker that doubles as a map: pass `onSelect`.", "A thumbnail map in a card: `size=\"sm\"` with `legend=\"ramp\"`."],
        avoid: ["The shape of the country is the point — a route, a corridor, a coastline. Use India Map.", "District readings. The tiles are States/UTs only."],
      }}
      related={[
        { label: "India Map", href: "/design-system/components/data-display/india-map", reason: "when the shape of the country is the point" },
      ]}
    />
  );
}
