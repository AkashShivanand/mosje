import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
  type PropDef,
} from "@/components/design-system/docs-kit";

import { LegendSpecimen } from "./specimen";

export const metadata: Metadata = {
  title: "Legend — Design System",
  description:
    "The key beside a chart. Decorative by default; passing onToggle turns every entry into a switch for its own series.",
};

/*
 * `LegendItem` is the shape the `items` prop is built from, and it carries the
 * decisions this component is actually about — the swatch forms and the `on`
 * flag. The extractor reads interfaces, not the members of the types they
 * reference, so it is documented by hand.
 */
const ITEM: PropDef[] = [
  {
    name: "LegendItem.label",
    type: "string",
    required: true,
    description: "The series name, as it reads in the chart's own table.",
  },
  {
    name: "LegendItem.color",
    type: "string",
    required: true,
    description: "The key's colour, as a token. Ignored when `swatch` is ramp or dots.",
  },
  {
    name: "LegendItem.id",
    type: "string",
    default: "label",
    description: "Stable identity passed back by onToggle. Set it explicitly as soon as two series can share a label.",
  },
  {
    name: "LegendItem.value",
    type: "string",
    description: "A trailing figure beside the label — a count or a share — where the key can carry the reading as well as name it.",
  },
  {
    name: "LegendItem.swatch",
    type: '"solid" | "ramp" | "dots"',
    default: '"solid"',
    description:
      "solid is one square, for a categorical series. ramp is a gradient strip for a sequential scale — give it `scale` so a shade can be valued. dots is a row of circles for a series that is itself a group of marks.",
  },
  {
    name: "LegendItem.colors",
    type: "string[]",
    description: "The stops for a ramp, or the marks for dots.",
  },
  {
    name: "LegendItem.scale",
    type: "[string, string]",
    description: 'The two ends of a ramp, e.g. ["1", "387"]. Without it a gradient tells the reader an order and withholds the values.',
  },
  {
    name: "LegendItem.on",
    type: "boolean",
    default: "true",
    description:
      "Whether this series is currently drawn. Only meaningful with onToggle. An entry that is off says so three ways — the pill empties and its border goes dashed, a solid key goes hollow, and it reports aria-pressed=\"false\".",
  },
];

const A11Y: A11yItem[] = [
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    status: "verified",
    description:
      'An interactive legend gives each entry role="button" and aria-pressed, and names the whole list through `label`. A decorative legend carries aria-hidden instead, because the values it names are already published in the chart\'s screen-reader table.',
    evidence: "legend.tsx lines 101–102 and 169–171.",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    status: "verified",
    description:
      "An interactive entry is focusable and responds to both Enter and Space. An element given a button's role owes the reader both keys and gets neither for free, so both are handled explicitly.",
    evidence: "legend.tsx lines 170–176: tabIndex plus an onKeyDown handling Enter, Space and Spacebar.",
  },
  {
    criterion: "1.4.1 Use of Color",
    level: "A",
    status: "verified",
    description:
      "A series that is switched off is marked three ways — an emptied pill with a dashed border, a hollow swatch, and aria-pressed=\"false\" — so the state never rests on colour alone.",
    evidence: "The `is-off` class and aria-pressed in legend.tsx, documented at LegendItem.on.",
  },
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    status: "partial",
    description:
      "A decorative legend is hidden from assistive technology on the assumption that the chart beside it publishes a screen-reader table. That holds for every chart in this catalogue, but a legend placed beside something else would hide its own labels with nothing standing in for them.",
  },
];

