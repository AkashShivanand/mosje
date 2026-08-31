import type { Metadata } from "next";
import {
  DocsTabs,
  PropsTable,
  A11yChecklist,
  StatusBadge,
  CodeBlock,
  Callout,
  FeedbackBar,
} from "@/components/design-system/docs-kit/index";
import { OrgLogo, ORG_LOGOS, type OrgSlug } from "@mosje/design-system";
import { figmaUrl, FIGMA_NODES } from "@/lib/design-system/figma";

export const metadata: Metadata = {
  title: "Org Logo — Design System",
  description:
    "Organisation and scheme marks in the estate's standard tile — and the only place a mark's path is written.",
};

const sectionStyle: React.CSSProperties = {
  marginTop: "var(--sa-section-48)",
  scrollMarginTop: "var(--docs-anchor-offset)",
};

const h2Style: React.CSSProperties = {
  fontSize: "var(--sa-type-headline-1-size)",
  lineHeight: "var(--sa-type-headline-1-lh)",
  fontWeight: 700,
  color: "var(--sa-text-neutral-base)",
  marginBottom: "var(--sa-stack-16)",
  paddingBottom: "var(--sa-padding-8)",
  borderBottom: "1px solid var(--sa-border-neutral-subtle)",
};

const proseStyle: React.CSSProperties = {
  color: "var(--sa-text-neutral-subtle)",
  fontSize: "var(--sa-type-body-1-size)",
  lineHeight: 1.7,
  maxWidth: "68ch",
};

const PROPS = [
  {
    name: "path",
    type: "string",
    default: "undefined",
    description:
      "A portal route, resolved through the registry. The normal case, because a route is what the estate registry hands you.",
  },
  {
    name: "org",
    type: "OrgSlug",
    default: "undefined",
    description: "An organisation slug, when you have that rather than a route.",
  },
  {
    name: "size",
    type: '"sm" | "md" | "lg"',
    default: '"md"',
    description:
      "Tile size — 32 / 48 / 56px. The three places the estate actually shows a mark: inline beside a label, on a card, and leading a directory row.",
  },
  {
    name: "name",
    type: "string",
    default: "undefined",
    description:
      "Accessible name. OMIT IT — a mark beside the organisation's name in real text is decorative and takes an empty alt. Pass one only where the mark stands alone with no adjacent text.",
  },
  {
    name: "src",
    type: "string",
    default: "undefined",
    description:
      "An explicit source, for a mark not yet in the registry. The escape hatch the registry exists to make unnecessary — every use is reported by npm run check:org-logos.",
  },
];

