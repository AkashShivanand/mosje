import * as React from "react";
import type { Metadata } from "next";
import { OtpInputPlayground } from "./otp-input-playground";
import { Playground } from "@/components/design-system/playground";
import { PropsTable, DoDont } from "@/components/design-system/docs-kit";

export const metadata: Metadata = {
  title: "OtpInput - SAMAVESH Design System",
  description:
    "An accessible group of text inputs optimized for collecting One-Time Passwords (OTP).",
};

export default function OtpInputPage(): React.JSX.Element {
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
          OtpInput
        </h1>
        <p className="ds-lead" style={leadStyle}>
          A specialised input component for collecting numeric One-Time Passwords (OTP). It handles pasting, arrow-key navigation, and mobile autofill natively.
        </p>
      </header>

      {/* ============ PLAYGROUND ============ */}
      <section style={sectionStyle}>
        <h2 id="playground" style={h2Style}>Playground</h2>
        <p style={proseStyle}>
          Try pasting a 6-digit number, typing normally, or using the left/right arrow keys to navigate between the boxes.
        </p>
        <div style={{ marginTop: "var(--sa-stack-24)" }}>
          <OtpInputPlayground />
        </div>
      </section>

      {/* ============ 1. USAGE ============ */}
      <section style={sectionStyle}>
        <h2 id="usage" style={h2Style}>1. Usage</h2>
        <p style={proseStyle}>
          Use the <code>OtpInput</code> exclusively when asking the user to enter a verification code sent via SMS or email. It provides a standard 4- or 6-digit box layout that users recognize instantly.
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
                label: "Wrap it in a FormField to provide a clear label and error message.",
                preview: null,
              },
              {
                type: "dont",
                label: "Don't use OtpInput for standard numeric fields like PIN codes or amounts. Use a standard Input with `type='number'` instead.",
                preview: null,
              },
            ]}
          />
        </div>
      </section>

      {/* ============ 2. CODE EXAMPLE ============ */}
      <section style={sectionStyle}>
        <h2 id="code-example" style={h2Style}>2. Code Example</h2>
        <p style={proseStyle}>
          The <code>onComplete</code> callback fires automatically when the final box is filled, allowing you to trigger verification immediately without requiring an extra button click.
        </p>
        <Playground
          code={`function VerificationFlow() {
  const [code, setCode] = React.useState("");

  const handleVerify = (fullCode) => {
    console.log("Verifying code:", fullCode);
  };

  return (
    <FormField label="Enter Verification Code">
      {(props) => (
        <OtpInput 
          {...props}
          value={code}
          onChange={setCode}
          length={6}
          onComplete={handleVerify}
          autoFocus
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
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Input Mode & Autofill:</strong> Sets <code>inputMode=&quot;numeric&quot;</code> to trigger the number pad on mobile devices. The first box sets <code>autoComplete=&quot;one-time-code&quot;</code> so the OS prompts the user when an SMS arrives.</li>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Keyboard Navigation:</strong> Fully supports navigating back and forth with Left/Right arrow keys and deleting characters seamlessly with Backspace.</li>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Aria Labels:</strong> Each individual box is labelled dynamically (e.g. &quot;Digit 1 of 6&quot;) so screen reader users know exactly where they are.</li>
        </ul>
      </section>

      {/* ============ 4. API ============ */}
      <section style={sectionStyle}>
        <h2 id="api" style={h2Style}>4. API Reference</h2>
        <PropsTable
          props={[
            { name: "value", type: "string", required: true, description: "Controlled value (up to 'length' characters long)." },
            { name: "onChange", type: "(value: string) => void", required: true, description: "Change handler." },
            { name: "length", type: "number", default: "6", description: "Number of digits/boxes." },
            { name: "label", type: "string", default: '"One-time code"', description: "Accessible group label." },
            { name: "onComplete", type: "(code: string) => void", description: "Called when all digits are filled." },
            { name: "invalid", type: "boolean", default: "false", description: "Render the error state." },
            { name: "autoFocus", type: "boolean", default: "false", description: "Focus the first box on mount." },
          ]}
        />
      </section>
    </main>
  );
}
