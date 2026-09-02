import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
} from "@/components/design-system/docs-kit";

import { HeatmapSpecimen } from "./specimen";

export const metadata: Metadata = {
  title: "Heatmap — Design System",
  description:
    "A matrix of two categorical axes whose cells are shaded by value, for spotting where a figure concentrates across states and periods.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.1.1 Non-text Content",
    level: "A",
    status: "verified",
    description:
      "Rendered through ChartFrame, which draws an SVG <title>, a <desc> naming the matrix size and its range, and a visually hidden table carrying every cell as a figure.",
    evidence: "heatmap.tsx lines 76 and 81: `summary` and `table` passed to ChartFrame.",
  },
  {
    criterion: "1.4.1 Use of Color",
    level: "A",
    status: "partial",
    description:
      "Shade is the whole visual encoding here — that is what a heatmap is — so the reading for a colour-blind or low-vision reader rests entirely on the screen-reader table and the tooltip. Always render a Legend beside it naming what the darkest and lightest ends mean.",
    evidence: "heatmap.tsx encodes value as fill only; no per-cell text is printed.",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    status: "partial",
    description:
      'Every cell value is reachable through the screen-reader table. The cells set tabIndex={0} beneath an SVG carrying role="img", which prunes its descendants, so those stops receive focus with no accessible name. This page previously claimed arrow-key navigation between cells; nothing in the component implements it.',
    evidence: 'Open gap, recorded 2026-09-02: role="img" in chart-frame.tsx against tabIndex={0} at heatmap.tsx line 109.',
  },
  {
    criterion: "1.4.11 Non-text Contrast",
    level: "AA",
    status: "untested",
    description:
      "Adjacent steps of the sequential ramp are close by construction. No measurement of the smallest perceptible step, nor of the lightest cell against the canvas, has been recorded.",
  },
];

export default function HeatmapPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Heatmap"
      status="Beta"
      summary="Crosses two categorical axes and shades each cell by its value, so concentration and absence are visible before any figure is read. It is the catalogue's chart for “where is this happening”."
      figma={{ absent: "Not yet published in the Figma library. The chart catalogue is authored in code first; a Figma counterpart has not been drawn." }}
      specimen={<HeatmapSpecimen />}
      propsFrom="HeatmapProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "Two categorical axes cross — state against month, scheme component against district — and the cell is one figure.",
          "The reading is where a figure concentrates, not what any single cell equals.",
          "The matrix is small enough that every row and column can carry a readable label.",
        ],
        avoid: [
          "One axis is a single category — that is a Bar Chart, and a one-row heatmap encodes in shade what a bar encodes in length far more accurately.",
          "The exact cell values matter — use a Data Table. Shade cannot be read to a figure.",
          "Both axes are measured quantities rather than categories — use a Scatter Chart.",
          "The categories are states and geography is part of the reading — use the India Map.",
          "A rainbow ramp is being reached for. Use the sequential scale, or diverging where the reading is distance from a midpoint; a rainbow implies an order the values do not have.",
        ],
      }}
      related={[
        { label: "India Map", href: "/design-system/components/data-display/india-map", reason: "when the rows are states and geography matters" },
        { label: "Data Table", href: "/design-system/components/data-display/data-table", reason: "when the exact cell values are the point" },
        { label: "Legend", href: "/design-system/components/data-display/legend", reason: "the key that names the ends of the ramp" },
        { label: "Scatter Chart", href: "/design-system/components/data-display/scatter-chart", reason: "when both axes are measured" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-states">
            <h2 id="cdp-states" className="cdp__h2">
              The States It Draws
            </h2>
            <p>
              The specimen shows the four states that are not the populated one. A heatmap makes the
              case for them plainly: a grid of pale cells and no grid at all are visually similar, and
              a reader cannot tell &ldquo;every figure is low&rdquo; from &ldquo;the feed said
              nothing&rdquo; without being told.
            </p>
            <ul>
              <li>
                <strong>Loading</strong> — a skeleton at the matrix&apos;s own proportions, carrying{" "}
                <code>role=&quot;status&quot;</code>.
              </li>
              <li>
                <strong>Empty</strong> — the feed answered with no matrix. No retry.
              </li>
              <li>
                <strong>Error</strong> — the request failed; <code>onRetry</code> renders
                &ldquo;Try again&rdquo;.
              </li>
              <li>
                <strong>Filtered to nothing</strong> — <code>filterLabel</code> names the filter, so
                the control reads &ldquo;Clear month range&rdquo;.
              </li>
            </ul>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-ramp">
            <h2 id="cdp-ramp" className="cdp__h2">
              Sequential or Diverging, Never Rainbow
            </h2>
            <p>
              <code>scale=&quot;sequential&quot;</code> is the default: one hue, light to dark, for a
              figure that runs from low to high. <code>scale=&quot;diverging&quot;</code> is for a
              reading whose meaning is distance from a midpoint in either direction — above or below a
              target, growth or decline.
            </p>
            <p>
              A rainbow ramp reads as ordered when it is not, and a reader ranks the colours in
              whatever order they happen to know them in. Both scales here come from the token ramps
              and re-theme with the brand pack.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-legend">
            <h2 id="cdp-legend" className="cdp__h2">
              Always Publish the Key
            </h2>
            <p>
              A shaded cell is meaningless without the ends of the ramp being named. Render a Legend
              beside the map saying what the darkest and lightest cells stand for, in the unit the
              figures are in. Without it the chart shows a pattern and withholds the reading.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { Heatmap } from "@mosje/design-system";

<Heatmap
  title="Inspections by State and Month"
  xLabels={["Jan", "Feb", "Mar", "Apr"]}
  yLabels={["Uttar Pradesh", "Maharashtra", "Bihar"]}
  matrix={[
    [10, 24, 31, 28],
    [40, 38, 52, 61],
    [12, 9, 18, 22],
  ]}
/>`}</CodeBlock>
          <p>
            <code>matrix</code> is row-major: one array per <code>yLabels</code> entry, each with one
            number per <code>xLabels</code> entry. A ragged matrix draws a ragged grid rather than
            throwing, so validate the shape where the figures are assembled.
          </p>
          <CodeBlock>{`<Heatmap
  title="Inspections by State and Month"
  xLabels={months}
  yLabels={states}
  matrix={matrix}
  scale="diverging"
  state={error ? "error" : loading ? "loading" : undefined}
  onRetry={refetch}
  filterLabel="month range"
/>`}</CodeBlock>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-sr">
          <h2 id="cdp-sr" className="cdp__h2">
            What a Screen Reader Gets
          </h2>
          <p>
            One image with a name and a summary stating the matrix size and its range, then a visually
            hidden table whose columns are the x labels and whose rows are the y labels. That table is
            the only complete reading of a heatmap for anyone who cannot compare shades, which is why
            it is not optional here in a way it almost is elsewhere.
          </p>
          <p>
            <strong>The open gap.</strong> Cells are focusable but sit beneath{" "}
            <code>role=&quot;img&quot;</code> and are pruned from the accessibility tree. There is no
            arrow-key navigation between cells, and this page has stopped saying there is.
          </p>
        </section>
      }
    />
  );
}