export default function OrgLogoPage() {
  const slugs = Object.keys(ORG_LOGOS) as OrgSlug[];

  return (
    <article className="docs-article">
      <header>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--sa-stack-12)", flexWrap: "wrap" }}>
          <h1 style={{ fontSize: "var(--sa-type-display-1-size)", fontWeight: 800, color: "var(--sa-text-neutral-base)", margin: 0 }}>
            Org Logo
          </h1>
          <StatusBadge status="New" />
        </div>
        <p style={{ ...proseStyle, marginTop: "var(--sa-stack-12)" }}>
          {
            "An organisation or scheme mark in the estate’s standard tile — and the only place a mark’s path is written. Seventeen marks, one canonical root, one gate."
          }
        </p>
        <div style={{ marginTop: "var(--sa-stack-16)", display: "flex", gap: "var(--sa-inline-12)", flexWrap: "wrap" }}>
          <a className="docs-page-header__link" href={figmaUrl(FIGMA_NODES.orgLogo)} target="_blank" rel="noopener noreferrer">
            Figma Component Spec <span aria-hidden="true">↗</span>
          </a>
        </div>
      </header>

      <section style={sectionStyle} aria-labelledby="catalogue-heading">
        <h2 id="catalogue-heading" style={h2Style}>
          Every mark the estate ships
        </h2>
        <p style={proseStyle}>
          {
            "Seventeen, in registry order. The library carries the same seventeen plus an Emblem variant for the fallback \u2014 18 in all, mirroring ORG_LOGOS and ORG_LOGO_FALLBACK exactly. Add one by dropping the file in the org-logos folder and adding a line to ORG_LOGOS \u2014 nothing else."
          }
        </p>
        <ul
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
            gap: "var(--sa-inline-20)",
            listStyle: "none",
            margin: "var(--sa-stack-24) 0 0",
            padding: 0,
          }}
        >
          {slugs.map((slug) => (
            <li key={slug} style={{ display: "grid", gap: "var(--sa-stack-8)", justifyItems: "center" }}>
              <OrgLogo org={slug} size="lg" />
              <code
                style={{
                  fontSize: "var(--sa-type-label-3-size)",
                  color: "var(--sa-text-neutral-subtle)",
                }}
              >
                {slug}
              </code>
            </li>
          ))}
        </ul>
      </section>

      <section style={sectionStyle} aria-labelledby="parity-heading">
        <h2 id="parity-heading" style={h2Style}>
          Figma parity, and what is still missing
        </h2>
        <p style={proseStyle}>
          {
            "The library’s org-logo set carries the same 17 organisations as the registry here, plus an Emblem variant for the fallback — 18 in all, mirroring ORG_LOGOS and ORG_LOGO_FALLBACK — and it lives on the Brand page, moved off Iconography on 31 August 2026 because a departmental crest is a brand asset rather than an icon. Matching NAMES is not matching ARTWORK, and on 31 August three did not: JRF shipped the State Emblem while the library held Babu Jagjivan Ram’s portrait, DAIC shipped a portrait roundel against the library’s building, and NSKFDC shipped a 96×19 sliver that rendered as a blank tile. All three were re-exported from the library. The files here are 96px renders of the library’s own artwork — the originals run to 2 MB and have no business on a page."
          }
        </p>
        <Callout type="warning" title="Where the artwork still needs the department">
          {
            "Four organisations — NCSK, DAF, DWBDNC and SCW — share one image: the State Emblem. That is a correct fallback, and code and the library agree on exactly which four; but if any of them has a crest of its own it has never been supplied. Two things are now closed. JRF’s variant carried three image fills — the correct portrait, in FILL mode and switched OFF, under two hand-cropped copies — and is rebuilt to one visible fill on a square rectangle like every sibling. And the library now carries an Emblem variant, so a portal with no bespoke mark is drawn honestly instead of wearing another organisation’s crest. SAMBAL had no usable export at all until 31 August: its device sat beneath a 74-node strapline, one text node per character, so every surface fell back to the emblem and nobody could see why."
          }
        </Callout>
      </section>

      <section style={sectionStyle} aria-labelledby="sizes-heading">
        <h2 id="sizes-heading" style={h2Style}>
          Three sizes, and the fallback
        </h2>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--sa-inline-24)",
            flexWrap: "wrap",
            marginBottom: "var(--sa-stack-16)",
          }}
        >
          <OrgLogo org="scw" size="sm" />
          <OrgLogo org="scw" size="md" />
          <OrgLogo org="scw" size="lg" />
          <OrgLogo path="/portals/e-anudaan" size="lg" />
        </div>
        <p style={proseStyle}>
          {
            "The last one is a route with no bespoke mark, so it renders the State Emblem. That is CORRECT rather than a placeholder: a portal without its own logo is still a Government of India property. Never substitute a grey box, an initial or a generic icon."
          }
        </p>
      </section>

      <section style={sectionStyle} aria-labelledby="usage-heading">
        <h2 id="usage-heading" style={h2Style}>
          Implementation &amp; Guidelines
        </h2>
        <DocsTabs
          tabs={[
            {
              id: "design",
              label: "Design",
              content: (
                <section style={sectionStyle}>
                  <h2 id="overview" style={h2Style}>
                    Why one component owns every path
                  </h2>
                  <p style={proseStyle}>
                    {
                      "The same sixteen files sat in two byte-identical public directories — /design-system/org-logos/ and /website/images/org-logos/ — while organisation-details.ts reached into three different roots for the same class of asset, one of them used by a single organisation. Nothing reconciled them, so a mark replaced in one place stayed stale in the others, and nobody could say where “the others” were."
                    }
                  </p>
                  <p style={{ ...proseStyle, marginTop: "var(--sa-stack-16)" }}>
                    {
                      "/design-system/org-logos/ is canonical. These are design-system assets and the website is a consumer of them, not their owner."
                    }
                  </p>
                  <p style={{ ...proseStyle, marginTop: "var(--sa-stack-16)" }}>
                    {
                      "The tile belongs to the component, not the caller: white ground, hairline rule, 8px radius, the mark contained rather than cropped. Four surfaces drew that tile by hand at three different radii before this existed. A departmental crest with its edges cut off is a brand error, not a layout one — so object-fit is always contain, never cover."
                    }
                  </p>
                  <Callout type="warning" title="A mark path written anywhere else fails the build">
                    {
                      "npm run check:org-logos is a per-file ratchet: 99 literals across 48 files are frozen as declared debt. A new file that writes one fails, a baselined file that grows fails, and one that shrinks also fails — telling you to re-baseline, so one surface’s cleanup cannot be spent silently on another’s regression. An unavoidable literal declares itself with // org-logo-exempt(portal-local): why."
                    }
                  </Callout>
                </section>
              ),
            },
            {
              id: "code",
              label: "Code",
              content: (
                <section style={sectionStyle}>
                  <h2 id="example" style={h2Style}>
                    Code Example
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
              ),
            },
            {
              id: "a11y",
              label: "Accessibility",
              content: (
                <section style={sectionStyle}>
                  <h2 id="a11y-heading" style={h2Style}>
                    Accessibility
                  </h2>
                  <A11yChecklist
                    items={[
                      {
                        criterion: "1.1.1 Non-text Content",
                        level: "A",
                        description: "The mark renders with alt=\"\" by default, because it sits beside the organisation's name in real text. Passing `name` sets a real alt, and is only correct where the mark stands alone.",
                      },
                      {
                        criterion: "H67 Decorative images",
                        level: "A",
                        description: "An empty alt is the documented technique for an image whose meaning is already carried by adjacent text. A name here would make a screen reader read the organisation twice.",
                      },
                      {
                        criterion: "1.4.11 Non-text Contrast",
                        level: "AA",
                        description: "The tile's hairline rule is --sa-border-neutral-subtle on white. It is decoration around supplied artwork rather than a control boundary or a meaningful graphic, so 1.4.11 does not apply to it.",
                      },
                    ]}
                  />
                </section>
              ),
            },
          ]}
        />
      </section>

      <section style={sectionStyle} aria-labelledby="props-heading">
        <h2 id="props-heading" style={h2Style}>
          Component Props
        </h2>
        <PropsTable props={PROPS} />
      </section>

      <FeedbackBar />
    </article>
  );
}
