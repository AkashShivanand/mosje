import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
} from "@/components/design-system/docs-kit";

import { SparklineSpecimen } from "./specimen";

export const metadata: Metadata = {
  title: "Sparkline — Design System",
  description:
    "A small, axis-free line showing the shape of a recent trend, sized to sit inside a table row, a card corner or a metric.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.1.1 Non-text Content",
    level: "A",
    status: "verified",
    description:
      'Where `label` is given, the sparkline is an image named by that label and by a spoken summary of the trend. Where it is omitted the sparkline is decorative and carries aria-hidden — which is correct only when the same reading is already stated in words beside it.',
    evidence: 'sparkline.tsx lines 89–91 and 120–122: role="img" plus aria-label when labelled, aria-hidden when not.',
  },
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    status: "verified",
    description:
      "Fewer than two points renders a stated absence rather than a blank hidden SVG, so a sparkline the caller asked to be announced is never silently removed from the accessibility tree.",
    evidence: "sparkline.tsx line 46 onward documents and implements the short-series path.",
  },
  {
    criterion: "1.4.1 Use of Color",
    level: "A",
    status: "partial",
    description:
      "A sparkline carries no axis, no ticks and no values — the shape is the whole visual reading. It is only accessible in context: the figure it accompanies must be stated in text, and this component cannot enforce that.",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    status: "untested",
    description:
      "There is no keyboard interaction to test: a sparkline has no focusable marks and listens for no key.",
  },
];

export default function SparklinePage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Sparkline"
      status="Beta"
      summary="A small line with no axes, showing the shape of a recent trend beside the figure it belongs to. It is read for direction and volatility, never for a value."
      figma={{ node: "chartsChart" }}
      specimen={<SparklineSpecimen />}
      propsFrom="SparklineProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A figure is already stated in text and the recent trend behind it adds something — a metric card, a table row, a list of schemes.",
          "The reading wanted is direction and volatility: rising, flat, erratic.",
          "Space is genuinely tight. A sparkline exists because a full chart would not fit and a number alone would not say enough.",
        ],
        avoid: [
          "A value has to be read off it. There are no axes and no ticks; use a Line Chart.",
          "It is the main chart on the surface — then it is not a sparkline, and a Line Chart with labelled axes is what the reader needs.",
          "There is no accompanying figure in text. The shape on its own is not a reading, and hiding it from assistive technology then hides everything.",
          "The categories are not ordered — a line between unordered categories implies a sequence that is not there.",
        ],
      }}
      related={[
        { label: "Line Chart", href: "/design-system/components/data-display/line-chart", reason: "the same shape with axes that can be read" },
        { label: "Metric Card", href: "/design-system/components/data-display/metric-card", reason: "the figure a sparkline usually sits beside" },
        { label: "Progress", href: "/design-system/components/data-display/progress", reason: "for a level rather than a trend, at the same height" },
        { label: "Data Table", href: "/design-system/components/data-display/data-table", reason: "the rows a sparkline is most often embedded in" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-states">
            <h2 id="cdp-states" className="cdp__h2">
              The States It Draws
            </h2>
            <p>
              A sparkline is small enough that a blank one is easy to miss entirely, which is exactly
              why it needs these four. The specimen shows each.
            </p>
            <ul>
              <li>
                <strong>Loading</strong> — a skeleton at the sparkline&apos;s own proportions, carrying{" "}
                <code>role=&quot;status&quot;</code>, so a table row does not change height when the
                figures land.
              </li>
              <li>
                <strong>Empty</strong> — the series is genuinely empty. No retry.
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
            <p>
              <code>data</code> accepts <code>null</code> and <code>undefined</code> as well as an
              array, because &ldquo;the figure has not arrived&rdquo; is a real state and not an
              empty list. A series of fewer than two points renders a stated absence rather than a
              blank line.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-label">
            <h2 id="cdp-label" className="cdp__h2">
              Labelled or Decorative — Decide Deliberately
            </h2>
            <p>
              With <code>label</code>, the sparkline is announced as an image with a spoken summary of
              its trend. Without it, the sparkline is hidden from assistive technology as decoration.
            </p>
            <p>
              Both are correct in the right place: a sparkline beside a metric that already says
              &ldquo;14,25,890, up 12.4% on last year&rdquo; is decoration, and announcing it again is
              noise. A sparkline that is the only statement of a trend must be labelled. What is never
              correct is leaving the decision to chance, which is what happened before this component
              applied <code>aria-hidden</code> conditionally.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { Sparkline } from "@mosje/design-system";

// Decorative — the figure beside it already carries the reading.
<Sparkline data={[10, 15, 8, 22, 18, 30]} />

// Announced — this is the only statement of the trend.
<Sparkline data={monthly} label="Applications, last eight months" fill />`}</CodeBlock>
          <CodeBlock>{`<Sparkline
  data={reading?.monthly}
  label="Applications, last eight months"
  state={error ? "error" : loading ? "loading" : undefined}
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
            A labelled sparkline is one image whose accessible name is the label and whose description
            summarises the direction of the series. There is no data table: a sparkline is deliberately
            not a source of values, and publishing one would contradict what the mark is for.
          </p>
          <p>
            An unlabelled sparkline is hidden entirely. That is the right treatment for decoration and
            the wrong treatment for a reading, so the label is the decision this component asks the
            author to make.
          </p>
        </section>
      }
    />
  );
}
