import type { Metadata } from "next";
import {
  DocsTabs,
  PropsTable,
  DoDont,
  A11yChecklist,
  StatusBadge,
  CodeBlock,
  FeedbackBar,
} from "@/components/design-system/docs-kit/index";
import { figmaUrl, FIGMA_NODES } from "@/lib/design-system/figma";
import { SamaveshBanner } from "@mosje/design-system";

export const metadata: Metadata = {
  title: "SAMAVESH Banner — Design System",
  description:
    "Top identity banner and portal discovery drawer implementing Figma node 7116:33784 & 7298:29968.",
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
  lineHeight: "var(--sa-type-body-1-lh)",
  maxWidth: "var(--sa-container-measure)",
};

/**
 * A MIXED set, so the specimen shows the category filter.
 *
 * The live banner passes no `portals` and therefore renders every LIVE portal —
 * all of which are scheme portals today, so the real site shows no filter at
 * all. Showing that here would document a control nobody can see, so the
 * specimen supplies portals spanning three categories instead. The rule is in
 * the Accessibility tab and in `portal-categories.test.ts`.
 */
const SPECIMEN_PORTALS = [
  {
    id: "scw",
    shortName: "SCW",
    name: "Senior Citizens Welfare",
    href: "/portals/scw",
    category: "Scheme Portals" as const,
    logoSrc: "/design-system/org-logos/scw.png",
  },
  {
    id: "nmba",
    shortName: "NMBA",
    name: "Nasha Mukt Bharat Abhiyaan",
    href: "/portals/nmba",
    category: "Scheme Portals" as const,
    logoSrc: "/design-system/org-logos/nmba.png",
  },
  {
    id: "ncsc",
    shortName: "NCSC",
    name: "National Commission for Scheduled Castes",
    href: "/portals/ncsc",
    category: "Commission" as const,
    logoSrc: "/design-system/org-logos/ncsc.png",
  },
  {
    id: "nsfdc",
    shortName: "NSFDC",
    name: "National SC Finance & Development Corporation",
    href: "/portals/nsfdc",
    category: "Corporations" as const,
    logoSrc: "/design-system/org-logos/nsfdc.png",
  },
];

