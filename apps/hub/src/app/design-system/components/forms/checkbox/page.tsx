import * as React from "react";
import type { Metadata } from "next";
import { CheckboxPlayground } from "./checkbox-playground";

export const metadata: Metadata = {
  title: "Checkbox - SAMAVESH Design System",
  description: "Checkboxes allow users to select one or more items from a set, or to turn an option on or off.",
};

export default function CheckboxPage(): React.JSX.Element {
  const sectionStyle: React.CSSProperties = { marginTop: "var(--sa-stack-48)", paddingTop: "var(--sa-stack-48)", borderTop: "1px solid var(--sa-border-neutral-subtle)" };
  const h2Style: React.CSSProperties = { fontSize: "var(--sa-type-headline-2-size)", fontWeight: 600, margin: "0 0 var(--sa-stack-24) 0", color: "var(--sa-text-neutral-bolder)" };
  const proseStyle: React.CSSProperties = { color: "var(--sa-text-neutral-base)", fontSize: "var(--sa-type-body-1-size)", lineHeight: 1.6 };

  return (
    <main className="ds-prose" style={{ maxWidth: "800px", padding: "var(--sa-padding-40) var(--sa-padding-24)" }}>
      <header style={{ marginBottom: "var(--sa-stack-40)" }}>
        <h1 style={{ fontSize: "var(--sa-type-headline-1-size)", margin: "0 0 var(--sa-stack-16) 0" }}>Checkbox</h1>
        <p className="ds-lead" style={{ fontSize: "var(--sa-type-headline-3-size)", color: "var(--sa-text-neutral-subtle)" }}>
          Checkboxes allow users to select one or more items from a set. They can also be used to turn a single option on or off.
        </p>
      </header>

      <CheckboxPlayground />

      <section style={sectionStyle}>
        <h2 id="usage" style={h2Style}>1. Usage</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--sa-inline-24)", marginTop: "var(--sa-stack-24)" }}>
          <UseCard tone="do" title="When to use">
            <li>When a user can select any number of choices from a list.</li>
            <li>For boolean settings (e.g., &quot;I agree to the terms&quot;).</li>
            <li>For parent-child grouped selections (using indeterminate state).</li>
          </UseCard>
          <UseCard tone="dont" title="When NOT to use">
            <li>When only one option can be selected (use a Radio group).</li>
            <li>When toggling a feature that immediately takes effect (use a Toggle).</li>
          </UseCard>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 id="features" style={h2Style}>2. Features & Accessibility</h2>
        <ul style={{ ...proseStyle, paddingLeft: "var(--sa-padding-20)", marginTop: "var(--sa-stack-16)", lineHeight: 1.8 }}>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Indeterminate State:</strong> Supports the mixed/indeterminate state natively, which is crucial for &quot;Select All&quot; parent checkboxes when only some children are selected.</li>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Native Semantics:</strong> It renders a visually-hidden <code>&lt;input type=&quot;checkbox&quot;&gt;</code> over a custom styled SVG box, ensuring standard keyboard navigation (Spacebar to toggle) and perfect screen reader support.</li>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Hit Area:</strong> The clickable label is inextricably linked to the input via <code>htmlFor</code>, vastly increasing the accessible tap target size.</li>
        </ul>
      </section>

      <section style={sectionStyle}>
        <h2 id="code" style={h2Style}>3. Code Example</h2>
        <CodeBlock>{`import { Checkbox } from "@mosje/design-system";

<Checkbox
  label="I have read and agree to the terms"
  checked={agreed}
  onChange={(e) => setAgreed(e.target.checked)}
/>`}</CodeBlock>
      </section>
    </main>
  );
}

function UseCard({ tone, title, children }: { tone: "do" | "dont"; title: string; children: React.ReactNode }) {
  const accent = tone === "do" ? "var(--sa-color-status-success)" : "var(--sa-color-status-danger)";
  return (
    <div style={{ border: "1px solid var(--sa-border-neutral-subtle)", borderTop: `3px solid ${accent}`, borderRadius: "var(--sa-shape-8)", padding: "var(--sa-padding-20)", background: "var(--sa-bg-neutral-base)" }}>
      <h3 style={{ margin: 0, marginBottom: "var(--sa-stack-12)", fontSize: "var(--sa-type-headline-2-size)", fontWeight: 600, color: "var(--sa-text-neutral-base)" }}>{title}</h3>
      <ul style={{ margin: 0, paddingLeft: "var(--sa-padding-20)", color: "var(--sa-text-neutral-subtle)", fontSize: "var(--sa-type-body-2-size)", lineHeight: 1.8 }}>{children}</ul>
    </div>
  );
}
function CodeBlock({ children }: { children: string }) {
  return <pre style={{ background: "var(--sa-bg-neutral-subtler)", border: "1px solid var(--sa-border-neutral-subtle)", borderRadius: "var(--sa-shape-8)", padding: "var(--sa-padding-16)", overflowX: "auto", fontSize: "var(--sa-type-body-2-size)", lineHeight: 1.6, color: "var(--sa-text-neutral-base)", marginTop: "var(--sa-stack-16)" }}><code style={{ fontFamily: "var(--sa-font-mono)" }}>{children}</code></pre>;
}
