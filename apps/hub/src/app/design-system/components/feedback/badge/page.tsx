import * as React from "react";
import type { Metadata } from "next";
import { BadgePlayground } from "./badge-playground";
import { Playground } from "@/components/design-system/playground";
import { PropsTable, DoDont, A11yChecklist, Callout, StatusBadge } from "@/components/design-system/docs-kit";
import { DocsTabs } from "@/components/design-system/docs-kit";

import { buttonClasses } from "@mosje/design-system";
import { figmaUrl, FIGMA_NODES } from "@/lib/design-system/figma";

export const metadata: Metadata = {
  title: "Badge",
  description:
    "Badge is a small label indicating status, count, or category — a tonal pill in semantic colours (success, warning, danger, info) with two sizes.",
};

const h2Style: React.CSSProperties = {
  fontSize: "var(--sa-type-headline-2-size)",
  fontWeight: 600,
  marginBottom: "var(--sa-stack-16)",
  scrollMarginTop: "var(--sa-section-48)",
};
const leadStyle: React.CSSProperties = {
  fontSize: "var(--sa-type-body-1-size)",
  color: "var(--sa-text-neutral-subtle)",
  lineHeight: "var(--sa-type-body-1-lh)",
  maxWidth: "64ch",
  marginBottom: "var(--sa-stack-16)",
};

