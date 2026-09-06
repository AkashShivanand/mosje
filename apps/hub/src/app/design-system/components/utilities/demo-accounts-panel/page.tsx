import type { Metadata } from "next";
import * as React from "react";

import { ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";

import { Specimen } from "./specimen";

export const metadata: Metadata = {
  title: "Demo Accounts Panel — Design System",
  description: "The shared credentials list used by the demo tooling.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    status: "verified",
    evidence:
      "Each account is one list item pairing a role with its identifier, so the two are read together rather than as loose strings. Where every account shares a password it is stated once above the list; where it does not, it sits beside the identifier in the same row. Both values carry a visually-hidden label naming what they are.",
    description: "A reviewer needs to know which credential belongs to which role.",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    status: "verified",
    evidence:
      "The row's target is a real button, reached by Tab in list order — verified by walking Tab from the top of the panel to a control announcing \"Use Admin credentials\". The copy buttons are separate stops, so copying an identifier and using an account stay separate intents.",
    description: "The row is the primary target; it must not be pointer-only.",
  },
  {
    criterion: "2.4.7 Focus Visible",
    level: "AA",
    status: "verified",
    evidence:
      "The focused row draws a 2px focus ring inset by 2px, washes its background, and fills its Use chip — measured as outline 2px solid rgb(3, 115, 223). forced-colors mode swaps the ring to Highlight, because neither the wash nor the fill is painted there.",
    description: "The row target is transparent, so focus has to be drawn deliberately.",
  },
  {
    criterion: "2.5.8 Target Size (Minimum)",
    level: "AA",
    status: "verified",
    evidence:
      "The row target spans the whole row — 52px tall at the default type scale, against the 24×24 minimum. The copy buttons are 20×20 but are separated from every other target by more than their own size, which the criterion's spacing exception allows.",
    description: "The AA minimum is 24×24, not the AAA 44×44.",
  },
];

export default function Page(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Demo Accounts Panel"
      status="Stable"
      summary="The shared credentials list body used by the demo tooling. Pure content — no floating chrome and no open/closed state, because a shell owns that and renders this for its body."
      figma={{ absent: "Demo tooling; not part of the product library." }}
      specimen={<Specimen />}
      propsFrom="DemoAccountsPanelProps"
      a11y={A11Y}
      whenToUse={{
        use: ["As the body of a demo shell that owns its own open and closed state."],
        avoid: [
          "As a floating panel on its own — it deliberately has no chrome.",
          "Anywhere a real citizen or officer could reach it. These are demonstration credentials.",
        ],
      }}
      related={[
        { label: "Demo Dock", href: "/design-system/components/utilities/demo-dock", reason: "the shell that renders it" },
        { label: "Demo Fab", href: "/design-system/components/utilities/demo-fab", reason: "the older shell" },
      ]}
    />
  );
}
