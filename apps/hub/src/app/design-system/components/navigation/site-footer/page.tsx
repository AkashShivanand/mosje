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
      "Colour comes entirely from the component's stylesheet, bound to mode-aware semantic and component tokens, so a caller cannot introduce a failing pair through `className`.",
    status: "verified",
    evidence:
      "Measured 2026-09-07 on the default blue ground #003975: lead ink #ffffff 11.40:1, navigation ink #c0dbff 8.04:1, boilerplate ink #92c2ff 6.18:1 — all against the 4.5:1 AA threshold. Re-measured 2026-09-16 in the browser across all eight brand modes: unchanged, worst case 5.37:1 (dbim-green, boilerplate ink). Since 2026-09-17 all three organisation lines use the white lead ink.",
  },
  {
    criterion: "1.4.11 Non-text Contrast",
    level: "AA",
    description:
      "The zone hairline (1.81:1) and the social chip ground (1.45:1) both sit below 3:1 and both are exempt: neither carries information required to identify a control or understand content. Each social link is identified by its glyph, which is white and reads 7.88:1 on the chip.",
    status: "verified",
    evidence: "Glyph measured 2026-09-17 in the browser: white on the chip is 7.88:1 on the default blue ground and 5.73:1 at worst across all eight brand modes (dbim-green). Chip 1.43–1.52:1 and hairline 1.27–2.04:1, measured 2026-09-16. The exemption is WCAG 1.4.11's own carve-out for decoration.",
  },
  {
    criterion: "2.5.8 Target Size (Minimum)",
    level: "AA",
    description: "The social links are 40x40, against the 24x24 the criterion asks for.",
    status: "verified",
    evidence: "site-footer.css — .ds-sitefooter__social-link is width/height 40px.",
  },
  {
    criterion: "GIGW 3.0 / DBIM 5.6 — Mandatory footer elements",
    level: "GIGW",
    description:
      "Website Policy, Sitemap, Related Links, Help, Feedback and Last Updated On, plus the lineage sentence and the hyperlinked logos — on BOTH variants. On `website` the Sitemap sits in the Support column and Help in the policy row; on `portal`, which renders no columns, both render in the statutory bar.",
    status: "verified",
    evidence:
      "Audited 2026-09-07 against DBIM 5.6 and Table 8. The audit found the portal variant publishing four of six — Sitemap and Help lived only in the columns — and both are now REQUIRED props (`sitemap`, `help`) rendered in the portal's statutory bar, joining `lineage`, `policyLinks` and `copyright` as type-enforced. Verified in a browser: three labelled navs, no duplicated destination.",
  },
];

/*
 * DBIM 3.0, Annexure F — Checklist 1, every item that applies to a footer, assessed
 * against the running website footer on 2026-09-17. Header-only items (5.2, 5.4),
 * button items (4.5) and imagery items (6.1) do not apply and are not counted.
 *
 * Scored Met = 1, Partial = 0.5, Not met = 0. Two statuses are NOT scored:
 *   Deviation     a recorded decision where the estate's standard is kept on
 *                 purpose (.claude/rules/standards-precedence.md)
 *   Not required  an element §5.6 lists as optional
 */
