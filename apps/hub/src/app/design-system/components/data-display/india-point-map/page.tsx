import type { Metadata } from "next";
import * as React from "react";

import { ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";

import { Specimen } from "./specimen";

export const metadata: Metadata = {
  title: "India Point Map — Design System",
  description: "Real coordinates on the national outline.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.1.1 Non-text Content",
    level: "A",
    status: "verified",
    evidence: "It renders through the shared chart frame, so a screen-reader table and a visible “View as Table” control accompany the map.",
    description: "Coordinates are unreadable without a table; the table is the accessible equivalent.",
  },
];

export default function Page(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="India Point Map"
      status="Beta"
      summary="Real coordinates on the national outline, at whichever grain the data can honestly support — hex bins where points are dense, bubbles where they are aggregated, pins where each one matters."
      figma={{ node: "mapOfIndia" }}
      specimen={<Specimen />}
      propsFrom="IndiaPointMapProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "Facilities, hostels or offices at their real locations.",
          "Thousands of points, binned — a hex grid says where the density is without drawing every dot.",
        ],
        avoid: [
          "A figure already aggregated to a state. Putting it at the state's centre implies a precision the data does not have — use India Map or India Bubble Map.",
        ],
      }}
      related={[
        { label: "India Bubble Map", href: "/design-system/components/data-display/india-bubble-map", reason: "counts per state" },
        { label: "India Map", href: "/design-system/components/data-display/india-map", reason: "rates per state" },
      ]}
    />
  );
}
