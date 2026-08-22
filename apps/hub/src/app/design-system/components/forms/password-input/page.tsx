import * as React from "react";
import type { Metadata } from "next";
import { PasswordInputPlayground } from "./password-input-playground";
import { Playground } from "@/components/design-system/playground";
import { PropsTable, DoDont } from "@/components/design-system/docs-kit";

export const metadata: Metadata = {
  title: "Password Input - SAMAVESH Design System",
  description:
    "A secure password field with an accessible reveal toggle.",
};

export default function PasswordInputPage(): React.JSX.Element {
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
          Password Input
        </h1>
        <p className="ds-lead" style={leadStyle}>
          A secure password field featuring an integrated, accessible reveal toggle. 
        </p>
      </header>

      {/* ============ PLAYGROUND ============ */}
      <section style={sectionStyle}>
        <h2 id="playground" style={h2Style}>Playground</h2>
        <p style={proseStyle}>
          Type into the field and click the eye icon to reveal the password. Notice how the caret position is maintained when toggling.
        </p>
        <div style={{ marginTop: "var(--sa-stack-24)" }}>
          <PasswordInputPlayground />
        </div>
      </section>

      {/* ============ 1. USAGE ============ */}
      <section style={sectionStyle}>
        <h2 id="usage" style={h2Style}>1. Usage</h2>
        <p style={proseStyle}>
          Typing a password blind is a major cause of failed sign-ins. Always provide a way for the user to verify what they’ve typed. This component suppresses the native browser reveal buttons (which vary wildly and can overlap) in favour of a consistent, accessible DS toggle.
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
                label: "Always pass the correct `autoComplete` prop ('current-password' for login, 'new-password' for registration) to help password managers.",
                preview: null,
              },
              {
                type: "dont",
                label: "Don't use a standard Input with type='password'. You will lose the consistent reveal toggle and its accessibility wiring.",
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
          code={`<FormField label="Create Password" required>
  {(props) => (
    <PasswordInput 
      {...props} 
      autoComplete="new-password"
      placeholder="Enter at least 8 characters" 
    />
  )}
</FormField>`}
        />
      </section>

      {/* ============ 3. ACCESSIBILITY ============ */}
      <section style={sectionStyle}>
        <h2 id="accessibility" style={h2Style}>3. Accessibility (A11y)</h2>
        <ul style={{ ...proseStyle, paddingLeft: "var(--sa-padding-20)", marginTop: "var(--sa-stack-16)", lineHeight: 1.8 }}>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Button Type:</strong> The toggle is explicitly set to <code>type=“button”</code> to prevent it from accidentally submitting the form.</li>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Aria Labels:</strong> The toggle’s <code>aria-label</code> announces the <em>action</em> (“Show password” or “Hide password”), while <code>aria-pressed</code> conveys the current state.</li>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Focus Management:</strong> Tabbing moves from the input to the toggle logically. Clicking the toggle prevents focus loss on the input using <code>onMouseDown</code>, keeping the keyboard user exactly where they were.</li>
        </ul>
      </section>

      {/* ============ 4. API ============ */}
      <section style={sectionStyle}>
        <h2 id="api" style={h2Style}>4. API Reference</h2>
        <PropsTable
          props={[
            { name: "showLabel", type: "string", default: '"Show password"', description: "Accessible name for the reveal button when the password is hidden." },
            { name: "hideLabel", type: "string", default: '"Hide password"', description: "Accessible name for the reveal button when the password is visible." },
            { name: "hideToggle", type: "boolean", default: "false", description: "Hide the reveal button entirely (renders a plain password field)." },
            { name: "...rest", type: "Omit<InputProps, 'type'>", description: "All standard Input component props are forwarded." },
          ]}
        />
      </section>
    </main>
  );
}
