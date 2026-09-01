import type { Metadata } from "next";
import * as React from "react";

import {
  Callout,
  CodeBlock,
  ComponentDocPage,
  MatrixTable,
  PropsTable,
  type A11yItem,
  type PropDef,
} from "@/components/design-system/docs-kit";

import { SiteFooterPortalSpecimen, SiteFooterWebsiteSpecimen } from "./site-footer-specimen";

export const metadata: Metadata = {
  title: "Site Footer — Design System",
  description:
    "The statutory footer for the SAMAVESH estate, in two variants. Structural, not content-bound: every label, href, logo and sentence arrives as a prop.",
};


/*
 * Four data shapes the extractor cannot see, because it reads exported `*Props`
 * interfaces and these are the objects those props carry.
 */
const FOOTER_SHAPES: PropDef[] = [
  { name: "SiteFooterLink · label", type: "string", required: true, description: "The link's visible text." },
  { name: "SiteFooterLink · href", type: "string", required: true, description: "Destination." },
  {
    name: "SiteFooterLink · external",
    type: "boolean",
    default: "false",
    description:
      "Opens in a new window, announced to assistive technology with a visually hidden note and marked rel=\"noreferrer\".",
  },
  { name: "SiteFooterColumn · heading", type: "string", required: true, description: "The column's visible heading. Name a grouping, not an action." },
  {
    name: "SiteFooterColumn · id",
    type: "string",
    required: true,
    description:
      "Stable DOM id, so the column's <nav> is labelled BY its visible heading. Four unlabelled navigations give a screen-reader user four identical landmark entries.",
  },
  { name: "SiteFooterColumn · links", type: "SiteFooterLink[]", required: true, description: "The column's links." },
  {
    name: "SiteFooterSocial · label",
    type: "string",
    required: true,
    description: "Human name — “X (formerly Twitter)”. Never a CSS class name; this is the link's accessible name.",
  },
  { name: "SiteFooterSocial · href", type: "string", required: true, description: "Destination." },
  {
    name: "SiteFooterSocial · icon",
    type: "BrandGlyphName",
    required: true,
    description:
      "Which brand mark to draw, as a NAME rather than path data — so every rail in the estate draws the same optically normalised set, and a content file never carries a kilobyte of vendor artwork.",
  },
  { name: "SiteFooterCredit · src / alt / href", type: "string", required: true, description: "The hyperlinked logo, its alternative text, and where it points." },
  { name: "SiteFooterCredit · width / height", type: "number", required: true, description: "Intrinsic size, so the row reserves its space before the image loads." },
  { name: "SiteFooterCredit · prefix", type: "string", description: "Rendered before the logo — “Powered by”." },
];

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "A `contentinfo` landmark named by a visually hidden `<h2>`. Every `<nav>` inside it is labelled — by its visible heading where it has one, by `aria-label` where the label would be an on-screen eyebrow.",
    status: "verified",
  },
  {
    criterion: "2.4.4 Link Purpose (In Context)",
    level: "A",
    description:
      "Every external link is `rel=\"noreferrer\"` and carries a visually hidden “(opens in a new window)”, so the change of context is announced before it happens.",
    status: "verified",
  },
  {
    criterion: "2.4.7 Focus Visible",
    level: "AA",
    description: "One focus ring, defined once, applying to every control in the subtree.",
    status: "verified",
  },
  {
    criterion: "1.1.1 Non-text Content",
    level: "A",
    description:
      "Brand glyphs are `aria-hidden`; the accessible name sits on the link, and it is a human name — “X (formerly Twitter)” — never a CSS class name.",
    status: "verified",
  },
  {
    criterion: "1.4.3 Contrast (Minimum)",
    level: "AA",
    description:
      "Colour comes entirely from the component's stylesheet, bound to the mode-aware brand ramp, so a caller cannot introduce a failing pair through `className`.",
  },
  {
    criterion: "GIGW 3.0 / DBIM 5.6 — Mandatory footer elements",
    level: "GIGW",
    description:
      "Website Policy, Sitemap, Related Links, Help, Feedback and Last Updated On, plus the lineage sentence and the hyperlinked logos. Three of the eight are required props, so the compiler catches their absence; the rest are the caller's to supply.",
    status: "partial",
    evidence: "lineage, policyLinks and copyright are type-required; the remainder are not.",
  },
];

