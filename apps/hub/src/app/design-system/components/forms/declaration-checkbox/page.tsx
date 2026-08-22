import * as React from "react";
import type { Metadata } from "next";
import { DeclarationCheckboxPlayground } from "./declaration-checkbox-playground";
import { Playground } from "@/components/design-system/playground";
import { PropsTable, DoDont } from "@/components/design-system/docs-kit";

export const metadata: Metadata = {
  title: "DeclarationCheckbox - SAMAVESH Design System",
  description:
    "A statutory certification block that closes a government form.",
};

export default function DeclarationCheckboxPage(): React.JSX.Element {
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
          DeclarationCheckbox
        </h1>
        <p className="ds-lead" style={leadStyle}>
          A specialised panel carrying statutory declaration text with a single required checkbox. Used to legally close government forms before submission.
        </p>
      </header>

      {/* ============ PLAYGROUND ============ */}
      <section style={sectionStyle}>
        <h2 id="playground" style={h2Style}>Playground</h2>
        <p style={proseStyle}>
          Toggle the error state to see how the panel styles itself when a user tries to submit the form without checking the box.
        </p>
        <div style={{ marginTop: "var(--sa-stack-24)" }}>
          <DeclarationCheckboxPlayground />
        </div>
      </section>

      {/* ============ 1. USAGE ============ */}
      <section style={sectionStyle}>
        <h2 id="usage" style={h2Style}>1. Usage</h2>
        <p style={proseStyle}>
          This component exists because the wording is legal text that the user is attesting to. It needs to read as a distinct, deliberate act rather than just another field in a grid.
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
                label: "Use a `<ul>` list when the declaration covers several points, so each is separately readable and digestible.",
                preview: null,
              },
              {
                type: "dont",
                label: "Don't use a standard Checkbox for final form declarations. The standard Checkbox does not properly bind a large block of legal text to the control for screen readers.",
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
          code={`<DeclarationCheckbox 
  checked={isAgreed} 
  onChange={setIsAgreed}
  title="Final Declaration"
  lead="By checking this box, I certify that:"
>
  <ul style={{ margin: 0, paddingLeft: "1.5rem" }}>
    <li>I am a citizen of India.</li>
    <li>I have not availed this scheme's benefits in the past.</li>
  </ul>
</DeclarationCheckbox>`}
        />
      </section>

      {/* ============ 3. ACCESSIBILITY ============ */}
      <section style={sectionStyle}>
        <h2 id="accessibility" style={h2Style}>3. Accessibility (A11y)</h2>
        <ul style={{ ...proseStyle, paddingLeft: "var(--sa-padding-20)", marginTop: "var(--sa-stack-16)", lineHeight: 1.8 }}>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Bound Statement:</strong> The entire declaration text block is bound to the checkbox via <code>aria-describedby</code>, ensuring screen readers announce the legal text the user is agreeing to when they focus the control.</li>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Landmark:</strong> The component is wrapped in a <code>&lt;section&gt;</code> and labelled by its title (e.g. &quot;Declaration&quot;), making it easy to navigate to.</li>
        </ul>
      </section>

      {/* ============ 4. API ============ */}
      <section style={sectionStyle}>
        <h2 id="api" style={h2Style}>4. API Reference</h2>
        <PropsTable
          props={[
            { name: "checked", type: "boolean", required: true, description: "Controlled checked state." },
            { name: "onChange", type: "(checked: boolean) => void", required: true, description: "Called when the checkbox is toggled." },
            { name: "children", type: "ReactNode", required: true, description: "The certification statement (e.g., a list of points)." },
            { name: "title", type: "ReactNode", default: '"Declaration"', description: "Panel heading." },
            { name: "lead", type: "ReactNode", default: '"I certify that:"', description: "Leading line above the statement." },
            { name: "error", type: "ReactNode", description: "Error message shown when submission was attempted unchecked." },
          ]}
        />
      </section>
    </main>
  );
}
