import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
} from "@/components/design-system/docs-kit";

import { PieChartSpecimen } from "./specimen";

export const metadata: Metadata = {
  title: "Pie Chart — Design System",
  description:
    "Shares of a single whole, drawn as slices with a legend beside them. For two to four parts that differ plainly in size.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.1.1 Non-text Content",
    level: "A",
    status: "verified",
    description:
      "Rendered through ChartFrame, which draws an SVG <title>, a <desc> listing every slice and its percentage, and a visually hidden table of the underlying values.",
    evidence: "pie-chart.tsx composes `summary` from the slice percentages and passes `table` to ChartFrame.",
  },
  {
    criterion: "1.4.1 Use of Color",
    level: "A",
    status: "verified",
    description:
      "Each slice is named in the legend beside the chart and repeated with its share in the screen-reader table, so no slice is identified by colour alone.",
    evidence: "pie-chart.tsx renders a Legend built from the same data as the slices.",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    status: "untested",
    description:
      "The slices are not focusable and there is no keyboard interaction to test — the reading is carried entirely by the summary and the screen-reader table. This page previously described tabbing between segments; nothing in the component does that.",
    evidence: "pie-chart.tsx sets no tabIndex on any slice.",
  },
  {
    criterion: "1.4.11 Non-text Contrast",
    level: "AA",
    status: "untested",
    description:
      "Adjacent slices are separated by their fills alone. No contrast measurement between neighbouring steps of the categorical ramp has been recorded across the brand packs.",
  },
];

export default function PieChartPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Pie Chart"
      status="Beta"
      summary="Divides one whole into slices, with a legend naming each. It answers “roughly what share” for a small number of parts, and nothing more precise than that."
      figma={{ absent: "Not yet published in the Figma library. The chart catalogue is authored in code first; a Figma counterpart has not been drawn." }}
      specimen={<PieChartSpecimen />}
      propsFrom="PieChartProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "Two to four parts make up one whole and their sizes differ plainly.",
          "The reading is a rough share — about two thirds, about a quarter — and no comparison between parts is being asked for.",
          "The total itself does not need stating on the chart.",
        ],
        avoid: [
          "The total is worth stating — use a Donut Chart, whose centre exists for exactly that.",
          "Parts are close in size. A reader cannot rank two similar slices by eye; use a Bar Chart, where the difference is a length.",
          "There are more than about five parts. This was previously documented as a limit of six; four is the point at which the legend starts doing the chart's work.",
          "The shares change over time — use a stacked Bar Chart or an Area Chart.",
          "One figure is being read against a target — use a Gauge, or a Progress bar in a list.",
        ],
      }}
      related={[
        { label: "Donut Chart", href: "/design-system/components/data-display/donut-chart", reason: "the same shares with the total in the middle" },
        { label: "Bar Chart", href: "/design-system/components/data-display/bar-chart", reason: "when the parts must be compared precisely" },
        { label: "Legend", href: "/design-system/components/data-display/legend", reason: "the key rendered beside the slices" },
        { label: "Funnel Chart", href: "/design-system/components/data-display/funnel-chart", reason: "when the parts are stages of one flow" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-states">
            <h2 id="cdp-states" className="cdp__h2">
              The States It Draws
            </h2>
            <p>
              The specimen shows the four states that are not the populated one. They matter here for
              a reason particular to a pie: a total of zero produces no slices at all, which is
              indistinguishable from a failed request unless the state says which it was.
            </p>
            <ul>
              <li>
                <strong>Loading</strong> — a skeleton at the chart&apos;s own proportions, carrying{" "}
                <code>role=&quot;status&quot;</code>.
              </li>
              <li>
                <strong>Empty</strong> — the feed answered and the total is genuinely nought. No retry.
              </li>
              <li>
                <strong>Error</strong> — the request failed; <code>onRetry</code> renders
                &ldquo;Try again&rdquo;.
              </li>
              <li>
                <strong>Filtered to nothing</strong> — <code>filterLabel</code> names the filter the
                reader applied.
              </li>
            </ul>
            <p>
              A zero total falls back to <code>&quot;empty&quot;</code> on its own. Pass{" "}
              <code>state</code> wherever the caller knows better, which is any case where a feed was
              asked and might not have answered.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-limits">
            <h2 id="cdp-limits" className="cdp__h2">
              What a Pie Cannot Do
            </h2>
            <p>
              A reader compares angles far less accurately than lengths. That is the whole of the case
              against this chart, and it is why the catalogue keeps it for two to four plainly
              different parts and routes everything else to a bar. Where a departmental figure has to
              be compared, quoted or ranked, it belongs in a bar chart or a table.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { PieChart } from "@mosje/design-system";

<PieChart
  title="Fund Distribution"
  data={[
    { label: "Direct Benefit", value: 60 },
    { label: "Infrastructure", value: 40 },
  ]}
/>`}</CodeBlock>
          <CodeBlock>{`<PieChart
  title="Fund Distribution"
  data={parts}
  state={error ? "error" : loading ? "loading" : undefined}
  onRetry={refetch}
  filterLabel="component filter"
/>`}</CodeBlock>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-sr">
          <h2 id="cdp-sr" className="cdp__h2">
            What a Screen Reader Gets
          </h2>
          <p>
            One image whose description is the reading itself — &ldquo;Direct Benefit 60.0%,
            Infrastructure 40.0%&rdquo; — followed by a visually hidden table of the underlying values.
            A pie is the one chart in the catalogue whose summary is close to a complete substitute for
            the picture, which is a consequence of how little it can carry.
          </p>
          <p>
            There is no keyboard interaction to document. The slices are not focusable, and nothing in
            the component listens for a key.
          </p>
        </section>
      }
    />
  );
}
