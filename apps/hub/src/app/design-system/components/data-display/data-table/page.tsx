import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
  type PropDef,
} from "@/components/design-system/docs-kit";

import { DataTableSpecimen } from "./specimen";

export const metadata: Metadata = {
  title: "Data Table — Design System",
  description:
    "Structured rows and columns with built-in pagination and a screen-reader caption, for scheme listings, applicant directories and transaction histories.",
};

/*
 * `DataTableColumn<T>` is the shape the `columns` prop is built from, and it is
 * where every decision on this page lives. The extractor reads interfaces, not
 * the members of the generic types they reference, so it is documented by hand
 * — the case the template's docstring keeps hand-written rows for.
 */
const COLUMN: PropDef[] = [
  {
    name: "DataTableColumn.key",
    type: "string",
    required: true,
    description: "The property on the row. It is also the export and copy key, so it must be the real field name even when `render` replaces what is shown.",
  },
  {
    name: "DataTableColumn.header",
    type: "string",
    required: true,
    description: "The column heading. Title Case, never capitals — see the header note in the Design tab.",
  },
  {
    name: "DataTableColumn.render",
    type: "(row: T) => React.ReactNode",
    description:
      "Custom cell content. Falls back to String(row[key]). Type the row interface so the row is typed here — an untyped row makes every field unknown and the cell will not compile.",
  },
  {
    name: "DataTableColumn.className",
    type: "string",
    description: "An extra class on the cell, for alignment. Numeric columns take a right-aligned class from the host app.",
  },
  {
    name: "DataTableColumn.exportValue",
    type: "(row: T) => string",
    description: "The value used when copying or exporting, for a column whose display comes from `render`. Without it a rendered badge exports as its markup rather than its meaning.",
  },
  {
    name: "DataTableColumn.noExport",
    type: "boolean",
    description: "Excludes the column from copy and export — for a column of action buttons, which mean nothing in a spreadsheet.",
  },
];

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    status: "verified",
    description:
      "A real <table> with a <caption> and column headers carrying scope=\"col\", so the relationship between a cell and its heading is structural rather than visual.",
    evidence: "data-table.tsx renders thead th elements with scope=\"col\" and the caption from `caption`.",
  },
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    status: "verified",
    description:
      'The pager is a <nav aria-label="Table pagination">; each page button is named "Page N" and the current one carries aria-current="page". The page-size buttons report aria-pressed.',
    evidence: "data-table.tsx lines 135–136, 155, 159, 176–177 and 187.",
  },
  {
    criterion: "2.4.4 Link Purpose (In Context)",
    level: "A",
    status: "verified",
    description:
      'The previous and next controls carry aria-label="Previous page" and "Next page", so they are named independently of their chevron glyphs.',
    evidence: "data-table.tsx lines 159 and 187.",
  },
  {
    criterion: "1.1.1 Non-text Content",
    level: "A",
    status: "verified",
    description:
      'The chevrons and the ellipsis glyph are aria-hidden, and the ellipsis carries a visually hidden "more pages" so the gap in the page list is announced rather than skipped.',
    evidence: "data-table.tsx lines 39, 42, 45 and 169.",
  },
  {
    criterion: "4.1.3 Status Messages",
    level: "AA",
    status: "untested",
    description:
      "Changing the page replaces the rows without announcing that anything changed. A screen-reader user who presses “Page 3” is not told the table has been rebuilt; they have to go and find out.",
  },
  {
    criterion: "1.4.10 Reflow",
    level: "AA",
    status: "untested",
    description:
      "Wide tables scroll horizontally within their own container. No measurement at 320px with a real six-column scheme listing has been recorded.",
  },
];

