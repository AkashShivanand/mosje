import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
} from "@/components/design-system/docs-kit";

import { DonutChartSpecimen } from "./specimen";

export const metadata: Metadata = {
  title: "Donut Chart — Design System",
  description:
    "A ring in two modes: segments that make up a whole, or a single figure against a target, with the total stated in the middle.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.1.1 Non-text Content",
    level: "A",
    status: "verified",
    description:
      "Rendered through ChartFrame, which draws an SVG <title> and <desc> and a visually hidden table of every label, value and share.",
    evidence: "ChartFrame's `table` and `summary` props, passed by donut-chart.tsx on every render.",
  },
  {
    criterion: "1.4.1 Use of Color",
    level: "A",
    status: "verified",
    description:
      "Every arc is named in the legend beside the ring and repeated with its value in the screen-reader table, so no segment is identified by its colour alone.",
    evidence: "donut-chart.tsx renders a Legend from the same data it draws the arcs from.",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    status: "partial",
    description:
      'The figures are reachable through the screen-reader table. The arcs set tabIndex={0} beneath an SVG carrying role="img", which prunes its descendants, so those stops receive focus with no accessible name.',
    evidence: 'Open gap, recorded 2026-09-02: role="img" in chart-frame.tsx against tabIndex={0} at donut-chart.tsx line 114.',
  },
  {
    criterion: "1.4.11 Non-text Contrast",
    level: "AA",
    status: "untested",
    description:
      "Adjacent arcs are separated only by their fills. No contrast measurement between neighbouring steps of the categorical ramp has been recorded across the brand packs.",
  },
];

export default function DonutChartPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Donut Chart"
      status="Beta"
      summary="A ring with the total in the middle. In its segmented form it shows how a whole divides; in its progress form it shows one figure against a target, with an optional tick where the target sits."
      figma={{ absent: "Not yet published in the Figma library. The chart catalogue is authored in code first; a Figma counterpart has not been drawn." }}
      specimen={<DonutChartSpecimen />}
      propsFrom="DonutChartProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "Five or fewer parts make up a whole, and the whole itself is worth stating — the centre carries the total.",
          "One figure is read against a target, and the shortfall is the point.",
          "The reading is a rough share — about half, about a quarter — rather than a precise comparison between parts.",
        ],
        avoid: [
          "The reader has to compare parts that are close in size. A ring cannot support that; use a Bar Chart, where the difference is a length.",
          "There are more than five parts — the arcs stop being separable and the legend does the work the chart was meant to do.",
          "The figure sits in a table row or a list of many — use a Progress bar, which keeps its row height.",
          "The parts change over time — use a stacked Bar Chart or an Area Chart, which show the change as well as the share.",
          "There is no centre figure worth stating and no hole worth having — use a Pie Chart.",
        ],
      }}
      related={[
        { label: "Pie Chart", href: "/design-system/components/data-display/pie-chart", reason: "the same shares with no centre figure" },
        { label: "Gauge", href: "/design-system/components/data-display/gauge", reason: "one figure against a scale, drawn as an arc" },
        { label: "Progress", href: "/design-system/components/data-display/progress", reason: "the same reading inside a list row" },
        { label: "Bar Chart", href: "/design-system/components/data-display/bar-chart", reason: "when the parts must be compared precisely" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-modes">
            <h2 id="cdp-modes" className="cdp__h2">
              Two Modes, One Component
            </h2>
            <p>
              <strong>Segments</strong> take <code>data</code> and draw one arc per part, with the sum
              in the centre unless <code>center</code> overrides it.{" "}
              <strong>Progress</strong> takes <code>value</code> and <code>max</code> and draws one
              arc, optionally with a <code>target</code> tick showing the level that was meant to be
              reached. Both are shown in the specimen above.
            </p>
            <p>
              They are one component because they resolve their states through one expression: a
              segmented donut and a progress ring with nothing to draw are the same object on the
              page, rather than two empty states that drift apart on the first copy change.
            </p>
            <p>
              The props are a union, and the table marks which arm each belongs to.{" "}
              <code>data</code> is the segmented arm. <code>value</code>, <code>max</code>,{" "}
              <code>target</code> and <code>color</code> are the progress arm. Pass one set or the
              other — never both, because the segmented form wins and the rest is silently ignored.
              <code>color</code> takes a token: a raw hex does not re-theme with the brand pack.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-states">
            <h2 id="cdp-states" className="cdp__h2">
              The States It Draws
            </h2>
            <ul>
              <li>
                <strong>Loading</strong> — a skeleton at the ring&apos;s own proportions, carrying{" "}
                <code>role=&quot;status&quot;</code>.
              </li>
              <li>
                <strong>Empty</strong> — the feed answered with nothing. No retry, because there is
                nothing to retry.
              </li>
              <li>
                <strong>Error</strong> — the request failed; <code>onRetry</code> renders
                &ldquo;Try again&rdquo;.
              </li>
              <li>
                <strong>Filtered to nothing</strong> — <code>filterLabel</code> names what the reader
                applied, so the control reads &ldquo;Clear component filter&rdquo;.
              </li>
            </ul>
            <p>
              A total of zero still falls back to <code>&quot;empty&quot;</code> on its own, but pass{" "}
              <code>state</code> wherever the caller knows more than the array does. Zero parts and a
              failed request look identical to the array and entirely different to the reader.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-centre">
            <h2 id="cdp-centre" className="cdp__h2">
              The Centre Is the Reading
            </h2>
            <p>
              The hole exists so a figure can sit in it. Use <code>centerSub</code> to name the unit —
              &ldquo;₹ crore&rdquo;, &ldquo;beneficiaries&rdquo; — because a bare number in the middle
              of a ring is the most-screenshotted part of any dashboard and the easiest to quote out of
              context.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { DonutChart } from "@mosje/design-system";

// Segments — the centre states the total.
<DonutChart
  title="Budget Distribution"
  centerSub="₹ crore"
  data={[
    { label: "Post-Matric", value: 45 },
    { label: "Pre-Matric", value: 30 },
    { label: "Top Class", value: 25 },
  ]}
/>

// Progress — one figure against a target.
<DonutChart title="Utilisation Against Target" value={84} max={100} target={90} centerSub="utilised" />`}</CodeBlock>
          <CodeBlock>{`<DonutChart
  title="Budget Distribution"
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
            One image with a name and a summary, a legend naming each arc, and a visually hidden table
            carrying every label, value and share. A reader who cannot see the ring gets the same
            figures a reader who can see it is estimating from it.
          </p>
          <p>
            <strong>The open gap.</strong> Arcs are focusable but sit beneath{" "}
            <code>role=&quot;img&quot;</code> and are pruned from the accessibility tree, so they
            announce as nothing.
          </p>
        </section>
      }
    />
  );
}
