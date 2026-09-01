import type { Metadata } from "next";
import * as React from "react";

import {
  Callout,
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
} from "@/components/design-system/docs-kit";
import { OrgLogo, ORG_LOGOS, type OrgSlug } from "@mosje/design-system";

import "./org-logo-docs.css";

export const metadata: Metadata = {
  title: "Org Logo — Design System",
  description:
    "Organisation and scheme marks in the estate's standard tile — and the only place a mark's path is written.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.1.1 Non-text Content",
    level: "A",
    description:
      "The mark renders with alt=\"\" by default, because it sits beside the organisation's name in real text. Passing `name` sets a real alt, and is only correct where the mark stands alone.",
  },
  {
    criterion: "H67 Decorative Images",
    level: "A",
    description:
      "An empty alt is the documented technique for an image whose meaning is already carried by adjacent text. A name here would make a screen reader read the organisation twice.",
  },
  {
    criterion: "1.4.11 Non-text Contrast",
    level: "AA",
    description:
      "The tile's hairline rule is --sa-border-neutral-subtle on white. It is decoration around supplied artwork rather than a control boundary or a meaningful graphic, so 1.4.11 does not apply to it.",
  },
];

export default function OrgLogoPage(): React.JSX.Element {
  const slugs = Object.keys(ORG_LOGOS) as OrgSlug[];

  return (
    <ComponentDocPage
      name="Org Logo"
      status="New"
      summary="An organisation or scheme mark in the estate’s standard tile — and the only place a mark’s path is written. Seventeen marks, one canonical root, one gate."
      figma={{ node: "orgLogo" }}
      specimen={
        <div>
          <div className="orglogo-sizes">
            <OrgLogo org="scw" size="sm" />
            <OrgLogo org="scw" size="md" />
            <OrgLogo org="scw" size="lg" />
            <OrgLogo path="/portals/e-anudaan" size="lg" />
          </div>
          <p>
            The last one is a route with no bespoke mark, so it renders the State Emblem. That is
            CORRECT rather than a placeholder: a portal without its own logo is still a Government
            of India property. Never substitute a grey box, an initial or a generic icon.
          </p>
        </div>
      }
      propsFrom="OrgLogoProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "An organisation or scheme is named on a card, a directory row, a mega-menu entry or a hero, and its mark should sit beside the name.",
          "You have a portal route rather than a slug — pass `path` and let the registry resolve it.",
          "A portal has no mark of its own; the component draws the State Emblem, which is the correct answer rather than a placeholder.",
        ],
        avoid: [
          "The mark is an interface glyph — use Icon, which is the Material Symbols set.",
          "You need the URL rather than the element, for a next/image or an og:image — call `orgLogoSrc()`.",
          "You are about to write a path to a mark yourself — that is what this component exists to stop, and `npm run check:org-logos` fails the build for it.",
        ],
      }}
      related={[
        { label: "Icon", href: "/design-system/components/utilities/icon", reason: "for an interface glyph, which a departmental crest is not" },
        { label: "Portal Card", href: "/design-system/components/navigation/portal-card", reason: "the card that leads with a mark at 40px" },
        { label: "Brand Lockup", href: "/design-system/components/navigation/brand-lockup", reason: "the National Emblem and ministry lines in a masthead" },
        { label: "Avatar", href: "/design-system/components/data-display/avatar", reason: "for a person rather than an organisation" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-catalogue">
            <h2 id="cdp-catalogue" className="cdp__h2">
              Every Mark the Estate Ships
            </h2>
            <p>
              Seventeen, in registry order. The library carries the same seventeen plus an Emblem
              variant for the fallback &mdash; 18 in all, mirroring <code>ORG_LOGOS</code> and{" "}
              <code>ORG_LOGO_FALLBACK</code> exactly. Add one by dropping the file in the
              org-logos folder and adding a line to <code>ORG_LOGOS</code> &mdash; nothing else.
            </p>
            <ul className="orglogo-catalogue">
              {slugs.map((slug) => (
                <li key={slug}>
                  <OrgLogo org={slug} size="lg" />
                  <code>{slug}</code>
                </li>
              ))}
            </ul>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-owner">
            <h2 id="cdp-owner" className="cdp__h2">
              Why One Component Owns Every Path
            </h2>
            <p>
              The same sixteen files sat in two byte-identical public directories &mdash;{" "}
              <code>/design-system/org-logos/</code> and <code>/website/images/org-logos/</code>{" "}
              &mdash; while <code>organisation-details.ts</code> reached into three different roots
              for the same class of asset, one of them used by a single organisation. Nothing
              reconciled them, so a mark replaced in one place stayed stale in the others, and
              nobody could say where &ldquo;the others&rdquo; were.
            </p>
            <p>
              <code>/design-system/org-logos/</code> is canonical. These are design-system assets
              and the website is a consumer of them, not their owner.
            </p>
            <p>
              The tile belongs to the component, not the caller: white ground, hairline rule, 8px
              radius, the mark contained rather than cropped. Four surfaces drew that tile by hand
              at three different radii before this existed. A departmental crest with its edges cut
              off is a brand error, not a layout one &mdash; so <code>object-fit</code> is always{" "}
              <code>contain</code>, never <code>cover</code>.
            </p>
            <Callout type="warning" title="A mark path written anywhere else fails the build">
              <code>npm run check:org-logos</code> is a per-file ratchet: 99 literals across 48
              files are frozen as declared debt. A new file that writes one fails, a baselined file
              that grows fails, and one that shrinks also fails &mdash; telling you to re-baseline,
              so one surface&rsquo;s cleanup cannot be spent silently on another&rsquo;s
              regression. An unavoidable literal declares itself with{" "}
              <code>{"// org-logo-exempt(portal-local): why"}</code>.
            </Callout>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-parity">
            <h2 id="cdp-parity" className="cdp__h2">
              Figma Parity, and What Is Still Missing
            </h2>
            <p>
              The library&rsquo;s org-logo set carries the same 17 organisations as the registry
              here, plus an Emblem variant for the fallback &mdash; 18 in all, mirroring{" "}
              <code>ORG_LOGOS</code> and <code>ORG_LOGO_FALLBACK</code> &mdash; and it lives on the
              Brand page, moved off Iconography on 31 August 2026 because a departmental crest is a
              brand asset rather than an icon. Matching NAMES is not matching ARTWORK, and on 31
              August three did not: JRF shipped the State Emblem while the library held Babu
              Jagjivan Ram&rsquo;s portrait, DAIC shipped a portrait roundel against the
              library&rsquo;s building, and NSKFDC shipped a 96×19 sliver that rendered as a blank
              tile. All three were re-exported from the library. The files here are 96px renders of
              the library&rsquo;s own artwork &mdash; the originals run to 2&nbsp;MB and have no
              business on a page.
            </p>
            <Callout type="warning" title="Where the artwork still needs the department">
              Four organisations &mdash; NCSK, DAF, DWBDNC and SCW &mdash; share one image: the
              State Emblem. That is a correct fallback, and code and the library agree on exactly
              which four; but if any of them has a crest of its own it has never been supplied. Two
              things are now closed. JRF&rsquo;s variant carried three image fills &mdash; the
              correct portrait, in FILL mode and switched off, under two hand-cropped copies &mdash;
              and is rebuilt to one visible fill on a square rectangle like every sibling. And the
              library now carries an Emblem variant, so a portal with no bespoke mark is drawn
              honestly instead of wearing another organisation&rsquo;s crest. SAMBAL had no usable
              export at all until 31 August: its device sat beneath a 74-node strapline, one text
              node per character, so every surface fell back to the emblem and nobody could see why.
            </Callout>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { OrgLogo, orgLogoSrc } from "@mosje/design-system";

// By ROUTE — what the estate registry hands you. The normal case.
<OrgLogo path="/portals/nmba" />

// By slug, at directory-row size.
<OrgLogo org="nmba" size="lg" />

// Standing alone with no adjacent text — the one case that takes a name.
<OrgLogo name="Government of India" />

// Need the URL rather than the element (an <Image>, an og:image):
const src = orgLogoSrc("scw");`}</CodeBlock>
        </section>
      }
    />
  );
}