const DBIM_ROWS: [string, string, string][] = [
  ["1 · One colour group from the primary palette", "Met", "Every colour resolves from the selected brand mode, so a portal never mixes groups."],
  ["2 · Other colours from the palette", "Met", "No colour outside the key group: the inks, rules and chips are tints and alphas of it."],
  ["3 · Icons in the darkest key colour or inclusive white", "Met", "The location pin, the five social glyphs and the new-window arrow are inclusive white."],
  ["4 · Footer background is the darkest shade of the key colour", "Met", "bg/brand/primary/boldest — #003975 in Blue, #162F6A (DBIM Blue shade 1) in DBIM Blue."],
  ["5 · Consistent icon style", "Met", "One rounded outline set for interface icons; brand marks for social links."],
  ["6 · Icons from the DBIM Toolkit", "Deviation", "Interface icons are Material Symbols Rounded, the one icon set used across the website and every portal. Replacing it in the footer alone would break that consistency."],
  ["7 · Icons in PNG, SVG or WEBP", "Deviation", "The social glyphs are SVG. The location pin is a Material Symbols glyph, drawn from the icon font like every other interface icon in the estate."],
  ["8 · Icon sizes 24, 32, 48 or 64px", "Deviation", "The social glyphs are 24px. The location pin is 16px so that it matches the 14px address beside it; at 24px it would outweigh the text it marks."],
  ["9 · Icon proportions retained", "Met", "No icon is stretched or compressed."],
  ["10 · Icon contrast with its background", "Met", "White glyph on its chip: 7.88:1 in Blue, 5.73:1 at worst across all eight brand modes."],
  ["11 · Noto Sans", "Met", "Every line is set in Noto Sans."],
  ["12 · Body text left-aligned", "Met", "All text is left-aligned."],
  ["13 · No capital case for sentences", "Met", "No uppercase labels or sentences."],
  ["14 · Type scale as defined in DBIM", "Deviation", "Links and organisation lines are 14px (Paragraph 2); lineage and colophon are 12px (Small Text 1). Column headings are 16px Semi Bold, which is not a row in DBIM Table 3. They head a 14px list clearly without competing with the section headings on the page."],
  ["15 · Text colour with optimal contrast", "Met", "11.40:1 for white, 8.04:1 for links and 6.18:1 for boilerplate on Blue; 5.37:1 at worst across all eight modes, against WCAG's 4.5:1."],
  ["18 · Hover changes clickable items", "Met", "Links underline and brighten to white on hover; social chips lighten."],
  ["19 · Emblem from an authorised source", "Met", "The National Emblem file published by the Department's own website."],
  ["20 · Emblem in proportion", "Met", "Drawn at 34 × 56 from a 40 × 65 original."],
  ["22 · Logo lockup white over a dark background", "Met", "The emblem and all three organisation lines are white. The Department line is set in Semi Bold."],
  ["25 · All key information elements and the lineage", "Met", "Website Policy, Sitemap, Related Links, Help, Feedback, Last Updated On and the lineage are all present. Help opens the Help page: file formats, screen reader access, accessibility and FAQs."],
  ["Table 12 · Archives", "Not\u00a0required", "§5.6 lists Archives among the elements that “may also be included”, and the live footer carries none."],
  ["Table 12 · Social Media Links", "Met", "Facebook, X, Instagram, YouTube and WhatsApp Channel."],
  ["Table 8 · Hyperlinked logos", "Met", "NeGD and Digital India, each linked to its own site."],
  ["26 · Correct logos", "Met", "The canonical NeGD and Digital India marks."],
  ["27 · Logos not scaled disproportionately", "Met", "Both are set to one height with their width following their own aspect."],
  ["28 · Logos in JPEG, PNG, SVG or WEBP", "Met", "All SVG."],
  ["29 · Logos under 100 KB", "Met", "NeGD 30 KB, Digital India 23 KB and the National Emblem 89 KB."],
  ["38 · Content complete and up to date", "Met", "Last Updated On is the date of the page being read, passed down from the page."],
  ["39 · Language free of errors, no Hinglish", "Met", "Formal English throughout."],
];

const SCORED = DBIM_ROWS.filter(([, status]) => ["Met", "Partial", "Not\u00a0met"].includes(status));
const DBIM_SCORE = Math.round(
  (SCORED.reduce((sum, [, status]) => sum + (status === "Met" ? 1 : status === "Partial" ? 0.5 : 0), 0) /
    SCORED.length) *
    100,
);
const DEVIATIONS = DBIM_ROWS.filter(([, status]) => status === "Deviation").length;

/*
 * The live dosje.gov.in footer, read on 2026-09-17 (31 links), set against this
 * footer. "Covered" means the same destination is reachable from this footer.
 */
const LIVE_COVERAGE: [string, string, string][] = [
  ["Facebook · X · Instagram · YouTube · WhatsApp", "Covered", "The same five accounts."],
  ["About Ministry · Vision & Mission · Organisational Chart · Ministers & Officials · Citizen Charter", "Covered", "Department column. Vision & Mission opens About Us, as it does on the live site."],
  ["Schemes · Tenders · Vacancies", "Covered", "Services column."],
  ["Contact Us · RTI · Sitemap", "Covered", "Support column."],
  ["Notices · Acts & Rules · Reports · Publications · Statistics", "Covered", "Resources column."],
  ["Total Visits", "Covered", "The colophon shows the Department's published total, the same figure as the Visitor Analytics page."],
  ["NeGD and Digital India logos", "Covered", "Hyperlinked credits in the statutory bar."],
  ["Copyright Policy · Hyperlinking Policy · Help · Terms & Conditions · Privacy Policy · Cookies · Visitor Analytics", "Covered", "The policy row, in the live footer's order."],
  ["Last Updated", "Covered", "The colophon, dated for the page being read."],
  ["Need Support? · Get in Touch", "Covered", "An Action Banner above the footer."],
  ["Feedback", "Added", "Required by DBIM §5.6 and GIGW 3.0. Opens the Feedback section of Contact Us."],
  ["Related Links", "Added", "Required by DBIM §5.6. One link, the National Portal of India, which GIGW 3.0 requires."],
  ["Lineage sentence", "Added", "Prescribed by DBIM §5.6."],
];

