import type { Metadata } from "next";
import * as React from "react";

import { CodeBlock, ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";

import { HeadingSpecimen } from "./specimen";

export const metadata: Metadata = {
  title: "Heading — Design System",
  description: "An h1–h6 bound to one type role. The level is the document outline; the role defaults from it.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    status: "verified",
    evidence:
      "`level` is required and renders the real h1–h6 element; there is no way to get the look of a heading without its element, and no way to change the element to change the size.",
    description: "A heading that is a styled div does not appear in a screen reader's heading list.",
  },
  {
    criterion: "2.4.6 Headings and Labels",
    level: "AA",
    status: "verified",
    evidence:
      "The role defaults from the level (h1 → headline-1 … h6 → headline-6), so two h2s on a page render alike unless a caller deliberately departs. The 2026-09-04 audit found a home page with no h1 and four different h2 sizes; this is the component that makes that the hard path.",
    description: "Headings describe topic or purpose, and the same level looks the same across a page.",
  },
  {
    criterion: "1.4.4 Resize Text",
    level: "AA",
    status: "verified",
    evidence:
      "Every role is a rem-based clamp(), so a raised browser default font size and the estate's A−/A/A+ stepper both scale it; verified at 200% zoom on the typography page.",
    description: "Text can be resized to 200% without loss of content.",
  },
  {
    criterion: "3.1.2 Language of Parts",
    level: "AA",
    status: "verified",
    evidence:
      "`lang` passes through; a Devanagari heading with `lang=\"hi\"` switches to Noto Sans Devanagari and the Devanagari leading token through the `:lang(hi)` rule in text.css.",
    description: "The language of a Hindi heading is machine-readable.",
  },
];

export default function HeadingPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Heading"
      status="Stable"
      since="0.42.0"
      summary="An h1–h6 element bound to one of the 21 type roles. The level is the document outline and is required; the role is the size and defaults from the level, so a page that writes `<Heading level={2}>` gets the estate's section size without naming it. Fluid and surface-aware from the tokens: the same heading is 32px on the website and 28px in a portal."
      figma={{
        absent:
          "Headings in the library are the Headline/* and Display/* text styles applied to a text node; there is no separate master, because a heading is a text style and an element, not a component.",
      }}
      specimen={<HeadingSpecimen />}
      propsFrom="HeadingProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "Every heading on the estate that is not a SectionTitle: page titles, card titles, dialog titles, form-section titles.",
          "A hero heading — pass `variant=\"display-3\"` (or another display role) and keep `level={1}`.",
          "A card's heading at a title role: `<Heading level={3} variant=\"title-1\">`.",
        ],
        avoid: [
          "A section heading with an eyebrow, a count or an action beside it — that is `SectionTitle`, which composes this.",
          "Changing `level` to change the size. The level is the outline; `variant` is the size.",
          "Any `font-*`, `leading-*`, `tracking-*` or `text-*` class on it. The role owns all four.",
        ],
      }}
      related={[
        { label: "Text", href: "/design-system/components/layout/text", reason: "the run-of-copy primitive" },
        { label: "Section Title", href: "/design-system/components/layout/section-title", reason: "the section heading that composes this" },
        { label: "Typography", href: "/design-system/foundations/typography", reason: "the 21 roles and the two surfaces" },
      ]}
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Level Is the Outline, Variant Is the Size
          </h2>
          <CodeBlock>{`// A page: one h1, sections at h2, sub-sections at h3 — sizes come from the level
<Heading level={1}>Scheme Coverage</Heading>
<Heading level={2}>Grants Released to States</Heading>
<Heading level={3}>Andhra Pradesh</Heading>

// A hero keeps its h1 and takes a display role
<Heading level={1} variant="display-3">Digital India, Inclusive India</Heading>

// A card title is an h3 at a title role
<Heading level={3} variant="title-1">Post-Matric Scholarship</Heading>

// Hindi: the lang attribute switches the face and the leading
<Heading level={2} lang="hi">हर नागरिक के लिए न्याय</Heading>`}</CodeBlock>
          <p>
            Before 2026-09-04 the estate had no heading primitive, and the website&rsquo;s home page had no{" "}
            <code>h1</code> and four different <code>h2</code> sizes. The component exists so the right outline
            is the easy path: write the level, and the size follows.
          </p>
        </section>
      }
    />
  );
}
