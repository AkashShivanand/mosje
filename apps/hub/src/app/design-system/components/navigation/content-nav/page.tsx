import type { Metadata } from "next";
import * as React from "react";

import { ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";

import { Specimen } from "./specimen";

export const metadata: Metadata = {
  title: "Content Nav — Design System",
  description: "The grouped section index beside a long content page.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    status: "verified",
    evidence: "`ariaLabel` is required, and the groups are real labelled groups — so the index announces itself as a table of contents rather than as a stack of loose links.",
    description: "A page with two navigations needs both of them named.",
  },
  {
    criterion: "2.4.8 Location",
    level: "AAA",
    status: "verified",
    evidence:
      "`content-nav.tsx:131` sets `aria-current=\"page\"` on the current item — confirmed rendered in the browser, where the story shows an element carrying aria-current.",
    description: "An item may be marked `current`, so the reader can tell where in the document they are.",
  },
];

export default function Page(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Content Nav"
      status="Stable"
      summary="The grouped section index beside a long content page — a table of contents for a DOCUMENT. No icons, no open/closed state, no client bundle."
      figma={{ absent: "Not yet drawn as its own node." }}
      specimen={<Specimen />}
      propsFrom="ContentNavProps"
      a11y={A11Y}
      whenToUse={{
        use: ["Beside a long content page that divides into named sections."],
        avoid: [
          "As a portal application rail. That is SidebarNav — every item carries an icon, it collapses to a strip, and it owns open/closed state.",
        ],
      }}
      related={[
        { label: "Sidebar Nav", href: "/design-system/components/navigation/sidebar-nav", reason: "the portal rail, which this is not" },
        { label: "Breadcrumb", href: "/design-system/components/navigation/breadcrumb", reason: "where the page sits in the estate" },
      ]}
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-not">
          <h2 id="cdp-not" className="cdp__h2">Why This Is Not Sidebar Nav</h2>
          <p>
            They look alike and are different components on purpose. <strong>SidebarNav</strong> is a
            portal application rail: every item carries an icon, it collapses to a strip, and it is a
            client component because it owns its own open and closed state.
          </p>
          <p>
            This is a table of contents for a document — a stack of labelled groups of links.
            Merging the two would mean either forcing an icon onto every heading of a content page,
            or shipping a client bundle for a list that never changes.
          </p>
        </section>
      }
    />
  );
}
