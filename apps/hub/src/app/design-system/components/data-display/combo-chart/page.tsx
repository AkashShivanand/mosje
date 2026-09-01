import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
} from "@/components/design-system/docs-kit";

import { ComboChartSpecimen } from "./specimen";

export const metadata: Metadata = {
  title: "Combo Chart — Design System",
  description:
    "Bars and a line on one canvas with two independent y axes, for a count and a rate that share a period but not a scale.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.1.1 Non-text Content",
    level: "A",
    status: "verified",
    description:
      "Rendered through ChartFrame, which draws an SVG <title> and <desc> and a visually hidden table carrying both the bar series and the line series against the shared labels.",
    evidence: "ChartFrame's `table` and `summary` props, passed by combo-chart.tsx on every render.",
  },
  {
    criterion: "1.4.1 Use of Color",
    level: "A",
    status: "verified",
    description:
      "The two families are separated by form before colour — bars are filled rectangles, the overlay is a stroked line — so the reading survives a monochrome print and a colour-vision difference.",
    evidence: "combo-chart.tsx renders `bars` as rect marks and `lines` as a path, both labelled in the legend.",
  },
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    status: "partial",
    description:
      "The screen-reader table holds both scales' figures, but it does not state which axis each row belongs to. Name the axes through leftLabel and rightLabel so the relationship is at least stated visually.",
    evidence: "combo-chart.tsx composes one `table` from both series without an axis column.",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    status: "partial",
    description:
      'Figures are reachable through the screen-reader table. The per-category hit areas set tabIndex={0} beneath an SVG carrying role="img", which prunes its descendants, so those stops have no accessible name.',
    evidence: 'Open gap, recorded 2026-09-02: role="img" in chart-frame.tsx against tabIndex={0} at combo-chart.tsx line 191.',
  },
  {
    criterion: "GIGW 3.0 — Data Presentation",
    level: "GIGW",
    status: "verified",
    description: "Values format through formatIndian by default, so a figure reads 4,50,000 rather than 450,000.",
    evidence: "`valueFormat` defaults to formatIndian in combo-chart.tsx.",
  },
];

export default function ComboChartPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Combo Chart"
      status="Beta"
      summary="Bars and a line over the same categories, each read against its own y axis. It is the chart for a count and a rate that belong together but do not share a scale."
      figma={{ absent: "Not yet published in the Figma library. The chart catalogue is authored in code first; a Figma counterpart has not been drawn." }}
      specimen={<ComboChartSpecimen />}
      propsFrom="ComboChartProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A quantity and a rate share a period — funds released in crore against the percentage utilised.",
          "A measured figure is read against a target or a benchmark drawn as a line over it.",
          "Exactly two scales are in play, and each is named.",
        ],
        avoid: [
          "Both series share a scale — put them in one Bar Chart or one Line Chart; a second axis that measures the same thing invites a false comparison.",
          "There are three or more scales. There are two axes; a third reading has no honest place to be read from.",
          "The reader only needs the trend of one figure — use a Line Chart.",
          "The parts sum to a whole — use a stacked Bar Chart, or a Donut Chart where the total is the reading.",
        ],
      }}
      related={[
        { label: "Bar Chart", href: "/design-system/components/data-display/bar-chart", reason: "when one scale is enough" },
        { label: "Line Chart", href: "/design-system/components/data-display/line-chart", reason: "when only the trend is read" },
        { label: "Legend", href: "/design-system/components/data-display/legend", reason: "the key that names both families" },
        { label: "Chart Frame", href: "/design-system/components/data-display/chart-frame", reason: "the shell every chart renders through" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-states">
            <h2 id="cdp-states" className="cdp__h2">
              The States It Draws
            </h2>
            <p>
              The specimen shows loading, empty, error and filtered-to-nothing. On a combo chart the
              distinction matters more than usual: a reader who has filtered to one quarter and sees a
              blank panel has no way to tell that from a feed being down.
            </p>
            <ul>
              <li>
                <strong>Loading</strong> — a skeleton at the chart&apos;s aspect ratio, carrying{" "}
                <code>role=&quot;status&quot;</code>.
              </li>
              <li>
                <strong>Empty</strong> — answered, nothing to draw. No retry.
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
          </section>
          <section className="cdp__section" aria-labelledby="cdp-axes">
            <h2 id="cdp-axes" className="cdp__h2">
              Two Axes, Two Names
            </h2>
            <p>
              <strong>Always set <code>leftLabel</code> and <code>rightLabel</code>.</strong> A second
              y axis is only readable when the reader is told which series belongs to which, and an
              unlabelled pair invites exactly the comparison a dual axis cannot support — that a bar
              taller than the line means anything at all. The two scales are independent; only the
              shape of each series against its own axis is a reading.
            </p>
            <p>
              Keep it to one bar series and one line. Two of each is four series over two scales, and
              at that point the chart is a table.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { ComboChart } from "@mosje/design-system";

<ComboChart
  title="Quarterly Target Against Utilisation"
  labels={["Q1", "Q2", "Q3", "Q4"]}
  bars={[{ name: "Target", data: [100, 150, 200, 250] }]}
  lines={[{ name: "Utilisation", data: [95, 94, 99, 96] }]}
  leftLabel="₹ crore released"
  rightLabel="Per cent utilised"
/>`}</CodeBlock>
          <p>
            Both families come from one request, so both take one resolved state. Deriving them
            separately is how a page ends up with bars drawn and a line missing, with nothing on
            screen saying why.
          </p>
          <CodeBlock>{`<ComboChart
  title="Quarterly Target Against Utilisation"
  labels={labels}
  bars={bars}
  lines={lines}
  state={reading == null ? "error" : undefined}
  onRetry={refetch}
  filterLabel="quarter filter"
/>`}</CodeBlock>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-sr">
          <h2 id="cdp-sr" className="cdp__h2">
            What a Screen Reader Gets
          </h2>
          <p>
            One image with a name and a summary, then a visually hidden table whose columns are the
            shared labels and whose rows are every bar and line series. Because the two scales are
            different, name them in the series names as well as on the axes — &ldquo;Utilisation
            (%)&rdquo; reads correctly in the table where &ldquo;Utilisation&rdquo; alone does not.
          </p>
          <p>
            <strong>The open gap.</strong> The per-category hit areas are focusable but sit beneath{" "}
            <code>role=&quot;img&quot;</code> and are pruned from the accessibility tree, so they
            announce as nothing.
          </p>
        </section>
      }
    />
  );
}
