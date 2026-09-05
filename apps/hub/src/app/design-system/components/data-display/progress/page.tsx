import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
} from "@/components/design-system/docs-kit";

import { ProgressSpecimen } from "./specimen";

export const metadata: Metadata = {
  title: "Progress — Design System",
  description:
    "A labelled horizontal bar for one figure against a maximum, at row height, with a real indeterminate state for a figure that has not arrived.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    status: "verified",
    description:
      'The track carries role="progressbar", is named by `label`, and reports aria-valuemin and aria-valuemax on every render. aria-valuenow is set only where a figure is known — its absence is precisely how ARIA spells "in progress, amount unknown".',
    evidence: "progress.tsx lines 99–106.",
  },
  {
    criterion: "1.4.1 Use of Color",
    level: "A",
    status: "verified",
    description:
      "The percentage is printed beside the label when `showValue` is on, and an unknown figure reads “—” to a sighted reader with a spoken equivalent for a screen reader. The fill never carries the reading alone.",
    evidence: "progress.tsx lines 88–89.",
  },
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    status: "verified",
    description:
      "A missing figure and a figure of nought are different renderings. A bar with no value stays indeterminate rather than drawing a confident empty track that reads, to a screen reader, as a measured nought.",
    evidence: "progress.tsx lines 14–20 document the change and the condition that implements it.",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    status: "untested",
    description:
      "Progress is not an input and has no keyboard interaction to test — it reports, and nothing on it is operable.",
  },
];

export default function ProgressPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Progress"
      status="Stable"
      summary="A labelled horizontal bar for one figure against a maximum. It keeps its row height in every state, which is what makes it the right mark inside a list where a gauge or a donut would not fit."
      figma={{ node: "chartsChart" }}
      specimen={<ProgressSpecimen />}
      propsFrom="ProgressProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "One figure is read against a maximum and several such figures are stacked, so their labels and bars should align.",
          "The bar sits inside a list, a table or a form where the row height must not change as figures arrive.",
          "A step count or a completion is being reported to the person waiting on it.",
        ],
        avoid: [
          "The figure is the headline of a card on its own — use a Gauge, which is drawn to be the focus.",
          "The whole divides into named parts — use a Donut Chart or a stacked Bar Chart; a single bar cannot show a division.",
          "The reading is a trend rather than a level — use a Sparkline or a Line Chart.",
          "The figure has no maximum. A progress bar with an invented ceiling is a made-up reading; use a Metric Card.",
        ],
      }}
      related={[
        { label: "Gauge", href: "/design-system/components/data-display/gauge", reason: "the same reading as a card headline" },
        { label: "Donut Chart", href: "/design-system/components/data-display/donut-chart", reason: "its progress mode, drawn as a ring" },
        { label: "Metric Card", href: "/design-system/components/data-display/metric-card", reason: "a figure with no ceiling" },
        { label: "Sparkline", href: "/design-system/components/data-display/sparkline", reason: "when the trend matters more than the level" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-states">
            <h2 id="cdp-states" className="cdp__h2">
              The States It Draws, and Why They Split
            </h2>
            <p>
              Progress handles its states differently from the SVG charts, deliberately. It is a label
              and a track sized to a row in a list, and replacing that row with a plate the moment the
              figures are in flight is a layout jump, not a loading state. So it splits two ways:
            </p>
            <ul>
              <li>
                <strong>Loading, and a missing figure, stay in the row.</strong> The bar renders
                indeterminate, the value reads &ldquo;—&rdquo;, and{" "}
                <code>aria-valuenow</code> is omitted. The row keeps its exact height.
              </li>
              <li>
                <strong>Empty, error, filtered-to-nothing and the rest need words</strong>, so they
                render the same state figure every other chart in the catalogue uses. Nothing here is
                hand-rolled, and a progress bar with nothing to show is the same object on the page as
                a bar chart with nothing to show.
              </li>
            </ul>
            <p>
              The specimen shows a known figure, a figure against a real maximum, an unpublished figure,
              and then the four state renderings.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-zero">
            <h2 id="cdp-zero" className="cdp__h2">
              Nought Is Not Missing
            </h2>
            <p>
              <code>value</code> is optional, and that is the whole point of this component&apos;s
              current API. It used to be required, so a caller with nothing to show had one honest
              option — pass nought — and the bar then drew a confident empty track reading{" "}
              <code>0%</code>, with <code>aria-valuenow=&quot;0&quot;</code> telling a screen reader
              the same thing.
            </p>
            <p>
              &ldquo;The department reports nought per cent&rdquo; and &ldquo;no figure has been
              published&rdquo; are different sentences, and one of them was being said for both. Omit{" "}
              <code>value</code> where the figure is unknown; pass nought only where nought is the
              reading.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { Progress } from "@mosje/design-system";

<Progress value={65} label="Application Form Progress" />

// A count against a real maximum.
<Progress value={1240} max={1800} label="Hostel Places Occupied" />

// No figure published. Do NOT pass 0 here.
<Progress label="Places Occupied" />`}</CodeBlock>
          <CodeBlock>{`<Progress
  value={reading?.rate}
  label="Grievances Resolved Within SLA"
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
            A real <code>progressbar</code>, named by its label, with its minimum and maximum always
            reported and its current value reported only when one is known. This is the one mark in the
            data-display group whose value is exposed as a value rather than as a picture with a
            caption — which is why it is the right choice on any surface read primarily through
            assistive technology.
          </p>
          <p>
            Nothing here is focusable, and nothing needs to be: a progress bar reports and is not
            operated.
          </p>
        </section>
      }
    />
  );
}
