import * as React from "react";
import type { Metadata } from "next";
import { TextareaPlayground } from "./textarea-playground";
import { Playground } from "@/components/design-system/playground";
import { PropsTable, DoDont } from "@/components/design-system/docs-kit";

export const metadata: Metadata = {
  title: "Textarea - SAMAVESH Design System",
  description:
    "A multi-line text input field used for long-form content.",
};

export default function TextareaPage(): React.JSX.Element {
  const sectionStyle: React.CSSProperties = {
    marginTop: "var(--sa-stack-48)",
    paddingTop: "var(--sa-stack-48)",
    borderTop: "1px solid var(--sa-border-neutral-subtle)",
  };
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
        maxWidth: "800px",
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
          Textarea
        </h1>
        <p className="ds-lead" style={leadStyle}>
          A native, vertically resizable multi-line text input field used for collecting long-form content like descriptions or comments.
        </p>
      </header>

      {/* ============ PLAYGROUND ============ */}
      <section style={sectionStyle}>
        <h2 id="playground" style={h2Style}>Playground</h2>
        <p style={proseStyle}>
          Interact with the Textarea to see its focus states and adjust its height using the native resize handle.
        </p>
        <div style={{ marginTop: "var(--sa-stack-24)" }}>
          <TextareaPlayground />
        </div>
      </section>

      {/* ============ 1. USAGE ============ */}
      <section style={sectionStyle}>
        <h2 id="usage" style={h2Style}>1. Usage</h2>
        <p style={proseStyle}>
          Like all form inputs, the Textarea should be wrapped in a <code>FormField</code> to provide a standard label, hint text, and error messaging. It is vertically resizable by default, matching browser conventions.
        </p>
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
                label: "Set an appropriate initial number of `rows` so users can see a reasonable amount of text before needing to scroll or resize.",
                preview: null,
              },
              {
                type: "dont",
                label: "Don't use Textarea for short, single-line data like an email address or a name. Use the standard Input component instead.",
                preview: null,
              },
            ]}
          />
        </div>
      </section>

      {/* ============ 2. CODE EXAMPLE ============ */}
      <section style={sectionStyle}>
        <h2 id="code-example" style={h2Style}>2. Code Example</h2>
        <Playground
          code={`<FormField 
  label="Additional Comments" 
  hint="Please provide any other information that might be helpful."
>
  <Textarea 
    rows={5} 
    placeholder="Write your comments here..." 
  />
</FormField>`}
        />
      </section>

      {/* ============ 3. ACCESSIBILITY ============ */}
      <section style={sectionStyle}>
        <h2 id="accessibility" style={h2Style}>3. Accessibility (A11y)</h2>
        <ul style={{ ...proseStyle, paddingLeft: "var(--sa-padding-20)", marginTop: "var(--sa-stack-16)", lineHeight: 1.8 }}>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>aria-invalid:</strong> When the <code>invalid</code> prop is true, it sets <code>aria-invalid=&quot;true&quot;</code>, alerting screen readers to the validation error.</li>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Focus Ring:</strong> Uses the global SAMAVESH focus ring token on keyboard focus, ensuring WCAG AA compliant focus visibility.</li>
        </ul>
      </section>

      {/* ============ 4. API ============ */}
      <section style={sectionStyle}>
        <h2 id="api" style={h2Style}>4. API Reference</h2>
        <PropsTable
          props={[
            { name: "invalid", type: "boolean", default: "false", description: "Applies error styling and sets aria-invalid." },
            { name: "rows", type: "number", default: "4", description: "The initial number of visible text lines." },
            { name: "...rest", type: "TextareaHTMLAttributes<HTMLTextAreaElement>", description: "All standard textarea attributes (e.g. placeholder, maxLength, disabled)." },
          ]}
        />
      </section>
    </main>
  );
}
