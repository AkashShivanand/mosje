import type { Metadata } from "next";
import * as React from "react";

import {
  Callout,
  CodeBlock,
  ComponentDocPage,
  DoDont,
  MatrixTable,
  PropsTable,
  type A11yItem,
  type PropDef,
} from "@/components/design-system/docs-kit";
import { BrandLockup } from "@mosje/design-system";

export const metadata: Metadata = {
  title: "Brand Lockup — Design System",
  description:
    "The National Emblem and the government text stack, as one home link. Always the National Emblem — never an invented mark.",
};

const EMBLEM = "/design-system/national-emblem.svg";
const BRAND_LINES = {
  org: "Government of India",
  ministry: "Ministry of Social Justice & Empowerment",
  department: "Department of Social Justice & Empowerment",
};


/*
 * `BrandLines` is a data shape, not a props interface, so the extractor cannot
 * see it — and it is the one thing a caller of this component always writes.
 */
const BRAND_LINES_SHAPE: PropDef[] = [
  {
    name: "department",
    type: "string",
    required: true,
    description:
      "The primary line, 20/24 SemiBold — “Department of Social Justice & Empowerment”. Use the full official name; never abbreviate it to an acronym in the masthead.",
  },
  {
    name: "ministry",
    type: "string",
    description: "“Ministry of Social Justice & Empowerment”, 12/16, muted. Omit it rather than passing an empty string.",
  },
  {
    name: "org",
    type: "string",
    description: "“Government of India”, 12/16, muted. The coarsest of the three lines, and the topmost.",
  },
];

const A11Y: A11yItem[] = [
  {
    criterion: "1.1.1 Non-text Content",
    level: "A",
    description:
      "The emblem carries real alternative text — “National Emblem of India” by default — rather than an empty alt, because it is the mark that identifies the property.",
    status: "verified",
  },
  {
    criterion: "2.4.4 Link Purpose (In Context)",
    level: "A",
    description:
      'The whole lockup is one link, named "<department> — Home". A reader hears where it goes, not "National Emblem of India, link".',
    status: "verified",
  },
  {
    criterion: "1.4.3 Contrast (Minimum)",
    level: "AA",
    description:
      "The text stack binds to a neutral ink on a light ground and to the inverse token under `inverse`. Neither is chosen at the call site, which is what keeps a navy masthead's lockup from being hand-picked white.",
  },
  {
    criterion: "2.5.8 Target Size (Minimum)",
    level: "AA",
    description:
      "The emblem and the text stack are inside the same anchor, so the target is the whole lockup and clears 24×24 comfortably — including with `textHiddenOnMobile`, where the 40×64 emblem is the target on its own.",
  },
  {
    criterion: "3.2.3 Consistent Navigation",
    level: "AA",
    description:
      "The lockup is the go-home control in the same place on every page of a property, including in the masthead's condensed state, where the emblem deliberately holds the same left edge it occupies at rest.",
  },
  {
    criterion: "DBIM 3.0 — State Emblem",
    level: "GIGW",
    description:
      "The component renders whatever `emblemSrc` points at. The estate rule is that this is always the National Emblem asset and never an invented mark; nothing in the component enforces it.",
    status: "partial",
    evidence: "Asset choice is caller-supplied.",
  },
];

