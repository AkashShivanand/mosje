import * as React from "react";
import type { Metadata } from "next";
import { FormFieldPlayground } from "./form-field-playground";
import { Playground } from "@/components/design-system/playground";
import { PropsTable, DoDont } from "@/components/design-system/docs-kit";
import { DocsTabs } from "@/components/design-system/docs-kit";


export const metadata: Metadata = {
  title: "FormField - SAMAVESH Design System",
  description:
    "A structural molecule that wires a label, hint text, and error message to a form control.",
};

export default function FormFieldPage(): React.JSX.Element {
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
          FormField
        </h1>
        <p className="ds-lead" style={leadStyle}>
          A wrapper component that guarantees accessibility for inputs. It automatically wires a label, optional hint, and optional error message to its child control.
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
          Toggle the hints, errors, and required states to see how FormField updates the layout and accessibility attributes.
        </p>
        <div style={{ marginTop: "var(--sa-stack-24)" }}>
          <FormFieldPlayground />
        </div>
      </section>
<section style={{ marginBottom: "var(--sa-section-48)" }}>
        <h2 id="usage" style={h2Style}>1. Usage</h2>
        <p style={proseStyle}>
          You should wrap almost every input, select, and textarea in a <code>FormField</code>. It prevents common accessibility bugs by handling the <code>htmlFor</code>, <code>id</code>, and <code>aria-describedby</code> attributes internally via a render prop.
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
                label: "Pass the props from the render function directly onto your input control.",
                preview: null,
              },
              {
                type: "dont",
                label: "Don't hardcode IDs or manually wire up labels when using FormField. It does this automatically.",
                preview: null,
              },
            ]}
          />
        </div>
      </section>
<section style={{ marginBottom: "var(--sa-section-48)" }}>
        <h2 id="code-example" style={h2Style}>2. Code Example</h2>
        <p style={proseStyle}>
          The <code>FormField</code> component expects a function as its child, commonly known as a &quot;render prop&quot;. This function provides the necessary accessibility properties that must be spread onto the actual input element.
        </p>
        <Playground
          code={`<FormField 
  label="First Name" 
  required 
  error={hasError ? "First name is required" : undefined}
>
  {(props) => (
    <Input {...props} placeholder="e.g. John" />
  )}
</FormField>`}
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
            { name: "label", type: "ReactNode", required: true, description: "The visible field label." },
            { name: "children", type: "(props: FormFieldControlProps) => ReactNode", required: true, description: "Render prop receiving the wiring for the control." },
            { name: "hint", type: "ReactNode", description: "Helper text rendered below the label." },
            { name: "error", type: "ReactNode", description: "Error message. When set, renders the error state." },
            { name: "required", type: "boolean", default: "false", description: "Marks the field as required (adds a * marker)." },
            { name: "id", type: "string", description: "Optional explicit ID. Auto-generated if omitted." },
            { name: "className", type: "string", description: "Additional classes merged onto the wrapper div." },
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
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Automatic Linking:</strong> Generates a unique <code>id</code> for the input and links the <code>&lt;label&gt;</code> to it via <code>htmlFor</code>.</li>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Described By:</strong> Links the hint and error messages to the input using <code>aria-describedby</code>, so screen readers announce them when the input receives focus.</li>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Live Errors:</strong> The error message container has <code>role=&quot;alert&quot;</code>. When an error appears, it is immediately announced by assistive technologies.</li>
        </ul>
      </section>

              </div>
            )
          }
        ]}
      />

    </main>
  );
}
