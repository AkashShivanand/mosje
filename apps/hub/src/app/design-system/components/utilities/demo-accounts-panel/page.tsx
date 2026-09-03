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
    evidence: "Each account is a row pairing a role with its identifier and password, so the three are read together rather than as loose strings.",
    description: "A reviewer needs to know which credential belongs to which role.",
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
