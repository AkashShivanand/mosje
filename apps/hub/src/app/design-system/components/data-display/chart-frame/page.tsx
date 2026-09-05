import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
  type PropDef,
} from "@/components/design-system/docs-kit";

import { ChartFrameSpecimen } from "./specimen";

export const metadata: Metadata = {
  title: "Chart Frame — Design System",
  description:
    "The shell every chart renders through: the accessible SVG wrapper, the screen-reader data table, and the one place the five chart states are drawn.",
};

/*
 * `ChartState` and `ChartStateFigure` are not interfaces the extractor can
 * reach — one is a union of string literals, the other a component whose props
 * are documented as part of the frame's own contract. They are the rows below;
 * everything else on this page comes from the type checker.
 */
const STATE_API: PropDef[] = [
  {
    name: "ChartState",
    type: '"loading" | "empty" | "no-results" | "not-published" | "error" | "restricted" | "offline"',
    description:
      "The states a chart can be in beyond drawing. It is the dashboard CardStateKind plus \"loading\", so a chart and the card around it cannot describe the same condition two different ways. The type itself is internal; callers pass the string literal.",
  },
  {
    name: "ChartStateFigure",
    type: "React.FC<ChartStateFigureProps>",
    description:
      "The state layer on its own, for the charts that do not draw through a frame — FunnelChart is a DOM list rather than an SVG. It takes the same state, onRetry and filterLabel, plus an `aspect` where the chart has proportions to give and a floor where it does not.",
  },
];

const A11Y: A11yItem[] = [
  {
    criterion: "1.1.1 Non-text Content",
    level: "A",
    status: "verified",
    description:
      'Every chart is one image: role="img" on the SVG, aria-labelledby pointing at a <title> and, where a summary is given, a <desc>. The figures follow as a visually hidden <table> with a caption. This is what makes the whole catalogue accessible by construction rather than chart by chart.',
    evidence: "chart-frame.tsx: the ChartFrame return renders title, desc, and the sr-only table from `table`.",
  },
  {
    criterion: "4.1.3 Status Messages",
    level: "AA",
    status: "verified",
    description:
      'The loading skeleton carries role="status" and a visually hidden "Loading <title>", so a wait is announced as deliberate rather than passing as silence.',
    evidence: "chart-frame.tsx, ChartStateFigure: the skeleton div and its ds-sr-only label.",
  },
  {
    criterion: "1.3.2 Meaningful Sequence",
    level: "A",
    status: "verified",
    description:
      "A state renders at the chart's own aspect ratio, derived from its viewBox, so nothing on the page moves when the figures land. A fixed placeholder in front of a responsive chart is the layout shift this avoids.",
    evidence: "aspectFromViewBox in chart-frame.tsx, passed to the state figure as an aspect-ratio.",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    status: "partial",
    description:
      'The frame is the reason the whole catalogue has one keyboard gap rather than seventeen. role="img" on the SVG prunes its descendants from the accessibility tree, so the per-mark tabIndex the charts set produces focus stops with no accessible name. Fixing it here fixes it everywhere; until then, the screen-reader table is the keyboard path.',
    evidence: 'Open gap, recorded 2026-09-02: role="img" in chart-frame.tsx against tabIndex={0} in bar, line, area, combo, donut, scatter, heatmap and india-map.',
  },
  {
    criterion: "GIGW 3.0 — Data Presentation",
    level: "GIGW",
    status: "verified",
    description:
      "Every chart publishes its figures as a real table with a caption, which is the accessible equivalent GIGW asks for and the one thing a picture of data cannot substitute for.",
    evidence: "The `table` prop, passed by every chart in packages/design-system/components/data-display/charts.",
  },
];

