import type { Metadata } from "next";
import * as React from "react";
import { CodeBlock, ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";
import { BulkPlayground } from "./bulk-playground";

export const metadata: Metadata = {
  title: "Bulk Actions Bar — Design System",
  description:
    "The strip that appears when rows are selected. It announces the count politely, always offers a way to clear, and sits in the flow rather than floating over the table.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "4.1.3 Status Messages",
    level: "AA",
    status: "verified",
    evidence:
      'The bar is a <div role="status" aria-live="polite"> holding the count, so appearing and re-counting are announced without focus moving. Read from the rendered DOM, and observed changing from "2 applications selected" to "3 applications selected" when a row was ticked on this page.',
    description:
      "Selecting rows is announced — otherwise a screen reader hears only 'checked' and never learns actions have appeared.",
  },
  {
    criterion: "1.4.1 Use of Color",
    level: "A",
    status: "verified",
    evidence:
      "Tone colours the action's label and its border, never a resting fill, and each action carries its own words — 'Return for correction', 'Reject'. Read from computed styles: the danger action's background-color matches the neutral one and only border-color and color differ.",
    description: "Destructive actions are named, not merely reddened.",
  },
  {
    criterion: "2.5.8 Target Size (Minimum)",
    level: "AA",
    status: "verified",
    evidence:
      "Each action binds --sa-control-height-sm (2rem = 32px) as a min-height with 12px of horizontal padding. Measured with getBoundingClientRect on this page: every action exceeds 32px tall and 24px wide.",
    description: "Actions are 32px tall, above the 24×24 minimum.",
  },
];

export default function BulkActionsBarPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Bulk Actions Bar"
      status="Stable"
      summary="The strip that appears when rows are selected. It announces the count politely, always offers a way to clear the selection, and sits in the flow rather than floating over the last row of the table."
      figma={{ node: "bulkActionsBar" }}
      specimen={<BulkPlayground />}
      propsFrom="BulkActionsBarProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A table or list lets the reader select several records and act on all of them at once.",
          "The actions apply to every selected record identically — assign, export, return, reject.",
        ],
        avoid: [
          "Only one record can be acted on at a time — put the action on the row, in a Menu.",
          "The actions are page-level rather than selection-level — those belong in the Page Header, where they are visible before anything is selected.",
          "The bar would be the only way to discover that selection is possible. Selection has to be visible in the table first.",
        ],
      }}
      related={[
        { label: "Data Table", href: "/design-system/components/data-display/data-table", reason: "the surface the selection is made in" },
        { label: "Menu", href: "/design-system/components/actions/menu", reason: "for actions on a single row" },
        { label: "Checkbox", href: "/design-system/components/forms/checkbox", reason: "the control that drives the selection" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-announce">
            <h2 id="cdp-announce" className="cdp__h2">The Count Is Announced, Not Just Drawn</h2>
            <p>
              Selecting rows changes nothing a screen reader would notice on its own. The checkbox
              says &ldquo;checked&rdquo;, and the page says nothing about how many are now selected
              or what can be done with them — so a whole toolbar can appear unremarked.
            </p>
            <p>
              The bar is a polite live region. <strong>Polite, not assertive</strong>: the reader is
              selecting deliberately, and an assertive announcement would interrupt them on every
              single click.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-clear">
            <h2 id="cdp-clear" className="cdp__h2">Clearing Is Always Offered</h2>
            <p>
              A reader who has selected forty rows by accident — and on a long table with a
              shift-click that is easy — needs one control to undo it, not forty. It sits apart from
              the actions, at the opposite end from anything destructive.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-flow">
            <h2 id="cdp-flow" className="cdp__h2">It Does Not Float</h2>
            <p>
              A bar pinned over the bottom of the viewport covers the last row of the table — which
              on a phone is very often the row the reader was about to act on. This sits in the flow
              above the table, where the selection is, and the page grows to hold it.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-noun">
            <h2 id="cdp-noun" className="cdp__h2">The Noun Is the Page&apos;s to Give</h2>
            <p>
              &ldquo;3 applications selected&rdquo; and &ldquo;3 records selected&rdquo; are
              different sentences, and only the page knows which is true. <code>noun</code> is
              singular and the bar pluralises it; pass <code>pluralNoun</code> where adding an
              &ldquo;s&rdquo; would be wrong — &ldquo;entries&rdquo;, not &ldquo;entrys&rdquo;.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">Example</h2>
          <CodeBlock>{`import { BulkActionsBar } from "@mosje/design-system";

<BulkActionsBar
  count={selected.length}
  noun="application"
  total={matched.length}
  onSelectAll={() => setSelected(matched)}
  onClear={() => setSelected([])}
  onAction={(id) => runBulk(id, selected)}
  actions={[
    { id: "assign", label: "Assign to an officer" },
    { id: "reject", label: "Reject", tone: "danger" },
  ]}
/>`}</CodeBlock>
          <p>
            At <code>count={0}</code> the bar renders <em>nothing</em> — not an empty strip. Give it{" "}
            <code>total</code> and it offers to extend the selection to everything that matched,
            which is the case a reader hits after filtering to 240 rows and selecting the 20 on
            screen.
          </p>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-order">
          <h2 id="cdp-order" className="cdp__h2">Where the Destructive Action Sits</h2>
          <p>
            The actions are pushed to the end of the bar and &ldquo;Clear selection&rdquo; follows
            them, so the most destructive action is never adjacent to the one a reader presses to
            back out. Tone colours the label and the border and never a resting fill: a filled red
            button in a bar that appeared on its own is easy to press by accident.
          </p>
        </section>
      }
    />
  );
}
