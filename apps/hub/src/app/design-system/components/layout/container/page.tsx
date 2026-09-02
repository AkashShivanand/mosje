import type { Metadata } from "next";
import * as React from "react";

import {
  Callout,
  CodeBlock,
  ComponentDocPage,
  MatrixTable,
  type A11yItem,
} from "@/components/design-system/docs-kit";
import { Container } from "@mosje/design-system";

export const metadata: Metadata = {
  title: "Container — Design System",
  description:
    "The centred content column. Applies the estate content cap and the responsive side margin together, because they are one rule.",
};


const A11Y: A11yItem[] = [
  {
    criterion: "1.4.10 Reflow",
    level: "AA",
    description:
      "The cap is `min(cap, viewport − 2 × margin)`, so the column narrows with the viewport rather than forcing a horizontal scrollbar at 320 CSS px.",
  },
  {
    criterion: "1.4.4 Resize Text",
    level: "AA",
    description:
      "The cap is a length, not a character count, so raising the browser font size reflows the text inside the column instead of clipping it.",
  },
  {
    criterion: "1.4.8 Visual Presentation",
    level: "AAA",
    description:
      "`size=\"prose\"` caps at 75ch, which sits inside the 80-character measure this criterion asks for. The default `page` cap does not claim it — a 12-column layout is not a reading column.",
  },
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "`as` renders a real landmark element where the region is one. A Container that should be the page's `main` and is left a `div` removes a landmark a screen-reader user navigates by.",
  },
];

export default function ContainerPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Container"
      status="Stable"
      summary="The centred content column. It applies the estate content cap and the responsive side margin together, because they are one rule: the effective width is the smaller of the cap and the viewport less two margins."
      figma={{
        absent:
          "The content container is a layout rule rather than a published master; the SAMAVESH library expresses it through the Layout Grid page, not a component.",
      }}
      specimen={
        <Container size="page">
          <p>
            Centred estate content column — 1200px, widening to 1320 from 1440 and 1440 from
            1920, with the side margin stepping alongside the cap.
          </p>
        </Container>
      }
      propsFrom="ContainerProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A page-level content column on any surface in the estate.",
          "Inside a Band, where the band paints its tone edge to edge and the Container holds the text.",
          "A long-form article or policy page, with `size=\"prose\"` so the measure stays readable.",
        ],
        avoid: [
          "Centring a small element inside a card — that is a flex or grid job, and a Container there applies a page margin in a place that has none.",
          "A hero image or a map that must reach the viewport edge — use Band with `container={false}`.",
          "A signed-in portal page body — AppShell already fluid-fills its main region and needs no cap.",
        ],
      }}
      related={[
        {
          label: "Band",
          href: "/design-system/components/layout/band",
          reason: "when the section's tone must reach the viewport edge",
        },
        {
          label: "Grid",
          href: "/design-system/components/layout/grid",
          reason: "for column arithmetic inside the container",
        },
        {
          label: "Site Layout",
          href: "/design-system/components/layout/site-layout",
          reason: "the website page skeleton these columns sit in",
        },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-ladder">
            <h2 id="cdp-ladder" className="cdp__h2">
              The Cap Is a Ladder, Not a Number
            </h2>
            <p>
              UX4G 3.0 publishes 1200px for desktop and 1320px for desktop-XL, and publishes no
              breakpoints at all — so where each cap engages is the estate&apos;s own decision.
              The margin steps with the <strong>cap</strong>, never with the viewport, which is
              what keeps the content column growing monotonically instead of shrinking as the
              window widens.
            </p>
            <MatrixTable
              caption="Content cap and margin, by viewport"
              columns={["Viewport", "Cap", "Side margin", "Content width"]}
              rows={[
                ["Below 768", "1200", "16", "up to 1152"],
                ["768 to 1439", "1200", "24", "1152"],
                ["1440 to 1919", "1320", "24", "1272"],
                ["1920 and up", "1440", "32", "1376"],
              ]}
            />
            <Callout type="warning" title="Never restate the number">
              Bind to <code>.sa-container</code> or this component and add no{" "}
              <code>px-*</code> of your own. A restated width is a second copy of the ladder that
              no build checks, and it is how a masthead ended up capped at 1320 while every
              section below it capped at 1280 — putting the National Emblem twenty pixels outside
              the content column on a wide screen.
            </Callout>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-sizes">
            <h2 id="cdp-sizes" className="cdp__h2">
              Choosing a Size
            </h2>
            <MatrixTable
              caption="What each size is for"
              columns={["size", "Cap", "Use it for"]}
              rows={[
                ["page", "the ladder above", "Any page-level content column"],
                ["narrow", "960", "A single-column form or a focused article"],
                ["prose", "75ch", "Long-form reading, where the measure matters more than the grid"],
                ["full", "none", "A band whose content genuinely spans the viewport"],
              ]}
            />
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { Band, Container } from "@mosje/design-system";

// A website section: the Band paints the tone, the Container holds the column.
<Band tone="muted">
  <h2>Schemes and Services</h2>
</Band>

// A standalone column, rendered as the page's main landmark.
<Container as="main" size="narrow">
  <ApplicationForm />
</Container>`}</CodeBlock>
          <p>
            <code>Band</code> renders a <code>Container</code> inside itself, so nesting one
            within a Band applies the margin twice. Pass <code>container</code> on the Band
            instead when the inner cap needs to differ.
          </p>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-landmarks">
          <h2 id="cdp-landmarks" className="cdp__h2">
            Landmarks
          </h2>
          <p>
            The Container renders a <code>div</code> by default and contributes no landmark. Where
            the region it wraps is the page&apos;s main content, a section with a heading, or the
            page header, pass <code>as</code> so the element is the real one — a screen-reader user
            navigating by landmark cannot reach a region that is only visually distinct.
          </p>
          <p>
            Do not pass <code>as=&quot;main&quot;</code> inside <code>AppShell</code> or{" "}
            <code>SiteLayout</code>. Both already render the page&apos;s single{" "}
            <code>&lt;main&gt;</code>, and a second one leaves a reader with two main landmarks and
            no way to tell which carries the page.
          </p>
        </section>
      }
    />
  );
}
