import * as React from "react";
import type { Metadata } from "next";
import { FormCardPlayground } from "./form-card-playground";
import { Playground } from "@/components/design-system/playground";
import { PropsTable, DoDont } from "@/components/design-system/docs-kit";
import { DocsTabs } from "@/components/design-system/docs-kit";


export const metadata: Metadata = {
  title: "FormCard - SAMAVESH Design System",
  description:
    "A titled surface card that accepts arbitrary children, ensuring consistent header styling across complex layouts.",
};

export default function FormCardPage(): React.JSX.Element {
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
          FormCard
        </h1>
        <p className="ds-lead" style={leadStyle}>
          A titled surface card with a custom body. It provides the same section-title styling and chrome as <code>FormSection</code>, but allows for arbitrary children instead of a rigid field grid.
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
          Configure the FormCard&apos;s header layout, including descriptions and right-aligned actions.
        </p>
        <div style={{ marginTop: "var(--sa-stack-24)" }}>
          <FormCardPlayground />
        </div>
      </section>
<section style={{ marginBottom: "var(--sa-section-48)" }}>
        <h2 id="usage" style={h2Style}>1. Usage</h2>
        <p style={proseStyle}>
          Use <code>FormCard</code> for sections of a form or dashboard where the layout isn&apos;t a simple 1-, 2-, or 3-column grid of inputs. This includes data tables, repeating field groups, or mixed content sections. By using this component, every section header across the application stays visually identical.
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
                label: "Use FormCard when you need to render a custom layout or a data table within a form section.",
                preview: null,
              },
              {
                type: "dont",
                label: "Don't use FormCard if you just need a standard grid of form fields. Use FormSection instead.",
                preview: null,
              },
            ]}
          />
        </div>
      </section>
<section style={{ marginBottom: "var(--sa-section-48)" }}>
        <h2 id="code-example" style={h2Style}>2. Code Example</h2>
        <Playground
          code={`<FormCard 
  title="Uploaded Documents" 
  description="Ensure all documents are clearly legible."
  actions={<Button variant="ghost" size="sm">Add Document</Button>}
>
  <table className="ds-table">
    {/* Complex custom content goes here */}
    <tbody>
      <tr><td>Aadhaar Card.pdf</td></tr>
    </tbody>
  </table>
</FormCard>`}
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
            { name: "title", type: "ReactNode", required: true, description: "Section heading." },
            { name: "description", type: "ReactNode", description: "Optional sub-heading below the title." },
            { name: "required", type: "boolean", default: "false", description: "Appends the accessible required marker (*) to the title." },
            { name: "headingId", type: "string", description: "Explicit heading id. Auto-generated if omitted." },
            { name: "actions", type: "ReactNode", description: "Optional right-aligned controls in the header row." },
            { name: "children", type: "ReactNode", required: true, description: "The content of the card." },
            { name: "className", type: "string", description: "Additional classes merged onto the section element." },
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
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Semantic Section:</strong> The component wraps its content in a native <code>&lt;section&gt;</code> element, defining a clear landmark for screen readers.</li>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>aria-labelledby:</strong> The section is automatically labelled by its title (<code>&lt;h2&gt;</code>), establishing a strong accessible name for the region. You can pass a custom <code>headingId</code> if needed.</li>
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