export default function BrandLockupPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Brand Lockup"
      status="Stable"
      summary="The National Emblem and the government text stack, rendered as one home link. It is server-safe and framework-agnostic — a plain anchor and image — so it works inside any basePath-ed zone in the estate."
      figma={{ node: "brandLockup" }}
      specimen={<BrandLockup emblemSrc={EMBLEM} lines={BRAND_LINES} href="#" beta />}
      propsFrom="BrandLockupProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "The brand row of any masthead in the estate, through SiteHeader.",
          "A surface that needs the government identity without the rest of the masthead — a login screen, a printed header, a standalone error page.",
          "A dark or navy chrome, with `inverse` and the white emblem asset.",
        ],
        avoid: [
          "An organisation's own mark — that is Org Logo, which draws the registry's departmental crests.",
          "A footer identity block — Site Footer renders its own lockup with the address and the statutory lines.",
          "Anywhere the mark would not be the National Emblem. This component exists so that never happens by accident.",
        ],
      }}
      related={[
        {
          label: "Navbar (Header)",
          href: "/design-system/components/section-templates/site-header",
          reason: "the masthead that renders this lockup",
        },
        {
          label: "Org Logo",
          href: "/design-system/components/brand/org-logo",
          reason: "for an organisation's own crest rather than the National Emblem",
        },
        {
          label: "Site Footer",
          href: "/design-system/components/navigation/site-footer",
          reason: "the identity block at the other end of the page",
        },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-stack">
            <h2 id="cdp-stack" className="cdp__h2">
              The Four Rows
            </h2>
            <MatrixTable
              caption="The lockup, top to bottom"
              columns={["Row", "Source", "Treatment"]}
              rows={[
                ["BETA badge", "beta", "Its own row above the text, opt-in per property"],
                ["Government of India", "lines.org", "12/16, muted"],
                ["Ministry of Social Justice & Empowerment", "lines.ministry", "12/16, muted"],
                ["Department of Social Justice & Empowerment", "lines.department", "20/24, SemiBold — the primary line"],
              ]}
            />
            <p>
              The four rows sit flush at gap 0 beside a 40×64 emblem, matching the Figma masthead.
              Only <code>department</code> is required; a property that has no ministry line simply
              omits it rather than passing an empty string.
            </p>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-variants">
            <h2 id="cdp-variants" className="cdp__h2">
              Compact and Inverse
            </h2>
            <div className="cdp-stack">
              <div className="cdp-ground">
                <p className="cdp-ground__label">compact — the app-shell lockup</p>
                <BrandLockup emblemSrc={EMBLEM} lines={BRAND_LINES} href="#" compact />
              </div>
              <div className="cdp-ground cdp-ground--brand">
                <p className="cdp-ground__label">inverse — on a brand or navy ground</p>
                <BrandLockup emblemSrc={EMBLEM} lines={BRAND_LINES} href="#" inverse />
              </div>
            </div>
            <Callout type="warning" title="Inverse needs the white emblem asset too">
              <code>inverse</code> resolves the <em>text</em> to the inverse token. The emblem is
              an image and the component cannot recolour it, so pass{" "}
              <code>National_Emblem_logo_white.svg</code> alongside — the specimen above uses the
              standard asset to show exactly that difference.
            </Callout>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-dodont">
            <h2 id="cdp-dodont" className="cdp__h2">
              The Mark Itself
            </h2>
            <DoDont
              cards={[
                {
                  type: "do",
                  label:
                    "Use the official National Emblem asset, at its own aspect ratio, with the full department name beside it.",
                  preview: <BrandLockup emblemSrc={EMBLEM} lines={BRAND_LINES} href="#" compact />,
                },
                {
                  type: "dont",
                  label:
                    "Never abbreviate the department to an acronym in the masthead, and never modify the emblem's geometry, proportions or colour.",
                  preview: (
                    <BrandLockup
                      emblemSrc={EMBLEM}
                      lines={{ org: "Government of India", department: "DoSJE" }}
                      href="#"
                      compact
                    />
                  ),
                },
              ]}
            />
          </section>
        </>
      }
      code={
        <>
          <section className="cdp__section" aria-labelledby="cdp-lines">
            <h2 id="cdp-lines" className="cdp__h2">
              BrandLines
            </h2>
            <PropsTable props={BRAND_LINES_SHAPE} />
          </section>

          <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { BrandLockup } from "@mosje/design-system";

<BrandLockup
  emblemSrc={\`\${basePath}/images/National-Emblem-logo.svg\`}
  href="/website"            // the zone root, not the hub root
  lines={{
    org: "Government of India",
    ministry: "Ministry of Social Justice & Empowerment",
    department: "Department of Social Justice & Empowerment",
  }}
  beta
/>`}</CodeBlock>
          <p>On a navy portal chrome, both halves change:</p>
          <CodeBlock>{`<BrandLockup
  inverse
  emblemSrc={\`\${basePath}/images/National_Emblem_logo_white.svg\`}
  href="/portals/pm-ajay"
  lines={BRAND_LINES}
  compact
  textHiddenOnMobile
/>`}</CodeBlock>
          <p>
            The component is server-safe: it renders a plain anchor and image with no client state,
            so it can be used directly from a page that exports <code>metadata</code>.
          </p>
          </section>
        </>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-name">
          <h2 id="cdp-name" className="cdp__h2">
            One Link, One Name
          </h2>
          <p>
            The emblem and all four text rows sit inside a single anchor whose accessible name is{" "}
            <code>&quot;&lt;department&gt; — Home&quot;</code>. That is deliberate: splitting the
            emblem and the text into two links would give a reader two adjacent links to the same
            place, and naming the anchor from its contents alone would announce the BETA badge and
            the whole three-line stack every time.
          </p>
          <p>
            <code>textHiddenOnMobile</code> hides the stack visually and leaves the accessible name
            untouched, so a screen-reader user on a phone still hears where the emblem goes.
          </p>
        </section>
      }
    />
  );
}
