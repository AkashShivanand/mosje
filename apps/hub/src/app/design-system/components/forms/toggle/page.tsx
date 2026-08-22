import * as React from "react";
import type { Metadata } from "next";
import { TogglePlayground } from "./toggle-playground";

export const metadata: Metadata = {
  title: "Toggle - SAMAVESH Design System",
  description: "Toggles are digital switches that immediately turn a setting on or off.",
};

export default function TogglePage(): React.JSX.Element {
  const sectionStyle: React.CSSProperties = { marginTop: "var(--sa-stack-48)", paddingTop: "var(--sa-stack-48)", borderTop: "1px solid var(--sa-border-neutral-subtle)" };
  const h2Style: React.CSSProperties = { fontSize: "var(--sa-type-headline-2-size)", fontWeight: 600, margin: "0 0 var(--sa-stack-24) 0", color: "var(--sa-text-neutral-bolder)" };
  const proseStyle: React.CSSProperties = { color: "var(--sa-text-neutral-base)", fontSize: "var(--sa-type-body-1-size)", lineHeight: 1.6 };

  return (
    <main className="ds-prose" style={{ maxWidth: "800px", padding: "var(--sa-padding-40) var(--sa-padding-24)" }}>
      <header style={{ marginBottom: "var(--sa-stack-40)" }}>
        <h1 style={{ fontSize: "var(--sa-type-headline-1-size)", margin: "0 0 var(--sa-stack-16) 0" }}>Toggle</h1>
        <p className="ds-lead" style={{ fontSize: "var(--sa-type-headline-3-size)", color: "var(--sa-text-neutral-subtle)" }}>
          Toggles are digital switches that immediately turn a setting on or off. They are best used for preferences and configurations.
        </p>
      </header>

      <TogglePlayground />

      <section style={sectionStyle}>
        <h2 id="usage" style={h2Style}>1. Usage</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--sa-inline-24)", marginTop: "var(--sa-stack-24)" }}>
          <UseCard tone="do" title="When to use">
            <li>For settings that take effect immediately without requiring a &quot;Save&quot; button.</li>
            <li>For boolean settings in a list or table (e.g. enabling a user account).</li>
          </UseCard>
          <UseCard tone="dont" title="When NOT to use">
            <li>Inside a long form that requires a final &quot;Submit&quot; button (use Checkboxes instead).</li>
            <li>When the user is agreeing to terms and conditions.</li>
          </UseCard>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 id="features" style={h2Style}>2. Features & Accessibility</h2>
        <ul style={{ ...proseStyle, paddingLeft: "var(--sa-padding-20)", marginTop: "var(--sa-stack-16)", lineHeight: 1.8 }}>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Role Switch:</strong> Under the hood, this uses an <code>&lt;input type=&quot;checkbox&quot; role=&quot;switch&quot;&gt;</code>. This explicitly tells screen readers that the element operates as an instant toggle rather than a queued form input.</li>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Sizes:</strong> Supports <code>default</code> and <code>small</code> sizes. Use <code>small</code> only when placing toggles inside dense data tables or lists.</li>
        </ul>
      </section>

      <section style={sectionStyle}>
        <h2 id="code" style={h2Style}>3. Code Example</h2>
        <CodeBlock>{`import { Toggle } from "@mosje/design-system";

<Toggle
  checked={isMfaEnabled}
  onChange={(e) => enableMfa(e.target.checked)}
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
