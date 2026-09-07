import type { Metadata } from "next";
import * as React from "react";
import { Callout, CodeBlock, ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";
import { ReportSpecimen } from "../specimens";

export const metadata: Metadata = {
  title: "Report Screen — Design System",
  description: "A print-first tabular statement, with its criteria and issuer on the page rather than in browser chrome.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "A real table with a caption, scoped column headers, and a tfoot for totals.",
    status: "verified",
    evidence: "Rendered as table/caption/thead th[scope=col]/tbody/tfoot; no div grid is used.",
  },
  {
    criterion: "1.4.10 Reflow",
    level: "AA",
    description:
      "The table scrolls horizontally on screen only. This is the single place on the estate a table may do that, because a statement's columns are fixed by the statement and paper has no narrow viewport.",
    status: "partial",
    evidence: "The wrapper sets overflow-x: auto on screen and visible in print. The scroll container is not keyboard-focusable, which is a known gap for keyboard-only horizontal scrolling.",
  },
  {
    criterion: "1.4.8 Visual Presentation",
    level: "AAA",
    description:
      "Numeric columns are right-aligned and tabular, so figures line up digit under digit down a printed column.",
    status: "verified",
    evidence: "The numeric flag sets data-numeric, which the stylesheet binds to text-align: right and font-variant-numeric: tabular-nums.",
  },
];

export default function ReportScreenPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Report Screen"
      status="Beta"
      summary={"A tabular statement meant to be printed or filed. It is the one template that deliberately does not page, because page 1 of 9 is not a statement."}
      figma={{
        absent:
          "Absent. No report or export surface is drawn anywhere on the handoff page.",
      }}
      specimen={<ReportSpecimen />}
      propsFrom="ReportScreenProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A utilisation statement, a sanction list, a district-wise summary.",
          "Anything taken to a meeting or filed rather than glanced at.",
        ],
        avoid: [
          "A dashboard read on screen — that is Overview Screen.",
          "Rows an officer acts on — that is Worklist Screen.",
        ],
      }}
      related={[
        { label: "Overview Screen", href: "/design-system/components/templates/overview-screen", reason: "when it is read on screen" },
        { label: "Data Table", href: "/design-system/components/data-display/data-table", reason: "the interactive alternative" },
        { label: "Chart Export", href: "/design-system/components/dashboard/chart-export", reason: "the same export vocabulary" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-print">
            <h2 id="cdp-print" className="cdp__h2">Four Things the Printer Needs and No Screen Does</h2>
            <p>
              A masthead <em>on the page</em> — issuer, title, when it was drawn — because the
              browser&rsquo;s own chrome prints as a URL in 8pt. The criteria in force, because the
              select boxes that produced this set do not survive the printer and a figure without
              its filters cannot be reproduced. A repeated header row, which{" "}
              <code>thead</code> gives for free. And no pagination.
            </p>
            <Callout type="warning" title="It takes every row, not one page">
              A report is printed and filed. Where the set is too large to hold, narrow it with
              criteria rather than paging it — that is the deliberate difference from Worklist
              Screen, which always pages.
            </Callout>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-ratio">
            <h2 id="cdp-ratio" className="cdp__h2">Both Halves of a Ratio From One Source</h2>
            <p>
              The template cannot check this and no gate can see it. Mixing a numerator from a live
              feed with a denominator from a snapshot published a <code>138%</code> once. Only the
              person composing the figure can prevent it.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">Example</h2>
          <CodeBlock>{`<ReportScreen
  title="Grant Utilisation Statement"
  issuer="Department of Social Justice & Empowerment"
  generatedAt={formatDate(new Date())}
  criteria={[
    { label: "Financial Year", value: filters.fy },
    { label: "Scheme", value: filters.scheme },
  ]}
  exportActions={<ExportButtons onCsv={toCsv} onPrint={() => window.print()} />}
  columns={COLUMNS}
  rows={rows}
  getRowId={(r) => r.id}
  totals={(key) => (key === "requested" ? money(sum) : null)}
  footnotes="Figures are as recorded in the MIS on the date of generation."
/>`}</CodeBlock>
        </section>
      }
    />
  );
}
