import type { Metadata } from "next";
import { PropsTable, Callout, A11yChecklist, StatusBadge } from "@/components/design-system/docs-kit/index";
import { TabsDemo } from "./tabs-demo";

export const metadata: Metadata = {
  title: "Tabs",
  description:
    "The SAMAVESH Tabs / TabPanel — accessible tabbed navigation for non-linear sections, implementing the WAI-ARIA Tabs pattern with roving tabindex and Arrow/Home/End keyboard support.",
};

/* ------------------------------------------------------------------ *
 * Layout primitives (shared shape with the other component pages)
 * ------------------------------------------------------------------ */

const sectionStyle: React.CSSProperties = {
  marginTop: "var(--ds-spacing-5xl)",
  scrollMarginTop: "var(--ds-spacing-5xl)",
};

const h2Style: React.CSSProperties = {
  fontSize: "var(--ds-text-headline)",
  fontWeight: 700,
  color: "var(--ds-ink)",
  marginBottom: "var(--ds-spacing-lg)",
  paddingBottom: "var(--ds-spacing-sm)",
  borderBottom: "1px solid var(--ds-border)",
};

const h3Style: React.CSSProperties = {
  fontSize: "var(--ds-text-title-1)",
  fontWeight: 600,
  color: "var(--ds-ink)",
  marginTop: "var(--ds-spacing-2xl)",
  marginBottom: "var(--ds-spacing-sm)",
};

const proseStyle: React.CSSProperties = {
  color: "var(--ds-ink-muted)",
  fontSize: "var(--ds-text-body-1)",
  lineHeight: 1.7,
  maxWidth: "68ch",
};

function CodeBlock({ children }: { children: string }): React.JSX.Element {
  return (
    <pre
      style={{
        background: "var(--ds-surface-muted)",
        border: "1px solid var(--ds-border)",
        borderRadius: "var(--ds-radius-md, 8px)",
        padding: "var(--ds-spacing-lg)",
        overflowX: "auto",
        fontSize: "var(--ds-text-body-2)",
        lineHeight: 1.6,
        color: "var(--ds-ink)",
        marginTop: "var(--ds-spacing-sm)",
      }}
    >
      <code style={{ fontFamily: "var(--ds-font-mono, monospace)" }}>{children}</code>
    </pre>
  );
}

/* ------------------------------------------------------------------ *
 * Page
 * ------------------------------------------------------------------ */

