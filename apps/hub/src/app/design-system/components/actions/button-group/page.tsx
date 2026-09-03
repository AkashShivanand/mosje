import type { Metadata } from "next";
import * as React from "react";

import { ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";

import { Specimen } from "./specimen";

export const metadata: Metadata = {
  title: "Button Group — Design System",
  description: "Related actions, kept together and kept apart.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "2.5.8 Target Size (Minimum)",
    level: "AA",
    status: "verified",
    evidence:
      "The group applies the estate's 8px gap between adjacent buttons. WCAG 2.2 lets a target under 24×24 be satisfied by SPACING instead of size, and a group is exactly where adjacency happens — a row of `sm` buttons touching each other is the case that fails.",
    description: "The spacing is the accessible half of this component, not decoration.",
  },
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    status: "verified",
    evidence:
      "`aria-label` is a REQUIRED prop — TypeScript refuses a group without one — so four loose buttons always become one named group rather than four unexplained controls.",
    description: "The name is not optional, because a group nobody can name is not a group to a screen reader.",
  },
];

export default function Page(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Button Group"
      status="Stable"
      summary="Related actions, kept together and kept apart. The second half is the one that gets forgotten: UX4G asks for 8px between adjacent targets, and WCAG 2.2 allows a target under 24×24 to be met by SPACING instead of size — so a row of adjacent small buttons with no gap is exactly the case that fails."
      figma={{ absent: "Not yet drawn as its own node; it composes Button." }}
      specimen={<Specimen />}
      propsFrom="ButtonGroupProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "Two or more related actions on one row — Save and Cancel, Approve and Return.",
          "A vertical stack of the same, with `vertical`.",
          "A segmented, joined appearance with `attached`.",
        ],
        avoid: [
          "A bare flex div, which is what produces the touching-targets defect this component exists to prevent.",
          "Unrelated actions that merely sit near each other — grouping implies a relationship.",
        ],
      }}
      related={[
        { label: "Button", href: "/design-system/components/actions/button", reason: "the control it groups" },
        { label: "Icon Button", href: "/design-system/components/actions/icon-button", reason: "when the label is the icon" },
      ]}
    />
  );
}
