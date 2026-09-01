import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
  type PropDef,
} from "@/components/design-system/docs-kit";

import { AxisSpecimen } from "./specimen";

export const metadata: Metadata = {
  title: "Axis — Design System",
  description:
    "The gridlines, tick labels and number formatters every chart in the catalogue draws its scale with, including the Indian digit grouping.",
};

/*
 * NOTHING HERE IS AN INTERFACE, so nothing here can come from `propsFrom`.
 * `Gridlines` and `XAxisLabels` take inline parameter objects and the
 * formatters are functions — and the extractor reads the type checker's view of
 * declared interfaces, not a function's argument list. This is the case the
 * template's docstring keeps the hand-written table for.
 */
const API: PropDef[] = [
  {
    name: "formatIndian(value)",
    type: "(value: number) => string",
    description:
      "The estate default. Groups digits the Indian way through toLocaleString(\"en-IN\"), so 4500000 reads 45,00,000 and not 4,500,000. Every chart uses it unless valueFormat says otherwise.",
  },
  {
    name: "formatCompact(value)",
    type: "(value: number) => string",
    description:
      "The same grouping, shortened — lakh and crore rather than a full number. For an axis where the full figure would not fit, or a tick label on a narrow chart.",
  },
  {
    name: "formatPercent(value, digits?)",
    type: "(value: number, digits?: number) => string",
    default: "digits = 1",
    description: "A percentage to a fixed number of decimals, with the sign. Pass 0 where a whole number is the honest precision.",
  },
  {
    name: "GridTick.pos",
    type: "number",
    required: true,
    description: "The tick's position in the chart's own coordinate space, not in CSS pixels.",
  },
  {
    name: "GridTick.value",
    type: "number",
    required: true,
    description: "The figure at that position, formatted through the chart's valueFormat before it is drawn.",
  },
  {
    name: "Gridlines({ ticks, x0, x1, format, labelGutter })",
    type: "React.FC",
    description:
      "Draws the horizontal rules and the left-hand value labels for a vertical chart. `x0` and `x1` are the span of each rule; `labelGutter` (6) is the distance from the axis to its label. Internal to the chart layer — not exported from the package barrel.",
  },
  {
    name: "XAxisLabels({ labels, x, y, rotate, maxChars })",
    type: "React.FC",
    description:
      "Draws the category labels along the bottom. `x` returns the centre of a label's band; `rotate` turns them for dense axes; `maxChars` (14) truncates with an ellipsis. Internal to the chart layer — not exported from the package barrel.",
  },
];

const A11Y: A11yItem[] = [
  {
    criterion: "1.1.1 Non-text Content",
    level: "A",
    status: "verified",
    description:
      'Both axis groups carry aria-hidden. That is correct rather than a lapse: the figures they draw are already published in the chart\'s screen-reader table, and announcing the ticks again would recite a scale with no readings attached to it.',
    evidence: 'axis.tsx lines 29 and 75: <g aria-hidden="true"> on both Gridlines and XAxisLabels.',
  },
  {
    criterion: "1.4.3 Contrast (Minimum)",
    level: "AA",
    status: "untested",
    description:
      "Tick labels are drawn in the chart ink token and gridlines in the grid token, both of which re-theme with the brand pack. No measurement of either against the canvas has been recorded across the three packs.",
  },
  {
    criterion: "1.4.4 Resize Text",
    level: "AA",
    status: "partial",
    description:
      "Axis text is drawn inside the SVG coordinate system, so it scales with the chart rather than with the browser's text size. A reader who enlarges text alone does not enlarge these labels; the screen-reader table is the path that does respond.",
  },
  {
    criterion: "GIGW 3.0 — Data Presentation",
    level: "GIGW",
    status: "verified",
    description:
      "Figures group the Indian way by default, so a departmental page reads 45,00,000 rather than 4,500,000 without every caller having to remember it.",
    evidence: "formatIndian is the default `valueFormat` on every chart in the catalogue.",
  },
];

