import * as React from "react";
import type { Metadata } from "next";
import { ErrorViewPlayground } from "./error-view-playground";
import { PropsTable, DoDont, A11yChecklist } from "@/components/design-system/docs-kit";
import { DocsTabs } from "@/components/design-system/docs-kit";

export const metadata: Metadata = {
  title: "Error View - SAMAVESH Design System",
  description:
    "A full-page resilient error state with Apple-inspired fluid motion, integrated search, recovery actions, and citizen wayfinding.",
};

export default function ErrorViewPage(): React.JSX.Element {
  const h2Style: React.CSSProperties = {
    fontSize: "var(--sa-type-headline-2-size)",
    fontWeight: 600,
    margin: "0 0 var(--sa-stack-24) 0",
    color: "var(--sa-text-neutral-bolder)",
  };
  const proseStyle: React.CSSProperties = {
    color: "var(--sa-text-neutral-base)",
    fontSize: "var(--sa-type-body-1-size)",
    lineHeight: 1.6,
  };
  const leadStyle: React.CSSProperties = {
    ...proseStyle,
    fontSize: "var(--sa-type-headline-3-size)",
    color: "var(--sa-text-neutral-subtle)",
    marginBottom: "var(--sa-stack-24)",
  };

  return (
    <main
      className="ds-prose"
      style={{
        maxWidth: "960px",
        padding: "var(--sa-padding-40) var(--sa-padding-24)",
      }}
    >
      {/* ============ HEADER ============ */}
      <header style={{ marginBottom: "var(--sa-stack-40)" }}>
        <h1
          style={{
            fontSize: "var(--sa-type-headline-1-size)",
            margin: "0 0 var(--sa-stack-16) 0",
          }}
        >
          Error View
        </h1>
        <p className="ds-lead" style={leadStyle}>
          A resilient, human-centered error architecture for 404 Not Found, 500 Server Error, 403 Forbidden, and Maintenance states. Built with Apple fluid design principles, integrated search recovery, and citizen wayfinding cards.
        </p>
      </header>

      {/* ============ TABS ============ */}
      <DocsTabs
        tabs={[
          {
            id: "design",
            label: "Design",
            content: (
              <div className="ds-prose">
                <section style={{ marginBottom: "var(--sa-section-48)" }}>
                  <h2 id="playground" style={h2Style}>Playground</h2>
                  <p style={proseStyle}>
                    Switch between error presets (404, 500, 403, maintenance) and toggle search or diagnostic options.
                  </p>
                  <div style={{ marginTop: "var(--sa-stack-24)" }}>
                    <ErrorViewPlayground />
                  </div>
                </section>

                <section style={{ marginBottom: "var(--sa-section-48)" }}>
                  <h2 id="usage" style={h2Style}>1. Usage Principles</h2>
                  <p style={proseStyle}>
                    When a citizen encounters a broken link or system exception, an error page should never be a dead end. Every ErrorView provides three levels of recovery:
                  </p>
                  <ul style={{ ...proseStyle, paddingLeft: "var(--sa-padding-20)", marginTop: "var(--sa-stack-12)" }}>
                    <li><strong>Direct Recovery:</strong> A prominent Primary action (Return to Homepage / Try Again) and Secondary action (Go Back).</li>
                    <li><strong>Immediate Discovery:</strong> An integrated search bar so citizens can search across all MoSJE services without navigating away.</li>
                    <li><strong>Contextual Wayfinding:</strong> 4 high-value internal destination cards guiding users to Schemes, Tenders, Directory, and Portals.</li>
                  </ul>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "var(--sa-inline-24)",
                      marginTop: "var(--sa-stack-24)",
                    }}
                  >
                    <DoDont
                      cards={[
                        {
                          type: "do",
                          label: "Always provide a clear path forward (Homepage, Search, and popular citizen destinations).",
                          preview: null,
                        },
                        {
                          type: "dont",
                          label: "Don't show cryptic raw stack traces or empty blank screens to citizens without site chrome.",
                          preview: null,
                        },
                      ]}
                    />
                  </div>
                </section>
              </div>
            ),
          },
          {
            id: "api",
            label: "API Reference",
            content: (
              <div className="ds-prose">
                <section style={{ marginBottom: "var(--sa-section-48)" }}>
                  <h2 id="props" style={h2Style}>Props</h2>
                  <PropsTable
                    props={[
                      {
                        name: "kind",
                        type: '"404" | "500" | "403" | "maintenance"',
                        default: '"404"',
                        description: "Preset archetype providing contextual status badge, icon, and empathetic copy.",
                      },
                      {
                        name: "badge",
                        type: "string",
                        description: "Custom badge text override.",
                      },
                      {
                        name: "title",
                        type: "string",
                        description: "Hero title text override.",
                      },
                      {
                        name: "description",
                        type: "string",
                        description: "Empathetic explanatory description text override.",
                      },
                      {
                        name: "searchUrl",
                        type: "string | null",
                        default: '"/website/search?q="',
                        description: "URL destination template for the search input. Set to null to hide.",
                      },
                      {
                        name: "primaryAction",
                        type: "{ label: string; href?: string; onClick?: () => void; icon?: string }",
                        description: "Primary recovery CTA button.",
                      },
                      {
                        name: "secondaryAction",
                        type: "{ label: string; href?: string; onClick?: () => void; icon?: string }",
                        description: "Secondary recovery CTA button (e.g. Go Back).",
                      },
                      {
                        name: "wayfindingLinks",
                        type: "WayfindingLink[]",
                        description: "Array of 4 popular destination cards for citizen wayfinding.",
                      },
                      {
                        name: "errorDetails",
                        type: "string",
                        description: "Technical diagnostics string rendered in a collapsible disclosure box.",
                      },
                    ]}
                  />
                </section>
              </div>
            ),
          },
          {
            id: "accessibility",
            label: "Accessibility",
            content: (
              <div className="ds-prose">
                <section style={{ marginBottom: "var(--sa-section-48)" }}>
                  <h2 id="a11y" style={h2Style}>Accessibility &amp; Standards</h2>
                  <A11yChecklist
                    items={[
                      {
                        criterion: "Semantic Sectioning",
                        level: "AA",
                        description: "Rendered with <section aria-labelledby='error-view-title'> and H1 title for screen reader navigation.",
                      },
                      {
                        criterion: "Accessible Forms",
                        level: "AA",
                        description: "Integrated search input carries explicit aria-label='Search MoSJE Portal'.",
                      },
                      {
                        criterion: "Contrast Compliance",
                        level: "AA",
                        description: "All text and button styles achieve >4.5:1 AA contrast ratio under GIGW 3.0 and WCAG 2.2 AA.",
                      },
                      {
                        criterion: "Keyboard Navigation",
                        level: "AA",
                        description: "All buttons, search input, and cards are fully focusable with visible focus rings.",
                      },
                    ]}
                  />
                </section>
              </div>
            ),
          },
        ]}
      />
    </main>
  );
}
