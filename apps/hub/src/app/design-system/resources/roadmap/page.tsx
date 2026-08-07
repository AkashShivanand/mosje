import * as React from "react";
import type { Metadata } from "next";
import { Callout } from "@/components/design-system/docs-kit/index";

export const metadata: Metadata = {
  title: "Roadmap",
  description:
    "Where SAMAVESH is heading — what is shipped now (v0.5), what is coming next (v0.6), and the longer-term plan toward v1.0.",
};

interface Column {
  phase: string;
  version: string;
  tone: "now" | "next" | "later";
  intro: string;
  groups: { heading?: string; items: string[] }[];
}

const COLUMNS: Column[] = [
  {
    phase: "Now",
    version: "v0.5",
    tone: "now",
    intro: "Shipped and in production across the estate.",
    groups: [
      {
        heading: "Components",
        items: [
          "Button",
          "Card",
          "Badge",
          "Chip",
          "Alert",
          "EmptyState",
          "Avatar",
          "Loader",
          "Input",
          "Textarea",
          "Select",
          "FormField",
          "Checkbox",
          "Radio",
          "Toggle",
          "AppSwitcher / ZoneSwitcher",
        ],
      },
      {
        heading: "System",
        items: [
          "@mosje/tokens DTCG pipeline",
          "ColorModeProvider + Switcher",
          "Interactive Playground",
          "Storybook 8 + a11y addon",
        ],
      },
    ],
  },
  {
    phase: "Next",
    version: "v0.6",
    tone: "next",
    intro: "In active design and build.",
    groups: [
      {
        heading: "Molecules",
        items: [
          "Table",
          "Modal",
          "Tabs",
          "Accordion",
          "Pagination",
          "Breadcrumb",
          "Toast",
        ],
      },
      {
        heading: "Chart primitives",
        items: ["Bar / line / donut for PM-AJAY"],
      },
      {
        heading: "Theming",
        items: ["Per-org brand theme sets"],
      },
    ],
  },
  {
    phase: "Later",
    version: "v1.0",
    tone: "later",
    intro: "The road to a stable, fully-adopted 1.0.",
    groups: [
      {
        items: [
          "Full Figma Code Connect coverage",
          "All 20 portals migrated",
          "Data-viz library",
          "Performance CI budget gates",
        ],
      },
    ],
  },
];

const TONE: Record<Column["tone"], { bar: string; chip: string }> = {
  now: { bar: "var(--ds-success)", chip: "var(--ds-success)" },
  next: { bar: "var(--ds-primary)", chip: "var(--ds-primary)" },
  later: { bar: "var(--ds-ink-muted)", chip: "var(--ds-ink-muted)" },
};

export default function RoadmapPage(): React.JSX.Element {
  return (
    <>
      {/* ── Page header ───────────────────────────────────────── */}
      <header className="docs-page-header">
        <div className="docs-page-header__text">
          <h1 className="docs-page-header__title">Roadmap</h1>
          <p className="docs-page-header__desc">
            Where SAMAVESH is today and where it is going. We build incrementally
            on a shared foundation, so the system grows without breaking the
            websites and portals already running on it. Plans shift with real
            needs — treat <strong>Later</strong> as direction, not a commitment.
          </p>
        </div>
      </header>

      <section className="docs-section">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "var(--ds-spacing-xl)",
            marginTop: "var(--ds-spacing-sm)",
          }}
        >
          {COLUMNS.map((col) => (
            <div
              key={col.phase}
              style={{
                border: "1px solid var(--ds-border)",
                borderRadius: "var(--ds-radius-md)",
                background: "var(--ds-surface)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  height: 4,
                  background: TONE[col.tone].bar,
                }}
                aria-hidden="true"
              />
              <div style={{ padding: "var(--ds-spacing-xl)" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "var(--ds-spacing-sm)",
                    marginBottom: "var(--ds-spacing-sm)",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "var(--ds-text-title-1)",
                      fontWeight: 700,
                      color: "var(--ds-ink)",
                    }}
                  >
                    {col.phase}
                  </h2>
                  <span
                    style={{
                      fontSize: "var(--ds-text-body-3)",
                      fontWeight: 600,
                      color: "#fff",
                      background: TONE[col.tone].chip,
                      padding: "2px var(--ds-spacing-sm)",
                      borderRadius: "var(--ds-radius-sm)",
                    }}
                  >
                    {col.version}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: "var(--ds-text-body-2)",
                    color: "var(--ds-ink-muted)",
                    marginBottom: "var(--ds-spacing-lg)",
                    lineHeight: "var(--ds-leading-body-2)",
                  }}
                >
                  {col.intro}
                </p>

                {col.groups.map((group, gi) => (
                  <div
                    key={gi}
                    style={{ marginBottom: "var(--ds-spacing-lg)" }}
                  >
                    {group.heading ? (
                      <div
                        style={{
                          fontSize: "var(--ds-text-body-3)",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                          color: "var(--ds-ink-muted)",
                          marginBottom: "var(--ds-spacing-sm)",
                        }}
                      >
                        {group.heading}
                      </div>
                    ) : null}
                    <ul
                      style={{
                        listStyle: "none",
                        margin: 0,
                        padding: 0,
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--ds-spacing-xs)",
                      }}
                    >
                      {group.items.map((item) => (
                        <li
                          key={item}
                          style={{
                            display: "flex",
                            gap: "var(--ds-spacing-sm)",
                            alignItems: "baseline",
                            fontSize: "var(--ds-text-body-2)",
                            color: "var(--ds-ink)",
                            lineHeight: "var(--ds-leading-body-2)",
                          }}
                        >
                          <span
                            aria-hidden="true"
                            style={{
                              flexShrink: 0,
                              color: TONE[col.tone].chip,
                              fontWeight: 700,
                            }}
                          >
                            {col.tone === "now" ? "✓" : "•"}
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Callout type="info" title="How priorities are set">
          The roadmap is driven by what the portals actually need next. If your
          team is blocked on a component, say so in an{" "}
          <a href="/design-system/resources/governance#rfc">RFC</a> — real demand moves items up
          the list.
        </Callout>
      </section>
    </>
  );
}
