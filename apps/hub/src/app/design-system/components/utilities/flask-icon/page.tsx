import type { Metadata } from "next";
import * as React from "react";

import { ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";

import { Specimen } from "./specimen";

export const metadata: Metadata = {
  title: "Flask Icon — Design System",
  description: "The demo tooling's own mark.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.1.1 Non-text Content",
    level: "A",
    status: "verified",
    evidence: "It is decorative inside a labelled control — the button carries the name, so the mark is not announced separately.",
    description: "The flask identifies the demo tooling visually; the label identifies it to everyone else.",
  },
];

export default function Page(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Flask Icon"
      status="Stable"
      summary="The demo tooling's own mark — a flask whose liquid moves, because a still flask reads as a picture of a flask rather than as something that is running."
      figma={{ absent: "Demo tooling; not part of the product library." }}
      specimen={<Specimen />}
      propsFrom="FlaskIconProps"
      a11y={A11Y}
      whenToUse={{ use: ["As the face of the demo dock's control."], avoid: ["As a product icon — the interface icon set is Material Symbols, through Icon."] }}
      related={[
        { label: "Demo Dock", href: "/design-system/components/utilities/demo-dock", reason: "what it is the face of" },
        { label: "Icon", href: "/design-system/components/utilities/icon", reason: "the product icon set" },
      ]}
    />
  );
}
