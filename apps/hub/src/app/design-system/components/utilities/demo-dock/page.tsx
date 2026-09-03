import type { Metadata } from "next";
import * as React from "react";

import { ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";

import { Specimen } from "./specimen";

export const metadata: Metadata = {
  title: "Demo Dock — Design System",
  description: "The floating demo console for the estate.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    status: "verified",
    evidence: "The panel is a labelled `dialog` with a programmatic tab stop, so focus can be moved into it and Escape closes it.",
    description: "Demo scaffolding still has to be operable by keyboard.",
  },
];

export default function Page(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Demo Dock"
      status="Stable"
      summary="One floating, demo-only console for the estate: app switching, brand-palette preview and demo sign-in credentials behind a single control on the right wall."
      figma={{ absent: "Demo tooling; not part of the product library." }}
      specimen={<Specimen />}
      propsFrom="DemoDockProps"
      a11y={A11Y}
      whenToUse={{
        use: ["Nowhere by hand — the hub root layout mounts it once for the whole estate."],
        avoid: [
          "Mounting it inside a portal. It already sits above every page, and a second mount reintroduces the duplicate-control problem it was built to remove.",
          "Treating it as product navigation: it is demo scaffolding, and the panel says so on every render.",
        ],
      }}
      related={[
        { label: "App Switcher Panel", href: "/design-system/components/navigation/app-switcher-panel", reason: "the Apps tab's body" },
        { label: "Demo Accounts Panel", href: "/design-system/components/utilities/demo-accounts-panel", reason: "the Sign in tab's body" },
      ]}
    />
  );
}