export default function ChartFramePage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Chart Frame"
      status="Beta"
      summary="The shell every chart in the catalogue renders through. It owns the accessible SVG wrapper, the screen-reader data table, the caption, the legend slot and the five states a chart can be in."
      figma={{ node: "chartsDoc" }}
      specimen={<ChartFrameSpecimen />}
      propsFrom="ChartFrameProps"
      props={STATE_API}
      a11y={A11Y}
      whenToUse={{
        use: [
          "A new chart is being added to the design system and needs the same accessible structure as the seventeen already there.",
          "A bespoke SVG drawing genuinely belongs in the package and has figures a screen reader must be able to read.",
          "A chart draws in the DOM rather than in an SVG and still needs the catalogue's states — render ChartStateFigure directly, as FunnelChart does.",
        ],
        avoid: [
          "A chart in the catalogue already draws what is wanted. Reach for it; a second implementation of the same mark is how two dashboards come to disagree about one figure.",
          "The drawing is decorative and carries no figures — that is an Illustration, and it takes an alt text rather than a data table.",
          "The surface is a portal rather than the design system. Charts belong in the package; a portal-local frame is a second copy of this contract that no gate can check.",
          "A single figure is being reported — use a Metric Card, a Gauge or a Progress bar rather than wrapping a number in a chart shell.",
        ],
      }}
      related={[
        { label: "Bar Chart", href: "/design-system/components/data-display/bar-chart", reason: "the frame in its ordinary use" },
        { label: "Funnel Chart", href: "/design-system/components/data-display/funnel-chart", reason: "the state layer without the frame" },
        { label: "Axis", href: "/design-system/components/data-display/axis", reason: "the scale drawn inside the frame" },
        { label: "Legend", href: "/design-system/components/data-display/legend", reason: "the key the frame renders below the canvas" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-shape">
            <h2 id="cdp-shape" className="cdp__h2">
              What It Guarantees
            </h2>
            <ol>
              <li>
                <strong>A named image.</strong> The SVG is <code>role=&quot;img&quot;</code> with a{" "}
                <code>&lt;title&gt;</code> and, where <code>summary</code> is given, a{" "}
                <code>&lt;desc&gt;</code>.
              </li>
              <li>
                <strong>A data table.</strong> <code>table</code> renders as a visually hidden{" "}
                <code>&lt;table&gt;</code> with a caption — the accessible source of truth, not a
                supplement to the drawing.
              </li>
              <li>
                <strong>A positioned canvas.</strong> <code>overlay</code> and <code>canvasRef</code>{" "}
                exist so a tooltip can be placed against the chart&apos;s own box.
              </li>
              <li>
                <strong>A caption and a legend slot</strong>, below the canvas, in the same place on
                every chart.
              </li>
              <li>
                <strong>The five states</strong>, drawn at the chart&apos;s own proportions.
              </li>
            </ol>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-states">
            <h2 id="cdp-states" className="cdp__h2">
              One Place, Not Seventeen
            </h2>
            <p>
              An audit on 2 September 2026 found all four of the states that get skipped skipped across
              all seventeen charts: none had a loading state, none had an error state, six had no empty
              state at all, and every one that did hard-coded &ldquo;empty&rdquo; — so a reader who had
              filtered their own selection away was told &ldquo;Nothing to show yet&rdquo; with no way
              back.
            </p>
            <p>
              That was never seventeen defects. Thirteen charts already rendered through this frame, so
              it was one place, and this is it. The specimen above shows a bar chart and a funnel — one
              an SVG, one a DOM list — resolving the same four states into the same object on the page.
            </p>
            <ul>
              <li>
                <strong>Loading</strong> — a skeleton at the chart&apos;s aspect ratio, carrying{" "}
                <code>role=&quot;status&quot;</code>.
              </li>
              <li>
                <strong>Empty</strong> — answered, nothing to show. No action is offered, because
                pressing one would do nothing.
              </li>
              <li>
                <strong>Error</strong> — a &ldquo;Try again&rdquo; control, where{" "}
                <code>onRetry</code> is given.
              </li>
              <li>
                <strong>Filtered to nothing</strong> — a &ldquo;Clear <em>filter</em>&rdquo; control,
                named by <code>filterLabel</code>.
              </li>
              <li>
                <strong>Not published, restricted and offline</strong> — the remaining card states,
                available for the same reason: a chart and the card around it must not describe one
                condition two ways.
              </li>
            </ul>
            <p>
              Which action a state gets is decided by the state, not by the caller. An
              &ldquo;empty&rdquo; card with a retry button invites a reader to press it forever.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-aspect">
            <h2 id="cdp-aspect" className="cdp__h2">
              Proportions, Not a Placeholder Height
            </h2>
            <p>
              The state figure takes its aspect ratio from the chart&apos;s own <code>viewBox</code>, so
              a loading skeleton occupies exactly the space the figures will. A fixed placeholder in
              front of a responsive chart is a layout shift, which is the thing a loading state is
              supposed to prevent. Where a chart genuinely has no viewBox — the funnel draws in the DOM
              — a minimum height stands in.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <p>
            <code>ChartFrame</code> is internal to the chart layer and is not exported from the package
            barrel — a portal composes charts, it does not compose frames. This is what a new chart
            inside the package looks like.
          </p>
          <CodeBlock>{`import { ChartFrame, type ChartStateProps } from "./internal/chart-frame";

interface MyChartProps extends ChartStateProps {
  title: string;
  data: ChartDatum[];
}

export function MyChart({ title, data, state, onRetry, filterLabel }: MyChartProps) {
  // ONE expression, resolved before anything downstream reads it. The caller's
  // state wins where it is given; an empty array falls back to "empty".
  const resolved = state ?? (data.length === 0 ? "empty" : undefined);

  return (
    <ChartFrame
      title={title}
      summary={\`\${data.length} categories\`}
      viewBox="0 0 480 280"
      table={{ columns: ["Category", "Value"], rows: data.map((d) => [d.label, d.value]) }}
      state={resolved}
      onRetry={onRetry}
      filterLabel={filterLabel}
    >
      {/* marks */}
    </ChartFrame>
  );
}`}</CodeBlock>
          <p>
            A chart that does not draw in an SVG renders the state layer directly, so its empty state is
            the same object on the page as every other chart&apos;s.
          </p>
          <CodeBlock>{`import { ChartStateFigure } from "./internal/chart-frame";

if (state && state !== "loading")
  return <ChartStateFigure state={state} title={title} onRetry={onRetry} filterLabel={filterLabel} />;`}</CodeBlock>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-sr">
          <h2 id="cdp-sr" className="cdp__h2">
            The Table Is the Reading
          </h2>
          <p>
            The frame publishes each chart as one named image followed by a visually hidden table of the
            same figures. That table is the accessible source of truth rather than a supplement: it is
            where a screen-reader user gets the values a sighted reader is estimating from the marks.
          </p>
          <p>
            <strong>The one gap, and where it lives.</strong>{" "}
            <code>role=&quot;img&quot;</code> on the SVG prunes every descendant from the accessibility
            tree. Eight charts set <code>tabIndex</code> on their marks so a keyboard user can reach the
            tooltip, and those focus stops therefore announce as nothing. It is one defect in one file
            rather than eight, and it is the reason no chart page in this group claims keyboard
            navigation.
          </p>
        </section>
      }
    />
  );
}
