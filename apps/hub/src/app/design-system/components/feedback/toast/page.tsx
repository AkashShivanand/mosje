import * as React from "react";
import type { Metadata } from "next";
import { ToastPlayground } from "./toast-playground";
import { Playground } from "@/components/design-system/playground";
import { PropsTable, DoDont } from "@/components/design-system/docs-kit";

export const metadata: Metadata = {
  title: "Toast - SAMAVESH Design System",
  description:
    "Toasts are transient notifications used to provide brief, non-interruptive feedback about an operation.",
};

export default function ToastPage(): React.JSX.Element {
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
          Toast
        </h1>
        <p className="ds-lead" style={leadStyle}>
          Toasts are transient notifications used to provide brief, non-interruptive feedback about an operation. They automatically disappear after a few seconds.
        </p>
      </header>

      {/* ============ PLAYGROUND ============ */}
      <section style={sectionStyle}>
        <h2 id="playground" style={h2Style}>Playground</h2>
        <p style={proseStyle}>
          Trigger toasts to see how they stack and animate in.
        </p>
        <div style={{ marginTop: "var(--sa-stack-24)" }}>
          <ToastPlayground />
        </div>
      </section>

      {/* ============ 1. USAGE ============ */}
      <section style={sectionStyle}>
        <h2 id="usage" style={h2Style}>1. Usage</h2>
        <p style={proseStyle}>
          Use toasts to inform users about the result of an action (e.g. “Record saved”) without blocking their workflow. Toasts are global to the application and appear in a fixed viewport corner.
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
                label: "Keep messages short and direct. Usually one sentence is enough.",
                preview: null,
              },
              {
                type: "dont",
                label: "Don't put interactive elements (links, buttons) inside a toast, as it auto-dismisses before a user might reach it.",
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
          The Toast system consists of a <code>&lt;ToastProvider&gt;</code> wrapping your application and a <code>useToast()</code> hook to trigger notifications.
        </p>
        <Playground
          code={`import { useToast, Button } from "@mosje/design-system";

export function SaveProfile() {
  const { toast } = useToast();

  const handleSave = () => {
    // perform save logic...
    toast("Profile saved successfully!", "success");
  };

  return <Button onClick={handleSave}>Save Profile</Button>;
}`}
        />
      </section>

      {/* ============ 3. ACCESSIBILITY ============ */}
      <section style={sectionStyle}>
        <h2 id="accessibility" style={h2Style}>3. Accessibility (A11y)</h2>
        <p style={proseStyle}>
          Toasts rely on ARIA live regions to announce changes to screen readers without moving focus.
        </p>
        <ul style={{ ...proseStyle, paddingLeft: "var(--sa-padding-20)", marginTop: "var(--sa-stack-16)", lineHeight: 1.8 }}>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Polite vs Assertive:</strong> Non-error toasts use <code>role=“status”</code> (polite), meaning screen readers will wait until the user is idle. Error toasts use <code>role=“alert”</code> (assertive), which interrupts the screen reader immediately.</li>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Auto-dismiss:</strong> WCAG allows auto-dismissing notifications if they do not contain essential interactive controls. Do not place forms or mandatory actions inside a toast.</li>
        </ul>
      </section>

      {/* ============ 4. API ============ */}
      <section style={sectionStyle}>
        <h2 id="api" style={h2Style}>4. API Reference</h2>
        <h3 style={{ ...h2Style, fontSize: "var(--sa-type-headline-3-size)", marginTop: "var(--sa-stack-24)" }}>useToast()</h3>
        <PropsTable
          props={[
            { name: "message", type: "ReactNode", required: true, description: "The content of the notification." },
            { name: "variant", type: '"success" | "info" | "warning" | "error"', default: '"success"', description: "The semantic style of the notification." },
          ]}
        />
      </section>
    </main>
  );
}