export default function DataTablePage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Data Table"
      status="Stable"
      summary="Displays structured rows and columns with built-in pagination and an accessible caption. It is the estate's one table, used across NMBA, SCW, SMILE and PM-AJAY so a listing reads the same wherever it appears."
      figma={{ absent: "Not yet published in the Figma library." }}
      specimen={<DataTableSpecimen />}
      propsFrom="DataTableProps"
      props={COLUMN}
      a11y={A11Y}
      whenToUse={{
        use: [
          "A large set of structured, repeating records has to be scanned or compared — a dashboard listing, an applicant directory, a transaction history.",
          "The reader needs the exact figures rather than the shape of them.",
          "The list is long enough to page. Pagination is built in and needs no wiring beyond `total`.",
        ],
        avoid: [
          "The table is being used for layout. A table describes a relationship between headings and cells; using one for page structure lies to every screen reader that reads it.",
          "There are a handful of unstructured facts — use a description list, or a Card.",
          "The reading is a shape rather than a set of values — use a chart, and put the table beneath it.",
          "There is one record with named fields — a Card or a Form Card reads better than a two-column table.",
        ],
      }}
      related={[
        { label: "Card", href: "/design-system/components/data-display/card", reason: "for a single record's fields" },
        { label: "Tabs", href: "/design-system/components/navigation/tabs", reason: "when the rows split into alternatives rather than pages" },
        { label: "Filter Bar", href: "/design-system/components/dashboard/filter-bar", reason: "the controls that narrow a listing" },
        { label: "Empty State", href: "/design-system/components/feedback/empty-state", reason: "for a whole surface with nothing on it" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-usage">
            <h2 id="cdp-usage" className="cdp__h2">
              One Table Across the Estate
            </h2>
            <p>
              The SAMAVESH Data Table standardises how tabular data is shown across every MoSJE portal.
              Pagination, the accessible structure and the header treatment come with it, so a listing
              in SMILE and a listing in PM-AJAY are the same object rather than two that resemble each
              other.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-features">
            <h2 id="cdp-features" className="cdp__h2">
              Pagination, Headers and Alignment
            </h2>
            <ul>
              <li>
                <strong>Pagination.</strong> Page sizes of 10, 50 and 100, with an ellipsis pager that
                keeps the control from overflowing on a large set. Set{" "}
                <code>showPageSizes</code> to false for the government register pattern, which states
                the visible range instead — &ldquo;Showing 1–10 of 71&rdquo; — and fixes the page size
                at the first entry of <code>pageSizes</code>.
              </li>
              <li>
                <strong>Headers are Title Case and neutral — never capitals.</strong> The estate&apos;s
                copy rule puts column headers in Title Case, and ALL-CAPS shouts on a listing of
                citizens&apos; applications.
              </li>
              <li>
                <strong>Text left, numbers right.</strong> Currency, counts and dates align right so a
                reader can compare magnitudes by scanning a single edge. Pass the alignment class
                through <code>className</code> on the column.
              </li>
              <li>
                <strong>Always pass a <code>caption</code>.</strong> It renders visually hidden, and it
                is what tells a screen-reader user which table they have landed in.
              </li>
            </ul>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-empty">
            <h2 id="cdp-empty" className="cdp__h2">
              Empty and Filtered to Nothing Are Different Sentences
            </h2>
            <p>
              <code>emptyLabel</code> defaults to &ldquo;No records found.&rdquo;, which is the right
              answer to neither question. <em>&ldquo;No scheme has been published yet&rdquo;</em> and{" "}
              <em>&ldquo;no scheme matches the filters you applied&rdquo;</em> have different remedies,
              and a table that says one for both is lying about one of them.
            </p>
            <p>
              The specimen shows both. Where the reader caused the state, name the filter and say how to
              clear it — they are the only person who can undo it.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <p>
            <strong>Type the row.</strong> <code>DataTable</code> is generic over{" "}
            <code>T extends Record&lt;string, unknown&gt;</code>, so a column&apos;s{" "}
            <code>render</code> receives an untyped row unless the interface is declared — and{" "}
            <code>row.score.toFixed(2)</code> against an untyped row does not compile, because{" "}
            <code>row.score</code> is <code>unknown</code>. That exact example stood on this page until
            it was corrected.
          </p>
          <CodeBlock>{`import { DataTable, type DataTableColumn } from "@mosje/design-system";

interface Applicant extends Record<string, unknown> {
  id: string;
  name: string;
  score: number;
}

const columns: DataTableColumn<Applicant>[] = [
  { key: "id", header: "Applicant ID" },
  { key: "name", header: "Full Name" },
  {
    key: "score",
    header: "Score",
    className: "ds-text-right",
    render: (row) => row.score.toFixed(2),
  },
];

export function ApplicantList({ data }: { data: Applicant[] }) {
  return (
    <DataTable
      columns={columns}
      data={data}
      total={data.length}
      caption="Recent scholarship applicants"
      emptyLabel="No applications have been received for this scheme yet."
    />
  );
}`}</CodeBlock>
          <p>
            A column whose display comes from <code>render</code> needs an{" "}
            <code>exportValue</code>, or the copied cell carries the rendered node rather than the
            figure. A column of action buttons takes <code>noExport</code> instead.
          </p>
          <CodeBlock>{`{
  key: "status",
  header: "Status",
  render: (row) => <Badge tone={row.status === "Active" ? "success" : "neutral"}>{row.status}</Badge>,
  exportValue: (row) => row.status,
}`}</CodeBlock>
        </section>
      }
      accessibility={
        <>
          <section className="cdp__section" aria-labelledby="cdp-structure">
            <h2 id="cdp-structure" className="cdp__h2">
              Structure
            </h2>
            <p>
              A real <code>&lt;table&gt;</code>, with a <code>&lt;caption&gt;</code> from{" "}
              <code>caption</code> and column headings carrying{" "}
              <code>scope=&quot;col&quot;</code> automatically. The caption is visually hidden and is
              not optional: it is how a screen-reader user knows which of a page&apos;s tables they are
              in.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-pager">
            <h2 id="cdp-pager" className="cdp__h2">
              The Pager
            </h2>
            <ul>
              <li>
                <strong>Tab</strong> — moves through the page-size buttons and then the page numbers.
                There is no arrow-key movement between them; each is its own tab stop.
              </li>
              <li>
                <strong>Enter</strong> or <strong>Space</strong> — activates the focused control. All of
                them are real buttons.
              </li>
            </ul>
            <p>
              The pager is a <code>&lt;nav&gt;</code> named &ldquo;Table pagination&rdquo;, the current
              page reports <code>aria-current=&quot;page&quot;</code>, and the ellipsis carries a
              visually hidden &ldquo;more pages&rdquo; so the gap in the sequence is announced rather
              than silently skipped.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-gap">
            <h2 id="cdp-gap" className="cdp__h2">
              The Open Gap
            </h2>
            <p>
              Changing the page rewrites the rows and announces nothing. A screen-reader user who
              presses &ldquo;Page 3&rdquo; is given no confirmation that the table changed and has to go
              and check. A polite live region reporting the new visible range would close it; it is not
              implemented, and this page says so rather than claiming the criterion is met.
            </p>
          </section>
        </>
      }
    />
  );
}
