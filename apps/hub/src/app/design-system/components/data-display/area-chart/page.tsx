import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
} from "@/components/design-system/docs-kit";

import { AreaChartSpecimen } from "./specimen";

export const metadata: Metadata = {
  title: "Area Chart — Design System",
  description:
    "A filled trend over an ordered axis, for cumulative readings such as funds disbursed to date or enrolment reached.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.1.1 Non-text Content",
    level: "A",
    status: "verified",
    description:
      "Rendered through ChartFrame, which draws an SVG <title> and <desc> and a visually hidden table of every label and series value.",
    evidence: "ChartFrame's `table` and `summary` props, passed by area-chart.tsx on every render.",
  },
  {
    criterion: "1.4.1 Use of Color",
    level: "A",
    status: "partial",
    description:
      "Series are separated by fill colour and by legend order alone; there is no pattern or marker per series. Where two fills overlap, the screen-reader table is what disambiguates them.",
    evidence: "area-chart.tsx applies a per-series fill from the categorical ramp and no pattern.",
  },
  {
    criterion: "1.4.11 Non-text Contrast",
    level: "AA",
    status: "untested",
    description:
      "Fills are drawn at reduced opacity over the canvas so that overlaps stay readable. No contrast measurement of the resulting composite has been recorded.",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    status: "partial",
    description:
      'The figures are reachable through the screen-reader table. The per-point hit areas set tabIndex={0} beneath an SVG carrying role="img", which prunes its descendants, so those stops receive focus with no accessible name.',
    evidence: 'Open gap, recorded 2026-09-02: role="img" in chart-frame.tsx against the point hit areas in area-chart.tsx.',
  },
  {
    criterion: "GIGW 3.0 — Data Presentation",
    level: "GIGW",
    status: "verified",
    description: "Values format through formatIndian by default, so a figure reads 4,50,000 rather than 450,000.",
    evidence: "`valueFormat` defaults to formatIndian in area-chart.tsx.",
  },
];

export default function AreaChartPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Area Chart"
      status="Beta"
      summary="A line with the space beneath it filled, for a reading whose accumulated size is the point — funds disbursed to date, places filled against a sanctioned total."
      figma={{ node: "chartsChart" }}
      specimen={<AreaChartSpecimen />}
      propsFrom="AreaChartProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "The magnitude under the line is part of the reading — a cumulative disbursal, a running enrolment total.",
          "One series, or two that do not overlap enough to obscure each other.",
          "The axis is time or another ordered sequence.",
        ],
        avoid: [
          "Only the direction matters, not the accumulated size — use a Line Chart, whose fill would add nothing but ink.",
          "Three or more series overlap; the fills hide one another and the reader has to guess at what is behind. Use a Line Chart, or a stacked Bar Chart where the parts genuinely sum.",
          "The categories have no order — a fill across unordered categories implies a continuity that is not there. Use a Bar Chart.",
          "A count and a rate share the canvas — use a Combo Chart, which gives each its own axis.",
        ],
      }}
      related={[
        { label: "Line Chart", href: "/design-system/components/data-display/line-chart", reason: "when only the direction matters" },
        { label: "Combo Chart", href: "/design-system/components/data-display/combo-chart", reason: "when two series need two scales" },
        { label: "Bar Chart", href: "/design-system/components/data-display/bar-chart", reason: "for stacked parts of a whole" },
        { label: "Chart Frame", href: "/design-system/components/data-display/chart-frame", reason: "the shell every chart renders through" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-states">
            <h2 id="cdp-states" className="cdp__h2">
              The States It Draws
            </h2>
            <p>
              The specimen shows the four states that are not the populated one. Each calls for a
              different action from the reader, and a chart that draws one blank panel for all four
              tells them nothing.
            </p>
            <ul>
              <li>
                <strong>Loading</strong> — a skeleton at the chart&apos;s aspect ratio, carrying{" "}
                <code>role=&quot;status&quot;</code>.
              </li>
              <li>
                <strong>Empty</strong> — the feed answered with nothing. No retry is offered.
              </li>
              <li>
                <strong>Error</strong> — the request failed; <code>onRetry</code> renders
                &ldquo;Try again&rdquo;.
              </li>
              <li>
                <strong>Filtered to nothing</strong> — <code>filterLabel</code> names the filter, so
                the reader can undo what they applied.
              </li>
            </ul>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-limit">
            <h2 id="cdp-limit" className="cdp__h2">
              Overlap Is the Limit
            </h2>
            <p>
              Two filled series already trade legibility for the fill; three do not survive it. Where a
              third series is genuinely needed, either drop the fill and use a Line Chart, or make the
              parts add up and use a stacked Bar Chart — which is an honest sum rather than three
              translucent shapes over one another.
            </p>
            <p>
              <code>yLabel</code> names the unit. An axis of bare numbers on a departmental page is a
              figure with no unit, and this chart is most often carrying rupees.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { AreaChart } from "@mosje/design-system";

<AreaChart
  title="Disbursals by Month"
  yLabel="₹ crore"
  labels={["Apr", "May", "Jun", "Jul", "Aug"]}
  series={[{ name: "Disbursed", data: [120, 240, 380, 520, 610] }]}
/>`}</CodeBlock>
          <p>
            Resolve the reading once and give the chart the answer, so a key above it and the chart
            itself cannot disagree about what the feed said.
          </p>
          <CodeBlock>{`<AreaChart
  title="Disbursals by Month"
  labels={labels}
  series={series}
  state={error ? "error" : loading ? "loading" : undefined}
  onRetry={refetch}
  filterLabel="financial year"
/>`}</CodeBlock>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-sr">
          <h2 id="cdp-sr" className="cdp__h2">
            What a Screen Reader Gets
          </h2>
          <p>
            One image with a name and a summary, followed by a visually hidden table whose columns are
            the labels and whose rows are the series. The fill carries nothing that the table does not.
          </p>
          <p>
            <strong>The open gap.</strong> Point hit areas are focusable but sit beneath{" "}
            <code>role=&quot;img&quot;</code>, so they are pruned from the accessibility tree and
            announce as nothing. Do not describe this chart as keyboard-navigable until that is fixed.
          </p>
        </section>
      }
    />
  );
}
