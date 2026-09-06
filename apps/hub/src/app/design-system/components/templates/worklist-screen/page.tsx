import type { Metadata } from "next";
import * as React from "react";
import { Callout, CodeBlock, ComponentDocPage, MatrixTable, type A11yItem } from "@/components/design-system/docs-kit";
import { WorklistSpecimen } from "../specimens";

export const metadata: Metadata = {
  title: "Worklist Screen — Design System",
  description:
    "Many records the reader acts on: filters, table, bulk actions and a pager, with all seven states owned by the template.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "The desktop form is a real table with a caption taking the page title. Below the tablet anchor the same rows render as a `<ul>` of cards, so a screen reader is still told how many records there are.",
    status: "verified",
    evidence: "DataTable renders a <table> with a <caption>; the mobile form is a <ul> of <li>, with its list styling reset rather than its semantics removed.",
  },
  {
    criterion: "4.1.3 Status Messages",
    level: "AA",
    description:
      "The loading state carries `role=\"status\"` and `aria-busy`, and its skeleton is `aria-hidden` — the wait is announced once rather than as a stack of empty boxes.",
    status: "verified",
    evidence: "ScreenBody renders role=\"status\" aria-busy=\"true\" with an aria-label from the copy object; the skeleton beneath it is aria-hidden.",
  },
  {
    criterion: "2.4.6 Headings and Labels",
    level: "AA",
    description:
      "The template renders exactly one `<h1>`, through `PageHeader`. The eyebrow is a `<p>`, not a heading, so it qualifies the title without competing with it in a heading list.",
    status: "verified",
    evidence: "PageHeader renders the eyebrow as a paragraph and the title as h1 by default.",
  },
  {
    criterion: "1.4.10 Reflow",
    level: "AA",
    description:
      "No horizontal scroll at 320px. Priority-3 columns are dropped and priority-1 becomes the card title, rather than the table scrolling sideways inside a card.",
    status: "verified",
    evidence: "Rendered at 375×812 in Storybook; the table is display:none and the card list carries the rows.",
  },
  {
    criterion: "2.5.8 Target Size (Minimum)",
    level: "AA",
    description:
      "The template's own controls — the retry, the clear-filters and the bulk-action bar — are DS Buttons, whose minimum height is `control/height/md` (40px), above the 24×24 minimum. Anything a caller passes into `rowActions` is the caller's to meet; that is stated on the Accessibility tab.",
    status: "verified",
    evidence: "Every control the template renders itself is a DS Button; --sa-control-height-md resolves to 40px.",
  },
];

export default function WorklistScreenPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Worklist Screen"
      status="Beta"
      summary="Many records the reader acts on. Filters, a table, bulk actions and a pager — plus every one of the seven states, which the caller never writes."
      figma={{
        absent:
          "The handoff draws no list screen at all: Pagination, Breadcrumb and Search return zero hits across all 5,138 nodes of the E-Anudaan page. The layout here is the estate's own answer, recorded in docs/audit/figma-handoff-defects-2026-09-06.md.",
      }}
      specimen={<WorklistSpecimen />}
      propsFrom="WorklistScreenProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A queue an officer works through — pending approvals, withdrawn applications, deficiencies.",
          "Any list where the reader selects rows and does something to them.",
          "A list that can grow past one screen: the pager is not optional here.",
        ],
        avoid: [
          "A list the reader only browses — use Catalogue Screen.",
          "A set the reader composed with a query rather than filters — use Search Screen.",
          "A server-paged list: this template hands the whole matching set to DataTable, which pages client-side.",
        ],
      }}
      related={[
        { label: "Data Table", href: "/design-system/components/data-display/data-table", reason: "what renders the rows, and what owns the pager" },
        { label: "Bulk Actions Bar", href: "/design-system/components/data-display/bulk-actions-bar", reason: "appears while a selection is held" },
        { label: "Portal Page", href: "/design-system/components/templates/portal-page", reason: "the chrome this sits inside" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-why">
            <h2 id="cdp-why" className="cdp__h2">Why This Template Exists</h2>
            <p>
              Measured on 6 September 2026: <strong>43 portal pages use a data table, and one of
              the estate&rsquo;s 265 portal pages uses Pagination</strong>. The handoff draws no
              list screen to copy, so every one of those 43 invented its own — and 236 of the 265
              pages handle none of loading, empty or error.
            </p>
            <Callout type="info" title="The states are structural, not remembered">
              Every part of this screen routes through <code>ScreenBody</code>, so there is no
              code path that renders rows without also having decided what happens when there are
              none.
            </Callout>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-priority">
            <h2 id="cdp-priority" className="cdp__h2">Priority Is How a Twelve-Column Table Survives a Phone</h2>
            <MatrixTable
              caption="What each priority does below the tablet anchor"
              columns={["Priority", "On the table", "On the card"]}
              rows={[
                ["1", "A column", "The card's title"],
                ["2 (default)", "A column", "A label/value pair"],
                ["3", "A column", "Dropped"],
              ]}
            />
            <p>
              One column should carry priority 1. If none does, the first column is used. The
              cards read the same array as the table, so the two cannot disagree about what is in
              the register.
            </p>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-counts">
            <h2 id="cdp-counts" className="cdp__h2">Two Counts, Kept Apart</h2>
            <p>
              <code>rows.length</code> is what the pager counts and always equals the array.{" "}
              <code>registerTotal</code> is how large the register is before the reader&rsquo;s
              filters, and it appears only in the sentence that says so.
            </p>
            <Callout type="warning" title="Found by rendering it">
              An earlier version passed a register total of 68 straight to{" "}
              <code>DataTable</code> alongside five rows. The pager offered seven pages, six of
              them empty, while the table showed five records — the &ldquo;one request, one
              answer&rdquo; defect in miniature.
            </Callout>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">Example</h2>
          <CodeBlock>{`<PortalPage portal="e-anudaan" role="officer" header={header} nav={NAV}>
  <WorklistScreen
    eyebrow="E-ANUDAAN"
    title="Pending Approvals"
    columns={COLUMNS}          // WorklistColumn<T>[], with priority
    rows={matching}            // EVERY matching row, not one page
    registerTotal={4210}       // the register before filters
    getRowId={(row) => row.id}
    noun="application"
    activeFilterCount={active}
    onClearFilters={clear}
    onRetry={refetch}
    loading={isLoading}
    error={error}
    filters={<><Select …/><DateRangePicker …/></>}
    rowActions={(row) => <Button href={href(row)}>Open</Button>}
    selectedIds={selected}
    onSelectionChange={setSelected}
    bulkActions={[{ id: "export", label: "Export" }]}
    onBulkAction={handleBulk}
  />
</PortalPage>`}</CodeBlock>
          <p>
            Pass the real filter predicate to <code>activeFilterCount</code>. A default-valued
            select is not a filter, and counting it turns every empty register into &ldquo;try
            clearing your filters&rdquo; — advice the reader cannot act on.
          </p>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-a11y-notes">
          <h2 id="cdp-a11y-notes" className="cdp__h2">Two Things the Template Cannot Do for You</h2>
          <p>
            <strong>Omit an action this role may not perform</strong> rather than rendering it
            disabled. A dead control tells the reader nothing about why, and a screen reader
            announces it as present but unavailable — which is worse than its absence.
          </p>
          <p>
            <strong>Anything you pass to <code>rowActions</code> is yours to make operable.</strong>{" "}
            DS Buttons meet the 24×24 minimum of WCAG 2.2 §2.5.8; a bare icon or a hand-rolled
            span does not.
          </p>
        </section>
      }
    />
  );
}
