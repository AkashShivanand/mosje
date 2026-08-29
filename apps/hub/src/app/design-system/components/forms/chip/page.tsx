import * as React from "react";
import type { Metadata } from "next";
import { ChipPlayground } from "./chip-playground";
import { Playground } from "@/components/design-system/playground";
import { PropsTable, DoDont } from "@/components/design-system/docs-kit";
import { DocsTabs } from "@/components/design-system/docs-kit";


export const metadata: Metadata = {
  title: "Chip - SAMAVESH Design System",
  description:
    "A compact, pill-shaped element used for filters, selections, and removable tags.",
};

export default function ChipPage(): React.JSX.Element {
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
    <article
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
          Chip
        </h1>
        <p className="ds-lead" style={leadStyle}>
          A compact pill-shaped component used for filtering, multi-selection, and displaying removable tags.
        </p>
      </header>

      {/* ============ PLAYGROUND ============ */}
      
      <DocsTabs
        tabs={[
          {
            id: "design",
            label: "Design",
            content: (
              <div className="ds-prose">
                <section style={{ marginBottom: "var(--sa-section-48)" }}>
        <h2 id="playground" style={h2Style}>Playground</h2>
        <p style={proseStyle}>
          Configure the Chip to act as a toggleable filter, a removable tag, or a static label.
        </p>
        <div style={{ marginTop: "var(--sa-stack-24)" }}>
          <ChipPlayground />
        </div>
      </section>
<section style={{ marginBottom: "var(--sa-section-48)" }}>
        <h2 id="usage" style={h2Style}>1. Usage</h2>
        <p style={proseStyle}>
          Chips are incredibly versatile. You can use them as a group of filters (like a multi-select), as tags that users can add or remove, or simply as static categories.
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
                label: "Pass `onSelectedChange` to make the chip act as a toggle button (e.g. for filtering).",
                preview: null,
              },
              {
                type: "dont",
                label: "Don't use Chips for primary page actions. Use standard Buttons instead.",
                preview: null,
              },
            ]}
          />
        </div>
      </section>
<section style={{ marginBottom: "var(--sa-section-48)" }}>
        <h2 id="code-example" style={h2Style}>2. Code Example</h2>
        <p style={proseStyle}>
          Here&apos;s how to create a dismissible filter tag.
        </p>
        <Playground
          code={`const [filters, setFilters] = React.useState(["Active", "Pending"]);

return (
  <div style={{ display: "flex", gap: 8 }}>
    {filters.map(f => (
      <Chip 
        key={f}
        onDismiss={() => setFilters(prev => prev.filter(x => x !== f))}
      >
        {f}
      </Chip>
    ))}
  </div>
);`}
        />
      </section>

              </div>
            )
          },
          {
            id: "develop",
            label: "Develop",
            content: (
              <div className="ds-prose">
                <section style={{ marginBottom: "var(--sa-section-48)" }}>
        <h2 id="api" style={h2Style}>4. API Reference</h2>
        <PropsTable
          props={[
            { name: "selected", type: "boolean", default: "false", description: "Controlled selected state." },
            { name: "onSelectedChange", type: "(selected: boolean) => void", description: "Enables interaction. Called when the chip is clicked or toggled via keyboard." },
            { name: "leadingIcon", type: "ReactNode", description: "Optional icon rendered before the label." },
            { name: "onDismiss", type: "() => void", description: "Renders a trailing dismiss (×) button and calls this when clicked." },
            { name: "dismissLabel", type: "string", default: '"Remove"', description: "Accessible label for the dismiss button." },
            { name: "trailingDropdown", type: "boolean", default: "false", description: "Renders a trailing chevron, often used to open a popover menu." },
            { name: "disabled", type: "boolean", default: "false", description: "Disables all interactions and dims the chip." },
            { name: "children", type: "ReactNode", required: true, description: "The chip label text." },
          ]}
        />
      </section>

              </div>
            )
          },
          {
            id: "accessibility",
            label: "Accessibility",
            content: (
              <div className="ds-prose">
                <section style={{ marginBottom: "var(--sa-section-48)" }}>
        <h2 id="accessibility" style={h2Style}>3. Accessibility (A11y)</h2>
        <ul style={{ ...proseStyle, paddingLeft: "var(--sa-padding-20)", marginTop: "var(--sa-stack-16)", lineHeight: 1.8 }}>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Keyboard Operable:</strong> If <code>onSelectedChange</code> is provided, the chip receives a <code>tabIndex</code> and can be toggled via Space or Enter.</li>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Semantic Roles:</strong> Interactive chips receive <code>role=&quot;button&quot;</code> and <code>aria-pressed</code> to announce their toggle state to screen readers.</li>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Dismiss Button:</strong> The trailing dismiss cross is a real <code>&lt;button&gt;</code> with an explicit <code>aria-label</code> (defaults to &quot;Remove&quot;).</li>
        </ul>
      </section>

              </div>
            )
          }
        ]}
      />

    </article>
  );
}
