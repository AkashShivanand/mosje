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

// Each tone carries the INK that belongs to its own chip colour. It used to be one
// hardcoded "#fff" for all three, which happened to be legible but said nothing about
// which background it was legible against — so a chip recolour could not carry its
// text with it.
const TONE: Record<Column["tone"], { bar: string; chip: string; ink: string }> = {
  now: {
    bar: "var(--sa-color-status-success)",
    chip: "var(--sa-color-status-success)",
    ink: "var(--sa-on-bg-status-success-bolder)",
  },
  next: {
    bar: "var(--sa-color-action-primary-default)",
    chip: "var(--sa-color-action-primary-default)",
    ink: "var(--sa-on-bg-brand-primary-bolder)",
  },
  // `later` used --sa-color-text-muted as a BACKGROUND — a text role standing in for a
  // surface role, which is why it had no `on-` companion to pair with and ended up with a
  // hardcoded white. Moved to the real background role: a quiet grey chip with dark ink,
  // 9.73:1, which also reads as the least-emphasised column, which is what `later` means.
  later: {
    bar: "var(--sa-bg-neutral-bold)",
    chip: "var(--sa-bg-neutral-bold)",
    ink: "var(--sa-on-bg-neutral-bold)",
  },
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
            gap: "var(--sa-padding-20)",
            marginTop: "var(--sa-stack-8)",
          }}
        >
          {COLUMNS.map((col) => (
            <div
              key={col.phase}
              style={{
                border: "1px solid var(--sa-border-neutral-subtle)",
                borderRadius: "var(--sa-shape-8)",
                background: "var(--sa-bg-neutral-base)",
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
              <div style={{ padding: "var(--sa-padding-20)" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "var(--sa-stack-8)",
                    marginBottom: "var(--sa-stack-8)",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "var(--sa-type-headline-2-size)",
                      fontWeight: 700,
                      color: "var(--sa-text-neutral-base)",
                    }}
                  >
                    {col.phase}
                  </h2>
                  <span
                    style={{
                      fontSize: "var(--sa-type-body-3-size)",
                      fontWeight: 600,
                      color: TONE[col.tone].ink,
                      background: TONE[col.tone].chip,
                      padding: "var(--sa-padding-2) var(--sa-padding-8)",
                      borderRadius: "var(--sa-shape-6)",
                    }}
                  >
                    {col.version}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: "var(--sa-type-body-2-size)",
                    color: "var(--sa-text-neutral-subtle)",
                    marginBottom: "var(--sa-stack-16)",
                    lineHeight: "var(--sa-type-body-2-lh)",
                  }}
                >
                  {col.intro}
                </p>

                {col.groups.map((group, gi) => (
                  <div
                    key={gi}
                    style={{ marginBottom: "var(--sa-stack-16)" }}
                  >
                    {group.heading ? (
                      <div
                        style={{
                          fontSize: "var(--sa-type-body-3-size)",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                          color: "var(--sa-text-neutral-subtle)",
                          marginBottom: "var(--sa-stack-8)",
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
                        gap: "var(--sa-stack-4)",
                      }}
                    >
                      {group.items.map((item) => (
                        <li
                          key={item}
                          style={{
                            display: "flex",
                            gap: "var(--sa-stack-8)",
                            alignItems: "baseline",
                            fontSize: "var(--sa-type-body-2-size)",
                            color: "var(--sa-text-neutral-base)",
                            lineHeight: "var(--sa-type-body-2-lh)",
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
