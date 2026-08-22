import * as React from "react";
import type { Metadata } from "next";
import { AlertPlayground } from "./alert-playground";
import { Playground } from "@/components/design-system/playground";
import { PropsTable, DoDont, A11yChecklist, Callout } from "@/components/design-system/docs-kit";

export const metadata: Metadata = {
  title: "Alert - SAMAVESH Design System",
  description:
    "Alerts display important, prominently placed messages that require the user's attention. They are used to communicate status, warnings, errors, or informational messages.",
};

export default function AlertPage(): React.JSX.Element {
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
          Alert
        </h1>
        <p className="ds-lead" style={leadStyle}>
          Alerts display important, prominently placed messages that require the user’s attention. They communicate status, warnings, errors, or info without interrupting the user’s flow.
        </p>
      </header>

      {/* ============ PLAYGROUND ============ */}
      <section style={sectionStyle}>
        <h2 id="playground" style={h2Style}>Playground</h2>
        <p style={proseStyle}>
          Try out the Alert component across its various semantic statuses.
        </p>
        <div style={{ marginTop: "var(--sa-stack-24)" }}>
          <AlertPlayground />
        </div>
      </section>

      {/* ============ 1. USAGE ============ */}
      <section style={sectionStyle}>
        <h2 id="usage" style={h2Style}>1. Usage</h2>
        <p style={proseStyle}>
          Use Alerts sparingly so users do not experience banner fatigue. Place them strategically at the top of a page or immediately above the section they relate to.
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
                label: "Use an Error Alert when the user cannot proceed due to a system failure or invalid input that applies broadly.",
                preview: null,
              },
              {
                type: "dont",
                label: "Don't use an Alert for transient feedback like 'Item saved'. Use a Toast instead to avoid permanently shifting layout.",
                preview: null,
              },
            ]}
          />
        </div>
      </section>

      {/* ============ 2. ANATOMY ============ */}
      <section style={sectionStyle}>
        <h2 id="anatomy" style={h2Style}>2. Anatomy</h2>
        <p style={proseStyle}>
          The Alert consists of a tonal background, a status icon, an optional title, body content, an optional action, and an optional dismiss button.
        </p>
        <Playground
          code={`<Alert 
  status="warning" 
  title="Maintenance Scheduled"
  dismissible
  action={<button>Learn more</button>}
  timestamp="Just now"
>
  The system will be undergoing maintenance on Saturday, 12:00 AM IST.
</Alert>`}
        />
      </section>

      {/* ============ 3. STATUS VARIANTS ============ */}
      <section style={sectionStyle}>
        <h2 id="variants" style={h2Style}>3. Status Variants</h2>
        <p style={proseStyle}>
          Alerts convey meaning through four semantic roles. Use them consistently to map to system states.
        </p>
        <ul style={{ ...proseStyle, paddingLeft: "var(--sa-padding-20)", marginTop: "var(--sa-stack-16)" }}>
          <li><strong>Info (<code>info</code>):</strong> The default. For general system information or helpful hints.</li>
          <li><strong>Success (<code>success</code>):</strong> Confirms a successful, prominent action (e.g., account created).</li>
          <li><strong>Warning (<code>warning</code>):</strong> Alerts the user of potential issues or destructive consequences if they proceed.</li>
          <li><strong>Error (<code>error</code>):</strong> Highlights a critical failure, blocking issue, or destructive system error.</li>
        </ul>
      </section>

      {/* ============ 4. ACCESSIBILITY ============ */}
      <section style={sectionStyle}>
        <h2 id="accessibility" style={h2Style}>4. Accessibility (A11y)</h2>
        <Callout type="warning" title="Don't rely on colour alone">
          Ensure that the textual content of the Alert clearly describes its meaning and intent. The visual colour coding (green for success, red for error) is helpful for sighted users but meaningless to screen readers or colour-blind individuals.
        </Callout>
        <div style={{ marginTop: "var(--sa-padding-20)" }}>
          <A11yChecklist
            items={[
              { criterion: "role='alert' is used", level: "A", description: "The component automatically sets role='alert', meaning assistive technologies will announce the alert as soon as it appears on screen." },
              { criterion: "Icons have aria-hidden='true'", level: "A", description: "Status icons are decorative and hidden from screen readers. The meaning must be conveyed by text." },
              { criterion: "Contrast ratios", level: "AA", description: "Text and interactive elements within the tonal banner meet the 4.5:1 minimum contrast ratio." },
            ]}
          />
        </div>
      </section>

      {/* ============ 5. API ============ */}
      <section style={sectionStyle}>
        <h2 id="api" style={h2Style}>5. API Reference</h2>
        <PropsTable
          props={[
            { name: "status", type: '"info" | "success" | "warning" | "error"', default: '"info"', description: "Semantic colour role and corresponding icon." },
            { name: "title", type: "ReactNode", description: "Bold heading line." },
            { name: "children", type: "ReactNode", description: "Description or body content of the alert." },
            { name: "dismissible", type: "boolean", default: "false", description: "Whether to render a close button." },
            { name: "onDismiss", type: "() => void", description: "Callback when the dismiss button is clicked." },
            { name: "action", type: "ReactNode", description: "Optional inline action(s) shown under the body." },
            { name: "timestamp", type: "string", description: "Optional timestamp shown in the top right." },
          ]}
        />
      </section>
    </main>
  );
}
