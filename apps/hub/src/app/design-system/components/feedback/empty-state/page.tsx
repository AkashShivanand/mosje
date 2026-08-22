import * as React from "react";
import type { Metadata } from "next";
import { EmptyStatePlayground } from "./empty-state-playground";
import { Playground } from "@/components/design-system/playground";
import { PropsTable, DoDont, A11yChecklist } from "@/components/design-system/docs-kit";

export const metadata: Metadata = {
  title: "Empty State - SAMAVESH Design System",
  description:
    "A centered placeholder for empty collections or zero-result views.",
};

export default function EmptyStatePage(): React.JSX.Element {
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
          Empty State
        </h1>
        <p className="ds-lead" style={leadStyle}>
          A centered placeholder used when a collection is empty or a search returns no results. It helps users understand why they are seeing a blank space and what they can do next.
        </p>
      </header>

      {/* ============ PLAYGROUND ============ */}
      <section style={sectionStyle}>
        <h2 id="playground" style={h2Style}>Playground</h2>
        <p style={proseStyle}>
          Toggle the optional components (icon, description, action) to see how the Empty State adapts.
        </p>
        <div style={{ marginTop: "var(--sa-stack-24)" }}>
          <EmptyStatePlayground />
        </div>
      </section>

      {/* ============ 1. USAGE ============ */}
      <section style={sectionStyle}>
        <h2 id="usage" style={h2Style}>1. Usage</h2>
        <p style={proseStyle}>
          Use an Empty State when a data table, list, or dashboard has no items to display. This usually happens in three scenarios:
          first use (onboarding), cleared data, or zero search results.
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
                label: "Always provide a clear path forward (e.g., 'Create your first item' or 'Clear filters').",
                preview: null,
              },
              {
                type: "dont",
                label: "Don't use generic or dead-end copy like 'No data'. Explain why it's empty.",
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
          code={`<EmptyState 
  icon={<FolderIcon />}
  title="No applications yet"
  description="You haven't submitted any applications. Click below to start a new one."
  action={<Button variant="primary">Start Application</Button>}
/>`}
        />
      </section>

      {/* ============ 3. ACCESSIBILITY ============ */}
      <section style={sectionStyle}>
        <h2 id="accessibility" style={h2Style}>3. Accessibility (A11y)</h2>
        <ul style={{ ...proseStyle, paddingLeft: "var(--sa-padding-20)", marginTop: "var(--sa-stack-16)", lineHeight: 1.8 }}>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Decorative Icons:</strong> The icon container automatically sets <code>aria-hidden="true"</code>, ensuring screen readers skip over the visual illustration and go straight to the title and description.</li>
        </ul>
      </section>

      {/* ============ 4. API ============ */}
      <section style={sectionStyle}>
        <h2 id="api" style={h2Style}>4. API Reference</h2>
        <PropsTable
          props={[
            { name: "title", type: "ReactNode", required: true, description: "The main headline explaining the empty state." },
            { name: "icon", type: "ReactNode", description: "Optional illustration or icon displayed above the title." },
            { name: "description", type: "ReactNode", description: "Supporting text providing more context or instruction." },
            { name: "action", type: "ReactNode", description: "Optional call-to-action, usually a Button component." },
            { name: "className", type: "string", description: "Additional classes merged onto the root element." },
            { name: "...rest", type: "HTMLAttributes<HTMLDivElement>", description: "All standard div props are forwarded, except 'title' which is overridden." },
          ]}
        />
      </section>
    </main>
  );
}
