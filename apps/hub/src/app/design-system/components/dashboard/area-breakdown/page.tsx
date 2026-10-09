import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  PropsTable,
  type A11yItem,
  type PropDef,
} from "@/components/design-system/docs-kit";
import { AreaPlayground } from "./area-playground";

export const metadata: Metadata = {
  title: "Area Breakdown — Design System",
  description:
    "The figures of one programme, State/UT by State/UT: the map of India and the same figures ranked beside it. With Area Explorer, the map beside a panel for the State/UT the reader picks.",
};

const MEASURE_SHAPE: PropDef[] = [
  { name: "id", type: "string", required: true, description: "Stable id; the switch's value." },
  { name: "name", type: "string", required: true, description: "What the figure counts, in full — \"Persons Engaged in Begging Identified\". The card's subtitle and the charts' titles." },
  { name: "label", type: "string", required: true, description: "Its word on the switch, where there is more than one measure — \"Identified\"." },
  { name: "rows", type: "AreaRow[]", required: true, description: "One `{ area, value }` per State/UT, spelled as India Map spells it." },
];

const A11Y: A11yItem[] = [
  {
    criterion: "1.1.1 Non-text Content",
    level: "A",
    description:
      "Each map carries its figures as a table for screen readers, so a reader who cannot see the shading still reads every State/UT's figure. Area Breakdown's ranked list beside the map says the same in text on screen.",
    status: "verified",
    evidence:
      "area-breakdown.tsx passes `tableView=\"sr-only\"` to both IndiaMap instances; chart-frame.tsx renders the table inside `.ds-sr-only` in that mode.",
  },
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    description:
      "The measure switch is a radio group with a name, and each option reports whether it is chosen.",
    status: "verified",
    evidence:
      "Area Breakdown renders SegmentedControl `variant=\"buttons\"` with `ariaLabel={switchLabel}`; filter-bar.tsx renders `role=\"radiogroup\"` with `role=\"radio\"` and `aria-checked` options.",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    description:
      "The measure switch is one tab stop, and the arrow keys move between measures.",
    status: "verified",
    evidence:
      "filter-bar.tsx gives the selected radio `tabIndex={0}` and the rest `-1`, and moves the choice and focus on the arrow keys, Home and End.",
  },
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "Area Explorer's \"Highest Five\" and \"Lowest Five\" are headings, at a level the page sets, so the two lists are found by heading and not by position.",
    status: "verified",
    evidence: "area-breakdown.tsx renders both labels as `h${labelLevel}`, defaulting to h4.",
  },
  {
    criterion: "2.3.3 Animation from Interactions",
    level: "AAA",
    description:
      "A new measure fades in rather than snapping; the fade is removed when the reader asks for reduced motion.",
    status: "verified",
    evidence: "area-breakdown.css: `@media (prefers-reduced-motion: reduce) { .ds-area-arrive { animation: none } }`.",
  },
];

