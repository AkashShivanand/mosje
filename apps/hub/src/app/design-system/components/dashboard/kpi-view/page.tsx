import type { Metadata } from "next";
import * as React from "react";

import {
  Callout,
  CodeBlock,
  ComponentDocPage,
  MatrixTable,
  PropsTable,
  type A11yItem,
  type PropDef,
} from "@/components/design-system/docs-kit";
import { KpiPlayground } from "./kpi-playground";

export const metadata: Metadata = {
  title: "KPI View — Design System",
  description:
    "One KPI, drawn by the shape of its reading: a breakdown as a ring or ranked bars, a series as a line or bars, stages as a funnel, a State/UT reading as a map beside its ranked list, a table as a table — each in a Chart Card carrying its source.",
};

const SPEC_SHAPE: PropDef[] = [
  { name: "id", type: "string", required: true, description: "Stable id — also the export file name." },
  { name: "name", type: "string", required: true, description: "Title Case; the card's title." },
  { name: "unit", type: "\"number\" | \"crore\" | \"percent\" | \"days\"", required: true, description: "The unit the number is read in. Decides the formatter, and whether a State/UT reading is mapped (a percentage is not)." },
  { name: "definition", type: "string", required: false, description: "What it measures; the card's subtitle." },
  { name: "span", type: "3 | 4 | 6 | 8 | 12", required: false, default: "6", description: "Grid width on a 12-column dashboard." },
  { name: "totalled", type: "boolean", required: false, description: "Its breakdown's parts add up to a meaningful whole, so a total leads it when `quiet`." },
];

const READING_SHAPE: PropDef[] = [
  { name: "value", type: "KpiValue", required: true, description: "The reading itself, in one of seven shapes — see the table below." },
  { name: "origin", type: "\"live\" | \"received\" | \"snapshot\" | \"modelled\"", required: true, description: "Where the value came from. `live`: the portal's own feed. `received`: supplied by the Department by hand, entered as received. `snapshot`: published by a Department system, mirrored on a stated date. `modelled`: illustrative, never a departmental figure." },
  { name: "source", type: "string", required: false, description: "Who published it." },
  { name: "asOn", type: "string", required: false, description: "DD.MM.YYYY." },
];

const A11Y: A11yItem[] = [
  {
    criterion: "1.1.1 Non-text Content",
    level: "A",
    description:
      "Every chart carries its figures as a table. In the analyst chrome the reader switches between Chart and Table; in the public, quiet chrome the table is kept for screen readers only.",
    status: "verified",
    evidence:
      "kpi-view.tsx passes `tableView = quiet ? \"sr-only\" : undefined` to DonutChart, LineChart, BarChart, IndiaMap and IndiaTileMap; chart-frame.tsx renders the sr-only table inside `.ds-sr-only`.",
  },
  {
    criterion: "1.4.1 Use of Colour",
    level: "A",
    description:
      "A table's compliance column is written in words with an icon — \"Meets, +0.8 pp\" or \"Short by 0.7 pp\" — so meeting a minimum is never told by colour or by sign alone.",
    status: "verified",
    evidence:
      "kpi-view.tsx renders the `againstMinimum` column as an Icon (check_circle / error) beside the text \"Meets, +n unit\" or \"Short by n unit\".",
  },
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "A table reading is a real data table, captioned with the KPI's name, so its header cells are announced with each value.",
    status: "verified",
    evidence: "kpi-view.tsx renders the `table` kind as DataTable with `caption={kpi.name}`.",
  },
  {
    criterion: "2.4.6 Headings and Labels",
    level: "AA",
    description:
      "Each card is titled by the KPI's name and subtitled by its definition, at a heading level the page sets, so a dashboard of many cards can be read by heading.",
    status: "verified",
    evidence: "kpi-view.tsx passes `title={kpi.name}`, `subtitle={kpi.definition}` and `headingLevel` (default 3) to ChartCard.",
  },
];

