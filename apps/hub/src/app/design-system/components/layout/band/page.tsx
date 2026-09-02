import type { Metadata } from "next";
import * as React from "react";

import {
  Callout,
  CodeBlock,
  ComponentDocPage,
  MatrixTable,
  type A11yItem,
} from "@/components/design-system/docs-kit";
import { Band } from "@mosje/design-system";

export const metadata: Metadata = {
  title: "Band — Design System",
  description:
    "A full-bleed horizontal section. The tone paints edge to edge while the Container inside holds the content column.",
};


const A11Y: A11yItem[] = [
  {
    criterion: "1.4.3 Contrast (Minimum)",
    level: "AA",
    description:
      "Each tone is paired with an `on/*` ink token in the stylesheet, so text placed inside the band inherits a foreground that clears 4.5:1 on that tone. Setting a colour by hand inside the band breaks that pairing.",
    status: "partial",
    evidence: "Token pairing is enforced in layout.css; per-page content is not gated.",
  },
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "Renders a real `<section>`. A section is only a landmark when it has an accessible name, so pass `aria-labelledby` pointing at the heading inside it.",
  },
  {
    criterion: "1.4.10 Reflow",
    level: "AA",
    description:
      "The band itself is full-bleed and never scrolls horizontally; the Container inside carries the cap and the responsive margin.",
  },
  {
    criterion: "1.4.1 Use of Colour",
    level: "A",
    description:
      "A tone change alone never carries meaning. A band that marks something out — an alert strip, a statutory notice — must also say so in its heading or its copy.",
  },
];

export default function BandPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Band"
      status="Stable"
      summary="A full-bleed horizontal section. The tone paints edge to edge while the Container inside holds the content column, which is what stops a tinted section from stopping short of the viewport edge."
      figma={{
        absent:
          "Bands are a page-composition rule rather than a published master; the SAMAVESH library documents the tones on the Colour page and the rhythm on the Layout Grid page.",
      }}
      specimen={
        <Band tone="muted" aria-label="Band specimen">
          <h3>Featured Ministry Schemes</h3>
          <p>
            The tone reaches the edge of the surface; the column inside stays on the estate
            content cap.
          </p>
        </Band>
      }
      propsFrom="BandProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "Any section of a public website page — the page is a stack of these.",
          "A section that needs a tinted or inverse ground reaching the viewport edge.",
          "A hero or map that must span the full width, with `container={false}`.",
        ],
        avoid: [
          "A signed-in portal page — portal content is fluid inside AppShell and has no bands.",
          "A tinted panel inside a card or a form — that is the card's own surface, not a page section.",
          "Separating two paragraphs — a band is a section, and using one for spacing is what the section spacing scale is for.",
        ],
      }}
      related={[
        {
          label: "Container",
          href: "/design-system/components/layout/container",
          reason: "the column the band holds, and what it renders inside itself",
        },
        {
          label: "Site Layout",
          href: "/design-system/components/layout/site-layout",
          reason: "the website page skeleton whose children are bands",
        },
        {
          label: "Section Title",
          href: "/design-system/components/layout/section",
          reason: "the heading row that opens a band",
        },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-composition">
            <h2 id="cdp-composition" className="cdp__h2">
              The Composition Is Always Band, Container, Content
            </h2>
            <p>
              The band paints the tone; the Container holds the column. Reaching for a bare{" "}
              <code>Container</code> with a background on it is the common mistake, and it
              produces a tinted section that stops short of the viewport edge on every screen
              wider than the cap.
            </p>
            <Callout type="warning" title="Never put a raw colour on the inner container">
              Every tone is bound to a semantic token, and every one of them changes with the
              brand mode. A hardcoded background inside the band survives the brand switch and
              leaves one section the wrong colour on the navy estate.
            </Callout>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-tones">
            <h2 id="cdp-tones" className="cdp__h2">
              Choosing a Tone
            </h2>
            <MatrixTable
              caption="What each tone is for"
              columns={["tone", "Ground", "Use it for"]}
              rows={[
                ["default", "The page surface", "The majority of sections"],
                ["muted", "The subtler neutral", "Alternating with default to separate adjacent sections"],
                ["brand", "The brand ground", "One section per page at most — a call to action or a scheme highlight"],
                ["inverse", "The dark ground", "A closing section or a statutory strip, where the contrast marks the end of the page"],
              ]}
            />
            <p>
              Alternate <code>default</code> and <code>muted</code> down a page rather than
              tinting every second section a different colour. Two adjacent bands with the same
              tone read as one section, which is usually the defect being reported when someone
              asks for a rule between them.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { Band, SectionTitle } from "@mosje/design-system";

<Band tone="muted" aria-labelledby="schemes-heading">
  <SectionTitle
    headingId="schemes-heading"
    title="Schemes and Services"
    description="Central sector schemes administered by the Department."
  />
  <SchemeGrid />
</Band>`}</CodeBlock>
          <p>
            A full-bleed hero takes <code>container={"{false}"}</code> and{" "}
            <code>spacing=&quot;none&quot;</code>, so the child owns both the width and the
            height.
          </p>
          <CodeBlock>{`<Band tone="inverse" spacing="none" container={false}>
  <SchemeHero />
</Band>`}</CodeBlock>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-naming">
          <h2 id="cdp-naming" className="cdp__h2">
            Naming the Region
          </h2>
          <p>
            A <code>&lt;section&gt;</code> becomes a landmark only when it has an accessible
            name. Give the band&apos;s heading a <code>headingId</code> and point the band at it
            with <code>aria-labelledby</code>, so a screen-reader user moving by landmark hears
            &ldquo;Schemes and Services, region&rdquo; rather than an unnamed section they must
            enter to identify.
          </p>
          <p>
            Do not add <code>role=&quot;region&quot;</code> by hand. A named{" "}
            <code>&lt;section&gt;</code> already maps to that role, and the explicit attribute
            only makes an unnamed one announce as an unnamed region instead of being skipped.
          </p>
        </section>
      }
    />
  );
}
