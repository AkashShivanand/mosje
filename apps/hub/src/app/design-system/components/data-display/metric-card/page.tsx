import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
} from "@/components/design-system/docs-kit";

import { MetricCardSpecimen } from "./specimen";

export const metadata: Metadata = {
  title: "Metric Card — Design System",
  description:
    "One headline figure with its label and, where there is one, the change against a stated baseline — with real states for a figure that has not arrived.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    status: "verified",
    description:
      "The card carries an aria-label combining its label and the spoken value, so the figure and what it counts are announced together rather than as two unrelated fragments. A card that is loading also reports aria-busy.",
    evidence: "metric-card.tsx lines 116–117.",
  },
  {
    criterion: "1.4.1 Use of Color",
    level: "A",
    status: "verified",
    description:
      'The trend direction is spoken as words — "Increase", "Decrease", "No change" — through visually hidden text beside the arrow, so it is never carried by a green or red pill alone.',
    evidence: "metric-card.tsx lines 151 and 160, with CHANGE_LABELS at line 52.",
  },
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    status: "verified",
    description:
      "A missing figure is not written as a dash. The card composes both the visible answer and the spoken one from `loading` or `state`, so a screen reader is never told that a total is “—”.",
    evidence: "metric-card.tsx documents this at the `value` prop and derives the spoken value from cardStateCopy.",
  },
  {
    criterion: "1.1.1 Non-text Content",
    level: "A",
    status: "verified",
    description: "The trend arrow and the optional icon badge are aria-hidden; neither carries information that is not also in text.",
    evidence: "metric-card.tsx lines 60–70, 126 and 140.",
  },
  {
    criterion: "1.4.4 Resize Text",
    level: "AA",
    status: "untested",
    description:
      "The figure is set in a display size and a long value at 200% text size has not been measured against the card's own width.",
  },
];

