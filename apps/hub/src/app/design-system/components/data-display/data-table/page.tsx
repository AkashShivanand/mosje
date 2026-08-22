import * as React from "react";
import type { Metadata } from "next";
import { DataTablePlayground } from "./data-table-playground";

export const metadata: Metadata = {
  title: "Data Table - SAMAVESH Design System",
  description: "Data tables display sets of structured data, making it easy to scan, compare, and analyze information.",
};

export default function DataTablePage(): React.JSX.Element {
  const sectionStyle: React.CSSProperties = { marginTop: "var(--sa-stack-48)", paddingTop: "var(--sa-stack-48)", borderTop: "1px solid var(--sa-border-neutral-subtle)" };
  const h2Style: React.CSSProperties = { fontSize: "var(--sa-type-headline-2-size)", fontWeight: 600, margin: "0 0 var(--sa-stack-24) 0", color: "var(--sa-text-neutral-bolder)" };
  const proseStyle: React.CSSProperties = { color: "var(--sa-text-neutral-base)", fontSize: "var(--sa-type-body-1-size)", lineHeight: 1.6 };

  return (
    <main className="ds-prose" style={{ maxWidth: "1000px", padding: "var(--sa-padding-40) var(--sa-padding-24)" }}>
      <header style={{ marginBottom: "var(--sa-stack-40)" }}>
        <h1 style={{ fontSize: "var(--sa-type-headline-1-size)", margin: "0 0 var(--sa-stack-16) 0" }}>Data Table</h1>
        <p className="ds-lead" style={{ fontSize: "var(--sa-type-headline-3-size)", color: "var(--sa-text-neutral-subtle)" }}>
          Data tables display sets of structured data in rows and columns, making it easy to scan, compare, and analyze information across Ministry portals.
        </p>
      </header>

      <DataTablePlayground />

      <section style={sectionStyle}>
        <h2 id="usage" style={h2Style}>1. Usage</h2>
        <p style={proseStyle}>The SAMAVESH DataTable standardizes how we display tabular data across all MoSJE portals (NMBA, SCW, SMILE, PM-AJAY). It includes built-in pagination, accessible structure, and standardized Figma treatments.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--sa-inline-24)", marginTop: "var(--sa-stack-24)" }}>
          <UseCard tone="do" title="When to use">
            <li>To display large sets of structured, repeating data.</li>
            <li>When users need to compare data points across multiple records.</li>
            <li>For dashboard listings, transaction histories, and applicant directories.</li>
          </UseCard>
          <UseCard tone="dont" title="When NOT to use">
            <li>For layout purposes (never use tables for page structure).</li>
            <li>For small amounts of unstructured data (use a list or description list instead).</li>
          </UseCard>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 id="features" style={h2Style}>2. Features & Best Practices</h2>
        <ul style={{ ...proseStyle, paddingLeft: "var(--sa-padding-20)", marginTop: "var(--sa-stack-16)", lineHeight: 1.8 }}>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Pagination:</strong> Built-in controls for page sizes (10, 50, 100) and an intelligent ellipsis pager that prevents UI overflow on large datasets.</li>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Header Treatment:</strong> Headers are intentionally sentence-cased and neutral. Avoid shouty ALL-CAPS headers.</li>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Alignment:</strong> Align textual data to the left, and numeric data (currency, counts, dates) to the right. This allows users to quickly scan and compare magnitudes.</li>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Accessibility:</strong> Pass a descriptive <code>caption</code> to the table (it renders visually hidden, but screen readers read it to provide context). Table headers use <code>scope="col"</code> automatically.</li>
        </ul>
      </section>
      
      <section style={sectionStyle}>
        <h2 id="code" style={h2Style}>3. Code Example</h2>
        <CodeBlock>{`import { DataTable, type DataTableColumn } from "@mosje/design-system";

const columns: DataTableColumn<Applicant>[] = [
  { key: "id", header: "Applicant ID" },
  { key: "name", header: "Full Name" },
  { 
    key: "score", 
    header: "Score",
    className: "ds-text-right",
    render: (row) => row.score.toFixed(2)
  }
];

export function ApplicantList({ data }) {
  return (
    <DataTable
      columns={columns}
      data={data}
      total={data.length}
      caption="List of recent scholarship applicants"
    />
  );
}`}</CodeBlock>
      </section>
    </main>
  );
}

function UseCard({ tone, title, children }: { tone: "do" | "dont"; title: string; children: React.ReactNode }) {
  const accent = tone === "do" ? "var(--sa-color-status-success)" : "var(--sa-color-status-danger)";
  return (
    <div style={{ border: "1px solid var(--sa-border-neutral-subtle)", borderTop: `3px solid ${accent}`, borderRadius: "var(--sa-shape-8)", padding: "var(--sa-padding-20)", background: "var(--sa-bg-neutral-base)" }}>
      <h3 style={{ margin: 0, marginBottom: "var(--sa-stack-12)", fontSize: "var(--sa-type-headline-2-size)", fontWeight: 600, color: "var(--sa-text-neutral-base)" }}>{title}</h3>
      <ul style={{ margin: 0, paddingLeft: "var(--sa-padding-20)", color: "var(--sa-text-neutral-subtle)", fontSize: "var(--sa-type-body-2-size)", lineHeight: 1.8 }}>{children}</ul>
    </div>
  );
}
function CodeBlock({ children }: { children: string }) {
  return (
    <pre style={{ background: "var(--sa-bg-neutral-subtler)", border: "1px solid var(--sa-border-neutral-subtle)", borderRadius: "var(--sa-shape-8)", padding: "var(--sa-padding-16)", overflowX: "auto", fontSize: "var(--sa-type-body-2-size)", lineHeight: 1.6, color: "var(--sa-text-neutral-base)", marginTop: "var(--sa-stack-16)" }}>
      <code style={{ fontFamily: "var(--sa-font-mono)" }}>{children}</code>
    </pre>
  );
}
