import type { Metadata } from "next";
import * as React from "react";

import { ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";

import { Specimen } from "./specimen";

export const metadata: Metadata = {
  title: "Document Library — Design System",
  description: "One shelf for everything a body publishes.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "2.4.4 Link Purpose (In Context)",
    level: "A",
    status: "verified",
    evidence: "Each row carries its own action label and, where it differs, the document's official name — so a link is never a bare “Download”.",
    description: "A shelf of identical “Download” links is unusable out of context.",
  },
];

export default function Page(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Document Library"
      status="Stable"
      summary="One shelf for everything a body publishes. It replaces the pattern of stacking a separate grid per category — circulars here, formats there, manuals below — because those headings are the publisher's filing system, not a question a reader arrives with."
      figma={{ absent: "Composed from Card and Chip; no separate node." }}
      specimen={<Specimen />}
      propsFrom="DocumentLibraryProps"
      a11y={A11Y}
      whenToUse={{
        use: ["Any page publishing more than a handful of documents across categories."],
        avoid: [
          "One grid per category — four consecutive grids of the identical card read as one long undifferentiated list anyway.",
          "A single document: that is a link.",
        ],
      }}
      related={[
        { label: "Card", href: "/design-system/components/data-display/card", reason: "the surface each row sits on" },
        { label: "Chip", href: "/design-system/components/forms/chip", reason: "the group filters" },
      ]}
    />
  );
}
