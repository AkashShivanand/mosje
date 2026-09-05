import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
} from "@/components/design-system/docs-kit";

import { RankedBarListSpecimen } from "./specimen";

export const metadata: Metadata = {
  title: "Ranked Bar List — Design System",
  description:
    "A label, a figure and a thin bar per row — the ranking and breakdown list every portal dashboard draws, paged rather than scrolled, with the figure as the reading and the bar as the aid.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    status: "verified",
    description:
      "The list is an ordered list named by `title`, so its order is the ranking and a screen reader announces the position of each row. The bar is aria-hidden because the figure beside it is printed as text.",
    evidence: "ranked-bar-list.tsx: the <ol> carries aria-label; every track carries aria-hidden.",
  },
  {
    criterion: "1.4.1 Use of Color",
    level: "A",
    status: "verified",
    description:
      "A tone tints the bar only. The figure, the label and, where a threshold is in play, the caption carry the reading in text, so a red bar is never the only way to know a district is below target.",
    evidence: "The specimen's SLA list states its thresholds in the caption; tones are applied through the row's --ranked-ink custom property.",
  },
  {
    criterion: "1.4.11 Non-text Contrast",
    level: "AA",
    status: "verified",
    description:
      "The neutral fill is the first categorical chart slot, which clears 3:1 against both page surfaces; the status fills are the estate's status inks at rung 600, each measured above 3:1 on white.",
    evidence: "packages/tokens/test/chart-palette.test.mjs for the chart slot; the Colour foundation page section 15 for the status inks.",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    status: "verified",
    description:
      "A row with `href` renders a real link with a visible focus ring; the page control is the design system's Pagination, which is a set of buttons. Nothing else on the list is operable.",
    evidence: "ranked-bar-list.css a.ds-ranked__label:focus-visible; Pagination's own checklist.",
  },
];

export default function RankedBarListPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Ranked Bar List"
      status="Beta"
      summary="One row per category: a label, a figure and a thin bar drawn against a shared ceiling. It is the ranking and the breakdown list every portal dashboard draws, and it pages rather than scrolls."
      figma={{ node: "chartsRankedList" }}
      specimen={<RankedBarListSpecimen />}
      propsFrom="RankedBarListProps"
      props={[
        {
          name: "InlineBar",
          type: "{ value; max; tone?; label? }",
          description:
            "The list's bar on its own, sized for a table cell. Give it a label only where the figure is not already printed beside it.",
        },
      ]}
      a11y={A11Y}
      whenToUse={{
        use: [
          "A ranking — top states by pledges, districts by SLA breach rate — where the reader wants the order and the figure, and the bar only helps them see the gap.",
          "A breakdown of one total into a handful of named parts, each printed with its share.",
          "A percentage against a target, with `max={100}` and a `toneFor` rule that states the threshold in the caption.",
          "A column in a Data Table that should be read at a glance — use `InlineBar` in the cell beside the printed figure.",
        ],
        avoid: [
          "Comparing several series across the same categories. That is a grouped Bar Chart, which has an axis, a legend and a screen-reader table.",
          "Change over time. The rows are categories, not periods; a Line Chart is the shape of a trend.",
          "More than about twenty rows on one screen without `pageSize`. Past that the list is a table, and a table has sort.",
          "A tone with no stated threshold. Green means on track on this estate; do not colour a row green because it is first.",
        ],
      }}
      related={[
        { label: "Bar Chart", href: "/design-system/components/data-display/bar-chart", reason: "when there is more than one series, or the figure is not printed per row" },
        { label: "Progress", href: "/design-system/components/data-display/progress", reason: "one figure against a maximum, on its own" },
        { label: "Data Table", href: "/design-system/components/data-display/data-table", reason: "when the reader needs to sort, or the list is long" },
        { label: "Pagination", href: "/design-system/components/navigation/pagination", reason: "the control the list pages with" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-reading">
            <h2 id="cdp-reading" className="cdp__h2">
              The Figure Is the Reading; the Bar Is the Aid
            </h2>
            <p>
              Every row prints its figure. The bar is drawn against a shared ceiling — the
              largest value in the list, or the <code>max</code> you pin — so the reader sees the
              gaps between rows without decoding an axis. Because the figure is text, the bar is
              hidden from assistive technology rather than described a second time, and the list
              needs no screen-reader table: the ordered list <em>is</em> the accessible reading.
            </p>
            <p>
              Pin <code>max</code> for a percentage. A list of compliance rates where the highest is
              94% would otherwise draw that row at full width, which reads as &ldquo;complete&rdquo;.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-tone">
            <h2 id="cdp-tone" className="cdp__h2">
              A Tone Is a Claim About the Figure
            </h2>
            <p>
              Green and red mean on track and breached on a government page, and the categorical
              chart ramp is kept clear of both for that reason. So a row takes a status tone only
              through <code>tone</code> or a <code>toneFor</code> rule — a threshold the scheme has
              actually stated — and the caption says what the threshold is. A ranking with no
              threshold stays in the neutral series colour, first row included.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-paging">
            <h2 id="cdp-paging" className="cdp__h2">
              It Pages; It Never Scrolls Inside Its Card
            </h2>
            <p>
              Pass <code>pageSize</code> and a long list pages with the design system&rsquo;s
              Pagination. A region that scrolls inside a card is the one thing this component
              refuses: on a phone, a reader flicking the page down lands in the list and moves the
              list instead. A fixed page size also keeps the card the same height whatever is in
              it.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-withheld">
            <h2 id="cdp-withheld" className="cdp__h2">
              A Withheld Figure Keeps Its Row
            </h2>
            <p>
              An item with <code>withheld</code> sorts last, prints an em dash, and hatches its
              track rather than drawing an empty one. &ldquo;Not reported&rdquo; and &ldquo;nought&rdquo;
              are different sentences, and a blank track would say the second.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { RankedBarList, InlineBar } from "@mosje/design-system";

<RankedBarList
  title="SLA compliance by district"
  items={districts.map((d) => ({ label: d.name, value: d.compliance, href: \`/districts/\${d.id}\` }))}
  max={100}
  valueFormat={(n) => \`\${n}%\`}
  toneFor={(item) => (item.value >= 90 ? "success" : item.value >= 80 ? "warning" : "danger")}
  caption="Target 90%."
  pageSize={8}
/>

// In a Data Table cell, beside the printed figure:
{ key: "utilised", header: "Utilisation", render: (r) => (
  <><InlineBar value={r.utilised} max={r.sanctioned} /> {formatCompact(r.utilised)} of {formatCompact(r.sanctioned)}</>
) }`}</CodeBlock>
          <p>
            Rows arrive in any order; the list sorts them (<code>sort=&quot;desc&quot;</code> by
            default). Pass <code>sort=&quot;none&quot;</code> to keep the order you gave, for a
            breakdown whose parts have a fixed sequence.
          </p>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-sr">
          <h2 id="cdp-sr" className="cdp__h2">
            What a Screen Reader Gets
          </h2>
          <p>
            An ordered list named by the title — &ldquo;Top states by pledges, list, 12
            items&rdquo; — then each row as its position, label and figure: &ldquo;1, Maharashtra,
            2,29,400&rdquo;. The bar is not announced, because it would repeat the figure. A
            withheld row is read as &ldquo;Not reported&rdquo; rather than as a dash.
          </p>
        </section>
      }
    />
  );
}
