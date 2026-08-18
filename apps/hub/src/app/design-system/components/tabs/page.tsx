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
  marginTop: "var(--sa-section-48)",
  scrollMarginTop: "var(--sa-section-48)",
};

const h2Style: React.CSSProperties = {
  fontSize: "var(--sa-type-headline-1-size)", lineHeight: "var(--sa-type-headline-1-lh)",
  fontWeight: 700,
  color: "var(--sa-text-neutral-base)",
  marginBottom: "var(--sa-stack-16)",
  paddingBottom: "var(--sa-padding-8)",
  borderBottom: "1px solid var(--sa-border-neutral-subtle)",
};

const h3Style: React.CSSProperties = {
  fontSize: "var(--sa-type-headline-2-size)",
  fontWeight: 600,
  color: "var(--sa-text-neutral-base)",
  marginTop: "var(--sa-stack-24)",
  marginBottom: "var(--sa-stack-8)",
};

const proseStyle: React.CSSProperties = {
  color: "var(--sa-text-neutral-subtle)",
  fontSize: "var(--sa-type-body-1-size)",
  lineHeight: 1.7,
  maxWidth: "68ch",
};

function CodeBlock({ children }: { children: string }): React.JSX.Element {
  return (
    <pre
      style={{
        background: "var(--sa-bg-neutral-subtler)",
        border: "1px solid var(--sa-border-neutral-subtle)",
        borderRadius: "var(--sa-shape-md)",
        padding: "var(--sa-padding-16)",
        overflowX: "auto",
        fontSize: "var(--sa-type-body-2-size)",
        lineHeight: 1.6,
        color: "var(--sa-text-neutral-base)",
        marginTop: "var(--sa-stack-8)",
      }}
    >
      <code style={{ fontFamily: "var(--sa-font-mono)" }}>{children}</code>
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
        padding: "var(--sa-padding-32) var(--sa-padding-24) var(--sa-section-56)",
      }}
    >
      {/* ── Title ── */}
      <header style={{ marginBottom: "var(--sa-stack-32)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--sa-stack-12)", flexWrap: "wrap" }}>
          <h1 style={{ fontSize: "var(--sa-type-display-1-size)", fontWeight: 800, color: "var(--sa-color-text-default)", margin: 0 }}>Tabs</h1>
          <StatusBadge status="Beta" />
        </div>
        <p style={{ ...proseStyle, marginTop: "var(--sa-stack-12)" }}>
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
        <div style={{ marginTop: "var(--sa-stack-16)" }}>
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
          <ul style={{ margin: 0, paddingLeft: "1.2em", display: "flex", flexDirection: "column", gap: "var(--sa-stack-4)" }}>
            <li>Use Tabs for non-linear sections a user revisits in any order (records, settings, detail facets).</li>
            <li>Run save / validation inside <code>onChange</code> so switching tabs never loses data.</li>
            <li>Give the tablist a meaningful <code>ariaLabel</code> describing what the sections are.</li>
          </ul>
        </Callout>
        <div style={{ marginTop: "var(--sa-stack-16)" }}>
          <Callout type="warning" title="✕ Don't">
            <ul style={{ margin: 0, paddingLeft: "1.2em", display: "flex", flexDirection: "column", gap: "var(--sa-stack-4)" }}>
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
