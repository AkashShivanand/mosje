import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
} from "@/components/design-system/docs-kit";

import { BarChartSpecimen } from "./specimen";

export const metadata: Metadata = {
  title: "Bar Chart — Design System",
  description:
    "Vertical columns or horizontal bars comparing a figure across states, districts and scheme categories, in one series or several.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.1.1 Non-text Content",
    level: "A",
    status: "verified",
    description:
      "The chart renders through ChartFrame, which draws an SVG <title> and <desc> and a visually hidden table carrying every label and value the bars carry. A reader who cannot see the bars gets the figures, not a description of them.",
    evidence: "ChartFrame's `table` and `summary` props, passed by bar-chart.tsx on every render.",
  },
  {
    criterion: "1.4.1 Use of Color",
    level: "A",
    status: "verified",
    description:
      "Every bar is labelled on the category axis, and `showValues` prints the figure on the bar. Colour separates series; it never carries the reading on its own.",
    evidence: "XAxisLabels is rendered unconditionally; the SR table repeats every value.",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    status: "partial",
    description:
      'Every figure is reachable without a pointer, because the screen-reader table holds all of them. The bars themselves are not: each sets tabIndex={0}, but the SVG above them carries role="img", which prunes its descendants from the accessibility tree — so those stops receive focus with no accessible name. Treat the table as the keyboard path.',
    evidence:
      'Open gap, recorded 2026-09-02: role="img" in chart-frame.tsx against tabIndex={0} at bar-chart.tsx lines 199 and 291.',
  },
  {
    criterion: "1.4.11 Non-text Contrast",
    level: "AA",
    status: "untested",
    description:
      "The categorical ramp is drawn from --sa-chart-cat-* so it re-themes with the brand, but no measurement of adjacent bar colours against the canvas has been recorded across all three brand packs.",
  },
  {
    criterion: "GIGW 3.0 — Data Presentation",
    level: "GIGW",
    status: "verified",
    description:
      "Values format through formatIndian by default, so a figure reads 4,50,000 rather than 450,000 on a Government of India page.",
    evidence: "`valueFormat` defaults to formatIndian in bar-chart.tsx.",
  },
];

