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
    phase: "Shipped (v1.0)",
    version: "v1.0",
    tone: "now",
    intro: "Fully built, tested, accessible, and live across all 20 MoSJE portals and public website.",
    groups: [
      {
        heading: "Full Component Library (90+)",
        items: [
          "Button, Card, Badge, Chip, Alert, EmptyState",
          "Forms: Input, Select, Textarea, Checkbox, Radio, DatePicker, FileUpload",
          "Data Display: Table, IndiaMap, Charts (Bar, Line, Area, Donut, Combo, Heatmap)",
          "Navigation: SiteHeader, NavSheet, SiteFooter, Stepper, Tabs, Breadcrumbs",
          "Dashboard: DashboardGrid, KPI Row, FilterBar, MetricCard, ChartCard",
          "Feedback: Modal, SideSheet, Lightbox, Toast, Skeleton, SLA Indicator",
        ],
      },
      {
        heading: "Architecture & Tooling",
        items: [
          "@mosje/tokens DTCG automated token pipeline",
          "WCAG 2.2 AA & GIGW 3.0 Compliance Suite",
          "Automated Full-Text Docs Search Index (117+ pages)",
          "Bilingual Interactive Playgrounds (English / Hindi)",
          "Figma Code Connect 100% Mapping",
        ],
      },
    ],
  },
  {
    phase: "Next",
    version: "v1.1",
    tone: "next",
    intro: "Next-generation enhancements and smart assistive capabilities.",
    groups: [
      {
        heading: "Smart Features",
        items: [
          "Bhashini Real-time Voice Interaction Primitives",
          "Citizen Grievance Predictive SLA Indicators",
          "Geo-spatial District Inspection Choropleth Enhancements",
          "High-density Table Virtualization (>10,000 records)",
        ],
      },
    ],
  },
  {
    phase: "Horizon",
    version: "v2.0",
    tone: "later",
    intro: "National multi-lingual scale and pan-ministry adoption.",
    groups: [
      {
        items: [
          "Pan-Ministry SAMAVESH Core Distribution",
          "Automated AI Accessibility Visual Audit Bots",
          "Dynamic Scheme Micro-Frontend Registry",
          "Multi-lingual Devanagari Typography Variable Font Optimization",
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
                      fontWeight: "var(--sa-font-weight-bold)",
                      color: "var(--sa-text-neutral-base)",
                    }}
                  >
                    {col.phase}
                  </h2>
                  <span
                    style={{
                      fontSize: "var(--sa-type-body-3-size)",
                      fontWeight: "var(--sa-font-weight-semibold)",
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
                          fontSize: "var(--sa-type-label-3-size)",
                          lineHeight: "var(--sa-type-label-3-lh)",
                          fontWeight: "var(--sa-font-weight-bold)",
                          textTransform: "uppercase",
                          letterSpacing: "var(--sa-type-caps-tracking)",
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
                              fontWeight: "var(--sa-font-weight-bold)",
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
