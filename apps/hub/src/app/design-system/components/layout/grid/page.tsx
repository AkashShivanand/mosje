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
import { Grid, GridItem } from "@mosje/design-system";
import { figmaUrl } from "@/lib/design-system/figma";

export const metadata: Metadata = {
  title: "Grid",
  description: "12-column responsive layout grid system with predefined responsive spans and gutters.",
};

/* ── Layout primitives ── */
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

export default function GridDocPage(): React.JSX.Element {
  return (
    <article className="docs-article" style={{ maxWidth: "1024px", margin: "0 auto", paddingBottom: "var(--sa-section-56)" }}>
      {/* ── Header ── */}
      <header style={{ marginBottom: "var(--sa-stack-32)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--sa-stack-12)", flexWrap: "wrap" }}>
          <h1 style={{ fontSize: "var(--sa-type-display-1-size)", fontWeight: 800, color: "var(--sa-text-neutral-base)", margin: 0 }}>
            Grid
          </h1>
          <StatusBadge status="Stable" />
        </div>
        <p style={{ ...proseStyle, marginTop: "var(--sa-stack-12)" }}>
          {"12-column responsive layout grid system with predefined responsive spans and gutters."}
        </p>
        <div style={{ marginTop: "var(--sa-stack-16)", display: "flex", gap: "var(--sa-inline-12)", flexWrap: "wrap" }}>
          <a
            className="docs-page-header__link"
            href={figmaUrl()}
            target="_blank"
            rel="noopener noreferrer"
          >
            Figma Component Spec <span aria-hidden="true">↗</span>
          </a>
        </div>
      </header>

      {/* ── Tabbed Content ── */}
      <DocsTabs
        tabs={[
          {
            id: "design",
            label: "Design",
            content: (
              <>
                <section style={sectionStyle}>
                  <h2 id="overview" style={h2Style}>Overview & Purpose</h2>
                  <p style={proseStyle}>
                    {"Grid is designed to enforce consistent interaction, visual hierarchy, and government compliance across all MoSJE digital properties."}
                  </p>
                  
                  <div
                    style={{
                      marginTop: "var(--sa-stack-24)",
                      padding: "var(--sa-padding-32)",
                      background: "var(--sa-bg-neutral-subtler)",
                      borderRadius: "var(--sa-shape-8)",
                      border: "1px solid var(--sa-border-neutral-subtle)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--sa-stack-16)",
                    }}
                  >
                    <div style={{ fontSize: "var(--sa-type-label-3-size)", fontWeight: 700, color: "var(--sa-text-neutral-subtle)", textTransform: "uppercase" }}>
                      Live Component Specimen
                    </div>
                    <div style={{ background: "var(--sa-bg-neutral-base)", padding: "var(--sa-padding-20)", borderRadius: "var(--sa-shape-6)", border: "1px solid var(--sa-border-neutral-subtle)" }}>
                      <Grid columns={12}><GridItem span={{ lg: 8, base: 12 }}><div style={{ padding: "var(--sa-padding-16)", background: "var(--sa-bg-neutral-base)", border: "1px solid var(--sa-border-neutral-subtle)" }}>Main Column (8 / 12)</div></GridItem><GridItem span={{ lg: 4, base: 12 }}><div style={{ padding: "var(--sa-padding-16)", background: "var(--sa-bg-neutral-base)", border: "1px solid var(--sa-border-neutral-subtle)" }}>Sidebar (4 / 12)</div></GridItem></Grid>
                    </div>
                  </div>
                </section>

                <section style={sectionStyle}>
                  <h2 id="guidelines" style={h2Style}>Usage Guidelines</h2>
                  <DoDont
                    cards={[
                      {
                        type: "do",
                        label: "Use 8+4 column splits for article pages with right rails.",
                        preview: (
                          <div style={{ padding: "var(--sa-padding-16)", textAlign: "center", fontSize: "var(--sa-type-body-2-size)", color: "var(--sa-text-neutral-base)" }}>
                            Recommended Practice
                          </div>
                        ),
                      },
                      {
                        type: "dont",
                        label: "Do not use arbitrary CSS margins to simulate grid gutters.",
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
                  <CodeBlock>{`import { Grid } from "@mosje/design-system";`}</CodeBlock>
                </section>

                <section style={sectionStyle}>
                  <h2 id="props" style={h2Style}>Props Reference</h2>
                  <PropsTable props={[
  {
    "name": "columns",
    "type": "number",
    "default": "12",
    "description": "Grid track count."
  },
  {
    "name": "children",
    "type": "React.ReactNode",
    "required": true,
    "description": "GridItem child elements."
  }
]} />
                </section>

                <section style={sectionStyle}>
                  <h2 id="example" style={h2Style}>Code Example</h2>
                  <CodeBlock>{`<Grid columns={12}><GridItem span={{ lg: 8, base: 12 }}><div style={{ padding: "var(--sa-padding-16)", background: "var(--sa-bg-neutral-base)", border: "1px solid var(--sa-border-neutral-subtle)" }}>Main Column (8 / 12)</div></GridItem><GridItem span={{ lg: 4, base: 12 }}><div style={{ padding: "var(--sa-padding-16)", background: "var(--sa-bg-neutral-base)", border: "1px solid var(--sa-border-neutral-subtle)" }}>Sidebar (4 / 12)</div></GridItem></Grid>`}</CodeBlock>
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
                  <A11yChecklist items={[
  {
    "criterion": "1.3.2 Meaningful Sequence",
    "level": "AA",
    "description": "Logical reading order preserved across responsive column stacks."
  }
]} />
                </section>

              </>
            ),
          },
        ]}
      />

      {/* ── Feedback & Continuous Improvement ── */}
      <FeedbackBar componentName="Grid" />
    </article>
  );
}
