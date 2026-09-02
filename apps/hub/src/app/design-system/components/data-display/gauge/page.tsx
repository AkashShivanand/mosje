import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
} from "@/components/design-system/docs-kit";

import { GaugeSpecimen } from "./specimen";

export const metadata: Metadata = {
  title: "Gauge — Design System",
  description:
    "One figure read against a scale, drawn as an arc with the value in the middle — a compliance rate, an occupancy against a sanctioned total.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.1.1 Non-text Content",
    level: "A",
    status: "verified",
    description:
      "Rendered through ChartFrame, which draws an SVG <title>, a <desc> reading “<value> of <max>”, and a visually hidden table carrying the metric, its value and its maximum.",
    evidence: "gauge.tsx lines 87 and 90: `summary` and `table` passed to ChartFrame on every render.",
  },
  {
    criterion: "1.4.1 Use of Color",
    level: "A",
    status: "verified",
    description:
      "The value is printed in the middle of the arc and repeated in the screen-reader table. The arc's colour is decoration over a figure that is already stated in words.",
    evidence: "gauge.tsx renders the formatted value and unit as text inside the ring.",
  },
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    status: "partial",
    description:
      'The figure and its maximum reach assistive technology through the SVG description and the hidden table, but the arc is exposed as role="img" and not as a meter: there is no aria-valuenow, aria-valuemin or aria-valuemax. This page previously claimed role="meter" with all three; the component has never carried them.',
    evidence: 'gauge.tsx sets no role or aria-value* of its own; the only role is the role="img" ChartFrame puts on the SVG.',
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    status: "untested",
    description:
      "There is no keyboard interaction to test — the gauge has no focusable marks and listens for no key.",
  },
];

export default function GaugePage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Gauge"
      status="Beta"
      summary="Draws one figure against a scale as an arc, with the value printed in the middle. It is for the single number a dashboard is judged on — a compliance rate, an occupancy, a utilisation."
      figma={{ absent: "Not yet published in the Figma library. The chart catalogue is authored in code first; a Figma counterpart has not been drawn." }}
      specimen={<GaugeSpecimen />}
      propsFrom="GaugeProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "One figure is the headline of a card, and where it sits between a floor and a ceiling is the reading.",
          "The scale is meaningful — a percentage, an occupancy against a sanctioned total — rather than an open-ended count.",
          "There is exactly one such figure on the card. A gauge is a headline, and a page cannot have four headlines.",
        ],
        avoid: [
          "Several figures are compared side by side. Four gauges in a row is four headlines; use a Bar Chart, or a row of Progress bars where the labels align.",
          "The figure sits in a table row or a dense list — use a Progress bar, which keeps the row height.",
          "The figure has no ceiling. A gauge needs a maximum to be read against; a count with no scale belongs in a Metric Card.",
          "The whole divides into parts — use a Donut Chart, which shows the division as well as the total.",
          "The reading is the change over time — use a Line Chart or a Sparkline.",
        ],
      }}
      related={[
        { label: "Progress", href: "/design-system/components/data-display/progress", reason: "the same reading at row height" },
        { label: "Donut Chart", href: "/design-system/components/data-display/donut-chart", reason: "its progress mode, or a division into parts" },
        { label: "Metric Card", href: "/design-system/components/data-display/metric-card", reason: "a headline figure with no ceiling" },
        { label: "Sparkline", href: "/design-system/components/data-display/sparkline", reason: "when the change matters more than the level" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-states">
            <h2 id="cdp-states" className="cdp__h2">
              The States It Draws
            </h2>
            <p>
              A gauge is the figure a stakeholder screenshots, which makes its non-populated states the
              ones that matter most: an arc drawn at nought and an arc that could not be drawn at all
              look the same, and only one of them is a departmental reading.
            </p>
            <ul>
              <li>
                <strong>Loading</strong> — a skeleton at the gauge&apos;s own proportions, carrying{" "}
                <code>role=&quot;status&quot;</code>.
              </li>
              <li>
                <strong>Empty</strong> — the feed answered with nothing. No retry.
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
          <section className="cdp__section" aria-labelledby="cdp-scale">
            <h2 id="cdp-scale" className="cdp__h2">
              The Scale and the Unit
            </h2>
            <ul>
              <li>
                <strong><code>min</code> and <code>max</code> define what the arc is read against.</strong>{" "}
                They default to a nought-to-hundred percentage, which is right for a rate and wrong for
                a count.
              </li>
              <li>
                <strong>Set <code>unit</code>.</strong> An unlabelled 84 in the middle of an arc is the
                single easiest figure on a dashboard to quote out of context.
              </li>
              <li>
                <strong><code>color</code> takes a token, not a hex.</strong> A literal does not
                re-theme with the brand pack, and a gauge is usually the most prominent colour on its
                card.
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
          <CodeBlock>{`import { Gauge } from "@mosje/design-system";

<Gauge title="Grievances Resolved Within SLA" value={84} unit="%" />

// A count against a sanctioned total — set the scale explicitly.
<Gauge title="Hostels Occupied" value={1240} max={1800} unit=" of 1,800" />`}</CodeBlock>
          <CodeBlock>{`<Gauge
  title="Grievances Resolved Within SLA"
  value={rate}
  unit="%"
  state={error ? "error" : loading ? "loading" : undefined}
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
            One image named by its title, described as &ldquo;<em>value</em> of <em>max</em>&rdquo;, and
            followed by a visually hidden table with one row: the metric, its value and its maximum.
          </p>
          <p>
            <strong>It is not a meter.</strong> ARIA&apos;s <code>meter</code> role, with{" "}
            <code>aria-valuenow</code>, <code>aria-valuemin</code> and <code>aria-valuemax</code>, would
            expose the reading as a value on a scale rather than as a picture with a caption. This
            component does not do that, and a previous version of this page said it did. Where the
            distinction matters — an officer&apos;s dashboard read primarily through assistive
            technology — reach for Progress, which is a real{" "}
            <code>progressbar</code> with its value exposed.
          </p>
        </section>
      }
    />
  );
}
