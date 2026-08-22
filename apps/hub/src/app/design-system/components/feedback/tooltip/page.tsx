import * as React from "react";
import type { Metadata } from "next";
import { TooltipPlayground } from "./tooltip-playground";
import { Playground } from "@/components/design-system/playground";
import { PropsTable, DoDont, A11yChecklist, Callout } from "@/components/design-system/docs-kit";

export const metadata: Metadata = {
  title: "Tooltip - SAMAVESH Design System",
  description:
    "Tooltips display informative text when users hover over, focus on, or tap an element. They are small, contextual overlays.",
};

export default function TooltipPage(): React.JSX.Element {
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
          Tooltip
        </h1>
        <p className="ds-lead" style={leadStyle}>
          A hint bubble that appears on hover and focus. Tooltips provide contextual information without cluttering the UI.
        </p>
      </header>

      {/* ============ PLAYGROUND ============ */}
      <section style={sectionStyle}>
        <h2 id="playground" style={h2Style}>Playground</h2>
        <p style={proseStyle}>
          Try adjusting the side placement and delay. The tooltip will automatically flip to the opposite side if it hits the edge of the screen.
        </p>
        <div style={{ marginTop: "var(--sa-stack-24)" }}>
          <TooltipPlayground />
        </div>
      </section>

      {/* ============ 1. USAGE ============ */}
      <section style={sectionStyle}>
        <h2 id="usage" style={h2Style}>1. Usage</h2>
        <p style={proseStyle}>
          Tooltips should be used for supplementary information only. They are not accessible on all touch devices in the same way they are with a mouse, so critical information must always be placed directly on the page.
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
                label: "Wrap focusable elements (like Buttons or Links) so keyboard users can access the tooltip.",
                preview: null,
              },
              {
                type: "dont",
                label: "Don't put interactive content like links or buttons inside a tooltip. Use a Popover or Modal instead.",
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
          Wrap a single child element with the Tooltip. Ensure the child accepts and forwards <code>ref</code> and standard DOM event handlers (<code>onMouseEnter</code>, <code>onFocus</code>, etc.).
        </p>
        <Playground
          code={`<Tooltip content="Provides additional details about this action" side="right">
  <Button variant="ghost" aria-label="More information">
    <InfoIcon />
  </Button>
</Tooltip>`}
        />
      </section>

      {/* ============ 3. ACCESSIBILITY ============ */}
      <section style={sectionStyle}>
        <h2 id="accessibility" style={h2Style}>3. Accessibility (A11y)</h2>
        <p style={proseStyle}>
          SAMAVESH Tooltips meet WCAG 1.4.13 (Content on Hover or Focus) out-of-the-box.
        </p>
        <ul style={{ ...proseStyle, paddingLeft: "var(--sa-padding-20)", marginTop: "var(--sa-stack-16)", lineHeight: 1.8 }}>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Dismissible:</strong> Pressing <code>Escape</code> closes the tooltip without moving focus away from the trigger.</li>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Hoverable:</strong> The bubble stays open while the pointer is over it, so users who are zoomed in can move onto it to read it.</li>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Persistent:</strong> The tooltip remains visible until the user moves the pointer away, removes focus, or presses Escape.</li>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Aria-describedby:</strong> The tooltip automatically sets <code>aria-describedby</code> on the trigger to announce the tooltip text. Set <code>duplicatesTriggerName=true</code> if the tooltip simply repeats the trigger's accessible name (e.g., an icon-only button), avoiding double announcement.</li>
        </ul>
      </section>

      {/* ============ 4. API ============ */}
      <section style={sectionStyle}>
        <h2 id="api" style={h2Style}>4. API Reference</h2>
        <PropsTable
          props={[
            { name: "content", type: "ReactNode", required: true, description: "The content of the tooltip." },
            { name: "children", type: "ReactElement", required: true, description: "The trigger element. Must accept refs and DOM event handlers (e.g. Button, Link, span)." },
            { name: "side", type: '"top" | "bottom" | "left" | "right"', default: '"top"', description: "The preferred placement." },
            { name: "sideOffset", type: "number", default: "6", description: "Distance (in px) between the tooltip and the trigger." },
            { name: "delay", type: "number", default: "200", description: "Delay (in ms) before the tooltip appears on hover." },
            { name: "disabled", type: "boolean", default: "false", description: "Prevents the tooltip from showing." },
            { name: "duplicatesTriggerName", type: "boolean", default: "false", description: "Set to true if the tooltip text is exactly the same as the trigger's accessible name. This hides the tooltip from screen readers to prevent redundant announcements." },
          ]}
        />
      </section>
    </main>
  );
}
