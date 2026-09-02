import type { Metadata } from "next";
import * as React from "react";

import { CodeBlock, ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";

import { SmallMultiplesSpecimen } from "./specimen";

export const metadata: Metadata = {
  title: "Small Multiples — Design System",
  description:
    "The same chart once per category, on one shared scale — the answer to a series count that colour cannot carry.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.4.1 Use of Colour",
    level: "A",
    status: "verified",
    evidence:
      "Identity is carried by POSITION and a per-panel heading, not by hue — which is the whole reason to reach for this over a many-series chart.",
    description: "A twenty-eight-series chart cannot satisfy 1.4.1; twenty-eight panels satisfy it by construction.",
  },
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    status: "verified",
    evidence:
      "The grid is a `<ul>` of `<li>`, each panel headed by an `<h3>`, inside a `<section>` labelled by the grid's title.",
    description: "The structure says “these are the same thing, once per category”.",
  },
  {
    criterion: "1.3.2 Meaningful Sequence",
    level: "A",
    status: "verified",
    evidence:
      "A sentence above the grid states the shared maximum, so a reader who cannot see the axes still knows the panels are comparable.",
    description:
      "Sighted readers cannot see a shared scale either — it is a property of the data, not of the drawing.",
  },
  {
    criterion: "1.4.10 Reflow",
    level: "AA",
    status: "verified",
    evidence: "The grid is one column below 640px and two below 1024px, whatever `columns` asks for.",
    description: "Four panels across on a phone is unreadable, so the column count is a ceiling rather than a promise.",
  },
];

export default function SmallMultiplesPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Small Multiples"
      status="Beta"
      summary="The same chart drawn once per category, on one shared scale. It is what to use when a series count has outgrown what colour can carry — position and a caption identify each panel, so no hue is needed at all."
      figma={{ absent: "Not yet drawn in the Figma library. The chart catalogue is authored in code first." }}
      specimen={<SmallMultiplesSpecimen />}
      propsFrom="SmallMultiplesProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "More than six series — the point at which the categorical ramp runs out of distinguishable colours.",
          "A per-state, per-district or per-scheme breakdown that would otherwise be a stacked bar nobody can read.",
          "Comparing the SHAPE of a trend across many categories rather than their exact values.",
        ],
        avoid: [
          "Two or three series, which one chart carries perfectly well.",
          "Panels that genuinely cannot share a scale — if the categories are measured in different units, they are different charts, not multiples.",
        ],
      }}
      related={[
        { label: "Bar Chart", href: "/design-system/components/data-display/bar-chart", reason: "one chart, up to six series" },
        { label: "Legend", href: "/design-system/components/data-display/legend", reason: "identifying series by colour, while colour still works" },
        { label: "Colour", href: "/design-system/foundations/color", reason: "why the categorical ramp stops at six" },
      ]}
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { BarChart, SmallMultiples, texturedColor } from "@mosje/design-system";

<SmallMultiples
  title="Applications by State and Category"
  items={states}
  labelOf={(s) => s.name}
  valuesOf={(s) => s.values}          // used ONLY for the shared ceiling
  renderItem={(s, sharedMax) => (
    <BarChart
      title={\`\${s.name} applications\`}
      textured                         // emits the hatch <defs>
      tableView="sr-only"              // one grid, not 28 table links
      max={sharedMax}                  // ← the shared scale
      data={s.values.map((v, i) => ({
        label: CATEGORIES[i],
        value: v,
        color: texturedColor(i),       // ← points at the patterns
      }))}
    />
  )}
/>`}</CodeBlock>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-scale">
          <h2 id="cdp-scale" className="cdp__h2">
            The Shared Scale Is the Whole Point
          </h2>
          <p>
            Small multiples work because the eye compares panel against panel. The instant each
            panel scales to its own maximum, a state with 40 beneficiaries draws an identical bar
            to one with 40,000 — and the grid becomes actively misleading, which is worse than no
            chart, because it looks rigorous.
          </p>
          <p>
            That is why <code>valuesOf</code> is required rather than optional, and why{" "}
            <code>renderItem</code> is handed <code>sharedMax</code> instead of being trusted to
            work it out. The component cannot force a caller to use it — but it can make ignoring
            it a visible choice rather than an oversight.
          </p>
          <h2 className="cdp__h2">Texture, and Why There Are Exactly Six</h2>
          <p>
            <code>textured</code> emits hatch patterns and <code>texturedColor(i)</code> points a
            series at them, through the colour override every chart already has. Texture is what
            survives colour-vision deficiency, print and forced-colors — and it keeps the hue as
            well as the geometry, so a reader who can see colour loses nothing.
          </p>
          <p>
            There are exactly as many textures as there are safe colour slots. A seventh would
            imply a seventh series is fine; past six the answer is this component.
          </p>
        </section>
      }
    />
  );
}