export default function AxisPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Axis"
      status="Beta"
      summary="The scale layer every chart draws through: the gridlines and tick labels, and the number formatters that decide how a figure reads on a Government of India page."
      figma={{ absent: "Not yet published in the Figma library. The axis is a drawing primitive inside the chart layer rather than a component with a design counterpart." }}
      specimen={<AxisSpecimen />}
      props={API}
      a11y={A11Y}
      whenToUse={{
        use: [
          "A chart in the catalogue needs its figures formatted differently — pass one of these functions as `valueFormat`.",
          "A new chart is being added to the package and needs gridlines and category labels that match the ones already drawn.",
          "A figure is being written into a caption or a table beside a chart, and it must group the same way the chart's own labels do.",
        ],
        avoid: [
          "A figure is being formatted outside the chart layer for general prose — reach for the number formatting the surrounding page already uses rather than importing a chart helper into it.",
          "A custom chart is being built in a portal. Charts belong in the design system, and a portal-local axis is how two dashboards end up formatting the same rupee figure two ways.",
          "The reading is a currency with its symbol — these format the digits only. Put the ₹ in `yLabel`, where it is stated once instead of on every tick.",
        ],
      }}
      related={[
        { label: "Chart Frame", href: "/design-system/components/data-display/chart-frame", reason: "the shell the axis is drawn inside" },
        { label: "Bar Chart", href: "/design-system/components/data-display/bar-chart", reason: "the chart that uses both axis helpers" },
        { label: "Legend", href: "/design-system/components/data-display/legend", reason: "the other shared piece of chart furniture" },
        { label: "Line Chart", href: "/design-system/components/data-display/line-chart", reason: "a value axis with a named unit" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-grouping">
            <h2 id="cdp-grouping" className="cdp__h2">
              Indian Digit Grouping Is the Default
            </h2>
            <p>
              Every chart in the catalogue formats through <code>formatIndian</code> unless the caller
              says otherwise, so a figure reads <strong>45,00,000</strong> and not 4,500,000. That is
              not a preference: it is how the department publishes its own figures, and a dashboard
              that groups them the international way asks an officer to re-read every number.
            </p>
            <p>
              The specimen above shows the same three state releases formatted both ways, and the
              output of each helper for one figure.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-density">
            <h2 id="cdp-density" className="cdp__h2">
              Crowding, Truncation and the Unit
            </h2>
            <ul>
              <li>
                <strong>Reach for <code>formatCompact</code> before you rotate an axis.</strong> A tick
                reading &ldquo;45L&rdquo; is legible where &ldquo;45,00,000&rdquo; is not, and rotated
                labels are harder to read than short ones.
              </li>
              <li>
                <strong>Category labels truncate at fourteen characters</strong> with an ellipsis.
                Where state names are being drawn, that is usually the signal to turn the chart
                horizontal rather than to raise the limit.
              </li>
              <li>
                <strong>The unit belongs in <code>yLabel</code>, not on every tick.</strong> Repeating
                &ldquo;₹&rdquo; down an axis is ink for a fact stated once.
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
          <p>
            The formatters are exported from the package. Pass one to any chart&apos;s{" "}
            <code>valueFormat</code>.
          </p>
          <CodeBlock>{`import { BarChart, formatCompact } from "@mosje/design-system";

<BarChart
  title="Releases by State"
  yLabel="₹"
  valueFormat={formatCompact}
  data={releases}
/>`}</CodeBlock>
          <p>
            <code>Gridlines</code> and <code>XAxisLabels</code> are internal to the chart layer and are
            not exported from the barrel. They are documented here because they are what every chart in
            the catalogue draws its scale with, and a new chart added to the package composes them the
            same way — with tick positions from the scale helpers rather than with numbers of its own.
          </p>
          <CodeBlock>{`// Inside the chart layer, not from a portal.
import { Gridlines, XAxisLabels } from "./internal/axis";
import { bandScale, linearScale, niceTicks } from "./internal/scales";

// Tick positions come from the same scale the marks are drawn with, so the
// gridlines and the bars cannot disagree about where a value sits.
<Gridlines ticks={ticks} x0={padLeft} x1={width - padRight} format={valueFormat} />
<XAxisLabels labels={labels} x={centreOfBand} y={height - 8} />`}</CodeBlock>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-hidden">
          <h2 id="cdp-hidden" className="cdp__h2">
            Why the Axis Is Hidden
          </h2>
          <p>
            Both axis groups carry <code>aria-hidden</code>. A screen reader hearing a chart already
            gets its title, its summary and a table of every figure; hearing the tick values on top of
            that is a scale with no readings attached — the least useful part of the drawing, recited
            first.
          </p>
          <p>
            The consequence to hold on to is that <strong>the axis is not the accessible reading</strong>.
            If a chart&apos;s table is missing or wrong, hiding the axis makes it invisible rather than
            merely incomplete. Check the table, not the ticks.
          </p>
        </section>
      }
    />
  );
}
