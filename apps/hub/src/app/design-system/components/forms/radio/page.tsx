import * as React from "react";
import { DocsTabs } from "@/components/design-system/docs-kit";
import type { Metadata } from "next";
import { RadioPlayground } from "./radio-playground";

export const metadata: Metadata = {
  title: "Radio - SAMAVESH Design System",
  description: "Radio buttons allow users to select exactly one mutually exclusive option from a list.",
};

export default function RadioPage(): React.JSX.Element {
    const h2Style: React.CSSProperties = { fontSize: "var(--sa-type-headline-2-size)", fontWeight: 600, margin: "0 0 var(--sa-stack-24) 0", color: "var(--sa-text-neutral-bolder)" };
  const proseStyle: React.CSSProperties = { color: "var(--sa-text-neutral-base)", fontSize: "var(--sa-type-body-1-size)", lineHeight: 1.6 };

  return (
    <article className="ds-prose" style={{ maxWidth: "800px", padding: "var(--sa-padding-40) var(--sa-padding-24)" }}>
      <header style={{ marginBottom: "var(--sa-stack-40)" }}>
        <h1 style={{ fontSize: "var(--sa-type-headline-1-size)", margin: "0 0 var(--sa-stack-16) 0" }}>Radio</h1>
        <p className="ds-lead" style={{ fontSize: "var(--sa-type-headline-3-size)", color: "var(--sa-text-neutral-subtle)" }}>
          Radio buttons allow users to select exactly one mutually exclusive option from a list of two or more options.
        </p>
      </header>

      <RadioPlayground />

      
      <DocsTabs
        tabs={[
          {
            id: "design",
            label: "Design",
            content: (
              <div className="ds-prose">
                <section style={{ marginBottom: "var(--sa-section-48)" }}>
        <h2 id="usage" style={h2Style}>1. Usage</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--sa-inline-24)", marginTop: "var(--sa-stack-24)" }}>
          <UseCard tone="do" title="When to use">
            <li>When users must select exactly one option from a list.</li>
            <li>When you have fewer than 6 options.</li>
            <li>For emphasizing a choice using the <code>card</code> variant.</li>
          </UseCard>
          <UseCard tone="dont" title="When NOT to use">
            <li>When a user can select multiple options (use Checkboxes).</li>
            <li>When you have 6 or more options (use a Select dropdown to save vertical space).</li>
          </UseCard>
        </div>
      </section>
<section style={{ marginBottom: "var(--sa-section-48)" }}>
        <h2 id="features" style={h2Style}>2. Features & Accessibility</h2>
        <ul style={{ ...proseStyle, paddingLeft: "var(--sa-padding-20)", marginTop: "var(--sa-stack-16)", lineHeight: 1.8 }}>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Radio Cards:</strong> The <code>variant=&quot;card&quot;</code> prop renders the radio as a large, tappable block with an optional description. This is highly recommended for mobile-first portal flows where options represent major pathways.</li>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Native Grouping:</strong> Because it uses an underlying <code>&lt;input type=&quot;radio&quot;&gt;</code>, the browser handles standard arrow-key navigation between options when the <code>name</code> prop matches.</li>
        </ul>
      </section>
<section style={{ marginBottom: "var(--sa-section-48)" }}>
        <h2 id="code" style={h2Style}>3. Code Example</h2>
        <CodeBlock>{`import { Radio } from "@mosje/design-system";

<Radio
  variant="card"
  name="payment_method"
  value="upi"
  checked={method === "upi"}
  onChange={() => setMethod("upi")}
  label="UPI (Unified Payments Interface)"
  description="Pay instantly using any UPI app."
/>`}</CodeBlock>
      </section>

              </div>
            )
          },
          {
            id: "develop",
            label: "Develop",
            content: (
              <div className="ds-prose">
                
              </div>
            )
          },
          {
            id: "accessibility",
            label: "Accessibility",
            content: (
              <div className="ds-prose">
                
              </div>
            )
          }
        ]}
      />

    </article>
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
