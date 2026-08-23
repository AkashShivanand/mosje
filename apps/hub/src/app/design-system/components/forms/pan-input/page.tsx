import * as React from "react";
import type { Metadata } from "next";
import { PanInputPlayground } from "./pan-input-playground";
import { Playground } from "@/components/design-system/playground";
import { PropsTable, DoDont } from "@/components/design-system/docs-kit";

export const metadata: Metadata = {
  title: "PanInput - SAMAVESH Design System",
  description:
    "An input specifically designed for collecting Indian Permanent Account Numbers (PAN).",
};

export default function PanInputPage(): React.JSX.Element {
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
          PanInput
        </h1>
        <p className="ds-lead" style={leadStyle}>
          An input tailored for Indian Permanent Account Numbers (PAN). It automatically uppercases input, blocks invalid characters, and verifies the strict <code>AAAAA9999A</code> format.
        </p>
      </header>

      {/* ============ PLAYGROUND ============ */}
      <section style={sectionStyle}>
        <h2 id="playground" style={h2Style}>Playground</h2>
        <p style={proseStyle}>
          Try typing in lowercase or entering special characters. The component automatically cleans the input. Once 10 characters are entered, it validates the structure (e.g. checking the 4th character).
        </p>
        <div style={{ marginTop: "var(--sa-stack-24)" }}>
          <PanInputPlayground />
        </div>
      </section>

      {/* ============ 1. USAGE ============ */}
      <section style={sectionStyle}>
        <h2 id="usage" style={h2Style}>1. Usage</h2>
        <p style={proseStyle}>
          PAN collection is extremely common across MoSJE portals for verification and direct benefit transfers. This component handles all the UX edge cases—like autocorrect fighting the user, or users getting yelled at for typing lowercase letters—so you don&apos;t have to.
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
                label: "Rely on the `onValueChange` callback to provide you with a clean, fully uppercase string that is ready to be stored in your database.",
                preview: null,
              },
              {
                type: "dont",
                label: "Don't write your own Regex validations for PAN numbers. This component already checks the holder-type codes (the 4th character).",
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
          code={`function BeneficiaryForm() {
  const [pan, setPan] = React.useState("");

  return (
    <FormField label="Enter your PAN" required>
      {(props) => (
        <PanInput 
          {...props} 
          value={pan} 
          onValueChange={setPan} 
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
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Auto-Correction:</strong> Disables <code>spellCheck</code>, <code>autoCorrect</code>, and <code>autoComplete</code> by default. A PAN is not a word, and the browser trying to &apos;fix&apos; it is a major frustration for users on mobile devices.</li>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Internal Validation:</strong> The input sets <code>aria-invalid=&quot;true&quot;</code> automatically if the user types a full 10-character string that fails the PAN structural validation.</li>
        </ul>
      </section>

      {/* ============ 4. API ============ */}
      <section style={sectionStyle}>
        <h2 id="api" style={h2Style}>4. API Reference</h2>
        <PropsTable
          props={[
            { name: "value", type: "string", required: true, description: "The controlled value. Always rendered uppercase." },
            { name: "onValueChange", type: "(pan: string) => void", required: true, description: "Called with the normalised, uppercase, stripped value." },
            { name: "invalid", type: "boolean", default: "false", description: "Render the error state manually (e.g. if the PAN was rejected by an API)." },
            { name: "...rest", type: "InputHTMLAttributes", description: "All standard input attributes are supported." },
          ]}
        />
      </section>
    </main>
  );
}
