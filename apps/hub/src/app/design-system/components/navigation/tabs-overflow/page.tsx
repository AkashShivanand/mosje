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
import { Tabs } from "@mosje/design-system";
import { figmaUrl } from "@/lib/design-system/figma";

export const metadata: Metadata = {
  title: "Tabs Overflow",
  description: "Adaptive horizontal tab bar that automatically collapses trailing tabs into a \"More\" dropdown when viewport width is restricted.",
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

export default function TabsOverflowDocPage(): React.JSX.Element {
  return (
    <article className="docs-article" style={{ maxWidth: "1024px", margin: "0 auto", paddingBottom: "var(--sa-section-56)" }}>
      {/* ── Header ── */}
      <header style={{ marginBottom: "var(--sa-stack-32)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--sa-stack-12)", flexWrap: "wrap" }}>
          <h1 style={{ fontSize: "var(--sa-type-display-1-size)", fontWeight: 800, color: "var(--sa-text-neutral-base)", margin: 0 }}>
            Tabs Overflow
          </h1>
          <StatusBadge status="Beta" />
        </div>
        <p style={{ ...proseStyle, marginTop: "var(--sa-stack-12)" }}>
          {"Adaptive horizontal tab bar that automatically collapses trailing tabs into a \"More\" dropdown when viewport width is restricted."}
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
                    {"Tabs Overflow is designed to enforce consistent interaction, visual hierarchy, and government compliance across all MoSJE digital properties."}
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
                      <Tabs idBase="tabs-demo" tabs={[{ id: "1", label: "Overview" }, { id: "2", label: "Eligibility" }, { id: "3", label: "Guidelines" }, { id: "4", label: "Grievances" }]} active={0} onChange={(i: number) => console.log(i)} overflow={true} />
                    </div>
                  </div>
                </section>

                <section style={sectionStyle}>
                  <h2 id="guidelines" style={h2Style}>Usage Guidelines</h2>
                  <DoDont
                    cards={[
                      {
                        type: "do",
                        label: "Use TabsOverflow for dense dashboard sections with more than 5 tabs.",
                        preview: (
                          <div style={{ padding: "var(--sa-padding-16)", textAlign: "center", fontSize: "var(--sa-type-body-2-size)", color: "var(--sa-text-neutral-base)" }}>
                            Recommended Practice
                          </div>
                        ),
                      },
                      {
                        type: "dont",
                        label: "Do not let tabs wrap onto multiple uneven visual lines.",
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
                  <CodeBlock>{`import { Tabs } from "@mosje/design-system";`}</CodeBlock>
                </section>

                <section style={sectionStyle}>
                  <h2 id="props" style={h2Style}>Props Reference</h2>
                  <PropsTable props={[
  {
    "name": "tabs",
    "type": "TabDef[]",
    "required": true,
    "description": "Array of tab definitions."
  },
  {
    "name": "active",
    "type": "number",
    "required": true,
    "description": "0-indexed active tab."
  },
  {
    "name": "onChange",
    "type": "(tabIndex: number) => void",
    "required": true,
    "description": "Tab change callback."
  }
]} />
                </section>

                <section style={sectionStyle}>
                  <h2 id="example" style={h2Style}>Code Example</h2>
                  <CodeBlock>{`<Tabs idBase="tabs-demo" tabs={[{ id: "1", label: "Overview" }, { id: "2", label: "Eligibility" }, { id: "3", label: "Guidelines" }, { id: "4", label: "Grievances" }]} active={0} onChange={(i: number) => console.log(i)} overflow={true} />`}</CodeBlock>
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
    "criterion": "4.1.2 Name, Role, Value",
    "level": "AA",
    "description": "WAI-ARIA tablist pattern with arrow-key keyboard navigation."
  }
]} />
                </section>

                <section style={sectionStyle}>
                  <h2 id="keyboard" style={h2Style}>Keyboard Navigation</h2>
                  <div style={{ overflowX: "auto" }}>
                    <table className="props-table">
                      <thead>
                        <tr>
                          <th scope="col">Key</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><kbd style={{ fontFamily: "var(--sa-font-mono)", padding: "var(--sa-padding-2) var(--sa-padding-6)", background: "var(--sa-bg-neutral-subtler)", borderRadius: "var(--sa-shape-4)", border: "1px solid var(--sa-border-neutral-subtle)" }}>ArrowLeft / ArrowRight</kbd></td>
                          <td>{"Moves active tab selection."}</td>
                        </tr>
                        <tr>
                          <td><kbd style={{ fontFamily: "var(--sa-font-mono)", padding: "var(--sa-padding-2) var(--sa-padding-6)", background: "var(--sa-bg-neutral-subtler)", borderRadius: "var(--sa-shape-4)", border: "1px solid var(--sa-border-neutral-subtle)" }}>Enter / Space</kbd></td>
                          <td>{"Opens the \"More\" overflow menu."}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>
              </>
            ),
          },
        ]}
      />

      {/* ── Feedback & Continuous Improvement ── */}
      <FeedbackBar componentName="Tabs Overflow" />
    </article>
  );
}
