import type { Metadata } from "next";
import * as React from "react";

import { ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";

import { Specimen } from "./specimen";

export const metadata: Metadata = {
  title: "Color Mode Provider — Design System",
  description: "Supplies the brand palette every component reads from.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.4.3 Contrast (Minimum)",
    level: "AA",
    status: "verified",
    evidence:
      "Every mode it can set is one whose token pairings are asserted by the estate's own contrast tests — the provider cannot introduce an unmeasured palette.",
    description: "Switching brand cannot silently produce a failing pairing.",
  },
];

export default function Page(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Color Mode Provider"
      status="Stable"
      summary="Supplies the brand palette every component reads from, by setting the mode attribute the token stylesheets key off. It renders no markup of its own — wrap the app once and every component follows."
      figma={{ absent: "Infrastructure; no visual node." }}
      specimen={<Specimen />}
      propsFrom="ColorModeProviderProps"
      a11y={A11Y}
      whenToUse={{
        use: ["Once, at the root of an app, so the palette is available everywhere below it."],
        avoid: [
          "Nesting a second provider to re-theme a subtree — the estate has one brand at a time, and two providers make “which mode am I in” unanswerable.",
          "Reaching for the `dbim` mode: it is code-only and deliberately outside the published set.",
        ],
      }}
      related={[
        { label: "Brand Modes", href: "/design-system/foundations/color", reason: "the palettes it selects between, and how a mode is chosen" },
      ]}
    />
  );
}
