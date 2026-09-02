import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  PropsTable,
  type A11yItem,
} from "@/components/design-system/docs-kit";

import { FilterBarSpecimen } from "./filter-bar-specimen";

export const metadata: Metadata = {
  title: "Filter Bar — Design System",
  description:
    "The row of controls that sits above a dashboard and decides what the cards below it show. Layout only — every control inside it keeps its own state.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "SegmentedControl renders `role=\"radiogroup\"` with `role=\"radio\"` children carrying `aria-checked`, so the options are announced as one mutually exclusive set rather than as loose buttons.",
  },
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    description:
      "The group takes its name from the required `ariaLabel`; each option is a real `<button>` with its label as its accessible name and its selection as `aria-checked`.",
  },
  {
    criterion: "2.4.3 Focus Order",
    level: "A",
    description: "Controls are focused in the order they are written, which is the order they are read.",
  },
  {
    criterion: "2.4.7 Focus Visible",
    level: "AA",
    description: "Each segment draws a focus ring on `:focus-visible`; the stylesheet never removes the outline.",
  },
  {
    criterion: "1.4.10 Reflow",
    level: "AA",
    description: "The bar wraps its controls onto further lines at 320px rather than scrolling horizontally.",
  },
  {
    criterion: "2.3.3 Animation from Interactions",
    level: "AAA",
    description: "The segment transition is dropped under `prefers-reduced-motion`.",
  },
];

export default function FilterBarPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Filter Bar"
      status="Beta"
      summary="The row of controls that sits above a dashboard and decides what the cards below it show. It is layout only: it holds no state, applies no filtering, and every control inside it works exactly as it would on its own."
      figma={{
        absent: "Not yet published in the Figma library. The controls it hosts — Select, Search — are published individually.",
      }}
      specimen={<FilterBarSpecimen />}
      propsFrom="FilterBarProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A dashboard's cards are all driven by the same two or three choices — a period, a state, a category.",
          "The choices need to stay visible while the reader looks at the results, so they can see what the figures are filtered to.",
          "A reader is expected to change a choice and watch the same cards update, rather than move to a different page.",
        ],
        avoid: [
          "The controls are part of a form the reader submits — use Form Section, which carries labels, help text and validation.",
          "There is one control — place it in the section heading's actions slot; a bar around a single Select is chrome.",
          "The filtering has more than about four inputs — put them in a Side Sheet and leave a summary of the active filters in the bar.",
        ],
      }}
      related={[
        { label: "Select", href: "/design-system/components/forms/select", reason: "the control the bar most often holds; use appearance=\"filter\"" },
        { label: "Search", href: "/design-system/components/forms/search", reason: "for filtering by a typed term rather than a fixed choice" },
        { label: "Chart Card", href: "/design-system/components/dashboard/chart-card", reason: "the cards the bar drives, and where a filtered-to-nothing result is drawn" },
        { label: "Dashboard Grid", href: "/design-system/components/dashboard/dashboard-grid", reason: "the grid the bar sits above" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-active">
            <h2 id="cdp-active" className="cdp__h2">
              Active Filters Stay Visible
            </h2>
            <p>
              A filter the reader cannot see is a figure they cannot explain. Keep the selected
              values on the bar rather than behind a collapsed menu, and where a menu is
              unavoidable, put the count of active filters on the control that opens it.
            </p>
            <p>
              Where more than two filters are offered, give the bar a way back to the unfiltered
              view. A reader who has narrowed a dashboard to nothing needs a single control that
              undoes it &mdash; and Chart Card&rsquo;s <code>no-results</code> state names that
              control rather than reporting that there is no data.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-segmented">
            <h2 id="cdp-segmented" className="cdp__h2">
              Segmented Control
            </h2>
            <p>
              Exported from the same file, and the control this bar is most often given. It is a
              single-select over two to four short options &mdash; a period, a unit, a view. It
              renders an ARIA radiogroup rather than a row of toggle buttons, because the choices
              are mutually exclusive and a screen-reader user is owed that fact before they press
              anything.
            </p>
            <p>Beyond about four options, or where the labels are long, use a Select instead.</p>
          </section>
        </>
      }
      code={
        <>
          <section className="cdp__section" aria-labelledby="cdp-segmented-props">
            <h2 id="cdp-segmented-props" className="cdp__h2">
              SegmentedControl Props
            </h2>
            <PropsTable from="SegmentedControlProps" />
          </section>
          <section className="cdp__section" aria-labelledby="cdp-example">
            <h2 id="cdp-example" className="cdp__h2">
              Example
            </h2>
            <CodeBlock>{`import { FilterBar, SegmentedControl, Select } from "@mosje/design-system";

const [period, setPeriod] = React.useState<"fy" | "quarter">("fy");

<FilterBar title="Scheme Coverage">
  <Select appearance="filter" aria-label="State" value={state} onChange={onState} options={states} />
  <SegmentedControl
    ariaLabel="Period"
    value={period}
    onChange={setPeriod}
    options={[
      { value: "fy", label: "Financial Year" },
      { value: "quarter", label: "Quarter" },
    ]}
  />
</FilterBar>`}</CodeBlock>
            <p>
              <code>SegmentedControl</code> is generic over its value type, so the union passed as{" "}
              <code>options</code> is the union <code>onChange</code> hands back &mdash; a typo in a
              value is a compile error rather than a filter that silently matches nothing.
            </p>
          </section>
        </>
      }
    />
  );
}