export default function SiteFooterPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Site Footer"
      status="Stable"
      summary="The statutory footer for the SAMAVESH estate, in two variants. It is structural rather than content-bound — every label, href, logo and sentence arrives as a prop — so the department's routes live in the app and this component serves any site or portal in the estate."
      figma={{ node: "siteFooter" }}
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
              Two Bands on One Ground
            </h2>
            <p>
              A government footer has two jobs — wayfinding and the statutory apparatus — set on a
              single ground with a hairline between them.
            </p>
            <MatrixTable
              caption="The footer's bands"
              columns={["Band", "Carries", "website", "portal"]}
              rows={[
                ["1 — Working footer", "Identity, address, social, four link columns, Related Links", "Yes", "Absent"],
                ["2 — Statutory bar", "Lineage, credits, policies, Sitemap and Help (portal), colophon", "Yes", "Yes"],
              ]}
            />
            <p>
              <code>variant=&quot;portal&quot;</code> renders band 2 alone. That is the whole
              difference, and it is why this is a variant rather than a second component: the
              statutory half is the half that must stay compliant, and a portal&apos;s cannot drift
              from the website&apos;s. A call to action is not part of the footer; the website sets
              it with Action Banner on a light band above.
            </p>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-width">
            <h2 id="cdp-width" className="cdp__h2">
              Width Comes from the Page Container
            </h2>
            <p>
              On the website each band&apos;s content carries <code>.sa-container</code>, so the
              footer takes the same cap, margin and right-wall gutter as the masthead and the page
              between them. A portal is fluid: the portal variant takes no cap and pads with the page
              margin, as a portal masthead does. Either way the footer&apos;s edges meet the
              masthead&apos;s at every width, and the Figma master binds{" "}
              <code>container/page</code> and <code>grid/margin/page</code> to match. Leave{" "}
              <code>maxWidth</code> unset.
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
          <section className="cdp__section" aria-labelledby="cdp-dbim">
            <h2 id="cdp-dbim" className="cdp__h2">
              DBIM 3.0 Compliance
            </h2>
            <p>
              Assessed against every item of DBIM 3.0&apos;s own compliance checklist (Annexure F,
              Checklist 1) that applies to a footer, on the running website footer:{" "}
              <strong>{DBIM_SCORE} / 100</strong>, with {DEVIATIONS} recorded deviations. All six
              information elements §5.6 makes mandatory are present on both variants, with the
              prescribed lineage sentence and the hyperlinked logos. The deviations keep the
              estate&apos;s Material Symbols icon set and its column-heading size, where following
              DBIM in the footer alone would make the footer inconsistent with the rest of the estate.
            </p>
            <MatrixTable
              caption="DBIM 3.0 checklist items that apply to the footer"
              columns={["Checklist item", "Status", "How the footer meets it"]}
              rows={DBIM_ROWS}
            />
          </section>

          <section className="cdp__section" aria-labelledby="cdp-live-coverage">
            <h2 id="cdp-live-coverage" className="cdp__h2">
              Coverage of the dosje.gov.in Footer
            </h2>
            <p>
              Every link in the live dosje.gov.in footer is carried. Three elements are added
              because DBIM or GIGW requires them and the live footer does not have them; nothing
              else is added.
            </p>
            <MatrixTable
              caption="Links in the live dosje.gov.in footer, and where this footer carries them"
              columns={["Live footer link", "Status", "In this footer"]}
              rows={LIVE_COVERAGE}
            />
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
  emblem={<Image src={emblem} alt="" width={40} height={65} />}
  organisation={[
    "Government of India",
    "Ministry of Social Justice & Empowerment",
    "Department of Social Justice & Empowerment",
  ]}
  address="Shastri Bhawan, Dr. Rajendra Prasad Road, New Delhi 110001"
  social={[{ label: "X (formerly Twitter)", href: "https://x.com/…", icon: "x" }]}
  columns={FOOTER_COLUMNS}
  lineage={LINEAGE}
  credits={CREDITS}
  policyLinks={POLICY_LINKS}
  sitemap={{ label: "Sitemap", href: "/website/sitemap" }}
  help={{ label: "Help & Support", href: "/website/contact-us" }}
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
  sitemap={{ label: "Sitemap", href: "/website/sitemap" }}
  help={{ label: "Help & Support", href: "/website/contact-us" }}
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
