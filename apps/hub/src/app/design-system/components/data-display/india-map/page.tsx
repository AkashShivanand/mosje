import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
  type PropDef,
} from "@/components/design-system/docs-kit";

import { IndiaMapSpecimen } from "./specimen";

export const metadata: Metadata = {
  title: "India Map — Design System",
  description:
    "A state-level choropleth of India, shading each state by its figure, with a legend and a screen-reader table of every value.",
};

/*
 * `IndiaMapDatum` is the shape the `data` prop is built from. The extractor
 * reads interfaces, not the members of the types they reference.
 */
const DATUM: PropDef[] = [
  {
    name: "IndiaMapDatum.state",
    type: "string",
    required: true,
    description:
      "The state or union territory name. It is matched against the boundary set after normalisation, so ordinary spelling variants resolve — but a name the set does not know is silently unshaded rather than reported, so check the render against the list you passed.",
  },
  {
    name: "IndiaMapDatum.value",
    type: "number",
    required: true,
    description: "The figure that decides the shade. A state absent from `data` reads as “no data”, which is not the same as nought.",
  },
];

const A11Y: A11yItem[] = [
  {
    criterion: "1.1.1 Non-text Content",
    level: "A",
    status: "verified",
    description:
      "Rendered through ChartFrame, which draws an SVG <title>, a <desc> naming the range across the states supplied, and a visually hidden table carrying every state and its figure.",
    evidence: "india-map.tsx lines 94 and 115: `summary` and `table` passed to ChartFrame.",
  },
  {
    criterion: "1.4.1 Use of Color",
    level: "A",
    status: "partial",
    description:
      "Shade is the whole visual encoding, as it is for any choropleth, so a reader who cannot separate the steps depends entirely on the screen-reader table. States with no datum are drawn in the unshaded ground and labelled “no data” in their accessible name rather than reading as nought.",
    evidence: 'india-map.tsx line 133: aria-label falls back to "no data" where the value is undefined.',
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    status: "partial",
    description:
      'Every state and figure is reachable through the screen-reader table. The state paths set tabIndex={0} beneath an SVG carrying role="img", which prunes its descendants, so those stops receive focus with no accessible name. This page previously claimed Tab and arrow-key navigation between states; the arrow keys have never existed.',
    evidence: 'Open gap, recorded 2026-09-02: role="img" in chart-frame.tsx against tabIndex={0} at india-map.tsx line 131.',
  },
  {
    criterion: "1.4.11 Non-text Contrast",
    level: "AA",
    status: "untested",
    description:
      "State boundaries are stroked so that adjacent states of similar value stay separable, but no measurement of the stroke against the palest and darkest fills has been recorded.",
  },
];

export default function IndiaMapPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="India Map"
      status="Beta"
      summary="Shades each state and union territory of India by its figure, with a legend for the ramp and a hidden table of every value. It answers where a scheme reaches, at the level the department reports."
      figma={{ absent: "Not yet published in the Figma library. The geography is generated from the boundary set in packages/design-system/components/data-display/charts/geo, not drawn." }}
      specimen={<IndiaMapSpecimen />}
      propsFrom="IndiaMapProps"
      props={DATUM}
      a11y={A11Y}
      whenToUse={{
        use: [
          "The figure is reported by state or union territory and where it concentrates is the reading.",
          "The reader is expected to recognise their own state and find its figure — the most common use on a departmental dashboard.",
          "A state can be highlighted to tie the map to a selection made elsewhere on the page, through highlightState.",
        ],
        avoid: [
          "The exact figures are the point — use a Data Table beside the map, or instead of it. Shade cannot be read to a number.",
          "The unit is a district or a village rather than a state; this component draws state boundaries only.",
          "Two categorical axes cross and neither is geography — use a Heatmap.",
          "The figures are counts at points rather than aggregates by area — a choropleth shades whole states, which misrepresents a scatter of locations.",
          "Only the ranking matters, not the geography — use a horizontal Bar Chart, which is read far more accurately.",
        ],
      }}
      related={[
        { label: "Heatmap", href: "/design-system/components/data-display/heatmap", reason: "the same shading without the geography" },
        { label: "Data Table", href: "/design-system/components/data-display/data-table", reason: "when the exact figures are the reading" },
        { label: "Bar Chart", href: "/design-system/components/data-display/bar-chart", reason: "when ranking states matters more than placing them" },
        { label: "Legend", href: "/design-system/components/data-display/legend", reason: "the key that names the ends of the ramp" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-states">
            <h2 id="cdp-states" className="cdp__h2">
              The States It Draws
            </h2>
            <p>
              A map has a particular failure that makes these four worth showing: the outline of India
              is drawn whether or not any figures arrived, so an unshaded map reads as a working map of
              a scheme that reaches nobody. It is not. The specimen shows what each of the four
              non-populated states says instead.
            </p>
            <ul>
              <li>
                <strong>Loading</strong> — a skeleton at the map&apos;s own proportions, carrying{" "}
                <code>role=&quot;status&quot;</code>.
              </li>
              <li>
                <strong>Empty</strong> — the feed answered with no states. No retry.
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
              Resolve the state once, above the map, and give the same resolved value to every key,
              counter and list reading the same request. A section shipped on this estate with a key
              reading nought above a map drawing 19,768 villages, because the two halves resolved the
              same request differently.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-boundaries">
            <h2 id="cdp-boundaries" className="cdp__h2">
              Boundaries and Names
            </h2>
            <p>
              The outline is generated from the boundary set committed alongside the component. Do not
              substitute another one: the depiction of India&apos;s external boundaries on a Government
              of India property is not a rendering preference.
            </p>
            <p>
              State names are matched after normalisation, so ordinary spelling variants resolve. A
              name the set does not recognise leaves that state unshaded and says nothing about it —
              check what you passed against what was drawn rather than assuming a silent match.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { IndiaMap } from "@mosje/design-system";

<IndiaMap
  title="State Beneficiary Coverage"
  highlightState="Bihar"
  data={[
    { state: "Uttar Pradesh", value: 1200 },
    { state: "Maharashtra", value: 950 },
    { state: "Bihar", value: 780 },
  ]}
/>`}</CodeBlock>
          <CodeBlock>{`const state = error ? "error" : loading ? "loading" : rows.length === 0 ? "no-results" : undefined;

<IndiaMap
  title="State Beneficiary Coverage"
  data={rows}
  state={state}
  onRetry={refetch}
  filterLabel="scheme filter"
/>`}</CodeBlock>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-sr">
          <h2 id="cdp-sr" className="cdp__h2">
            What a Screen Reader Gets
          </h2>
          <p>
            One image named by its title and described by its range, then a visually hidden table with
            a row per state. A state with no datum reads as &ldquo;no data&rdquo; rather than as
            nought, which is the distinction a choropleth most often loses.
          </p>
          <p>
            <strong>The open gap.</strong> State paths are focusable but sit beneath{" "}
            <code>role=&quot;img&quot;</code> and are pruned from the accessibility tree, so they
            announce as nothing. There is no arrow-key navigation between states, and this page has
            stopped claiming it.
          </p>
        </section>
      }
    />
  );
}
