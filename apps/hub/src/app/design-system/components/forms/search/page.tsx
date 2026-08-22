import * as React from "react";
import type { Metadata } from "next";
import { SearchPlayground } from "./search-playground";
import { Playground } from "@/components/design-system/playground";
import { PropsTable, DoDont } from "@/components/design-system/docs-kit";

export const metadata: Metadata = {
  title: "Search - SAMAVESH Design System",
  description:
    "An input field optimized for search queries, featuring a leading icon, optional clear button, and submit handler.",
};

export default function SearchPage(): React.JSX.Element {
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
          Search
        </h1>
        <p className="ds-lead" style={leadStyle}>
          A native <code>type=“search”</code> input featuring a leading search icon, an optional clear button, and an integrated submit handler.
        </p>
      </header>

      {/* ============ PLAYGROUND ============ */}
      <section style={sectionStyle}>
        <h2 id="playground" style={h2Style}>Playground</h2>
        <p style={proseStyle}>
          Try typing in the search box to see the clear button appear, and press Enter to trigger the submit handler.
        </p>
        <div style={{ marginTop: "var(--sa-stack-24)" }}>
          <SearchPlayground />
        </div>
      </section>

      {/* ============ 1. USAGE ============ */}
      <section style={sectionStyle}>
        <h2 id="usage" style={h2Style}>1. Usage</h2>
        <p style={proseStyle}>
          Use the Search component for filtering data tables in-place or for masthead site search. By passing an <code>onSubmit</code> prop, the leading icon becomes an interactive button, allowing users to submit their query by clicking or pressing Enter.
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
                label: "Provide a clear, descriptive placeholder (e.g., 'Search by name or Aadhaar number...') to help users understand what they can search for.",
                preview: null,
              },
              {
                type: "dont",
                label: "Don't use the Search component for standard form fields. Use the regular Input component instead.",
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
          The Search component is available in three sizes to fit different contexts.
        </p>
        <ul style={{ ...proseStyle, paddingLeft: "var(--sa-padding-20)", marginTop: "var(--sa-stack-16)" }}>
          <li><strong>Small (<code>sm</code>):</strong> Best for compact layouts like data table toolbars or side panels.</li>
          <li><strong>Medium (<code>md</code>):</strong> The default size, suitable for most page content and forms.</li>
          <li><strong>Large (<code>lg</code>):</strong> Ideal for prominent, central search bars (e.g., a hero section or masthead).</li>
        </ul>
      </section>

      {/* ============ 3. CODE EXAMPLE ============ */}
      <section style={sectionStyle}>
        <h2 id="code-example" style={h2Style}>3. Code Example</h2>
        <Playground
          code={`function GlobalSearch() {
  const [query, setQuery] = React.useState("");

  return (
    <Search 
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      size="lg"
      placeholder="Search DoSJE..."
      onClear={() => setQuery("")}
      onSubmit={(val) => window.location.href = \`/search?q=\${val}\`}
    />
  );
}`}
        />
      </section>

      {/* ============ 4. ACCESSIBILITY ============ */}
      <section style={sectionStyle}>
        <h2 id="accessibility" style={h2Style}>4. Accessibility (A11y)</h2>
        <ul style={{ ...proseStyle, paddingLeft: "var(--sa-padding-20)", marginTop: "var(--sa-stack-16)", lineHeight: 1.8 }}>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Input Type:</strong> Uses <code>type=“search”</code>, which triggers the appropriate keyboard layout on mobile devices.</li>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Aria Label:</strong> Automatically falls back to the placeholder text if an explicit <code>aria-label</code> is not provided.</li>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Clear Button:</strong> The clear button is fully keyboard accessible and has a descriptive <code>aria-label</code>.</li>
        </ul>
      </section>

      {/* ============ 5. API ============ */}
      <section style={sectionStyle}>
        <h2 id="api" style={h2Style}>5. API Reference</h2>
        <PropsTable
          props={[
            { name: "value", type: "string", required: true, description: "Controlled input value." },
            { name: "onChange", type: "ChangeEventHandler<HTMLInputElement>", required: true, description: "Called when the input value changes." },
            { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Controls the height and padding of the search bar." },
            { name: "onClear", type: "() => void", description: "Called when the user clicks the clear (×) button. Enables the clear button when value is non-empty." },
            { name: "onSubmit", type: "(value: string) => void", description: "Called when the user presses Enter or clicks the leading search icon. Changes the icon into a submit button." },
            { name: "placeholder", type: "string", description: "Hint text displayed when empty." },
            { name: "...rest", type: "InputHTMLAttributes<HTMLInputElement>", description: "All standard input attributes." },
          ]}
        />
      </section>
    </main>
  );
}
