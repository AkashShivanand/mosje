import type { Metadata } from "next";
import * as React from "react";

import {
  Callout,
  CodeBlock,
  ComponentDocPage,
  MatrixTable,
  type A11yItem,
} from "@/components/design-system/docs-kit";

import { SiteLayoutSpecimen } from "./site-layout-specimen";

export const metadata: Metadata = {
  title: "Site Layout — Design System",
  description:
    "The website page skeleton: chrome, then a stack of Bands. The main region grows, so a short page still pins its footer to the bottom of the viewport.",
};


const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "Renders the page's single `<main>`, with the header and footer landmarks supplied by the components passed into those slots.",
  },
  {
    criterion: "2.4.1 Bypass Blocks",
    level: "A",
    description:
      "`<main>` carries `id` (default `main`) and `tabIndex={-1}`, so the masthead's skip link moves real focus into the content rather than only scrolling to it.",
  },
  {
    criterion: "1.4.10 Reflow",
    level: "AA",
    description:
      "The layout adds no width of its own. Each Band is full-bleed and each Container inside carries the cap and the responsive margin, so the page reflows to 320 CSS px without a horizontal scrollbar.",
  },
  {
    criterion: "2.4.11 Focus Not Obscured (Minimum)",
    level: "AA",
    description:
      "The masthead is sticky by default, so a focused control near the top of the page must not sit under it. Check this whenever the header's height changes.",
    status: "partial",
    evidence: "Depends on the header configuration a site passes in.",
  },
  {
    criterion: "3.2.3 Consistent Navigation",
    level: "AA",
    description:
      "Every page on the website uses this layout, so the masthead, the banner, the content and the footer appear in the same relative order throughout.",
  },
  {
    criterion: "GIGW 3.0 — Mandatory page elements",
    level: "GIGW",
    description:
      "The footer slot carries the statutory apparatus — lineage, policy links, last updated. A website page rendered without it is not a compliant government page.",
  },
];

export default function SiteLayoutPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Site Layout"
      status="Stable"
      summary="The website page skeleton: chrome, then a stack of Bands. The main region grows, so a short page still pins its footer to the bottom of the viewport rather than leaving it floating mid-screen."
      figma={{
        absent:
          "The page skeleton is a composition rule rather than a published master; its parts — the Navbar, the SAMAVESH Banner and the Footer — are published separately in the SAMAVESH library.",
      }}
      specimen={<SiteLayoutSpecimen />}
      propsFrom="SiteLayoutProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "Every public website page — the department's front door and everything under it.",
          "A page that opens with a hero or a full-bleed banner above its content stack.",
          "A short page, where the footer must still sit at the bottom of the viewport.",
        ],
        avoid: [
          "A signed-in portal page — use App Shell, which carries the sidebar and the account chrome.",
          "A portal login screen — use Portal Login Shell.",
          "An internal index surface such as the hub landing — those take the compact masthead and no statutory footer.",
        ],
      }}
      related={[
        {
          label: "App Shell",
          href: "/design-system/components/layout/app-shell",
          reason: "the signed-in portal equivalent",
        },
        {
          label: "Band",
          href: "/design-system/components/layout/band",
          reason: "what every child of this layout should be",
        },
        {
          label: "Site Footer",
          href: "/design-system/components/navigation/site-footer",
          reason: "the statutory footer this layout ends with",
        },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-stack">
            <h2 id="cdp-stack" className="cdp__h2">
              Every Child Is a Band
            </h2>
            <p>
              This is the common mistake and it has a visible symptom: putting a bare{" "}
              <code>&lt;Container&gt;</code> here with a background on it produces a tinted
              section that stops short of the viewport edge on every screen wider than the cap.
              The band paints the tone edge to edge and holds the column inside itself, so the
              composition is always Band, then Container, then content.
            </p>
            <Callout type="info" title="The hero is a slot, not a special case">
              A hero is a Band too. It has its own slot only so it can sit above the content
              stack and below the banner without the page having to remember that order.
            </Callout>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-regions">
            <h2 id="cdp-regions" className="cdp__h2">
              What Goes Where
            </h2>
            <MatrixTable
              caption="The layout's slots, in render order"
              columns={["Slot", "Inside main?", "Holds"]}
              rows={[
                ["header", "No", "The public masthead"],
                ["banner", "Yes", "A full-bleed strip — the SAMAVESH banner"],
                ["hero", "Yes", "The page hero or title band"],
                ["children", "Yes", "The content stack of Bands"],
                ["footer", "No", "The statutory footer"],
                ["overlays", "No", "Fixed elements outside the flow"],
              ]}
            />
          </section>

          <section className="cdp__section" aria-labelledby="cdp-overlays">
            <h2 id="cdp-overlays" className="cdp__h2">
              Overlays Belong to a Rail
            </h2>
            <p>
              Anything fixed that this slot renders sits on one of exactly two rails: the
              bottom-right corner, which stacks the citizen&apos;s own controls upward by
              permanence, or the right wall, which carries navigators and tooling. A new floating
              element does not invent a third position, and it declares itself with{" "}
              <code>data-sa-corner-occupant</code> or <code>data-sa-wall-occupant</code> so the
              rails can measure around it.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { Band, SiteFooter, SiteHeader, SiteLayout } from "@mosje/design-system";

<SiteLayout
  header={
    <SiteHeader
      variant="website"
      homeHref="/website"       // the zone root, not the hub root
      skipTo="#main"            // must match mainId below
      emblemSrc={emblem}
      brandLines={BRAND}
      nav={NAV}
    />
  }
  banner={<SamaveshBanner />}
  hero={<SchemeHero />}
  footer={<SiteFooter variant="website" {...FOOTER} />}
  overlays={<ImportantLinks />}
>
  <Band tone="default">
    <SchemesSection />
  </Band>
  <Band tone="muted">
    <NewsSection />
  </Band>
</SiteLayout>`}</CodeBlock>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-skip">
          <h2 id="cdp-skip" className="cdp__h2">
            The Skip Link Has Two Halves
          </h2>
          <p>
            This layout supplies the target: a <code>&lt;main&gt;</code> carrying{" "}
            <code>mainId</code> and <code>tabIndex=&#123;-1&#125;</code>, so focus can actually
            land in it. The masthead supplies the link, through its <code>skipTo</code> prop. The
            two defaults do not match — <code>main</code> here, <code>#main-content</code> there
            — so a page that leaves both alone has a skip link pointing at no element.
          </p>
          <p>
            Set one to agree with the other, and check it with the keyboard rather than by
            reading the code: press Tab on a freshly loaded page and confirm the link appears and
            that activating it moves focus into the content.
          </p>
          <Callout type="warning" title="One main landmark per page">
            Do not render a second <code>&lt;main&gt;</code> inside a Band. The layout owns the
            page&apos;s only one, and a duplicate leaves a screen-reader user choosing between
            two.
          </Callout>
        </section>
      }
    />
  );
}
