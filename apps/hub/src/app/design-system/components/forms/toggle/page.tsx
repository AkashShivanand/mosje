import * as React from "react";
import type { Metadata } from "next";
import { TogglePlayground } from "./toggle-playground";
import { Playground } from "@/components/design-system/playground";
import { PropsTable, DoDont } from "@/components/design-system/docs-kit";

export const metadata: Metadata = {
  title: "Toggle - SAMAVESH Design System",
  description:
    "An accessible switch component for toggling a setting on or off.",
};

export default function TogglePage(): React.JSX.Element {
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
          Toggle
        </h1>
        <p className="ds-lead" style={leadStyle}>
          A switch control that allows users to toggle a single setting on or off. Under the hood, it&apos;s a fully accessible checkbox with <code>role=&quot;switch&quot;</code>.
        </p>
      </header>

      {/* ============ PLAYGROUND ============ */}
      <section style={sectionStyle}>
        <h2 id="playground" style={h2Style}>Playground</h2>
        <p style={proseStyle}>
          Interact with the Toggle and adjust its size.
        </p>
        <div style={{ marginTop: "var(--sa-stack-24)" }}>
          <TogglePlayground />
        </div>
      </section>

      {/* ============ 1. USAGE ============ */}
      <section style={sectionStyle}>
        <h2 id="usage" style={h2Style}>1. Usage</h2>
        <p style={proseStyle}>
          Use Toggles for binary settings that take effect immediately (or when a settings form is saved). They are a more modern, prominent alternative to a standard checkbox.
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
                label: "Use Toggles for settings like 'Enable notifications' or 'Dark mode'.",
                preview: null,
              },
              {
                type: "dont",
                label: "Don't use Toggles for acknowledging terms and conditions. Use a standard Checkbox instead.",
                preview: null,
              },
            ]}
          />
        </div>
      </section>

      {/* ============ 2. SIZES ============ */}
      <section style={sectionStyle}>
        <h2 id="sizes" style={h2Style}>2. Sizes</h2>
        <p style={proseStyle}>
          The Toggle component comes in two sizes:
        </p>
        <ul style={{ ...proseStyle, paddingLeft: "var(--sa-padding-20)", marginTop: "var(--sa-stack-16)" }}>
          <li><strong>Default:</strong> Standard size, ideal for primary forms and settings pages.</li>
          <li><strong>Small:</strong> Compact size, suitable for dense layouts, toolbars, or data tables.</li>
        </ul>
      </section>

      {/* ============ 3. CODE EXAMPLE ============ */}
      <section style={sectionStyle}>
        <h2 id="code-example" style={h2Style}>3. Code Example</h2>
        <Playground
          code={`function NotificationsSettings() {
  const [enabled, setEnabled] = React.useState(true);

  return (
    <Toggle 
      checked={enabled} 
      onChange={(e) => setEnabled(e.target.checked)} 
      label="Receive SMS alerts" 
    />
  );
}`}
        />
      </section>

      {/* ============ 4. ACCESSIBILITY ============ */}
      <section style={sectionStyle}>
        <h2 id="accessibility" style={h2Style}>4. Accessibility (A11y)</h2>
        <ul style={{ ...proseStyle, paddingLeft: "var(--sa-padding-20)", marginTop: "var(--sa-stack-16)", lineHeight: 1.8 }}>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Semantic Role:</strong> The visually hidden input uses <code>type=&quot;checkbox&quot;</code> and <code>role=&quot;switch&quot;</code> so screen readers announce it as a toggle switch.</li>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Associated Label:</strong> When the <code>label</code> prop is provided, the component automatically generates an <code>id</code> and correctly wires up the <code>&lt;label htmlFor=&quot;...&quot;&gt;</code>.</li>
        </ul>
      </section>

      {/* ============ 5. API ============ */}
      <section style={sectionStyle}>
        <h2 id="api" style={h2Style}>5. API Reference</h2>
        <PropsTable
          props={[
            { name: "checked", type: "boolean", required: true, description: "Controlled on/off state." },
            { name: "onChange", type: "ChangeEventHandler", required: true, description: "Called when the toggle is clicked." },
            { name: "label", type: "ReactNode", description: "Optional text label rendered beside the switch." },
            { name: "size", type: '"default" | "small"', default: '"default"', description: "Control size." },
            { name: "...rest", type: "InputHTMLAttributes", description: "All standard input attributes are supported." },
          ]}
        />
      </section>
    </main>
  );
}