export default function KpiViewPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="KPI View"
      status="Beta"
      summary="One KPI, drawn by the shape of its reading, never by its name. Hand it a reading and it draws the chart that fits, in a Chart Card carrying its source and the date it is as on; a new portal's KPIs render the day they are in its register."
      figma={{ node: "kpiView" }}
      specimen={<KpiPlayground />}
      propsFrom="KpiViewProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A dashboard draws KPIs from a register, and each KPI's reading arrives in one of the shapes below.",
          "Every portal's dashboard should draw the same shape of reading the same way.",
          "The card must carry its source and date, and an origin mark where the figure is not the Department's.",
        ],
        avoid: [
          "The reading is a single figure or a pair — `isKpiTile` says so; draw it in a KPI Row above the charts, where the reader meets it first.",
          "The chart needs a form the shapes do not cover, or an annotation of its own — draw it directly in a Chart Card.",
          "The figures are not a KPI reading at all — a list of documents, a timeline — use the component for that content.",
          "Several States/UTs' figures should be compared across measures — use Area Breakdown, which switches measures on one map.",
        ],
      }}
      related={[
        { label: "Chart Card", href: "/design-system/components/dashboard/chart-card", reason: "the card every view is drawn in, with its states and provenance" },
        { label: "KPI Row", href: "/design-system/components/dashboard/kpi-row", reason: "where a tile reading is drawn instead" },
        { label: "Area Breakdown", href: "/design-system/components/dashboard/area-breakdown", reason: "State/UT figures with a switch between measures" },
        { label: "Dashboard Grid", href: "/design-system/components/dashboard/dashboard-grid", reason: "the 12-column grid a view's span is measured against" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-by-shape">
            <h2 id="cdp-by-shape" className="cdp__h2">
              Drawn by the Shape of the Reading
            </h2>
            <p>
              The chart is chosen by what the reading is, not by which KPI it belongs to. A portal
              that publishes a new KPI does not need a new chart drawn by hand; its reading&rsquo;s
              shape decides.
            </p>
            <MatrixTable
              caption="What each kind of reading is drawn as"
              columns={["kind", "Drawn as", "In the quiet chrome"]}
              rows={[
                ["figure, pair", "Nothing — a tile for KPI Row", "The same"],
                ["breakdown", "A ring (donut) or ranked bars (bar)", "A two-part ring becomes two bars against their whole; ranked bars run largest first; status labels take status colours; a totalled breakdown leads with its total"],
                ["series", "A line or bars; crore bars run horizontal, values printed", "Several series avoid red"],
                ["stages", "A funnel", "The same"],
                ["areas", "The map beside its ranked list, for States/UTs; a ranked list otherwise", "The map's scale is quantile; counts in lakh and crore"],
                ["table", "A data table", "A compliance column in words, and how many meet it, above the rows"],
              ]}
            />
          </section>
          <section className="cdp__section" aria-labelledby="cdp-quiet">
            <h2 id="cdp-quiet" className="cdp__h2">
              Two Chromes: the Public&rsquo;s and the Analyst&rsquo;s
            </h2>
            <p>
              <code>quiet</code> is the public dashboard&rsquo;s chrome: an outlined card, no Chart /
              Table switch, no download, and red never used as a category, because on this estate red
              means a rejected application. Off, the card is the analyst&rsquo;s, with the switch,
              the download and the categorical order.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-provenance">
            <h2 id="cdp-provenance" className="cdp__h2">
              Provenance on Every Card
            </h2>
            <p>
              A live, received or snapshot reading with a <code>source</code> and an{" "}
              <code>asOn</code> date names both on its card; a modelled reading names neither. Any
              other mark about origin — an Illustrative chip — comes from <code>renderOrigin</code>,
              called for every origin but a snapshot, because whether marks are shown is a page
              setting.
            </p>
            <Callout type="warning" title="A missing figure is not a zero">
              A series point with no figure yet is listed in <code>pending</code> and drawn as not
              reported. Never pass 0 for a figure that has not been published.
            </Callout>
          </section>
        </>
      }
      code={
        <>
          <section className="cdp__section" aria-labelledby="cdp-spec-shape">
            <h2 id="cdp-spec-shape" className="cdp__h2">
              KpiSpec
            </h2>
            <PropsTable props={SPEC_SHAPE} />
          </section>
          <section className="cdp__section" aria-labelledby="cdp-reading-shape">
            <h2 id="cdp-reading-shape" className="cdp__h2">
              KpiReading
            </h2>
            <PropsTable props={READING_SHAPE} />
            <CodeBlock>{`type KpiValue =
  | { kind: "figure"; value: number }
  | { kind: "pair"; items: [Labelled & { unit: KpiUnit }, Labelled & { unit: KpiUnit }] }
  | { kind: "breakdown"; items: Labelled[]; chart: "donut" | "bar"; unit?: KpiUnit }
  | { kind: "series"; labels: string[]; chart: "line" | "bar"; note?: string;
      series: { name: string; data: number[]; pending?: number[] }[] }
  | { kind: "stages"; stages: Labelled[] }
  | { kind: "areas"; total: number; rows: AreaRow[] }
  | { kind: "table"; columns: string[]; rows: (string | number)[][];
      againstMinimum?: { column: number; header: string; unit: string } };`}</CodeBlock>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-format">
            <h2 id="cdp-format" className="cdp__h2">
              Formatters
            </h2>
            <MatrixTable
              caption="Figures as the Department prints them, exported with KPI View"
              columns={["Function", "Gives"]}
              rows={[
                ["formatKpi(value, unit)", "Indian grouping; ₹ … Cr; one-decimal percentages; days"],
                ["kpiFormatter(unit)", "formatKpi bound to a unit, for a chart's valueFormat"],
                ["compactCount(n)", "\"11.87 Cr\", \"4.88 lakh\", \"80,629\""],
                ["shownDate(\"05.10.2026\")", "\"05 Oct 2026\""],
                ["isoDate(\"05.10.2026\")", "\"2026-10-05\", for a provenance date"],
              ]}
            />
          </section>
          <section className="cdp__section" aria-labelledby="cdp-example">
            <h2 id="cdp-example" className="cdp__h2">
              Example
            </h2>
            <CodeBlock>{`import { DashboardGrid, KpiRow, KpiView, formatKpi, isKpiTile } from "@mosje/design-system";

const tiles = kpis.filter((k) => isKpiTile(readings[k.id]));
const charts = kpis.filter((k) => !isKpiTile(readings[k.id]));

<DashboardGrid>
  <KpiRow span={12} items={tiles.map((k) => ({ label: k.name, value: formatKpi(figureOf(readings[k.id]), k.unit) }))} />
  {charts.map((k) => (
    <KpiView key={k.id} kpi={k} reading={readings[k.id]} areasAreStates quiet
      card={{ loading, state: failed ? "error" : undefined, onRetry }}
      renderOrigin={(origin) => <OriginChip origin={origin} />} />
  ))}
</DashboardGrid>`}</CodeBlock>
            <p>
              KPI View is a client component. Pass <code>areasAreStates</code> only where the rows
              are States/UTs spelled as India Map spells them; district rows are drawn as a ranked
              list.
            </p>
          </section>
        </>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-inherited">
          <h2 id="cdp-inherited" className="cdp__h2">
            Inherited, Not Claimed Here
          </h2>
          <p>
            Loading, error and empty states, the retry, and the announcement that a card is loading
            are Chart Card&rsquo;s, and are documented on its page. Series and slice colours are the
            chart palette&rsquo;s; their contrast is not measured by this component.
          </p>
        </section>
      }
    />
  );
}