export default function LegendPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Legend"
      status="Beta"
      summary="The key beside a chart. Passing onToggle changes what it is: from a list naming the series to a set of controls that decide which series are drawn."
      figma={{ node: "chartsLegend" }}
      specimen={<LegendSpecimen />}
      propsFrom="LegendProps"
      props={ITEM}
      a11y={A11Y}
      whenToUse={{
        use: [
          "A chart draws more than one series and the colours need naming.",
          "A sequential or diverging ramp needs its ends valued — use swatch \"ramp\" with a scale, or the shading means nothing.",
          "The reader should be able to remove a series from the chart; pass onToggle and every entry becomes its own switch.",
        ],
        avoid: [
          "There is one series. A legend naming one thing is a caption, and the chart title already is one.",
          "Every mark is labelled on the chart itself — a legend then makes the reader look in two places for one fact.",
          "The entries are filters over the page rather than over one chart's series — use a Filter Bar, which reads as a control and sits where controls belong.",
          "The list is a set of statuses being reported rather than a key to a drawing — use Badges or Chips.",
        ],
      }}
      related={[
        { label: "Chart Frame", href: "/design-system/components/data-display/chart-frame", reason: "the shell that renders the legend below the canvas" },
        { label: "Heatmap", href: "/design-system/components/data-display/heatmap", reason: "the chart that most needs a ramp legend" },
        { label: "Bar Chart", href: "/design-system/components/data-display/bar-chart", reason: "a multi-series chart the legend keys" },
        { label: "Chip", href: "/design-system/components/forms/chip", reason: "the pill language an interactive legend borrows" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-two">
            <h2 id="cdp-two" className="cdp__h2">
              Passing onToggle Changes What It Is
            </h2>
            <p>
              <strong>Without <code>onToggle</code>, a legend is decoration.</strong> The real values
              live in the chart&apos;s screen-reader table, so the list is hidden from assistive
              technology and a screen reader is spared a second, numberless recital of the same labels.
            </p>
            <p>
              <strong>With it, every entry is a control that changes the chart</strong> — and a control
              may never be hidden from assistive technology. So the <code>aria-hidden</code> comes off,
              each entry becomes a button with a pressed state, and it stops looking like text: entries
              become bordered pills in the Chip language, because an affordance a reader cannot see is
              the same as one that is not there, and &ldquo;hover to discover it&rdquo; is not an answer
              on a touchscreen.
            </p>
            <p>
              The capability arrives with the handler rather than through a separate flag — the same
              shape as Chip and Pagination — so a legend cannot be made interactive-looking without
              being made interactive.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-swatch">
            <h2 id="cdp-swatch" className="cdp__h2">
              Three Swatches
            </h2>
            <ul>
              <li>
                <strong>solid</strong> — one square. The default, and correct for a categorical series.
              </li>
              <li>
                <strong>ramp</strong> — a gradient strip for a sequential or diverging scale.{" "}
                <strong>Always give it <code>scale</code>.</strong> A gradient with no ends tells the
                reader there is an order and withholds what any shade is worth.
              </li>
              <li>
                <strong>dots</strong> — a row of circles, for one entry standing for a group of
                sub-categories drawn as separate marks.
              </li>
            </ul>
            <p>
              Entries are listed in the same order as the marks they key. Two lists of the same things
              use the same order; a legend that disagrees with its chart makes the reader do the
              matching.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { Legend } from "@mosje/design-system";

// Decorative — the chart beside it publishes the values.
<Legend
  items={[
    { label: "Approved", color: "var(--sa-color-status-success)" },
    { label: "Pending", color: "var(--sa-color-status-warning)" },
    { label: "Rejected", color: "var(--sa-color-status-danger)" },
  ]}
/>`}</CodeBlock>
          <p>
            Interactive. <code>on</code> is controlled by the caller, because the legend does not own
            what the chart draws — the page does.
          </p>
          <CodeBlock>{`const [hidden, setHidden] = React.useState<string[]>([]);

<Legend
  label="Application status"
  items={series.map((s) => ({ id: s.name, label: s.name, color: s.color, on: !hidden.includes(s.name) }))}
  onToggle={(id) =>
    setHidden((current) =>
      current.includes(id) ? current.filter((x) => x !== id) : [...current, id],
    )
  }
/>`}</CodeBlock>
          <p>A sequential ramp, with its ends valued.</p>
          <CodeBlock>{`<Legend
  items={[
    {
      label: "Beneficiaries per district",
      color: "var(--sa-chart-cat-1)",
      swatch: "ramp",
      colors: ["var(--sa-chart-seq-200)", "var(--sa-chart-seq-500)", "var(--sa-chart-seq-800)"],
      scale: ["1", "387"],
    },
  ]}
/>`}</CodeBlock>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-keys">
          <h2 id="cdp-keys" className="cdp__h2">
            Keyboard
          </h2>
          <ul>
            <li>
              <strong>Tab</strong> — moves to each interactive entry in turn. A decorative legend has no
              tab stops at all.
            </li>
            <li>
              <strong>Enter</strong> and <strong>Space</strong> — toggle the entry. Both are handled
              explicitly: an element given a button&apos;s role owes the reader both keys, and a span
              gets neither for free.
            </li>
          </ul>
          <p>
            Where a legend is interactive, name the list through <code>label</code>. &ldquo;Series&rdquo;
            is the default and it is rarely the best available sentence — &ldquo;Application
            status&rdquo; tells a screen-reader user what the buttons they are about to hear will
            change.
          </p>
        </section>
      }
    />
  );
}
