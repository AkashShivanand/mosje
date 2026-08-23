import * as React from "react";
import type { Metadata } from "next";
import { SelectPlayground } from "./select-playground";
import { Playground } from "@/components/design-system/playground";
import { PropsTable, DoDont } from "@/components/design-system/docs-kit";
import { DocsTabs } from "@/components/design-system/docs-kit";


export const metadata: Metadata = {
  title: "Select - SAMAVESH Design System",
  description:
    "A native dropdown field that allows users to pick one option from a list.",
};

export default function SelectPage(): React.JSX.Element {
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
          Select
        </h1>
        <p className="ds-lead" style={leadStyle}>
          A native dropdown component providing a standard way for users to pick a single value from a list of options. 
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
          Interact with the Select component and toggle its invalid and disabled states.
        </p>
        <div style={{ marginTop: "var(--sa-stack-24)" }}>
          <SelectPlayground />
        </div>
      </section>
<section style={{ marginBottom: "var(--sa-section-48)" }}>
        <h2 id="usage" style={h2Style}>1. Usage</h2>
        <p style={proseStyle}>
          Always pair the Select with a <code>FormField</code> to provide a visible, accessible label, and to manage validation messages. The Select component uses a native <code>&lt;select&gt;</code> element to ensure perfect accessibility across all devices and screen readers.
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
                label: "Use Select when you have between 5 and 15 options. For fewer options, use a Radio group.",
                preview: null,
              },
              {
                type: "dont",
                label: "Don't use Select for very long lists (e.g. countries of the world) without offering a searchable Combobox or Search.",
                preview: null,
              },
            ]}
          />
        </div>
      </section>
<section style={{ marginBottom: "var(--sa-section-48)" }}>
        <h2 id="code-example" style={h2Style}>2. Code Example</h2>
        <p style={proseStyle}>
          You can provide an array of options to the <code>options</code> prop, or pass standard <code>&lt;option&gt;</code> elements as children.
        </p>
        <Playground
          code={`<FormField label="Document Type" required>
  <Select 
    placeholder="Choose a document..."
    options={[
      { label: "Aadhaar Card", value: "aadhaar" },
      { label: "PAN Card", value: "pan" },
      { label: "Passport", value: "passport" },
      { label: "Voter ID", value: "voter_id", disabled: true }
    ]} 
  />
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
            { name: "invalid", type: "boolean", default: "false", description: "Applies error styling and sets aria-invalid." },
            { name: "options", type: "{ label: string; value: string; disabled?: boolean }[]", description: "Convenience prop for passing an array of options instead of using <option> children." },
            { name: "placeholder", type: "string", description: "Text displayed when no option is selected (rendered as a disabled first option)." },
            { name: "children", type: "ReactNode", description: "Native <option> elements, used if the 'options' prop is omitted." },
            { name: "...rest", type: "SelectHTMLAttributes<HTMLSelectElement>", description: "All standard select attributes (e.g. value, onChange, disabled)." },
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
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Native HTML Element:</strong> Because this uses a native <code>&lt;select&gt;</code>, it benefits from built-in mobile OS UI and robust screen reader support.</li>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>aria-invalid:</strong> When the <code>invalid</code> prop is true, it sets <code>aria-invalid=&quot;true&quot;</code>, alerting screen readers to the validation error.</li>
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