export default function BarChartPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Bar Chart"
      status="Beta"
      summary="Compares one figure across a set of named categories — states, districts, scheme components — as vertical columns or horizontal bars. It takes a single series or several, grouped or stacked."
      figma={{ node: "chartsChart" }}
      specimen={<BarChartSpecimen />}
      propsFrom="BarChartProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A figure is compared across named categories that have no natural order — states, districts, scheme components.",
          "The category names are long enough to overlap on a horizontal axis; set orientation=\"horizontal\" and they read as a list.",
          "Two or three series are compared category by category (variant=\"grouped\"), or their parts add to a whole (variant=\"stacked\").",
        ],
        avoid: [
          "The axis is time and the reader is looking for a trend — use a Line Chart, or an Area Chart where the running total is the point.",
          "The figures are parts of one whole and there are five or fewer — use a Donut Chart, which states the total in the middle.",
          "There is one figure against one target — use a Gauge, or a Progress bar in a list.",
          "The comparison is between two measured quantities rather than across categories — use a Scatter Chart.",
          "There are more categories than the surface can label. A bar chart with forty unreadable ticks is a table.",
        ],
      }}
      related={[
        { label: "Line Chart", href: "/design-system/components/data-display/line-chart", reason: "when the axis is time" },
        { label: "Combo Chart", href: "/design-system/components/data-display/combo-chart", reason: "when bars and a rate share one canvas" },
        { label: "Heatmap", href: "/design-system/components/data-display/heatmap", reason: "when two categorical axes cross" },
        { label: "Chart Frame", href: "/design-system/components/data-display/chart-frame", reason: "the shell every chart renders through" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-states">
            <h2 id="cdp-states" className="cdp__h2">
              The States It Draws
            </h2>
            <p>
              Four of the five states a chart can be in are not the populated one, and the specimen
              above shows all four. They are not decoration: a blank panel reads as &ldquo;none&rdquo;,
              as &ldquo;broken&rdquo; and as &ldquo;your filter matched nothing&rdquo; identically, and
              a reader cannot act on any of the three.
            </p>
            <ul>
              <li>
                <strong>Loading</strong> — a skeleton at the chart&apos;s own aspect ratio, carrying{" "}
                <code>role=&quot;status&quot;</code>, so the layout does not move when the figures land.
              </li>
              <li>
                <strong>Empty</strong> — the feed answered and had nothing. No retry is offered,
                because pressing one would do nothing.
              </li>
              <li>
                <strong>Error</strong> — the request failed. <code>onRetry</code> puts a
                &ldquo;Try again&rdquo; control on the card. No status code and no endpoint reaches
                the page.
              </li>
              <li>
                <strong>Filtered to nothing</strong> — the reader excluded everything themselves.{" "}
                <code>filterLabel</code> names the filter so the control reads &ldquo;Clear state
                filter&rdquo; rather than &ldquo;Clear filters&rdquo;.
              </li>
            </ul>
            <p>
              Passing no <code>state</code> at all still resolves: empty arrays fall back to{" "}
              <code>&quot;empty&quot;</code>. Give the prop wherever the caller knows more than the
              array does — which is every case where a feed was asked.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-orient">
            <h2 id="cdp-orient" className="cdp__h2">
              Orientation, Grouping and Stacking
            </h2>
            <ul>
              <li>
                <strong>Vertical</strong> is the default and suits short category names and up to
                about a dozen bars.
              </li>
              <li>
                <strong>Horizontal</strong> is the right choice for state and scheme names, which do
                not fit under a vertical axis without rotation.
              </li>
              <li>
                <strong>Grouped</strong> puts series side by side, for comparing them category by
                category.
              </li>
              <li>
                <strong>Stacked</strong> adds them, and is only honest when the parts genuinely sum
                to the whole the reader is being shown.
              </li>
            </ul>
            <p>
              Bar colours come from the categorical ramp. Do not pass a raw hex to{" "}
              <code>color</code>: the ramp re-themes with the brand pack and a literal does not.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { BarChart } from "@mosje/design-system";

<BarChart
  title="State Beneficiary Totals"
  orientation="horizontal"
  data={[
    { label: "Uttar Pradesh", value: 450 },
    { label: "Maharashtra", value: 380 },
    { label: "Bihar", value: 290 },
  ]}
/>`}</CodeBlock>
          <p>
            <strong>The props are a union, and the table above marks which arm each belongs to.</strong>{" "}
            Pass <code>data</code> for a single series — one bar per{" "}
            <code>{"{ label, value, color? }"}</code> — or <code>labels</code> and{" "}
            <code>series</code> for several, each series&apos; <code>data</code> aligned to{" "}
            <code>labels</code> by index. Never both: the single-series form wins, and the other half
            is silently ignored.
          </p>
          <p>
            Several series share one category axis. The reading and its states are resolved once, by
            the caller, and handed to the chart — the same expression a heading or a key on the same
            page must read, or the two will disagree on screen.
          </p>
          <CodeBlock>{`<BarChart
  title="Target Against Release"
  variant="grouped"
  labels={["Q1", "Q2", "Q3", "Q4"]}
  series={[
    { name: "Target", data: [100, 150, 200, 250] },
    { name: "Released", data: [95, 142, 198, 240] },
  ]}
  state={reading == null ? "error" : undefined}
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
            The SVG is one image with a name and a short summary, and the figures follow it as a
            visually hidden table with the same columns the axis carries. That table is the
            accessible source of truth, not a supplement to it.
          </p>
          <p>
            <strong>The open gap.</strong> Each bar sets <code>tabIndex</code> so a pointer
            user&apos;s tooltip can also be reached by keyboard, but the SVG above it carries{" "}
            <code>role=&quot;img&quot;</code>, which removes its descendants from the accessibility
            tree. The result is a focus stop that a screen reader announces as nothing. Until that is
            resolved, do not describe this chart as keyboard-navigable, and do not add arrow-key
            handling on top of it — no chart in this catalogue implements arrow keys, and a page
            claiming otherwise sends a reader looking for a behaviour that is not there.
          </p>
        </section>
      }
    />
  );
}
