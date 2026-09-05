import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
  type PropDef,
} from "@/components/design-system/docs-kit";

import { ScatterChartSpecimen } from "./specimen";

export const metadata: Metadata = {
  title: "Scatter Chart — Design System",
  description:
    "Plots one measured quantity against another, one mark per record, for distribution and correlation across districts or units.",
};

/*
 * `ScatterSeries` and `ScatterPoint` are the shapes the `series` prop is built
 * from. The extractor reads interfaces, not the members of the types they
 * reference, so these two are documented by hand — the one case the template's
 * docstring names as legitimate.
 */
const SHAPES: PropDef[] = [
  {
    name: "ScatterSeries.name",
    type: "string",
    required: true,
    description: "The series name, used in the legend, the tooltip and the screen-reader table.",
  },
  {
    name: "ScatterSeries.points",
    type: "ScatterPoint[]",
    required: true,
    description: "The marks in this series.",
  },
  {
    name: "ScatterSeries.color",
    type: "string",
    description: "Overrides the categorical ramp. Pass a token, never a hex — a literal does not re-theme.",
  },
  {
    name: "ScatterPoint.x / .y",
    type: "number",
    required: true,
    description: "The two measured quantities, in the units named by xLabel and yLabel.",
  },
  {
    name: "ScatterPoint.label",
    type: "string",
    description:
      "Names the record the mark stands for — a district, an institution. It reaches the tooltip and the screen-reader table; a scatter with no point labels is a shape a reader cannot act on.",
  },
];

const A11Y: A11yItem[] = [
  {
    criterion: "1.1.1 Non-text Content",
    level: "A",
    status: "verified",
    description:
      "Rendered through ChartFrame, which draws an SVG <title> and <desc> and a visually hidden table with a row per point, so the coordinates reach a screen reader as figures.",
    evidence: "ChartFrame's `table` and `summary` props, passed by scatter-chart.tsx line 86 onward.",
  },
  {
    criterion: "1.4.1 Use of Color",
    level: "A",
    status: "partial",
    description:
      "Series are separated by colour and by the legend alone; every mark is the same circle. With one series that is unambiguous, with three it is not, and the screen-reader table is then the only unambiguous reading.",
    evidence: "scatter-chart.tsx draws one circle shape for every series and varies only the fill.",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    status: "partial",
    description:
      'Every coordinate is reachable through the screen-reader table. The marks themselves set tabIndex={0} beneath an SVG carrying role="img", which prunes its descendants, so those focus stops have no accessible name.',
    evidence: 'Open gap, recorded 2026-09-02: role="img" in chart-frame.tsx against tabIndex={0} at scatter-chart.tsx line 123.',
  },
  {
    criterion: "2.5.8 Target Size (Minimum)",
    level: "AA",
    status: "untested",
    description:
      "Mark radius is fixed in viewBox units, so the rendered target size depends on how wide the chart is drawn. No measurement at the narrowest supported width has been recorded.",
  },
];

export default function ScatterChartPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Scatter Chart"
      status="Beta"
      summary="Plots two measured quantities against each other, one mark per record, so the reader sees the spread and whether the two move together. It is the catalogue's chart for distribution rather than comparison."
      figma={{ node: "chartsChart" }}
      specimen={<ScatterChartSpecimen />}
      propsFrom="ScatterChartProps"
      props={SHAPES}
      a11y={A11Y}
      whenToUse={{
        use: [
          "Two measured quantities are compared across many units of the same kind — districts, institutions, shelters.",
          "The reading is the spread: which units sit apart from the rest, and whether the two figures move together.",
          "There are enough records that a table would not be read, and few enough that the marks do not merge.",
        ],
        avoid: [
          "One quantity is compared across named categories — use a Bar Chart; a scatter needs two measured axes.",
          "The x axis is time — use a Line Chart, which draws the path between readings that a scatter deliberately withholds.",
          "The records are places on a map and geography is part of the reading — use the India Map.",
          "Both axes are categorical and the value is the cell — use a Heatmap.",
          "There are thousands of points. Bin them first; an unclustered cloud is slow to draw and unreadable when drawn.",
        ],
      }}
      related={[
        { label: "Heatmap", href: "/design-system/components/data-display/heatmap", reason: "when both axes are categorical" },
        { label: "Line Chart", href: "/design-system/components/data-display/line-chart", reason: "when the x axis is time" },
        { label: "India Map", href: "/design-system/components/data-display/india-map", reason: "when the records are states" },
        { label: "Bar Chart", href: "/design-system/components/data-display/bar-chart", reason: "for one figure across categories" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-states">
            <h2 id="cdp-states" className="cdp__h2">
              The States It Draws
            </h2>
            <p>
              The specimen shows the four states that are not the populated one. On a scatter the
              filtered-to-nothing state is the one that earns its place most often, because narrowing
              to a single state is the first thing a reader does.
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
                <strong>Filtered to nothing</strong> — <code>filterLabel</code> names the filter, so
                the control reads &ldquo;Clear state filter&rdquo;.
              </li>
            </ul>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-density">
            <h2 id="cdp-density" className="cdp__h2">
              Density, Labels and Axes
            </h2>
            <ul>
              <li>
                <strong>Name both axes.</strong> <code>xLabel</code> and <code>yLabel</code> are what
                turn two numbers into a reading; without them the reader is looking at a shape.
              </li>
              <li>
                <strong>Give every point a <code>label</code></strong> where the record has a name.
                &ldquo;Which district is that outlier?&rdquo; is the first question this chart
                provokes, and the tooltip should answer it.
              </li>
              <li>
                <strong>Bin before you plot.</strong> Thousands of unclustered marks are slow to draw
                and unreadable once drawn; aggregate to the unit the reader actually asks about.
              </li>
            </ul>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { ScatterChart } from "@mosje/design-system";

<ScatterChart
  title="District Inspections Against Grievances Closed"
  xLabel="Inspections"
  yLabel="Grievances closed"
  series={[
    {
      name: "Districts",
      points: [
        { x: 10, y: 20, label: "Bankura" },
        { x: 25, y: 45, label: "Nashik" },
        { x: 48, y: 71, label: "Kanpur Nagar" },
      ],
    },
  ]}
/>`}</CodeBlock>
          <CodeBlock>{`<ScatterChart
  title="District Inspections Against Grievances Closed"
  series={series}
  state={error ? "error" : loading ? "loading" : points.length === 0 ? "no-results" : undefined}
  onRetry={refetch}
  filterLabel="state filter"
/>`}</CodeBlock>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-sr">
          <h2 id="cdp-sr" className="cdp__h2">
            What a Screen Reader Gets
          </h2>
          <p>
            One image with a name and a summary counting the points and the series, then a visually
            hidden table with a row per mark. That table is why point labels matter: a row reading
            &ldquo;Districts, 48, 71&rdquo; is three numbers, and &ldquo;Kanpur Nagar, 48, 71&rdquo; is
            a fact.
          </p>
          <p>
            <strong>The open gap.</strong> Marks are focusable but sit beneath{" "}
            <code>role=&quot;img&quot;</code>, so they are pruned from the accessibility tree and carry
            no accessible name.
          </p>
        </section>
      }
    />
  );
}