export default function MetricCardPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Metric Card"
      status="Stable"
      summary="States one figure, what it counts, and how it has moved against a named baseline. It keeps its height whether the figure has arrived or not, so a row of them does not reflow."
      figma={{ node: "chartsMetricCard" }}
      specimen={<MetricCardSpecimen />}
      propsFrom="MetricCardProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A dashboard opens with the two to six figures a reader came for.",
          "A figure has moved and the movement matters — pass changeValue with a changeLabel naming what it is measured against.",
          "The figure has no ceiling, so there is nothing to draw it against.",
        ],
        avoid: [
          "The figure is read against a maximum — use a Gauge, or a Progress bar where several such figures are stacked.",
          "The reading is the shape over time rather than the level — use a Sparkline beside the figure, or a Line Chart instead of it.",
          "There are more than about six on one screen. Past that nothing is a headline, and a Data Table is what the reader actually wants.",
          "The figure needs a chart beside it inside one surface — use a Chart Card, which is built to hold both.",
        ],
      }}
      related={[
        { label: "Chart Card", href: "/design-system/components/dashboard/chart-card", reason: "when a figure and a chart share one surface" },
        { label: "KPI Row", href: "/design-system/components/dashboard/kpi-row", reason: "the row these are laid out in" },
        { label: "Gauge", href: "/design-system/components/data-display/gauge", reason: "when the figure is read against a maximum" },
        { label: "Sparkline", href: "/design-system/components/data-display/sparkline", reason: "the trend that sits beside the figure" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-states">
            <h2 id="cdp-states" className="cdp__h2">
              A Figure That Has Not Arrived
            </h2>
            <p>
              <code>value</code> is optional, and it was not. A required string made &ldquo;still
              arriving&rdquo; and &ldquo;did not arrive&rdquo; inexpressible, so every call site with no
              figure passed a dash — and the card then announced <em>&ldquo;Total beneficiaries:
              —&rdquo;</em>, which is not a reading of anything.
            </p>
            <ul>
              <li>
                <strong><code>loading</code></strong> — the tile keeps its exact height and shimmers
                where the value will be, so a row of six does not reflow when they land.
              </li>
              <li>
                <strong><code>state</code></strong> — why there is no figure, in{" "}
                <code>CardState</code>&apos;s own words, so a tile and the chart beside it describe one
                failed request with one sentence.
              </li>
              <li>
                <strong><code>loading</code> wins where both are given.</strong> A card cannot be
                waiting and finished at the same time.
              </li>
            </ul>
            <p>
              The specimen&apos;s second row shows loading, an unpublished figure, a failed request and
              a filter that matched nothing — four different sentences where a dash would have been one
              silence.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-change">
            <h2 id="cdp-change" className="cdp__h2">
              The Change Needs a Baseline
            </h2>
            <p>
              <code>changeValue</code> is the delta and <code>changeLabel</code> is what it is measured
              against. <strong>A delta with no baseline is not a fact</strong> — &ldquo;+12.4%&rdquo;
              on its own invites a reader to supply their own comparison, and on a departmental figure
              that is how a number reaches a deck meaning something it never meant.
            </p>
            <p>
              Set <code>changeDirection</code> to match the delta. It draws the arrow and the tint, and
              it is what supplies the spoken &ldquo;Increase&rdquo; or &ldquo;Decrease&rdquo; that stops
              the trend resting on colour. Leave it <code>flat</code> where a change is not meaningful
              rather than pointing it in a flattering direction.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-five">
            <h2 id="cdp-five" className="cdp__h2">
              Five Readings of One Number
            </h2>
            <p>
              The visualisation specification names five genuine variants of showing one number,
              separated by what else the reader needs. They are props on this one card, not five
              cards:
            </p>
            <ul>
              <li>
                <strong>Bare value</strong> — <code>label</code> and <code>value</code>. Formatting
                is the whole component.
              </li>
              <li>
                <strong>Value with comparison</strong> — <code>changeValue</code> against a named{" "}
                <code>changeLabel</code>.
              </li>
              <li>
                <strong>Value with trend</strong> — a <code>Sparkline</code> in <code>aside</code>.
                It is decorative there; the figure carries the meaning.
              </li>
              <li>
                <strong>Value against target</strong> — <code>progress</code> with a{" "}
                <code>max</code> and, where one exists, a <code>target</code>. It is a bar, not a
                second number, because the reader&rsquo;s question is how far there is to go.
              </li>
              <li>
                <strong>Value with status</strong> — <code>status</code> for the words and{" "}
                <code>tone</code> for the colour. The chip is what lets the tint be a tint.
              </li>
            </ul>
            <p>
              <code>detail</code> prints the numerator and denominator behind a rate, and{" "}
              <code>provenance</code> prints where the figure came from. Both are dropped, with the
              change indicator, whenever there is no figure to describe.
            </p>
            <p>
              A tone is a claim. On this estate red means breached and green means on track, so
              set <code>tone</code> only against a rule the scheme has stated — the queue&rsquo;s
              &ldquo;due soon&rdquo; and &ldquo;overdue&rdquo; tiles, not the first card in a row.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-format">
            <h2 id="cdp-format" className="cdp__h2">
              Format the Figure Before You Pass It
            </h2>
            <p>
              <code>value</code> is a pre-formatted string, so the grouping is decided by the caller.
              Use Indian grouping — <strong>14,25,890</strong>, not 1,425,890 — because that is how the
              department publishes its own figures. The chart layer exports{" "}
              <code>formatIndian</code> and <code>formatCompact</code> for exactly this.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { MetricCard, formatIndian } from "@mosje/design-system";

<MetricCard
  label="Total Scholarships Awarded"
  value={formatIndian(1425890)}
  changeValue="12.4%"
  changeDirection="up"
  changeLabel="vs last year"
/>`}</CodeBlock>
          <p>
            With no figure yet, leave <code>value</code> out entirely. Do not reach for a dash, and do
            not pass a zero.
          </p>
          <CodeBlock>{`<MetricCard label="Total Scholarships Awarded" loading={pending} state={error ? "error" : undefined} value={figure} />`}</CodeBlock>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-sr">
          <h2 id="cdp-sr" className="cdp__h2">
            What a Screen Reader Gets
          </h2>
          <p>
            One labelled region announcing the label and the value together, so &ldquo;Total
            Scholarships Awarded: 14,25,890&rdquo; arrives as one fact rather than as a heading and an
            orphaned number.
          </p>
          <p>
            The trend is spoken as a word before the delta — &ldquo;Increase, 12.4% vs last year&rdquo;
            — so a reader who cannot see the arrow or the tint gets the direction. Where the figure has
            not arrived, the card speaks the reason rather than the placeholder.
          </p>
        </section>
      }
    />
  );
}