export default function AreaBreakdownPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Area Breakdown"
      status="Beta"
      summary="One programme's figures State/UT by State/UT: the map of India, a switch between the figures it can show, and the same figures ranked beside it. Area Explorer sets the map beside a panel that shows the highest and lowest five until the reader picks a State/UT, then that State/UT."
      figma={{
        absent:
          "Not yet drawn in the SAMAVESH library. Extracted from the built Beneficiary Dashboard in October 2026; the Figma master follows in the next pass, and the code is authoritative until it exists.",
      }}
      specimen={<AreaPlayground />}
      propsFrom="AreaBreakdownProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A programme publishes a figure for each State/UT, and the reader wants both where it is high and in what order.",
          "The map should be a way into a State/UT's figures — `onSelectArea` sets the page's area, as the State/UT filter does.",
          "Area Explorer: a landing page where the reader is expected to pick a State/UT and read about it in place.",
        ],
        avoid: [
          "The rows are districts, or anything India Map cannot draw — use Ranked Bar List alone.",
          "The figure is a percentage of something different in each State/UT — a shaded map of ratios reads as a map of size; use a Ranked Bar List and say what the ratio is of.",
          "The reading comes from a KPI register — use KPI View, which draws a State/UT reading the same way and carries its source.",
          "Only a handful of States/UTs report — a mostly blank map says less than a short list.",
        ],
      }}
      related={[
        { label: "India Map", href: "/design-system/components/data-display/india-map", reason: "the map, on its own, with its own legend and states" },
        { label: "Ranked Bar List", href: "/design-system/components/data-display/ranked-bar-list", reason: "the ranked figures without a map" },
        { label: "KPI View", href: "/design-system/components/dashboard/kpi-view", reason: "a register reading drawn by its shape, State/UT readings included" },
        { label: "Chart Card", href: "/design-system/components/dashboard/chart-card", reason: "the card Area Breakdown is drawn in" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-one-measure">
            <h2 id="cdp-one-measure" className="cdp__h2">
              One Measure, Read by Both
            </h2>
            <p>
              The map and the ranked list read the same measure from the same rows, chosen once.
              They cannot disagree, which matters because a reader who finds two different figures
              for one State/UT on a government page has no way to tell which is true.
            </p>
            <p>
              The switch changes the measure for both at once. It appears only where there is more
              than one measure; with one, the subtitle names it.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-map-control">
            <h2 id="cdp-map-control" className="cdp__h2">
              The Map Is a Control
            </h2>
            <p>
              Picking a State/UT on the map calls <code>onSelectArea</code>. On the Beneficiary
              Dashboard that sets the page&rsquo;s area, so the map is a way into a State&rsquo;s
              figures rather than a second picture of them. In the specimen, picking one on either
              map opens it in the explorer.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-explorer">
            <h2 id="cdp-explorer" className="cdp__h2">
              The Explorer&rsquo;s Panel Belongs to the Page
            </h2>
            <p>
              Area Explorer draws the highest and lowest from <code>rows</code> itself. What a page
              knows about one State/UT is the page&rsquo;s, so the picked State/UT&rsquo;s body and
              footer are passed in as <code>selectedContent</code> and <code>selectedActions</code>.
              Always offer a way back to the extremes in the footer.
            </p>
          </section>
        </>
      }
      code={
        <>
          <section className="cdp__section" aria-labelledby="cdp-explorer-props">
            <h2 id="cdp-explorer-props" className="cdp__h2">
              Area Explorer Props
            </h2>
            <PropsTable from="AreaExplorerProps" />
          </section>
          <section className="cdp__section" aria-labelledby="cdp-measure-shape">
            <h2 id="cdp-measure-shape" className="cdp__h2">
              AreaMeasure
            </h2>
            <PropsTable props={MEASURE_SHAPE} />
          </section>
          <section className="cdp__section" aria-labelledby="cdp-example">
            <h2 id="cdp-example" className="cdp__h2">
              Example
            </h2>
            <CodeBlock>{`import { AreaBreakdown, compactCount } from "@mosje/design-system";

<AreaBreakdown
  measures={[
    { id: "identified", name: "Persons Engaged in Begging Identified", label: "Identified", rows: identified },
    { id: "rehabilitated", name: "Persons Rehabilitated", label: "Rehabilitated", rows: rehabilitated },
  ]}
  headingLevel={4}
  valueFormat={compactCount}
  onSelectArea={(state) => go({ state })}
/>`}</CodeBlock>
            <p>
              Both components are client components: the switch and the explorer&rsquo;s choice are
              state, and <code>valueFormat</code> is a function. Render them from a client
              component, or pass no function props from the server.
            </p>
          </section>
        </>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-not-measured">
          <h2 id="cdp-not-measured" className="cdp__h2">
            Not Yet Verified
          </h2>
          <p>
            Picking a State/UT on the map from the keyboard depends on India Map&rsquo;s own
            keyboard support, which is documented on its own page and is not claimed here. The
            map&rsquo;s shading is the chart palette&rsquo;s, and its contrast is not measured by
            this component.
          </p>
        </section>
      }
    />
  );
}
