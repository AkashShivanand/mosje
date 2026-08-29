import * as React from "react";
import type { Metadata } from "next";
import { LabelPlayground } from "./label-playground";
import { Playground } from "@/components/design-system/playground";
import { PropsTable, DoDont } from "@/components/design-system/docs-kit";
import { DocsTabs } from "@/components/design-system/docs-kit";


export const metadata: Metadata = {
  title: "Label - SAMAVESH Design System",
  description:
    "A standalone accessible label for form controls when you cannot use the FormField wrapper.",
};

export default function LabelPage(): React.JSX.Element {
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
    <article
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
          Label
        </h1>
        <p className="ds-lead" style={leadStyle}>
          A standalone <code>&lt;label&gt;</code> element. Used when hand-wiring form controls outside of the standard FormField component layout.
        </p>
      </header>

      {/* ============ PLAYGROUND ============ */}
      
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
          Toggle the required marker and the inline hint. Notice how the visual styling matches exactly what you see in the FormField component.
        </p>
        <div style={{ marginTop: "var(--sa-stack-24)" }}>
          <LabelPlayground />
        </div>
      </section>
<section style={{ marginBottom: "var(--sa-section-48)" }}>
        <h2 id="usage" style={h2Style}>1. Usage</h2>
        <p style={proseStyle}>
          You should almost always use <code>FormField</code> instead of this component. Use the standalone Label only when building complex layouts where the FormField&apos;s internal DOM structure (label above input) isn&apos;t appropriate—like custom filter toolbars or inline form rows.
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
                label: "Always provide an 'htmlFor' prop that exactly matches the 'id' of the input you are labelling.",
                preview: null,
              },
              {
                type: "dont",
                label: "Don't use this if you can use FormField. Hand-wiring IDs and aria-describedby is prone to human error.",
                preview: null,
              },
            ]}
          />
        </div>
      </section>
<section style={{ marginBottom: "var(--sa-section-48)" }}>
        <h2 id="code-example" style={h2Style}>2. Code Example</h2>
        <Playground
          code={`<div style={{ display: "flex", alignItems: "center", gap: "var(--sa-stack-16)" }}>
  <Label htmlFor="custom-search" required hint="(Min 3 chars)">
    Search Query
  </Label>
  <Input id="custom-search" />
</div>`}
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
        <h2 id="api" style={h2Style}>4. API Reference</h2>
        <PropsTable
          props={[
            { name: "children", type: "ReactNode", required: true, description: "The primary label text." },
            { name: "htmlFor", type: "string", required: true, description: "The ID of the input element this label is associated with." },
            { name: "required", type: "boolean", default: "false", description: "Appends a visual red asterisk." },
            { name: "hint", type: "ReactNode", description: "Secondary text rendered inline after the label." },
            { name: "...rest", type: "LabelHTMLAttributes<HTMLLabelElement>", description: "All standard label attributes." },
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
        <h2 id="accessibility" style={h2Style}>3. Accessibility (A11y)</h2>
        <ul style={{ ...proseStyle, paddingLeft: "var(--sa-padding-20)", marginTop: "var(--sa-stack-16)", lineHeight: 1.8 }}>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Required Marker:</strong> The red asterisk rendered by the <code>required</code> prop has <code>aria-hidden=&quot;true&quot;</code>, so screen readers don&apos;t read out &quot;star&quot;.</li>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>htmlFor:</strong> Because this is just a thin wrapper around a native label, you are entirely responsible for correctly wiring the <code>htmlFor</code> attribute to the control.</li>
        </ul>
      </section>

              </div>
            )
          }
        ]}
      />

    </article>
  );
}
