import * as React from "react";
import type { Metadata } from "next";
import { ModalPlayground } from "./modal-playground";

export const metadata: Metadata = {
  title: "Modal - SAMAVESH Design System",
  description: "Modals focus the user’s attention exclusively on one task or piece of information via a window that sits on top of the page content.",
};

export default function ModalPage(): React.JSX.Element {
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
          Modal
        </h1>
        <p className="ds-lead" style={{ fontSize: "var(--sa-type-headline-3-size)", color: "var(--sa-text-neutral-subtle)" }}>
          Modals focus the user’s attention exclusively on one task or piece of information via a window that sits on top of the page content.
        </p>
      </header>

      {/* ============ PLAYGROUND ============ */}
      <ModalPlayground />

      {/* ============ 1. USAGE ============ */}
      <section style={sectionStyle}>
        <h2 id="usage" style={h2Style}>1. Usage</h2>
        <p style={proseStyle}>
          Modals are highly disruptive. They halt the user's current context and require an action before they can return. Use them sparingly, only when an action is irreversible, or when a sub-flow is required to complete the main flow.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "var(--sa-inline-24)",
            marginTop: "var(--sa-stack-24)",
          }}
        >
          <UseCard tone="do" title="When to use">
            <li>For critical confirmations (e.g., deleting a record).</li>
            <li>For short, independent sub-tasks (e.g., creating a new folder, selecting an option).</li>
            <li>When you must interrupt the user with urgent information.</li>
          </UseCard>
          <UseCard tone="dont" title="When NOT to use">
            <li>Don't use for complex forms that require referencing the underlying page.</li>
            <li>Don't stack modals on top of other modals.</li>
            <li>Don't use for simple feedback (use a Toast or Alert instead).</li>
          </UseCard>
        </div>
      </section>

      {/* ============ 2. SIZES ============ */}
      <section style={sectionStyle}>
        <h2 id="sizes" style={h2Style}>2. Sizes</h2>
        <p style={proseStyle}>
          Modals come in three preset widths. The height will automatically adjust to the content, but long content will scroll within the modal body.
        </p>
        <ul style={{ ...proseStyle, paddingLeft: "var(--sa-padding-20)", marginTop: "var(--sa-stack-16)" }}>
          <li><strong>Small (<code>sm</code>, max 400px):</strong> Best for simple confirmations, alerts, and very short inputs (e.g. deleting a user).</li>
          <li><strong>Medium (<code>md</code>, max 600px):</strong> The default. Good for standard sub-tasks, multi-field inputs, and settings.</li>
          <li><strong>Large (<code>lg</code>, max 800px):</strong> Use when the modal requires a data table, large chart, or multi-column layout.</li>
        </ul>
      </section>

      {/* ============ 3. ANATOMY ============ */}
      <section style={sectionStyle}>
        <h2 id="anatomy" style={h2Style}>3. Anatomy</h2>
        <p style={proseStyle}>
          The Modal consists of four distinct architectural areas:
        </p>
        <ol style={{ ...proseStyle, paddingLeft: "var(--sa-padding-20)", marginTop: "var(--sa-stack-16)" }}>
          <li><strong>Backdrop:</strong> The dark scrim that obscures the page. Clicking it closes the modal.</li>
          <li><strong>Header:</strong> Contains the title and the close button. The title is automatically wired to <code>aria-labelledby</code>.</li>
          <li><strong>Body:</strong> The main scrollable content area.</li>
          <li><strong>Footer (Optional):</strong> Contains the primary and secondary actions, aligned to the right.</li>
        </ol>
        <CodeBlock>{`import { Modal } from "@mosje/design-system";

<Modal
  open={isOpen}
  onClose={() => setIsOpen(false)}
  title="Action Required"
  size="md"
  footer={<Button onClick={handleConfirm}>Confirm</Button>}
>
  <p>Modal body content goes here.</p>
</Modal>`}</CodeBlock>
      </section>

      {/* ============ 4. ACCESSIBILITY ============ */}
      <section style={sectionStyle}>
        <h2 id="accessibility" style={h2Style}>4. Accessibility (A11y)</h2>
        <p style={proseStyle}>
          SAMAVESH Modals handle complex accessibility requirements internally.
        </p>
        <ul style={{ ...proseStyle, paddingLeft: "var(--sa-padding-20)", marginTop: "var(--sa-stack-16)", lineHeight: 1.8 }}>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Focus Trap:</strong> When opened, focus is automatically moved to the first focusable element inside the modal. Tabbing will cycle through the modal's elements and will not escape to the background page.</li>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Focus Restoration:</strong> When closed, focus is automatically returned to the exact element that originally opened the modal, preventing keyboard users from losing their place.</li>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Scroll Locking:</strong> The <code>&lt;body&gt;</code> is locked from scrolling while the modal is open.</li>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Escape Key:</strong> Hitting the <code>Escape</code> key triggers the <code>onClose</code> handler.</li>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>ARIA Roles:</strong> The modal panel has <code>role="dialog"</code>, <code>aria-modal="true"</code>, and <code>aria-labelledby</code> pointing to the auto-generated ID of the title.</li>
        </ul>
      </section>
    </main>
  );
}

/* Local Helpers */
function UseCard({ tone, title, children }: { tone: "do" | "dont"; title: string; children: React.ReactNode }) {
  const accent = tone === "do" ? "var(--sa-color-status-success)" : "var(--sa-color-status-danger)";
  return (
    <div
      style={{
        border: "1px solid var(--sa-border-neutral-subtle)",
        borderTop: `3px solid ${accent}`,
        borderRadius: "var(--sa-shape-8)",
        padding: "var(--sa-padding-20)",
        background: "var(--sa-bg-neutral-base)",
      }}
    >
      <h3 style={{ margin: 0, marginBottom: "var(--sa-stack-12)", fontSize: "var(--sa-type-headline-2-size)", fontWeight: 600, color: "var(--sa-text-neutral-base)" }}>
        {title}
      </h3>
      <ul style={{ margin: 0, paddingLeft: "var(--sa-padding-20)", color: "var(--sa-text-neutral-subtle)", fontSize: "var(--sa-type-body-2-size)", lineHeight: 1.8 }}>
        {children}
      </ul>
    </div>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre
      style={{
        background: "var(--sa-bg-neutral-subtler)",
        border: "1px solid var(--sa-border-neutral-subtle)",
        borderRadius: "var(--sa-shape-8)",
        padding: "var(--sa-padding-16)",
        overflowX: "auto",
        fontSize: "var(--sa-type-body-2-size)",
        lineHeight: 1.6,
        color: "var(--sa-text-neutral-base)",
        marginTop: "var(--sa-stack-16)",
      }}
    >
      <code style={{ fontFamily: "var(--sa-font-mono)" }}>{children}</code>
    </pre>
  );
}
