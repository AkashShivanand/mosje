import * as React from "react";
import type { Metadata } from "next";
import { AadhaarInputPlayground } from "./aadhaar-input-playground";
import { Playground } from "@/components/design-system/playground";
import { PropsTable, DoDont, Callout } from "@/components/design-system/docs-kit";

export const metadata: Metadata = {
  title: "AadhaarInput - SAMAVESH Design System",
  description:
    "An input specifically designed for collecting and securely masking Indian Aadhaar numbers.",
};

export default function AadhaarInputPage(): React.JSX.Element {
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
          AadhaarInput
        </h1>
        <p className="ds-lead" style={leadStyle}>
          An input tailored for 12-digit Aadhaar numbers. It formats the number into groups of four as the user types, validates it via Verhoeff checksum, and automatically masks the first 8 digits on blur for data privacy.
        </p>
      </header>

      <Callout title="Privacy & DPDP Act 2023" type="warning" style={{ marginBottom: "var(--sa-stack-32)" }}>
        Aadhaar numbers are sensitive personal data. UIDAI guidelines require masking the first 8 digits when displaying an Aadhaar number on screen. The `AadhaarInput` handles this automatically. Do not disable the `mask` prop without explicit authorization.
      </Callout>

      {/* ============ PLAYGROUND ============ */}
      <section style={sectionStyle}>
        <h2 id="playground" style={h2Style}>Playground</h2>
        <p style={proseStyle}>
          Type exactly 12 digits. Notice how spaces are inserted automatically. When you click outside the field (blur), the first 8 digits are masked. The internal state always holds the raw 12 digits.
        </p>
        <div style={{ marginTop: "var(--sa-stack-24)" }}>
          <AadhaarInputPlayground />
        </div>
      </section>

      {/* ============ 1. USAGE ============ */}
      <section style={sectionStyle}>
        <h2 id="usage" style={h2Style}>1. Usage</h2>
        <p style={proseStyle}>
          Use this component whenever you need a user to provide their Aadhaar number. It prevents invalid characters, fixes the caret jumping issue common in formatted inputs, and ensures you always receive a clean 12-digit string to send to your backend.
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
                label: "Store the raw 12 digits in your application state. The component handles formatting and masking visually.",
                preview: null,
              },
              {
                type: "dont",
                label: "Don't use a standard number input for Aadhaar. Number inputs strip leading zeros and allow mouse-wheel scrolling to change the value.",
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
          code={`function IdentityForm() {
  const [aadhaar, setAadhaar] = React.useState("");

  return (
    <FormField label="Aadhaar Number" required>
      {(props) => (
        <AadhaarInput 
          {...props} 
          value={aadhaar} 
          onValueChange={setAadhaar} 
        />
      )}
    </FormField>
  );
}`}
        />
      </section>

      {/* ============ 3. ACCESSIBILITY ============ */}
      <section style={sectionStyle}>
        <h2 id="accessibility" style={h2Style}>3. Accessibility (A11y)</h2>
        <ul style={{ ...proseStyle, paddingLeft: "var(--sa-padding-20)", marginTop: "var(--sa-stack-16)", lineHeight: 1.8 }}>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Input Mode:</strong> Sets <code>inputMode="numeric"</code> so mobile users are presented with a numeric keypad, while remaining a <code>type="text"</code> input to avoid native number input quirks.</li>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Internal Validation:</strong> When exactly 12 digits are entered, it runs the Verhoeff algorithm. If the checksum fails, it automatically sets <code>aria-invalid="true"</code>.</li>
        </ul>
      </section>

      {/* ============ 4. API ============ */}
      <section style={sectionStyle}>
        <h2 id="api" style={h2Style}>4. API Reference</h2>
        <PropsTable
          props={[
            { name: "value", type: "string", required: true, description: "The raw 12 digits, no separators." },
            { name: "onValueChange", type: "(digits: string) => void", required: true, description: "Called with raw digits only (never the formatted string)." },
            { name: "invalid", type: "boolean", default: "false", description: "Render the error state." },
            { name: "mask", type: "boolean", default: "true", description: "Mask to the last four digits when the field is complete and not focused." },
            { name: "...rest", type: "InputHTMLAttributes", description: "All standard input attributes are supported." },
          ]}
        />
      </section>
    </main>
  );
}
