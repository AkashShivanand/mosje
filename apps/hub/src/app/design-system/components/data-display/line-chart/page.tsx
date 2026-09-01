import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
} from "@/components/design-system/docs-kit";

import { LineChartSpecimen } from "./specimen";

export const metadata: Metadata = {
  title: "Line Chart — Design System",
  description:
    "A continuous trend over an ordered axis — applications by month, releases by quarter — for one series or several.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.1.1 Non-text Content",
    level: "A",
    status: "verified",
    description:
      "The chart renders through ChartFrame, which draws an SVG <title> and <desc> and a visually hidden table holding every label and every series value. The figures reach a screen reader, not a description of the shape.",
    evidence: "ChartFrame's `table` and `summary` props, passed by line-chart.tsx on every render.",
  },
  {
    criterion: "1.4.11 Non-text Contrast",
    level: "AA",
    status: "untested",
    description:
      "Series strokes come from --sa-chart-cat-*, so they re-theme with the brand pack, but no measurement of stroke against canvas has been recorded across all three packs.",
  },
  {
    criterion: "1.4.1 Use of Color",
    level: "A",
    status: "partial",
    description:
      "A single series needs no legend and is unambiguous. Two or more are separated by colour and by the legend's order alone — there is no dash pattern or marker shape per series — so the screen-reader table is what a reader who cannot separate the colours relies on.",
    evidence: "line-chart.tsx sets `stroke` per series; no strokeDasharray or per-series marker is applied.",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    status: "partial",
    description:
      'Every figure is reachable without a pointer through the screen-reader table. The per-point hit areas are not: they set tabIndex={0} beneath an SVG carrying role="img", which prunes its descendants from the accessibility tree, so those stops have no accessible name.',
    evidence: 'Open gap, recorded 2026-09-02: role="img" in chart-frame.tsx against tabIndex={0} at line-chart.tsx line 177.',
  },
  {
    criterion: "GIGW 3.0 — Data Presentation",
    level: "GIGW",
    status: "verified",
    description: "Values format through formatIndian by default, so a figure reads 4,50,000 rather than 450,000.",
    evidence: "`valueFormat` defaults to formatIndian in line-chart.tsx.",
  },
];

export default function LineChartPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Line Chart"
      status="Beta"
      summary="Plots a figure against an ordered axis so the reader sees its direction — month by month, quarter by quarter. It takes one series or several against a shared set of labels."
      figma={{ absent: "Not yet published in the Figma library. The chart catalogue is authored in code first; a Figma counterpart has not been drawn." }}
      specimen={<LineChartSpecimen />}
      propsFrom="LineChartProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "The axis is time or another ordered sequence and the reading a citizen needs is the direction of travel.",
          "Two or three series are compared over the same period — target against release, sanctioned against disbursed.",
          "There are enough points that the shape between them means something; below about four, a bar chart is more honest.",
        ],
        avoid: [
          "The categories have no order — use a Bar Chart, which does not imply a path between them.",
          "The running total is the point rather than the rate — use an Area Chart, or set area on this one.",
          "Two series share a canvas but not a scale, such as a count against a percentage — use a Combo Chart, which gives each its own axis.",
          "The figures are a distribution of one quantity against another — use a Scatter Chart.",
          "The line is going inside a table row or a card corner — use a Sparkline, which is drawn to be read at a glance and never for a precise value.",
        ],
      }}
      related={[
        { label: "Area Chart", href: "/design-system/components/data-display/area-chart", reason: "when the accumulated total is the reading" },
        { label: "Combo Chart", href: "/design-system/components/data-display/combo-chart", reason: "when two series need two scales" },
        { label: "Sparkline", href: "/design-system/components/data-display/sparkline", reason: "for the same shape inside a table row" },
        { label: "Bar Chart", href: "/design-system/components/data-display/bar-chart", reason: "when the axis is categorical" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-states">
            <h2 id="cdp-states" className="cdp__h2">
              The States It Draws
            </h2>
            <p>
              The specimen shows the four states that are not the populated one. Rendering the same
              blank panel for all of them, which is what a chart without this API does, tells a reader
              nothing about whether the feed is empty, down, or filtered away by their own selection.
            </p>
            <ul>
              <li>
                <strong>Loading</strong> — a skeleton at the chart&apos;s own aspect ratio, announced
                through <code>role=&quot;status&quot;</code>, so nothing on the page moves when the
                figures land.
              </li>
              <li>
                <strong>Empty</strong> — the feed answered and had nothing. No retry, because there is
                nothing to retry.
              </li>
              <li>
                <strong>Error</strong> — the request failed; <code>onRetry</code> renders the
                &ldquo;Try again&rdquo; control. Never print the status code or the endpoint.
              </li>
              <li>
                <strong>Filtered to nothing</strong> — <code>filterLabel</code> names what the reader
                applied, so the control reads &ldquo;Clear date range&rdquo;.
              </li>
            </ul>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-series">
            <h2 id="cdp-series" className="cdp__h2">
              Series, Dots and the Y Axis
            </h2>
            <ul>
              <li>
                <strong>Three series is the working ceiling.</strong> Beyond that the lines cross often
                enough that the legend stops resolving them, and the reader is doing the chart&apos;s
                work.
              </li>
              <li>
                <strong>Turn <code>showDots</code> on where each point is a real reading</strong> — a
                monthly return, a quarterly release — and off where the line is a sampled curve.
              </li>
              <li>
                <strong><code>yLabel</code> names what is being counted.</strong> An axis of bare
                numbers on a government page is a figure with no unit.
              </li>
            </ul>
            <p>
              Every series takes its colour from the categorical ramp so it re-themes with the brand
              pack. A raw hex passed to <code>color</code> does not.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { LineChart } from "@mosje/design-system";

<LineChart
  title="Monthly Applications"
  yLabel="Applications received"
  labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun"]}
  series={[{ name: "Applications", data: [400, 600, 520, 800, 760, 910] }]}
  showDots
/>`}</CodeBlock>
          <p>
            The state is resolved once by the caller and handed down, so a heading, a key and this
            chart reading the same request cannot disagree about what the request answered.
          </p>
          <CodeBlock>{`const state = error ? "error" : loading ? "loading" : rows.length === 0 ? "no-results" : undefined;

<LineChart
  title="Monthly Applications"
  labels={labels}
  series={series}
  state={state}
  onRetry={refetch}
  filterLabel="date range"
/>`}</CodeBlock>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-sr">
          <h2 id="cdp-sr" className="cdp__h2">
            What a Screen Reader Gets
          </h2>
          <p>
            One image with a name, a one-line summary, and a visually hidden table whose columns are
            the labels and whose rows are the series. That table is the accessible source of truth.
          </p>
          <p>
            <strong>The open gap.</strong> Per-point hit areas are focusable, but the SVG above them is{" "}
            <code>role=&quot;img&quot;</code>, which prunes its descendants — so those focus stops
            carry no accessible name. This page previously claimed arrow-key stepping between
            vertices; no chart in the catalogue implements arrow keys, and the claim has been removed.
          </p>
        </section>
      }
    />
  );
}