export default function BadgePage(): React.JSX.Element {
  return (
    <>
      {/* ── Header ── */}
      <div style={{ marginBottom: "var(--sa-stack-32)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--sa-stack-12)", marginBottom: "var(--sa-stack-12)" }}>
          <h1 style={{ fontSize: "var(--sa-type-display-1-size)", fontWeight: 500, lineHeight: 1.1 }}>Badge</h1>
          <StatusBadge status="Stable" />
        </div>
        <p style={{ fontSize: "var(--sa-type-headline-2-size)", fontWeight: 400, color: "var(--sa-color-text-default)", maxWidth: "60ch", lineHeight: 1.5 }}>
          A small label that indicates a status, count, or category.
        </p>
        <div style={{ marginTop: "var(--sa-stack-16)" }}>
          <a className={buttonClasses("primary", "outlined", "md")} href={figmaUrl(FIGMA_NODES.badges)} target="_blank" rel="noopener noreferrer">
            View in Figma <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>

      {/* ── Overview ── */}
      
      <DocsTabs
        tabs={[
          {
            id: "design",
            label: "Design",
            content: (
              <div className="ds-prose">
                <section style={{ marginBottom: "var(--sa-section-48)" }}>
        <h2 id="overview" style={h2Style}>Overview</h2>
        <p style={leadStyle}>
          A <strong>Badge</strong> is a compact, tonal pill used to annotate something with a
          status (&ldquo;Approved&rdquo;, &ldquo;Pending&rdquo;), a count (&ldquo;12 new&rdquo;), or
          a category tag. It carries colour meaning but is <em>not</em> interactive — it never acts
          as a button or link.
        </p>
        <p style={leadStyle}>
          The semantic <code>status</code> prop drives a tonal background plus readable text:{" "}
          <code>neutral</code> (default), <code>success</code>, <code>warning</code>,{" "}
          <code>danger</code>, and <code>primary</code> (info).
        </p>
      </section>
<section style={{ marginBottom: "var(--sa-section-48)" }}>
        <h2 id="playground" style={h2Style}>Playground</h2>
        <p style={leadStyle}>
          Try each semantic status and the two sizes. Edit the label inline to see how the pill
          adapts.
        </p>
        <BadgePlayground />
      </section>
<section style={{ marginBottom: "var(--sa-section-48)" }}>
        <h2 id="variants" style={h2Style}>Status variants</h2>
        <p style={leadStyle}>
          Five semantic roles. Map system states to the matching colour: <code>info</code> uses the{" "}
          <code>primary</code> role; <code>default</code> uses <code>neutral</code>.
        </p>
        <Playground
          code={`<div style={{ display: "flex", gap: "var(--sa-inline-8)", flexWrap: "wrap", alignItems: "center" }}>
  <Badge status="neutral">Default</Badge>
  <Badge status="success">Success</Badge>
  <Badge status="warning">Warning</Badge>
  <Badge status="danger">Danger</Badge>
  <Badge status="primary">Info</Badge>
</div>`}
        />
      </section>
<section style={{ marginBottom: "var(--sa-section-48)" }}>
        <h2 id="sizes" style={h2Style}>Sizes</h2>
        <p style={leadStyle}>
          Two sizes are available. <code>sm</code> (default) suits inline annotations and table
          cells; <code>lg</code> reads better as a standalone status next to a heading.
        </p>
        <Playground
          code={`<div style={{ display: "flex", gap: "var(--sa-inline-12)", alignItems: "center" }}>
  <Badge status="success" size="sm">Small</Badge>
  <Badge status="success" size="lg">Large</Badge>
</div>`}
        />
      </section>
<section style={{ marginBottom: "var(--sa-section-48)" }}>
        <h2 id="guidelines" style={h2Style}>Do &amp; Don&apos;t</h2>
        <DoDont
          cards={[
            {
              type: "do",
              label: "Use status badges to surface system states such as Approved, Pending, or Rejected.",
              preview: (
                <div style={{ display: "flex", gap: "var(--sa-inline-8)", flexWrap: "wrap", alignItems: "center" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", padding: "var(--sa-padding-2) var(--sa-stack-12)", borderRadius: "var(--sa-shape-full)", background: "var(--sa-color-status-successTonal)", color: "var(--sa-color-status-success)", fontSize: "var(--sa-type-body-3-size)", fontWeight: 600 }}>Approved</span>
                  <span style={{ display: "inline-flex", alignItems: "center", padding: "var(--sa-padding-2) var(--sa-stack-12)", borderRadius: "var(--sa-shape-full)", background: "var(--sa-color-status-warningTonal)", color: "var(--sa-color-text-default)", fontSize: "var(--sa-type-body-3-size)", fontWeight: 600 }}>Pending</span>
                  <span style={{ display: "inline-flex", alignItems: "center", padding: "var(--sa-padding-2) var(--sa-stack-12)", borderRadius: "var(--sa-shape-full)", background: "var(--sa-color-status-dangerTonal)", color: "var(--sa-color-status-danger)", fontSize: "var(--sa-type-body-3-size)", fontWeight: 600 }}>Rejected</span>
                </div>
              ),
            },
            {
              type: "dont",
              label: "Don't use a badge as an action. It isn't a button or a link — use Button or Chip for anything clickable.",
              preview: (
                <span style={{ display: "inline-flex", alignItems: "center", gap: "var(--sa-inline-4)", padding: "var(--sa-padding-2) var(--sa-padding-12)", borderRadius: "var(--sa-shape-full)", background: "var(--sa-color-action-primary-tonal)", color: "var(--sa-bg-brand-primary-bolder)", fontSize: "var(--sa-type-body-3-size)", fontWeight: 600, cursor: "pointer", border: "2px solid var(--sa-color-status-danger)" }}>
                  Click me →
                </span>
              ),
            },
          ]}
        />
      </section>

              </div>
            )
          },
          {
            id: "develop",
            label: "Develop",
            content: (
              <div className="ds-prose">
                <section style={{ marginBottom: "var(--sa-section-48)" }}>
        <h2 id="api" style={h2Style}>API</h2>
        <PropsTable
          props={[
            { name: "status", type: '"primary" | "success" | "danger" | "warning" | "neutral"', default: '"neutral"', description: "Semantic colour role driving the tonal background and text. Use primary for an info badge and neutral for a default badge." },
            { name: "size", type: '"sm" | "lg"', default: '"sm"', description: "Pill size. sm for inline use, lg for standalone status." },
            { name: "children", type: "ReactNode", required: true, description: "The badge label. Keep it short and descriptive of the state." },
            { name: "aria-label", type: "string", description: "Describe the status when colour carries meaning and the visible text is sparse." },
            { name: "className", type: "string", description: "Additional classes merged onto the root <span>." },
            { name: "...rest", type: "HTMLAttributes<HTMLSpanElement>", description: "All standard span props are forwarded." },
          ]}
        />
      </section>

              </div>
            )
          },
          {
            id: "accessibility",
            label: "Accessibility",
            content: (
              <div className="ds-prose">
                <section style={{ marginBottom: "var(--sa-section-48)" }}>
        <h2 id="accessibility" style={h2Style}>Accessibility</h2>
        <Callout type="warning" title="Don't rely on colour alone">
          A green vs. red badge is invisible to colour-blind and screen-reader users if colour is
          the only signal. The <strong>text label is the meaning</strong> — keep it descriptive
          (&ldquo;Approved&rdquo;, not just a coloured dot). When a badge conveys status through
          colour with little or no text, add an <code>aria-label</code> describing the state.
        </Callout>
        <div style={{ marginTop: "var(--sa-padding-20)" }}>
          <A11yChecklist
            items={[
              { criterion: "Meaning is not colour-only", level: "A", description: "WCAG 1.4.1 — colour must never be the sole way status is conveyed. Pair colour with a clear text label." },
              { criterion: "aria-label on colour-coded badges", level: "A", description: "If a badge uses colour with minimal text (e.g. a count or icon-only state), add aria-label='Status: Rejected' so it's announced." },
              { criterion: "Text contrast meets AA", level: "AA", description: "WCAG 1.4.3 — badge text must reach 4.5:1 against its tonal background. The built-in status tints are tuned to pass." },
              { criterion: "Not focusable / not interactive", level: "A", description: "A badge is a label, not a control. It has no tab stop and no click handler — use Button or Chip for actions." },
            ]}
          />
        </div>
      </section>

              </div>
            )
          }
        ]}
      />

    </>
  );
}
