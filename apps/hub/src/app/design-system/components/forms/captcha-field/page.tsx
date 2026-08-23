import * as React from "react";
import type { Metadata } from "next";
import { CaptchaFieldPlayground } from "./captcha-field-playground";
import { Playground } from "@/components/design-system/playground";
import { PropsTable, DoDont, Callout } from "@/components/design-system/docs-kit";

export const metadata: Metadata = {
  title: "CaptchaField - SAMAVESH Design System",
  description:
    "A legacy CAPTCHA challenge component for existing portals.",
};

export default function CaptchaFieldPage(): React.JSX.Element {
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
          CaptchaField
        </h1>
        <p className="ds-lead" style={leadStyle}>
          A legacy CAPTCHA challenge component provided strictly for backwards compatibility with older MoSJE portals.
        </p>
      </header>

      <Callout title="Discouraged" type="warning">
        Visual CAPTCHAs are an aggressive accessibility barrier and violate GIGW 3.0 requirements if no audio alternative is provided. Prefer rate limiting or server-side signals over a visual CAPTCHA wherever possible.
      </Callout>

      {/* ============ PLAYGROUND ============ */}
      <section style={sectionStyle}>
        <h2 id="playground" style={h2Style}>Playground</h2>
        <div style={{ marginTop: "var(--sa-stack-24)" }}>
          <CaptchaFieldPlayground />
        </div>
      </section>

      {/* ============ 1. USAGE ============ */}
      <section style={sectionStyle}>
        <h2 id="usage" style={h2Style}>1. Usage</h2>
        <p style={proseStyle}>
          Only one surface in the estate uses this today (SMILE-Transgender / Garima Greh). Adding it to a new portal is a decision that must be justified against accessibility conformance failures.
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
                label: "Clear the input field's value when the user clicks the refresh button to load a new challenge.",
                preview: null,
              },
              {
                type: "dont",
                label: "Don't use this component on new portals without exploring invisible alternatives first.",
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
          code={`function LegacyForm() {
  const [captcha, setCaptcha] = React.useState("");

  return (
    <CaptchaField
      challenge={{ type: "text", characters: "X4Y9Z" }}
      value={captcha}
      onValueChange={setCaptcha}
      onRefresh={() => {
        setCaptcha("");
        // fetch new challenge...
      }}
    />
  );
}`}
        />
      </section>

      {/* ============ 3. ACCESSIBILITY ============ */}
      <section style={sectionStyle}>
        <h2 id="accessibility" style={h2Style}>3. Accessibility (A11y)</h2>
        <ul style={{ ...proseStyle, paddingLeft: "var(--sa-padding-20)", marginTop: "var(--sa-stack-16)", lineHeight: 1.8 }}>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Refresh Button:</strong> The refresh button has an explicit <code>aria-label</code> (&quot;Get a new security check. This clears anything you have typed.&quot;) so screen reader users know exactly what the action does.</li>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Errors:</strong> Like <code>FormField</code>, any error message is linked to the input via <code>aria-describedby</code>. A red border alone is never sufficient to indicate an error.</li>
        </ul>
      </section>

      {/* ============ 4. API ============ */}
      <section style={sectionStyle}>
        <h2 id="api" style={h2Style}>4. API Reference</h2>
        <PropsTable
          props={[
            { name: "challenge", type: "ImageChallenge | TextChallenge", required: true, description: "The CAPTCHA challenge data." },
            { name: "value", type: "string", required: true, description: "The controlled input value." },
            { name: "onValueChange", type: "(val: string) => void", required: true, description: "Called when the user types in the input." },
            { name: "onRefresh", type: "() => void", required: true, description: "Called when the user clicks the refresh button." },
            { name: "error", type: "string", description: "Validation error message." },
            { name: "label", type: "string", default: '"Security check"', description: "Accessible label for the input." },
            { name: "placeholder", type: "string", default: '"Enter the characters"', description: "Placeholder text for the input." },
          ]}
        />
      </section>
    </main>
  );
}
