import * as React from "react";
import type { Metadata } from "next";
import { PasswordStrengthMeterPlayground } from "./password-strength-meter-playground";
import { Playground } from "@/components/design-system/playground";
import { PropsTable, DoDont, A11yChecklist } from "@/components/design-system/docs-kit";

export const metadata: Metadata = {
  title: "PasswordStrengthMeter - SAMAVESH Design System",
  description:
    "An accessible password strength indicator designed for registration and password-reset flows.",
};

export default function PasswordStrengthMeterPage(): React.JSX.Element {
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
          PasswordStrengthMeter
        </h1>
        <p className="ds-lead" style={leadStyle}>
          A visual and accessible indicator that provides feedback to users as they create a password.
        </p>
      </header>

      {/* ============ PLAYGROUND ============ */}
      <section style={sectionStyle}>
        <h2 id="playground" style={h2Style}>Playground</h2>
        <p style={proseStyle}>
          Type a password to see how the meter fills and updates its status word.
        </p>
        <div style={{ marginTop: "var(--sa-stack-24)" }}>
          <PasswordStrengthMeterPlayground />
        </div>
      </section>

      {/* ============ 1. USAGE ============ */}
      <section style={sectionStyle}>
        <h2 id="usage" style={h2Style}>1. Usage</h2>
        <p style={proseStyle}>
          This component expects a score between <code>0</code> and <code>4</code> from a library like <code>zxcvbn</code>. It should only be used when a user is <strong>creating</strong> a password (e.g. registration or reset), never when they are logging in.
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
                label: "Use this meter purely as advisory feedback to encourage stronger passwords.",
                preview: null,
              },
              {
                type: "dont",
                label: "Don't compute the score manually by checking for 'one capital, one symbol'. Use zxcvbn. Don't block form submission based on a 'Fair' score.",
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
          code={`import zxcvbn from "zxcvbn";

function RegistrationForm() {
  const [password, setPassword] = React.useState("");
  const result = password ? zxcvbn(password) : null;
  const score = result ? result.score : null;

  return (
    <>
      <PasswordInput
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        aria-describedby="pw-meter"
      />
      <PasswordStrengthMeter id="pw-meter" score={score} />
    </>
  );
}`}
        />
      </section>

      {/* ============ 3. ACCESSIBILITY ============ */}
      <section style={sectionStyle}>
        <h2 id="accessibility" style={h2Style}>3. Accessibility (A11y)</h2>
        <ul style={{ ...proseStyle, paddingLeft: "var(--sa-padding-20)", marginTop: "var(--sa-stack-16)", lineHeight: 1.8 }}>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Described By:</strong> Wire the meter's ID to the password input's <code>aria-describedby</code> attribute so screen readers know they are linked.</li>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Live Region:</strong> The text label (e.g., "Weak", "Strong") has <code>aria-live="polite"</code>. As the user types and the score changes, screen readers will announce the new strength politely without interrupting the user mid-keystroke.</li>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Colour Independence:</strong> The component relies on the text word to convey meaning, not just the bar's colour, ensuring it is fully accessible to users with colour vision deficiencies.</li>
        </ul>
      </section>

      {/* ============ 4. API ============ */}
      <section style={sectionStyle}>
        <h2 id="api" style={h2Style}>4. API Reference</h2>
        <PropsTable
          props={[
            { name: "score", type: "0 | 1 | 2 | 3 | 4 | null", required: true, description: "A zxcvbn score. Pass null when the field is empty." },
            { name: "caption", type: "string", default: '"Password strength"', description: "Label to the left of the strength word." },
            { name: "id", type: "string", description: "ID used to link the meter to the input via aria-describedby." },
          ]}
        />
      </section>
    </main>
  );
}