export default function SiteFooterPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Site Footer"
      status="Stable"
      summary="The statutory footer for the SAMAVESH estate, in two variants. It is structural rather than content-bound — every label, href, logo and sentence arrives as a prop — so the department's routes live in the app and this component serves any site or portal in the estate."
      figma={{
        absent:
          "The footer is documented in the SAMAVESH library alongside the Navbar page, but is not yet registered as its own node in the estate's Figma index.",
      }}
      specimen={<SiteFooterPortalSpecimen />}
      propsFrom="SiteFooterProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "The foot of every public website page, with `variant=\"website\"`.",
          "A portal that must publish the statutory apparatus, with `variant=\"portal\"`.",
          "Anywhere DBIM 5.6's required elements have to be on the page.",
        ],
        avoid: [
          "An internal index surface that is not a public government page — the slim Footer is the right shape there.",
          "A page that needs only a credit line and two policy links — again, Footer.",
          "Building a second portal footer: the statutory half is identical by design, and a separate one is a second thing to keep DBIM-compliant.",
        ],
      }}
      related={[
        {
          label: "Footer",
          href: "/design-system/components/navigation/footer",
          reason: "the slim app-shell footer, with no statutory apparatus",
        },
        {
          label: "Site Layout",
          href: "/design-system/components/layout/site-layout",
          reason: "the website skeleton whose footer slot this fills",
        },
        {
          label: "Visitor Counter",
          href: "/design-system/components/data-display/visitor-counter",
          reason: "what the estate puts in the colophon slot",
        },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-zones">
            <h2 id="cdp-zones" className="cdp__h2">
              Three Zones, in Priority Order
            </h2>
            <p>
              A government footer has three jobs, and the version this replaced mixed all three at
              one weight.
            </p>
            <MatrixTable
              caption="The footer's zones"
              columns={["Zone", "Carries", "website", "portal"]}
              rows={[
                ["0 — Support strip", "Opt-in helpline or contact strip", "Optional", "Absent"],
                ["1 — Working footer", "Identity, address, social, four link columns", "Yes", "Absent"],
                ["2 — Statutory bar", "Lineage, credits, policies, colophon", "Yes", "Yes"],
              ]}
            />
            <p>
              <code>variant=&quot;portal&quot;</code> renders zone 2 alone. That is the whole
              difference, and it is why this is a variant rather than a second component: the
              statutory half is the half that must stay compliant, and it is now impossible for a
              portal&apos;s to drift from the website&apos;s.
            </p>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-website">
            <h2 id="cdp-website" className="cdp__h2">
              The Website Variant
            </h2>
            <p>
              The same statutory bar, with the working footer above it: identity and address,
              social links, and four columns of wayfinding.
            </p>
            <SiteFooterWebsiteSpecimen />
          </section>

          <section className="cdp__section" aria-labelledby="cdp-content">
            <h2 id="cdp-content" className="cdp__h2">
              Writing the Content
            </h2>
            <p>
              Column headings name a grouping, not an action — &ldquo;Documents&rdquo;, not
              &ldquo;Download our documents&rdquo;. Link labels are Title Case noun phrases. The
              lineage sentence is the department&apos;s own published wording, quoted rather than
              paraphrased; it is a statutory statement about who runs the site, and rewriting it to
              suit a layout is not ours to do.
            </p>
            <Callout type="warning" title="Last updated is per page, not per site">
              <code>lastUpdated</code> is DBIM&apos;s &ldquo;Last Updated On&rdquo; for the{" "}
              <em>respective page</em>. A single date passed from a shared layout is correct on one
              page and wrong on every other, which is worse than omitting it.
            </Callout>
          </section>
        </>
      }
      code={
        <>
          <section className="cdp__section" aria-labelledby="cdp-shapes">
            <h2 id="cdp-shapes" className="cdp__h2">
              The Four Content Shapes
            </h2>
            <PropsTable props={FOOTER_SHAPES} />
          </section>

          <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import Link from "next/link";
import { SiteFooter } from "@mosje/design-system";

<SiteFooter
  variant="website"
  linkAs={Link}
  emblem={<Image src={emblem} alt="" width={48} height={72} />}
  organisation={[
    "Government of India",
    "Ministry of Social Justice & Empowerment",
    "Department of Social Justice & Empowerment",
  ]}
  address="Shastri Bhawan, Dr. Rajendra Prasad Road, New Delhi 110001"
  social={[{ label: "X (formerly Twitter)", href: "https://x.com/…", icon: "x" }]}
  columns={FOOTER_COLUMNS}
  lineage={LINEAGE}
  credits={[{ src: negd, alt: "NeGD", href: "https://negd.gov.in/", width: 96, height: 32, prefix: "Powered by" }]}
  policyLinks={POLICY_LINKS}
  relatedLinks={RELATED_LINKS}
  copyright="© 2026 Department of Social Justice & Empowerment. All rights reserved."
  lastUpdated={page.lastUpdated}
  colophonSlot={<VisitorCounter />}
/>`}</CodeBlock>
          <p>
            A portal takes the same statutory props and nothing else. Passing{" "}
            <code>columns</code> or <code>social</code> alongside{" "}
            <code>variant=&quot;portal&quot;</code> is not an error; they are simply not rendered.
          </p>
          <CodeBlock>{`<SiteFooter
  variant="portal"
  organisation={ORGANISATION}
  lineage={LINEAGE}
  policyLinks={POLICY_LINKS}
  copyright={COPYRIGHT}
  lastUpdated={page.lastUpdated}
/>`}</CodeBlock>
          </section>
        </>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-navs">
          <h2 id="cdp-navs" className="cdp__h2">
            Every Navigation Is Named
          </h2>
          <p>
            A footer with four unlabelled <code>&lt;nav&gt;</code> elements gives a screen-reader
            user four identical &ldquo;navigation&rdquo; entries and no way to choose between them.
            Each column therefore carries a stable <code>id</code>, and the{" "}
            <code>&lt;nav&gt;</code> is labelled by that visible heading — so the landmark list
            reads &ldquo;Documents, navigation&rdquo;, not &ldquo;navigation&rdquo; four times over.
          </p>
          <p>
            Where a group has no visible heading, the <code>&lt;nav&gt;</code> takes an{" "}
            <code>aria-label</code> instead. Both are labels; only one of them is also on screen,
            and a visible heading is preferred wherever there is one to point at.
          </p>
          <Callout type="info" title="External links say so">
            Every external link carries <code>rel=&quot;noreferrer&quot;</code> and a visually
            hidden &ldquo;(opens in a new window)&rdquo;. Both halves are needed: the note is
            invisible to a sighted reader, and a glyph alone is invisible to a screen reader.
          </Callout>
        </section>
      }
    />
  );
}
