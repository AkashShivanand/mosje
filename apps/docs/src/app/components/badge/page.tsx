import * as React from "react";
import type { Metadata } from "next";
import { BadgePlayground } from "./badge-playground";
import { Playground } from "@/components/playground";
import { PropsTable, DoDont, A11yChecklist, Callout, StatusBadge } from "@/components/docs-kit";

export const metadata: Metadata = {
  title: "Badge",
  description:
    "Badge is a small label indicating status, count, or category — a tonal pill in semantic colours (success, warning, danger, info) with two sizes.",
};

const sectionStyle: React.CSSProperties = { marginBottom: "var(--ds-space-12)" };
const h2Style: React.CSSProperties = {
  fontSize: "var(--ds-text-title-1)",
  fontWeight: 600,
  marginBottom: "var(--ds-space-4)",
  scrollMarginTop: "var(--ds-space-12)",
};
const leadStyle: React.CSSProperties = {
  fontSize: "var(--ds-text-body-1)",
  color: "var(--ds-ink-muted)",
  lineHeight: "var(--ds-leading-body-1)",
  maxWidth: "64ch",
  marginBottom: "var(--ds-space-4)",
};

export default function BadgePage(): React.JSX.Element {
  return (
    <>
      {/* ── Header ── */}
      <div style={{ marginBottom: "var(--ds-space-8)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--ds-space-3)", marginBottom: "var(--ds-space-3)" }}>
          <h1 style={{ fontSize: "var(--ds-text-display)", fontWeight: 500, lineHeight: 1.1 }}>Badge</h1>
          <StatusBadge status="Stable" />
        </div>
        <p style={{ fontSize: "var(--ds-text-title-1)", fontWeight: 400, color: "var(--ds-ink)", maxWidth: "60ch", lineHeight: 1.5 }}>
          A small label that indicates a status, count, or category.
        </p>
      </div>

      {/* ── Overview ── */}
      <section style={sectionStyle}>
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

      {/* ── Playground ── */}
      <section style={sectionStyle}>
        <h2 id="playground" style={h2Style}>Playground</h2>
        <p style={leadStyle}>
          Try each semantic status and the two sizes. Edit the label inline to see how the pill
          adapts.
        </p>
        <BadgePlayground />
      </section>

      {/* ── Status variants ── */}
      <section style={sectionStyle}>
        <h2 id="variants" style={h2Style}>Status variants</h2>
        <p style={leadStyle}>
          Five semantic roles. Map system states to the matching colour: <code>info</code> uses the{" "}
          <code>primary</code> role; <code>default</code> uses <code>neutral</code>.
        </p>
        <Playground
          code={`<div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
  <Badge status="neutral">Default</Badge>
  <Badge status="success">Success</Badge>
  <Badge status="warning">Warning</Badge>
  <Badge status="danger">Danger</Badge>
  <Badge status="primary">Info</Badge>
</div>`}
        />
      </section>

      {/* ── Sizes ── */}
      <section style={sectionStyle}>
        <h2 id="sizes" style={h2Style}>Sizes</h2>
        <p style={leadStyle}>
          Two sizes are available. <code>sm</code> (default) suits inline annotations and table
          cells; <code>lg</code> reads better as a standalone status next to a heading.
        </p>
        <Playground
          code={`<div style={{ display: "flex", gap: 12, alignItems: "center" }}>
  <Badge status="success" size="sm">Small</Badge>
  <Badge status="success" size="lg">Large</Badge>
</div>`}
        />
      </section>

      {/* ── Do / Don't ── */}
      <section style={sectionStyle}>
        <h2 id="guidelines" style={h2Style}>Do &amp; Don&apos;t</h2>
        <DoDont
          cards={[
            {
              type: "do",
              label: "Use status badges to surface system states such as Approved, Pending, or Rejected.",
              preview: (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 10px", borderRadius: 999, background: "#dcfce7", color: "#166534", fontSize: "var(--ds-text-body-3)", fontWeight: 600 }}>Approved</span>
                  <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 10px", borderRadius: 999, background: "#fef9c3", color: "#854d0e", fontSize: "var(--ds-text-body-3)", fontWeight: 600 }}>Pending</span>
                  <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 10px", borderRadius: 999, background: "#fee2e2", color: "#991b1b", fontSize: "var(--ds-text-body-3)", fontWeight: 600 }}>Rejected</span>
                </div>
              ),
            },
            {
              type: "dont",
              label: "Don't use a badge as an action. It isn't a button or a link — use Button or Chip for anything clickable.",
              preview: (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 10px", borderRadius: 999, background: "var(--ds-primary-tonal)", color: "var(--ds-primary)", fontSize: "var(--ds-text-body-3)", fontWeight: 600, cursor: "pointer", border: "2px solid var(--ds-danger)" }}>
                  Click me →
                </span>
              ),
            },
          ]}
        />
      </section>

      {/* ── Accessibility ── */}
      <section style={sectionStyle}>
        <h2 id="accessibility" style={h2Style}>Accessibility</h2>
        <Callout type="warning" title="Don't rely on colour alone">
          A green vs. red badge is invisible to colour-blind and screen-reader users if colour is
          the only signal. The <strong>text label is the meaning</strong> — keep it descriptive
          (&ldquo;Approved&rdquo;, not just a coloured dot). When a badge conveys status through
          colour with little or no text, add an <code>aria-label</code> describing the state.
        </Callout>
        <div style={{ marginTop: "var(--ds-space-5)" }}>
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

      {/* ── API ── */}
      <section style={sectionStyle}>
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
    </>
  );
}
