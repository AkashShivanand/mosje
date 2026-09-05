import type { Metadata } from "next";
import * as React from "react";

import { CodeBlock, ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";

import { BulletChartSpecimen } from "./specimen";

export const metadata: Metadata = {
  title: "Bullet Chart — Design System",
  description:
    "A measure against its target on one line: the value as a bar, the target as a tick across it.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.1.1 Non-text Content",
    level: "A",
    status: "verified",
    evidence:
      "Every row is a focusable group with an aria-label naming the measure, its value, its target and whether the target was met. The chart also carries a data table, reachable by sighted readers through “View as Table”.",
    description: "The chart is not the only way to the figures.",
  },
  {
    criterion: "1.4.1 Use of Colour",
    level: "A",
    status: "verified",
    evidence:
      "The target is a tick in neutral ink, not a second colour, and the qualitative bands are neutral greys. Nothing in the chart is distinguished by hue alone.",
    description:
      "Deliberate: colouring the bands red/amber/green would encode a policy judgement in the design system AND make the reading colour-dependent.",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    status: "verified",
    evidence: "Each row is `tabIndex={0}`, so every measure is reachable in order.",
    description: "Verified in a browser: tabbing steps through the rows and each announces its own label.",
  },
  {
    criterion: "1.4.11 Non-text Contrast",
    level: "AA",
    status: "verified",
    evidence:
      "The measure bar is `chart/cat/1` (4.64:1 on the page) and the target tick is `text/neutral/bolder`, well past the 3:1 floor for a graphical object.",
    description: "The two marks that carry meaning both clear the threshold.",
  },
];

export default function BulletChartPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Bullet Chart"
      status="Beta"
      summary="A measure against its target, on one line: the value as a bar, the target as a tick across it, and the department's own thresholds as quiet bands behind. It is the shape of almost every figure this department reports."
      figma={{ node: "chartsChart" }}
      specimen={<BulletChartSpecimen />}
      propsFrom="BulletChartProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A figure that only means something against a target — released against sanctioned, utilised against released, filled against created.",
          "A dashboard listing many such measures, where a gauge each would not fit.",
          "Progress against a published threshold the department itself set.",
        ],
        avoid: [
          "Comparing categories with no target between them — that is a Bar Chart.",
          "A single headline figure with no target — that is a Metric Card.",
          "Showing a share of a whole — that is a Donut or Progress.",
        ],
      }}
      related={[
        { label: "Bar Chart", href: "/design-system/components/data-display/bar-chart", reason: "comparing categories with no target" },
        { label: "Gauge", href: "/design-system/components/data-display/gauge", reason: "one measure against a scale, given more room" },
        { label: "Progress", href: "/design-system/components/data-display/progress", reason: "a simple share of a whole" },
      ]}
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { BulletChart } from "@mosje/design-system";

<BulletChart
  title="Scheme Delivery Against Target"
  unit="₹ crore"
  rows={[
    { label: "Grants Released", value: 940, target: 1200, ranges: [600, 1000], max: 1400 },
    { label: "Utilisation Certified", value: 610, target: 940 },
  ]}
/>`}</CodeBlock>
          <p>
            <code>ranges</code> are ascending boundaries, not colours — <code>[600, 1000]</code> on a
            scale of 1400 draws three bands. Omit them and the track is plain, which is the honest
            default when no threshold has been published.
          </p>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-why">
          <h2 id="cdp-why" className="cdp__h2">
            Why the Bands Are Grey
          </h2>
          <p>
            It is tempting to draw the qualitative ranges in red, amber and green. This chart
            deliberately does not, for two reasons. A component that decides 60% is “amber” has
            made a policy judgement that belongs to the scheme, not to the design system. And a
            traffic-light band makes the reading colour-dependent, which is exactly what{" "}
            <a href="/design-system/foundations/color">the colour foundation</a> and WCAG 1.4.1 ask
            us not to do.
          </p>
          <p>
            The department&apos;s own thresholds are still visible — as position, which every reader
            has.
          </p>
        </section>
      }
    />
  );
}
