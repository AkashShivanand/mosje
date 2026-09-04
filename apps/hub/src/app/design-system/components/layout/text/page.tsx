import type { Metadata } from "next";
import * as React from "react";

import { CodeBlock, ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";

import { TextSpecimen } from "./specimen";

export const metadata: Metadata = {
  title: "Text — Design System",
  description: "A run of copy bound to a body, label or title role. Never sets a size of its own.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.4.3 Contrast (Minimum)",
    level: "AA",
    status: "verified",
    evidence:
      "The four tones offered are text inks that clear 4.5:1 on their intended grounds (base 16.18:1 and subtle 10.92:1 on white; measured 2026-09-04). The placeholder ink `subtler` — 4.65:1 on white but 3.45:1 on bg/neutral/subtle — is deliberately not a tone.",
    description: "Body-size text needs 4.5:1 against its ground.",
  },
  {
    criterion: "1.4.12 Text Spacing",
    level: "AA",
    status: "partial",
    evidence:
      "No fixed heights: a Text grows with its content, and `flow` spacing is a margin, not a height. The estate-wide text-spacing overlay test (line-height 1.5, paragraph 2em, letter 0.12em, word 0.16em) is on the roadmap and not yet run.",
    description: "Nothing is lost when a reader overrides spacing.",
  },
  {
    criterion: "1.4.8 Visual Presentation",
    level: "AAA",
    status: "verified",
    evidence:
      "`measure` caps the line at the measure token (36rem, about 68 characters); body roles are 1.5 leading on both surfaces; text is never justified.",
    description: "Line length, leading and alignment that keep reading comfortable.",
  },
  {
    criterion: "3.1.2 Language of Parts",
    level: "AA",
    status: "verified",
    evidence:
      "`lang=\"hi\"` on a Text switches the face and takes the Devanagari leading token; the type gate reports a file that writes Devanagari without the attribute.",
    description: "Hindi runs are machine-readable as Hindi.",
  },
];

export default function TextPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Text"
      status="Stable"
      since="0.42.0"
      summary="A run of copy bound to one type role — body for reading, label for controls and captions, title for the name of a thing. It never sets a size, leading, tracking or weight of its own: the role's tokens do, so the same Text renders alike on every surface and follows the scale when the scale changes."
      figma={{
        absent:
          "Body copy in the library is the Body/*, Label/* and Title/* text styles applied to a text node; a run of text is a style and an element, not a component.",
      }}
      specimen={<TextSpecimen />}
      propsFrom="TextProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "Any paragraph, caption, help text, table cell, label or figure the estate renders.",
          "Figures that line up in a column: `numeric` sets tabular numerals.",
          "Running prose: `measure` caps the line at about 68 characters; `flow` gives consecutive paragraphs the role's paragraph spacing.",
          "The uppercase eyebrow or overline: `variant=\"label-3\"` — the role carries the case and the caps tracking.",
        ],
        avoid: [
          "A heading — that is `Heading`, so the outline stays real.",
          "Any `text-*`, `leading-*`, `tracking-*` or `font-*` class on it.",
          "Uppercase on any role but label-3, and `subtler` ink on running text.",
        ],
      }}
      related={[
        { label: "Heading", href: "/design-system/components/layout/heading", reason: "the heading primitive" },
        { label: "Typography", href: "/design-system/foundations/typography", reason: "the 21 roles and the two surfaces" },
      ]}
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            The Role Is the Job, Not the Size
          </h2>
          <CodeBlock>{`<Text measure flow>
  Villages declared as Adarsh Gram and hostels sanctioned under the scheme, at the
  locations recorded in the PM-AJAY Management Information System.
</Text>
<Text measure flow variant="body-2" tone="subtle">
  Figures as on 31 March 2026.
</Text>

// A control label, a caption, an overline
<Text as="label" variant="label-1">Mobile Number</Text>
<Text as="figcaption" variant="body-3" tone="subtle">Source: PM-AJAY MIS</Text>
<Text as="span" variant="label-3">Scheme Delivery</Text>

// Figures that line up
<Text as="td" variant="body-2" numeric>1,24,560</Text>

// Hindi
<Text lang="hi">सामाजिक न्याय और अधिकारिता</Text>`}</CodeBlock>
        </section>
      }
    />
  );
}