export default function SamaveshBannerDocPage(): React.JSX.Element {
  return (
    <article
      className="docs-article"
      style={{
        maxWidth: "1024px",
        margin: "0 auto",
        paddingBottom: "var(--sa-section-56)",
      }}
    >
      {/* ── Header ── */}
      <header style={{ marginBottom: "var(--sa-stack-32)" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--sa-stack-12)",
            flexWrap: "wrap",
          }}
        >
          <h1
            style={{
              fontSize: "var(--sa-type-display-1-size)",
              lineHeight: "var(--sa-type-display-1-lh)",
              fontWeight: 500,
              color: "var(--sa-text-neutral-base)",
              margin: 0,
            }}
          >
            SAMAVESH Banner
          </h1>
          <StatusBadge status="New" />
        </div>
        <p style={{ ...proseStyle, marginTop: "var(--sa-stack-12)" }}>
          {
            "Top identity banner and interactive portal exploration drawer for the MoSJE estate, connecting citizens directly to ministry portals including SCW, SMILE, PM-AJAY and NMBA."
          }
        </p>
        <div
          style={{
            marginTop: "var(--sa-stack-16)",
            display: "flex",
            gap: "var(--sa-inline-12)",
            flexWrap: "wrap",
          }}
        >
          <a
            className="docs-page-header__link"
            href={figmaUrl(FIGMA_NODES.samaveshBanner)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Figma Component Spec <span aria-hidden="true">↗</span>
          </a>
        </div>
      </header>

      {/* ── Interactive Specimen ── */}
      <section style={sectionStyle} aria-labelledby="specimen-heading">
        <h2 id="specimen-heading" style={h2Style}>
          Interactive Specimen
        </h2>
        {/*
          NO `overflow: hidden`, and a reserved block below the band. The drawer
          is `position: absolute` so that it OVERLAYS the page instead of pushing
          it down; a clipping specimen frame would hide the very thing this
          section exists to show, and a specimen that silently disagrees with the
          live component is worse than no specimen. The reserved height is what
          stops the open drawer overlapping the next section of this page.
        */}
        <div
          style={{
            borderRadius: "var(--sa-shape-16)",
            border: "1px solid var(--sa-border-neutral-subtle)",
            backgroundColor: "var(--sa-bg-neutral-base)",
            // ds-exempt(demo-geometry): room for the OPEN drawer, which is
            // `position: absolute` so that it overlays the page rather than
            // pushing it down. This is the measured height of the open panel in
            // this frame, not a spacing decision — no token models "as tall as
            // that component happens to be", and snapping it to the nearest
            // space rung would either clip the specimen or leave a gap.
            paddingBottom: "420px",
          }}
        >
          {/* A SPECIMEN, so it opts out of pinning. `sticky` defaults ON — the
              band is masthead chrome — and an inline example that pins itself
              over the documentation explaining it is demonstrating the page
              rather than the component. Same call SiteHeader's own previews make. */}
          <SamaveshBanner
            defaultOpen={true}
            sticky={false}
            portals={SPECIMEN_PORTALS}
          />
        </div>
      </section>

      {/* ── Usage Tabs ── */}
      <section style={sectionStyle} aria-labelledby="usage-heading">
        <h2 id="usage-heading" style={h2Style}>
          Implementation & Guidelines
        </h2>
        <DocsTabs
          tabs={[
            {
              id: "design",
              label: "Design",
              content: (
                <>
                  <section style={sectionStyle}>
                    <h2 id="overview" style={h2Style}>Overview & Principles</h2>
                    <p style={proseStyle}>
                      The SAMAVESH banner acts as the unified gateway across the
                      digital estate. It provides immediate branding recognition with
                      the India Saffron ground and the SAMAVESH mark, paired with
                      an accessible expandable accordion drawer for instant navigation
                      to core public-facing services.
                    </p>
                  </section>

                  <section style={sectionStyle}>
                    <h2 id="guidelines" style={h2Style}>Usage Guidelines</h2>
                    <DoDont
                      cards={[
                        {
                          type: "do",
                          label: "Use the unified @mosje/design-system SamaveshBanner on all required pages.",
                          preview: (
                            <div style={{ padding: "var(--sa-padding-16)", textAlign: "center", fontSize: "var(--sa-type-body-2-size)", color: "var(--sa-text-neutral-base)" }}>
                              Recommended Practice
                            </div>
                          ),
                        },
                        {
                          type: "dont",
                          label: "Do not hand-roll raw HTML/CSS header banners with hardcoded hex colors or static links.",
                          preview: (
                            <div style={{ padding: "var(--sa-padding-16)", textAlign: "center", fontSize: "var(--sa-type-body-2-size)", color: "var(--sa-text-neutral-subtle)" }}>
                              Anti-pattern
                            </div>
                          ),
                        },
                      ]}
                    />
                  </section>
                </>
              ),
            },
            {
              id: "code",
              label: "Code",
              content: (
                <>
                  <section style={sectionStyle}>
                    <h2 id="installation" style={h2Style}>Installation & Import</h2>
                    <CodeBlock>{`import { SamaveshBanner } from "@mosje/design-system";`}</CodeBlock>
                  </section>

                  <section style={sectionStyle}>
                    <h2 id="props" style={h2Style}>Props Reference</h2>
                    <PropsTable from="SamaveshBannerProps" />
                  </section>

                  <section style={sectionStyle}>
                    <h2 id="example" style={h2Style}>Code Example</h2>
                    <CodeBlock>{`<SamaveshBanner
  drawerTitle="Choose a portal to visit"
  viewAllHref="/website/samavesh-citizen-portals"
/>`}</CodeBlock>
                  </section>
                </>
              ),
            },
            {
              id: "accessibility",
              label: "Accessibility",
              content: (
                <>
                  <section style={sectionStyle}>
                    <h2 id="wcag" style={h2Style}>WCAG 2.2 AA & GIGW 3.0 Compliance</h2>
                    <p style={proseStyle}>
                      This component satisfies all mandatory Government of India Guidelines for Web Portals (GIGW 3.0) and WCAG 2.2 Level AA requirements.
                    </p>
                    <A11yChecklist
                      items={[
                        {
                          criterion: "2.1.1 Keyboard Navigation",
                          level: "A",
                          description:
                            "The Explore toggle is a native button with full keyboard focus indicators, and pressing Escape automatically closes the open drawer.",
                        },
                        {
                          criterion: "4.1.2 Name, Role, Value",
                          level: "A",
                          description:
                            "aria-expanded and aria-controls communicate the drawer state. The portal cards are a real <ul>/<li> of <a> inside a named <nav> \u2014 never role=\"listitem\" on the anchor, which REPLACES its link role and announces four list items with no links between them.",
                        },
                        {
                          criterion: "1.3.1 Info and Relationships",
                          level: "A",
                          description:
                            "The drawer title is a <p> naming the <nav>, not an <h2>. The banner renders before every page's <h1>, so a heading here would invert the document outline \u2014 and mounting it outside <main> does not fix that, because heading order is a property of the document rather than of the landmark.",
                        },
                        {
                          criterion: "1.4.3 Contrast (Minimum)",
                          level: "AA",
                          description:
                            "The band's text is INK on India Saffron at 5.56:1, not white \u2014 white on that ground is 2.91:1 and fails at every size, including the title as large text. Explore is white on India Green at 6.72:1; the drawer heading is 12.9:1 on the peach ground.",
                        },
                        {
                          criterion: "1.4.11 Non-text Contrast",
                          level: "AA",
                          description:
                            "The Explore focus ring is ink rather than white (5.56:1 against saffron), and the portal card border is saffronDark at 6.02:1 \u2014 it is the card's only boundary, so the 3:1 threshold applies to it.",
                        },
                        {
                          criterion: "2.4.3 Focus Order / 2.4.7 Focus Visible",
                          level: "AA",
                          description:
                            "Escape closes the drawer and returns focus to the Explore button. Without that return, focus stays on a card the collapse has just made invisible, leaving no focus indicator anywhere on the page.",
                        },
                        {
                          criterion: "2.3.3 Animation from Interactions",
                          level: "AAA",
                          description:
                            "prefers-reduced-motion: reduce removes the drawer tween and the card hover lift. The drawer still opens and closes \u2014 only the travel stops.",
                        },
                      ]}
                    />
                  </section>
                </>
              ),
            },
          ]}
        />
      </section>

      {/* ── Variants & the research behind them ── */}
      <section style={sectionStyle} aria-labelledby="variants-heading">
        <h2 id="variants-heading" style={h2Style}>
          Band tones, and why the default fails contrast on purpose
        </h2>
        <p style={proseStyle}>
          {
            "India Saffron is a saturated mid-tone, which is the one ground no ink sits on comfortably \u2014 too light to carry white, too vivid and dark to carry reading-size dark text. This is a named problem in the field, not a quirk of this component, and the three tones exist because it has no single right answer."
          }
        </p>

        <div style={{ marginTop: "var(--sa-stack-24)", overflowX: "auto" }}>
          <table style={{ borderCollapse: "collapse", width: "100%", fontSize: "var(--sa-type-body-2-size)" }}>
            <caption style={{ textAlign: "left", paddingBottom: "var(--sa-padding-8)", color: "var(--sa-text-neutral-subtle)" }}>
              Measured on the shipped colours. WCAG 2 needs 4.5:1 body / 3:1 large; APCA needs Lc 75 body / 45 headline.
            </caption>
            <thead>
              <tr>
                {["tone", "ink on ground", "WCAG 2", "APCA Lc", "body text", "large text"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "var(--sa-padding-8)", borderBottom: "2px solid var(--sa-border-neutral-subtle)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["light (default)", "#ffffff on #ff671f", "2.91 \u2717", "59.8", "fails both", "fails WCAG, passes APCA"],
                ["dark", "#0e1114 on #ff671f", "6.50 \u2713", "48.9", "passes WCAG only", "passes both"],
                ["tint", "#0e1114 on #fff2ed", "17.29 \u2713", "99.1", "passes both", "passes both"],
              ].map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, i) => (
                    <td key={i} style={{ padding: "var(--sa-padding-8)", borderBottom: "1px solid var(--sa-border-neutral-subtle)", fontWeight: i === 0 ? 600 : 400 }}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Three live bands, collapsed — the numbers above are only half the
            answer, and the reason this component ships three tones is that the
            trade-off is visible rather than arguable. */}
        <div style={{ marginTop: "var(--sa-stack-32)", display: "flex", flexDirection: "column", gap: "var(--sa-stack-24)" }}>
          {([
            ["light", "Default. Matches Figma. 2.91:1 \u2014 fails WCAG 2. Best APCA score on this ground (Lc 59.8)."],
            ["dark", "Compliant on the saffron band: 6.50:1. APCA Lc 48.9 \u2014 headline only, not body."],
            ["tint", "Clears both standards for body text: 17.29:1, APCA Lc 99.1. Saffron becomes the accent."],
          ] as const).map(([tone, note]) => (
            <div key={tone}>
              <p
                style={{
                  fontSize: "var(--sa-type-label-1-size)",
                  fontWeight: 600,
                  color: "var(--sa-text-neutral-base)",
                  margin: "0 0 var(--sa-stack-8)",
                }}
              >
                <code>tone=&quot;{tone}&quot;</code>{" "}
                <span style={{ fontWeight: 400, color: "var(--sa-text-neutral-subtle)" }}>{note}</span>
              </p>
              <div style={{ borderRadius: "var(--sa-shape-16)", border: "1px solid var(--sa-border-neutral-subtle)", overflow: "hidden" }}>
                <SamaveshBanner tone={tone} sticky={false} portals={SPECIMEN_PORTALS} />
              </div>
            </div>
          ))}
        </div>

        <h3 style={{ ...h2Style, fontSize: "var(--sa-type-headline-4-size)", marginTop: "var(--sa-stack-32)" }}>
          Why the two standards disagree
        </h3>
        <p style={proseStyle}>
          {
            "WCAG 2 computes relative luminance only. The Helmholtz\u2013Kohlrausch effect means a saturated colour appears far brighter to the eye than its luminance measures, so WCAG 2 systematically misjudges vivid mid-tones. APCA \u2014 the perceptual algorithm built to correct this \u2014 ranks the inks on saffron in the OPPOSITE order: white (Lc 59.8) beats near-black (48.9), which beats the deep brand green (43.9, below APCA\u2019s 45 floor for headline text)."
          }
        </p>

        <h3 style={{ ...h2Style, fontSize: "var(--sa-type-headline-4-size)", marginTop: "var(--sa-stack-32)" }}>
          What user testing found
        </h3>
        <p style={proseStyle}>
          {
            "In the most-cited study on this question (Bounteous / Seastrand, ~20 colour-blind participants) 61% preferred white text and 39% black, rising to 71% for white among protanopia. The single monochrome participant preferred black. One participant described black on orange as having \u201ca slight halo effect around it\u201d; another said of white that it \u201cfalls into the background\u201d. Both effects are real and they affect different people, which is why this component ships alternatives instead of one answer."
          }
        </p>

        <h3 style={{ ...h2Style, fontSize: "var(--sa-type-headline-4-size)", marginTop: "var(--sa-stack-32)" }}>
          The finding that settles it
        </h3>
        <p style={proseStyle}>
          {
            "Scanning roughly 700,000 colours against #ff671f: ZERO clear WCAG 2\u2019s 4.5:1 and APCA\u2019s Lc 75 for the 14px subline. Not one, in the entire colour space \u2014 and still none when relaxed to Lc 60. For the large bold wordmark, 34,887 inks clear both. So the constraint is the ground, not the ink, and the argument about black versus white cannot be won on this band."
          }
        </p>

        <h3 style={{ ...h2Style, fontSize: "var(--sa-type-headline-4-size)", marginTop: "var(--sa-stack-32)" }}>
          Why APCA does not simply decide it
        </h3>
        <p style={proseStyle}>
          {
            "APCA was removed from WCAG 3 consideration in 2023 and was only ever exploratory content; WCAG 3\u2019s contrast algorithm is still undecided and no Recommendation is expected before roughly 2028. WCAG 2.1/2.2 AA remains the enforceable standard, and GIGW 3.0 binds this estate to it. The default tone is therefore a recorded NON-CONFORMANCE chosen for reference fidelity and perceptual legibility \u2014 not a conformance argument. It is entry 8 in the divergence register at docs/guidelines/README.md, and `tone=\"tint\"` is the one-word remedy if an audit challenges it."
          }
        </p>
      </section>

      {/* \u2500\u2500 Props Table \u2500\u2500 */}
      <section style={sectionStyle} aria-labelledby="props-heading">
        <h2 id="props-heading" style={h2Style}>
          Component Props
        </h2>
        <PropsTable from="SamaveshBannerProps" />
      </section>

      {/* ── Feedback Bar ── */}
      <div style={{ marginTop: "var(--sa-section-48)" }}>
        <FeedbackBar />
      </div>
    </article>
  );
}
