import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
  type PropDef,
} from "@/components/design-system/docs-kit";
import { KpiRow } from "@mosje/design-system";

export const metadata: Metadata = {
  title: "KPI Row — Design System",
  description:
    "A responsive row of MetricCard tiles carrying the headline figures at the top of a dashboard — funds released, beneficiaries, applications pending.",
};

/*
 * Read off `KpiRowProps` in packages/design-system/components/dashboard/kpi-row.tsx.
 * The row is a layout only: every tile is a `MetricCard`, and each entry in `items`
 * is that component's own props, so a tile's API is documented on the Metric Card page.
 */
const PROPS: PropDef[] = [
  {
    name: "items",
    type: "(MetricCardProps & { key?: React.Key })[]",
    required: true,
    description:
      "The tiles. Each entry is forwarded to MetricCard unchanged — label and value are required, icon, changeValue, changeDirection and changeLabel are optional. Pass `key` only where two tiles share a label.",
  },
  {
    name: "span",
    type: "number",
    default: "undefined",
    description:
      "Column span (1–12) when the row sits inside a DashboardGrid, applied at 768px and above. Below that every grid child is full width, so the value is ignored.",
  },
  {
    name: "className",
    type: "string",
    default: "undefined",
    description: "Merged onto the row, not onto the tiles.",
  },
];

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "Each tile is a MetricCard with its label above its value, so the pairing is structural rather than positional. The row itself adds no landmark — it is a grid track, and announcing it would put a container between the reader and the figures.",
  },
  {
    criterion: "1.4.1 Use of Colour",
    level: "A",
    description:
      "A tile's change indicator carries an arrow and screen-reader text (\"Increase\", \"Decrease\", \"No change\") beside the tinted pill, so direction is never conveyed by colour alone.",
  },
  {
    criterion: "1.4.10 Reflow",
    level: "AA",
    description:
      "The row is `repeat(auto-fit, minmax(180px, 1fr))`, so tiles wrap rather than scroll horizontally at 320px.",
  },
  {
    criterion: "1.4.4 Resize Text",
    level: "AA",
    description:
      "Tile type is authored in rem off the --sa-type-* scale, so it follows the reader's font-size choice from the Accessibility Bar.",
  },
];

export default function KpiRowPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="KPI Row"
      status="Beta"
      summary="A responsive row of MetricCard tiles, for the headline figures a dashboard opens with. It is a layout, not a tile: every figure is drawn by MetricCard, so a change to how a figure looks is made there and appears in every row at once."
      figma={{
        absent:
          "Not yet published in the Figma library. The tile it repeats is published as Metric Card; the row itself is a grid track with no separate master.",
      }}
      specimen={
        <KpiRow
          items={[
            { label: "Funds Released", value: "₹ 1,240 Cr", changeValue: "8%", changeDirection: "up", changeLabel: "vs FY 2024-25" },
            { label: "Beneficiaries", value: "4,21,509", changeValue: "12%", changeDirection: "up", changeLabel: "vs FY 2024-25" },
            { label: "Applications Pending", value: "6,318", changeValue: "3%", changeDirection: "down", changeLabel: "vs last quarter" },
            { label: "States Reporting", value: "28", changeDirection: "flat", changeLabel: "no change" },
          ]}
        />
      }
      props={PROPS}
      a11y={A11Y}
      whenToUse={{
        use: [
          "A dashboard opens with three to five figures a reader is expected to take in at a glance.",
          "The figures are of the same kind and the same reporting period, so they can be read across the row.",
          "Each figure is a single number, formatted before it is passed in.",
        ],
        avoid: [
          "There is one figure — use Metric Card on its own; a row of one is a card with extra markup.",
          "The figures need a chart to be understood — use Chart Card, which carries the title, the states and the export control a chart needs.",
          "There are more than about five figures — the row wraps and stops being a row a reader can scan; put the rest in a Data Table.",
        ],
      }}
      related={[
        {
          label: "Metric Card",
          href: "/design-system/components/data-display/metric-card",
          reason: "the tile this row repeats, and where a tile's own API is documented",
        },
        {
          label: "Chart Card",
          href: "/design-system/components/dashboard/chart-card",
          reason: "when the figure needs a chart, a title and its own empty state",
        },
        {
          label: "Dashboard Grid",
          href: "/design-system/components/dashboard/dashboard-grid",
          reason: "the 12-column grid the row's span prop is measured against",
        },
      ]}
      design={
        <section className="cdp__section" aria-labelledby="cdp-composition">
          <h2 id="cdp-composition" className="cdp__h2">
            Composition
          </h2>
          <p>
            The row wraps on its own at <code>180px</code> per tile, so the number of tiles is a
            content decision rather than a layout one. Keep the figures to a single reporting
            period and say which period in the section heading above the row, not on each tile —
            repeating &ldquo;FY 2025-26&rdquo; four times spends the tile&rsquo;s smallest line on
            something the reader already knows.
          </p>
          <p>
            Values are passed pre-formatted. The row does no rounding, no grouping and no currency
            handling, because the correct Indian grouping for a figure (<code>4,21,509</code>, not{" "}
            <code>421,509</code>) depends on what the figure is, and a layout cannot know that.
          </p>
        </section>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { KpiRow } from "@mosje/design-system";

<KpiRow
  items={[
    { label: "Funds Released", value: "₹ 1,240 Cr", changeValue: "8%", changeDirection: "up", changeLabel: "vs FY 2024-25" },
    { label: "Beneficiaries", value: "4,21,509" },
  ]}
/>`}</CodeBlock>
          <p>
            Inside a <code>DashboardGrid</code>, give the row a span so it shares a line with
            another card. The span applies at 768px and above; below it, every grid child is full
            width.
          </p>
          <CodeBlock>{`<DashboardGrid>
  <KpiRow span={8} items={kpis} />
  <ChartCard span={4} title="Releases by Quarter">…</ChartCard>
</DashboardGrid>`}</CodeBlock>
        </section>
      }
    />
  );
}
