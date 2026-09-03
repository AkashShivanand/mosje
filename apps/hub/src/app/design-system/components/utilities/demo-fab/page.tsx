import type { Metadata } from "next";
import * as React from "react";

import { ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";

import { Specimen } from "./specimen";

export const metadata: Metadata = {
  title: "Demo Fab — Design System",
  description: "The older, per-page demo credentials control.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    status: "verified",
    evidence:
      "`demo-fab.tsx` labels the panel `aria-label=\"Demo credentials\"` and its close control `aria-label=\"Close demo credentials\"`, so both the region and its control are named.",
    description: "The trigger is a named button and the panel it opens is labelled.",
  },
];

export default function Page(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Demo Fab"
      status="Deprecated"
      summary="The older, per-page demo credentials control that Demo Dock superseded. It survives for the rare surface genuinely outside the hub's layout tree — a standalone Storybook demo, for instance."
      figma={{ absent: "Demo tooling; not part of the product library." }}
      specimen={<Specimen />}
      propsFrom="DemoFabProps"
      a11y={A11Y}
      whenToUse={{
        use: ["A page genuinely outside the hub's layout tree, where Demo Dock is not mounted."],
        avoid: [
          "Inside the hub alongside Demo Dock. Two floating demo controls on one page is exactly the problem Demo Dock was built to remove.",
        ],
      }}
      related={[
        { label: "Demo Dock", href: "/design-system/components/utilities/demo-dock", reason: "what replaced it" },
        { label: "Demo Accounts Panel", href: "/design-system/components/utilities/demo-accounts-panel", reason: "the body both shells render" },
      ]}
    />
  );
}
