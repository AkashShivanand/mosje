import * as React from "react";
import type { Metadata } from "next";
import { FormSectionPlayground } from "./form-section-playground";
import { Playground } from "@/components/design-system/playground";
import { PropsTable, DoDont, A11yChecklist } from "@/components/design-system/docs-kit";

export const metadata: Metadata = {
  title: "FormSection - SAMAVESH Design System",
  description:
    "A titled card wrapping a responsive field grid.",
};

export default function FormSectionPage(): React.JSX.Element {
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
          FormSection
        </h1>
        <p className="ds-lead" style={leadStyle}>
          The shared form-layout primitive: a surface card with a left-aligned section title over a responsive field grid.
        </p>
      </header>

      {/* ============ PLAYGROUND ============ */}
      <section style={sectionStyle}>
        <h2 id="playground" style={h2Style}>Playground</h2>
        <p style={proseStyle}>
          Adjust the column count to see how the internal grid adapts. Note that on smaller screens, it will automatically collapse to a single column.
        </p>
        <div style={{ marginTop: "var(--sa-stack-24)" }}>
          <FormSectionPlayground />
        </div>
      </section>

      {/* ============ 1. USAGE ============ */}
      <section style={sectionStyle}>
        <h2 id="usage" style={h2Style}>1. Usage</h2>
        <p style={proseStyle}>
          Use <code>FormSection</code> to group related form fields logically (e.g., "Personal Details", "Address", "Banking Information"). This is the standard way to build forms across the SAMAVESH estate, ensuring a consistent rhythm and responsive behaviour.
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
                label: "Group conceptually related fields together under a clear, descriptive title.",
                preview: null,
              },
              {
                type: "dont",
                label: "Don't use FormSection for complex, non-grid layouts like data tables. Use FormCard instead.",
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
          code={`<FormSection title="Address Details" columns={2}>
  <FormField label="Street Address">
    {(props) => <Input {...props} />}
  </FormField>
  <FormField label="City">
    {(props) => <Input {...props} />}
  </FormField>
  <FormField label="State">
    {(props) => <Select {...props} options={[{ label: "Delhi", value: "DL" }]} />}
  </FormField>
  <FormField label="PIN Code">
    {(props) => <Input {...props} />}
  </FormField>
</FormSection>`}
        />
      </section>

      {/* ============ 3. ACCESSIBILITY ============ */}
      <section style={sectionStyle}>
        <h2 id="accessibility" style={h2Style}>3. Accessibility (A11y)</h2>
        <ul style={{ ...proseStyle, paddingLeft: "var(--sa-padding-20)", marginTop: "var(--sa-stack-16)", lineHeight: 1.8 }}>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Semantic Section:</strong> Uses the native <code>&lt;section&gt;</code> element, creating a structural landmark for assistive tech.</li>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>aria-labelledby:</strong> Automatically links the section to its internal <code>&lt;h2&gt;</code> title, so screen readers can easily identify the grouping.</li>
        </ul>
      </section>

      {/* ============ 4. API ============ */}
      <section style={sectionStyle}>
        <h2 id="api" style={h2Style}>4. API Reference</h2>
        <PropsTable
          props={[
            { name: "title", type: "ReactNode", required: true, description: "Section heading." },
            { name: "description", type: "ReactNode", description: "Optional sub-heading below the title." },
            { name: "columns", type: "1 | 2 | 3", default: "3", description: "The number of columns in the responsive field grid." },
            { name: "children", type: "ReactNode", required: true, description: "The form fields to render within the grid." },
            { name: "className", type: "string", description: "Additional classes merged onto the section element." },
          ]}
        />
      </section>
    </main>
  );
}