export default function TabsPage(): React.JSX.Element {
  return (
    <main
      style={{
        maxWidth: "1024px",
        margin: "0 auto",
        padding: "var(--ds-spacing-3xl) var(--ds-spacing-2xl) var(--ds-spacing-6xl)",
      }}
    >
      {/* ── Title ── */}
      <header style={{ marginBottom: "var(--ds-spacing-3xl)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--ds-spacing-md)", flexWrap: "wrap" }}>
          <h1 style={{ fontSize: "var(--ds-text-display)", fontWeight: 800, color: "var(--ds-ink)", margin: 0 }}>Tabs</h1>
          <StatusBadge status="Beta" />
        </div>
        <p style={{ ...proseStyle, marginTop: "var(--ds-spacing-md)" }}>
          Accessible tabbed navigation for <strong>non-linear</strong> sections a user revisits in any order — a clinical
          record, a settings panel, a multi-facet detail view. <code>Tabs</code> implements the WAI-ARIA Tabs pattern with
          a roving <code>tabindex</code>, Arrow / Home / End keys, and a polite live-region announce. Use it when the user
          jumps freely between sections; reach for <code>&lt;Wizard&gt;</code> instead when the flow is a linear, ordered
          sequence of steps.
        </p>
      </header>

      {/* ============ Live demo ============ */}
      <section style={sectionStyle}>
        <h2 id="demo" style={h2Style}>
          Live demo
        </h2>
        <p style={proseStyle}>
          Focus a tab and use <strong>Arrow</strong> keys to move between sections, or <strong>Home</strong> / <strong>End</strong>{" "}
          to jump to the first / last.
        </p>
        <div style={{ marginTop: "var(--ds-spacing-lg)" }}>
          <TabsDemo />
        </div>
      </section>

      {/* ============ 1. Import ============ */}
      <section style={sectionStyle}>
        <h2 id="import" style={h2Style}>
          1. Import
        </h2>
        <CodeBlock>{`import { Tabs, TabPanel } from "@mosje/design-system";
import type { TabDef } from "@mosje/design-system";`}</CodeBlock>
      </section>

      {/* ============ 2. Usage ============ */}
      <section style={sectionStyle}>
        <h2 id="usage" style={h2Style}>
          2. Usage
        </h2>
        <p style={proseStyle}>
          The parent owns the active index and renders one <code>&lt;TabPanel&gt;</code> at a time. Pass a stable{" "}
          <code>idBase</code> (use <code>React.useId()</code>) so the tab ↔ panel ids stay wired.
        </p>
        <CodeBlock>{`"use client";
import * as React from "react";
import { Tabs, TabPanel, type TabDef } from "@mosje/design-system";

const SECTIONS: TabDef[] = [
  { id: "history", label: "Previous History" },
  { id: "dosage",  label: "Medication Dosage" },
  { id: "discharge", label: "Diagnosis & Discharge" },
];

function ClinicalRecord() {
  const [active, setActive] = React.useState(0);
  const idBase = React.useId();

  return (
    <>
      <Tabs
        tabs={SECTIONS}
        active={active}
        onChange={setActive}      // auto-save the current tab here, then switch
        idBase={idBase}
        ariaLabel="Clinical record sections"
      />
      <TabPanel idBase={idBase} tabId={SECTIONS[active].id}>
        {/* render the active section's fields */}
      </TabPanel>
    </>
  );
}`}</CodeBlock>

        <Callout type="info" title="Save-gated tabs">
          <code>onChange</code> fires before the index updates, so it&apos;s the right place to persist the current
          tab&apos;s data before moving (the clinical-record wizard saves each section on switch).
        </Callout>
      </section>

      {/* ============ 3. Props ============ */}
      <section style={sectionStyle}>
        <h2 id="props" style={h2Style}>
          3. Props
        </h2>

        <h3 style={h3Style}>Tabs</h3>
        <PropsTable
          props={[
            { name: "tabs", type: "TabDef[]", required: true, description: "Ordered tab definitions ({ id, label })." },
            { name: "active", type: "number", required: true, description: "0-based index of the active tab. Owned by the parent." },
            { name: "onChange", type: "(index: number) => void", required: true, description: "Called with the next active index on click or keyboard navigation. Run save-on-switch logic here." },
            { name: "idBase", type: "string", required: true, description: "Namespace for the generated tab/panel ids. Pass React.useId()." },
            { name: "ariaLabel", type: "string", default: '"Sections"', description: "Accessible name for the tablist (announced by screen readers)." },
          ]}
        />

        <h3 style={h3Style}>TabPanel</h3>
        <PropsTable
          props={[
            { name: "idBase", type: "string", required: true, description: "Must match the Tabs idBase so aria-controls / aria-labelledby resolve." },
            { name: "tabId", type: "string", required: true, description: "The id of the currently-active tab (e.g. tabs[active].id)." },
            { name: "children", type: "React.ReactNode", required: true, description: "The active section's content." },
          ]}
        />

        <h3 style={h3Style}>TabDef</h3>
        <PropsTable
          props={[
            { name: "id", type: "string", required: true, description: "Stable id fragment used to build the tab and panel ids." },
            { name: "label", type: "string", required: true, description: "Visible, accessible tab label." },
          ]}
        />
      </section>

      {/* ============ 4. Accessibility ============ */}
      <section style={sectionStyle}>
        <h2 id="accessibility" style={h2Style}>
          4. Accessibility
        </h2>
        <A11yChecklist
          items={[
            { criterion: "Name, Role, Value", level: "AA", description: "Renders role=tablist / tab / tabpanel with aria-selected and aria-controls ↔ aria-labelledby wiring." },
            { criterion: "Keyboard", level: "AA", description: "Roving tabindex: only the active tab is in the tab order. Arrow keys move between tabs (automatic activation); Home/End jump to first/last." },
            { criterion: "Focus Order", level: "AA", description: "Focus follows selection, then Tab moves into the panel (tabindex=0)." },
            { criterion: "Status Messages", level: "AA", description: "A polite live region announces 'Section N of M: <label>' on change." },
            { criterion: "Focus Visible", level: "AA", description: "Each tab shows a visible focus ring over the muted track." },
          ]}
        />
      </section>

      {/* ============ 5. Do / Don't ============ */}
      <section style={sectionStyle}>
        <h2 id="guidelines" style={h2Style}>
          5. Guidelines
        </h2>
        <Callout type="info" title="✓ Do">
          <ul style={{ margin: 0, paddingLeft: "1.2em", display: "flex", flexDirection: "column", gap: "var(--ds-spacing-xs)" }}>
            <li>Use Tabs for non-linear sections a user revisits in any order (records, settings, detail facets).</li>
            <li>Run save / validation inside <code>onChange</code> so switching tabs never loses data.</li>
            <li>Give the tablist a meaningful <code>ariaLabel</code> describing what the sections are.</li>
          </ul>
        </Callout>
        <div style={{ marginTop: "var(--ds-spacing-lg)" }}>
          <Callout type="warning" title="✕ Don't">
            <ul style={{ margin: 0, paddingLeft: "1.2em", display: "flex", flexDirection: "column", gap: "var(--ds-spacing-xs)" }}>
              <li>
                Don&apos;t use Tabs for an ordered, must-complete-in-sequence flow — use <code>&lt;Wizard&gt;</code> (a linear
                stepper) instead.
              </li>
              <li>Never hand-roll tab <code>&lt;button&gt;</code>s — that drops the role / keyboard contract this component guarantees.</li>
            </ul>
          </Callout>
        </div>
      </section>
    </main>
  );
}
