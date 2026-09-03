import type { Metadata } from "next";
import * as React from "react";

import { ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";

import { Specimen } from "./specimen";

export const metadata: Metadata = {
  title: "Sidebar Nav — Design System",
  description: "The portal app-shell left navigation.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    status: "verified",
    evidence: "Items are grouped, and a group with children renders a real nested list rather than an indented flat one.",
    description: "The two-level hierarchy is structural, not visual.",
  },
  {
    criterion: "2.4.8 Location",
    level: "AAA",
    status: "verified",
    evidence: "`pathname` is required, so the rail always knows and marks which item is current.",
    description: "A portal rail that cannot say where you are is a list of links.",
  },
];

export default function Page(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Sidebar Nav"
      status="Stable"
      summary="The portal app-shell left navigation: two levels, an expanded 300px mode and a collapsed 88px strip, with the current item derived from the pathname you pass it."
      figma={{ absent: "Mirrors Portal DS sidebar/type-1; the SAMAVESH node is not yet linked here." }}
      specimen={<Specimen />}
      propsFrom="SidebarNavProps"
      a11y={A11Y}
      whenToUse={{
        use: ["The left rail of a portal application shell."],
        avoid: [
          "A content page's section index — that is ContentNav, which needs no icons and no client bundle.",
          "Omitting `pathname`: without it nothing is marked current.",
        ],
      }}
      related={[
        { label: "App Shell", href: "/design-system/components/layout/app-shell", reason: "the shell it is the rail of" },
        { label: "Content Nav", href: "/design-system/components/navigation/content-nav", reason: "for a document, not an application" },
      ]}
    />
  );
}
