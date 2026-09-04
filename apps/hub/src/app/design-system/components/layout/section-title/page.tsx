import type { Metadata } from "next";
import * as React from "react";

import { CodeBlock, ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";

import { SectionTitleSpecimen } from "./specimen";

export const metadata: Metadata = {
  title: "Section Title — Design System",
  description: "The estate's section heading: eyebrow, title, description, an optional count, and room for an action.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    status: "verified",
    evidence:
      "`as` chooses the heading level (2, 3 or 4) so the page outline stays sequential, and `id` lets a table or list point `aria-labelledby` at the heading.",
    description: "A heading that looks like a heading but is a styled div does not appear in a screen reader's heading list.",
  },
  {
    criterion: "2.4.6 Headings and Labels",
    level: "AA",
    status: "verified",
    evidence: "The title is a real heading element at the level the caller chooses, not a size class.",
    description: "This is the component's whole purpose: one heading treatment, estate-wide.",
  },
  {
    criterion: "1.4.3 Contrast (Minimum)",
    level: "AA",
    status: "verified",
    evidence:
      "Measured 2026-09-02: the eyebrow and the count pill both render #3a3d41 at 11px, which is 10.92:1 on white — more than twice the 4.5:1 AA floor for small text. Title and description use text/neutral/bolder and text/neutral/subtle, which clear it by more.",
    description: "The eyebrow is the smallest text the component renders at 11px, the estate's stated floor, so it is the one that decides this.",
  },
];

export default function SectionTitlePage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Section Title"
      status="Stable"
      summary="The estate's section heading — an optional eyebrow, the title, a supporting sentence, a count pill, and right-aligned room for an action. Use it instead of hand-rolling a heading, so section headers stay identical estate-wide."
      figma={{ absent: "Not yet drawn in the Figma library. The Figma counterpart is outstanding." }}
      specimen={<SectionTitleSpecimen />}
      propsFrom="SectionTitleProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "Every section heading on the estate. This is not a preference — `ui-restraint-and-copy.md` §3 mandates it.",
          "A heading that needs an action beside it, such as “View All”: pass it as children and it is right-aligned.",
          "A section whose size is worth stating, using `count`.",
        ],
        avoid: [
          "The page's own `<h1>` — that belongs to the page template, not to a section.",
          "A card's title, which is `CardTitle`.",
        ],
      }}
      related={[
        { label: "Card", href: "/design-system/components/data-display/card", reason: "a card's own title" },
        { label: "Typography", href: "/design-system/foundations/typography", reason: "the type roles this composes" },
      ]}
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Use It Instead of a Hand-Rolled Heading
          </h2>
          {/* ds-exempt-start(specimen): the "don't" half of the pair shows the hand-rolled heading the component replaces — binding it would delete what is being demonstrated */}
          <CodeBlock>{`// DO
<SectionTitle
  title="Grants Released to States"
  description="Figures as recorded in the PM-AJAY Management Information System."
  count={28}
/>

// DON'T — this is what the component exists to replace
<div className="flex justify-between">
  <h2 className="text-2xl font-bold">Grants Released to States</h2>
</div>`}</CodeBlock>
          {/* ds-exempt-end */}
          <p>
            The “don&rsquo;t” is not hypothetical. A reach section shipped with an <code>h2</code> at
            26.3px/700 over a 16px lead, beside six sibling sections at 18.6px/600 over 12px
            descriptions. Before styling any heading, check what the neighbouring sections render —
            if they use this and yours does not, that is the defect, not their size.
          </p>
        </section>
      }
    />
  );
}
