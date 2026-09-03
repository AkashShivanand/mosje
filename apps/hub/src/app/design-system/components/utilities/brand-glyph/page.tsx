import type { Metadata } from "next";
import * as React from "react";

import { ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";

import { Specimen } from "./specimen";

export const metadata: Metadata = {
  title: "Brand Glyph — Design System",
  description: "A third-party brand mark, optically normalised against its siblings.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.1.1 Non-text Content",
    level: "A",
    status: "verified",
    evidence: "The glyph is decorative inside a labelled link — the LINK carries the name, so the mark is not announced twice.",
    description: "A social row where every icon announces its own name reads as a stutter.",
  },
];

export default function Page(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Brand Glyph"
      status="Stable"
      summary="A third-party brand mark — the vendors' own artwork, unredrawn — optically normalised against its siblings and inheriting currentColor. What it adds is the one thing a row of five logos needs and no vendor supplies: a single optical size."
      figma={{ absent: "Vendor artwork; not a SAMAVESH-authored node." }}
      specimen={<Specimen />}
      propsFrom="BrandGlyphProps"
      a11y={A11Y}
      whenToUse={{
        use: ["A row of social or partner links in a footer or contact rail."],
        avoid: [
          "Redrawing or recolouring the vendor's mark to match the brand — these are other organisations' assets.",
          "Using it for an organisation in this estate: those are OrgLogo, and they are the National Emblem family.",
        ],
      }}
      related={[
        { label: "Org Logo", href: "/design-system/components/brand/org-logo", reason: "marks belonging to this estate" },
        { label: "Icon", href: "/design-system/components/utilities/icon", reason: "the interface icon set" },
      ]}
    />
  );
}
