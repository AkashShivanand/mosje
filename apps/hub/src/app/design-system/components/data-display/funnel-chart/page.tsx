import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
  type PropDef,
} from "@/components/design-system/docs-kit";

import { FunnelChartSpecimen } from "./specimen";

export const metadata: Metadata = {
  title: "Funnel Chart — Design System",
  description:
    "The stages of one workflow in order, each bar sized by its share of the first, with the carry-through stated beside it.",
};

/*
 * `FunnelStage` is the shape the `stages` prop is built from. The extractor
 * reads interfaces, not the members of the types they reference, so it is
 * documented by hand here.
 */
const STAGE: PropDef[] = [
  {
    name: "FunnelStage.label",
    type: "string",
    required: true,
    description: "The stage name, as the department calls it in the workflow it describes.",
  },
  {
    name: "FunnelStage.value",
    type: "number",
    required: true,
    description: "The count that reached this stage. It must be a subset of the stage above, or the drawing is a lie about a flow.",
  },
  {
    name: "FunnelStage.color",
    type: "string",
    description: "Overrides the categorical ramp for this bar. Pass a token, never a hex.",
  },
];

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    status: "verified",
    description:
      "The funnel is a DOM list rather than an SVG, and it carries a visually hidden table of every stage and value — so the order of the stages, which is the reading, is structural rather than visual.",
    evidence: "funnel-chart.tsx renders a `table.ds-sr-only` alongside the bars.",
  },
  {
    criterion: "1.1.1 Non-text Content",
    level: "A",
    status: "verified",
    description:
      'The bar group carries role="img" with the chart title as its accessible name, and every stage name and figure is printed as text beside the bar rather than encoded in its width alone.',
    evidence: 'funnel-chart.tsx line 59: role="img" with aria-label={title}; labels and values render as text.',
  },
  {
    criterion: "1.4.1 Use of Color",
    level: "A",
    status: "verified",
    description:
      "Every stage is labelled and its value printed. Colour distinguishes the bars; it never carries the reading.",
    evidence: "Stage label and formatted value are rendered as text for each stage in funnel-chart.tsx.",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    status: "untested",
    description:
      "There is no keyboard interaction to test: the funnel has no focusable marks and listens for no key. Everything it shows is text a screen reader reaches in document order.",
  },
];

export default function FunnelChartPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Funnel Chart"
      status="Beta"
      summary="Draws the stages of one workflow top to bottom, each bar as wide as its share of the first stage, with the carry-through percentage beside it. It answers where a process loses its volume."
      figma={{ node: "chartsChart" }}
      specimen={<FunnelChartSpecimen />}
      propsFrom="FunnelChartProps"
      props={STAGE}
      a11y={A11Y}
      whenToUse={{
        use: [
          "The stages are one ordered process and every stage is a subset of the one above — applications received, verified, approved, disbursed.",
          "The reading a citizen or an officer needs is where the volume is lost.",
          "There are between three and about seven stages.",
        ],
        avoid: [
          "The categories are not stages of one flow — use a Bar Chart; a funnel implies a carry-through that is not there.",
          "A later stage can be larger than an earlier one. That is not a funnel, and drawing it as one misrepresents the process.",
          "The parts make up a whole rather than following each other — use a Donut Chart or a Pie Chart.",
          "The interest is how the pipeline changed over time — use a Line Chart per stage, or a stacked Bar Chart by period.",
        ],
      }}
      related={[
        { label: "Bar Chart", href: "/design-system/components/data-display/bar-chart", reason: "when the categories are not a flow" },
        { label: "Approval Timeline", href: "/design-system/components/data-display/approval-timeline", reason: "the stages of one application rather than of many" },
        { label: "Progress", href: "/design-system/components/data-display/progress", reason: "a single stage's completion" },
        { label: "Donut Chart", href: "/design-system/components/data-display/donut-chart", reason: "when the parts sum to a whole" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-states">
            <h2 id="cdp-states" className="cdp__h2">
              The States It Draws
            </h2>
            <p>
              The funnel is a DOM list, not an SVG, so it has no viewBox to take its proportions from —
              it renders the same state figure every other chart uses, against a minimum height. That
              is deliberate: a funnel with nothing to show and a bar chart with nothing to show are the
              same object on the page, and two hand-rolled empty states that merely resemble each other
              drift apart on the first copy change.
            </p>
            <ul>
              <li>
                <strong>Loading</strong> — a skeleton, carrying <code>role=&quot;status&quot;</code>.
              </li>
              <li>
                <strong>Empty</strong> — the feed answered with no stages. No retry.
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
          <section className="cdp__section" aria-labelledby="cdp-order">
            <h2 id="cdp-order" className="cdp__h2">
              Order Is the Argument
            </h2>
            <p>
              The stages are drawn in the order they are given, from the first at the top. Do not invert
              them: a funnel read upward asks the reader to reverse a process in their head, and the
              carry-through percentage beside each bar is computed against the stage above it.
            </p>
            <p>
              Each bar&apos;s width is its share of the <em>first</em> stage, so the first bar is always
              full. Where a stage is larger than its predecessor the data is not a funnel, and the
              chart will draw it anyway — check the shape of the figures before reaching for this
              chart, not after.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { FunnelChart } from "@mosje/design-system";

<FunnelChart
  title="Application Pipeline"
  stages={[
    { label: "Applications Received", value: 100000 },
    { label: "Documents Verified", value: 85000 },
    { label: "District Approved", value: 72000 },
    { label: "Amount Disbursed", value: 68000 },
  ]}
/>`}</CodeBlock>
          <CodeBlock>{`<FunnelChart
  title="Application Pipeline"
  stages={stages}
  state={error ? "error" : loading ? "loading" : undefined}
  onRetry={refetch}
  filterLabel="district filter"
/>`}</CodeBlock>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-sr">
          <h2 id="cdp-sr" className="cdp__h2">
            What a Screen Reader Gets
          </h2>
          <p>
            Every stage name and figure is real text, in the order the process runs, followed by a
            visually hidden table of the same values. Unlike the SVG charts in this catalogue, nothing
            here is drawn in a way that has to be described — which is also why it has no keyboard gap
            to declare.
          </p>
        </section>
      }
    />
  );
}
