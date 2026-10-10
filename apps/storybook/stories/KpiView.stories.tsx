import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge, DashboardGrid, KpiView, isKpiTile, type KpiReading, type KpiSpec } from "@mosje/design-system";

/**
 * **KpiView** — one KPI, drawn by the **shape of its reading**, never by its name. A
 * breakdown is a ring or a ranked list, a series a line or bars, stages a funnel, a
 * State/UT reading a map beside its ranked list, a table a table — each in a `ChartCard`
 * carrying its source and the date it is as on. A new portal's KPIs render the day they are
 * in its register; nothing is drawn by hand.
 *
 * `kpi` (`KpiSpec`) says what the figure is — name, unit, definition, `span`; `reading`
 * (`KpiReading`) says what it is now — the value, its `origin`, `source` and `asOn`. A
 * figure, a pair, and an area reading with no areas are **tiles**, not charts: `isKpiTile`
 * says which, and a dashboard draws its tiles as a `KpiRow` above its charts. `KpiView`
 * draws nothing for a tile.
 *
 * **`quiet`** is the public dashboard's chart chrome: an outlined card at rest, no Chart /
 * Table switch, no download control, a two-part ring drawn as two bars against their whole,
 * breakdowns largest first, status breakdowns in status colours, red never used as a
 * category. Off, the card is the analyst's.
 *
 * Other props: `areasAreStates` (an area reading's rows are States/UTs, so they can be
 * mapped), `stateMap` (`choropleth` or equal `tiles`), `donutLayout` (`auto` sets the legend
 * beside a wide ring), `headline` (a section's one figure, at the head of the chart),
 * `badge` (a page's own mark, e.g. "Officers Only"), `renderOrigin` (the mark for a
 * non-snapshot origin — an "Illustrative" chip), `span`, `headingLevel`. `card` carries the
 * loading, error or empty state and its retry. Storybook shows each reading kind below.
 *
 * Lifecycle: **Beta**.
 */
const SOURCE = "Nasha Mukt Bharat Abhiyaan MIS";
const AS_ON = "30.09.2026";

const SPEC: KpiSpec = {
  id: "kpi",
  name: "Persons Engaged in Begging, by Outcome",
  unit: "number",
  definition: "Persons identified under SMILE – Beggary, by where they stand in the rehabilitation process.",
  span: 6,
};

const reading = (value: KpiReading["value"], origin: KpiReading["origin"] = "snapshot"): KpiReading => ({
  value,
  origin,
  source: "SMILE – Beggary MIS",
  asOn: AS_ON,
});

const DONUT = reading({
  kind: "breakdown",
  chart: "donut",
  items: [
    { label: "Rehabilitated", value: 9264 },
    { label: "In Shelter Homes", value: 4210 },
    { label: "Reunited with Family", value: 3860 },
    { label: "Referred for Skilling", value: 2476 },
  ],
});

const meta = {
  title: "Components/Dashboard/KpiView",
  component: KpiView,
  parameters: { layout: "padded" },
  args: {
    kpi: SPEC,
    reading: DONUT,
    areasAreStates: false,
    headingLevel: 3,
    quiet: false,
    donutLayout: "stacked",
    stateMap: "choropleth",
  },
  argTypes: {
    quiet: { control: "boolean" },
    headingLevel: { control: "inline-radio", options: [3, 4] },
    donutLayout: { control: "inline-radio", options: ["stacked", "auto"] },
    stateMap: { control: "inline-radio", options: ["choropleth", "tiles"] },
    areasAreStates: { control: "boolean" },
    span: { control: "select", options: [undefined, 3, 4, 6, 8, 12] },
    kpi: { control: false },
    reading: { control: false },
    card: { control: false },
    badge: { control: false },
    headline: { control: false },
    renderOrigin: { control: false },
  },
  decorators: [
    (Story) => (
      <DashboardGrid>
        <Story />
      </DashboardGrid>
    ),
  ],
} satisfies Meta<typeof KpiView>;
export default meta;
type Story = StoryObj<typeof meta>;

/** A breakdown as a ring, in the analyst's chrome: the Chart / Table switch and the download. */
export const BreakdownDonut: Story = {};

/** The same reading in the public dashboard's `quiet` chrome. */
export const BreakdownDonutQuiet: Story = {
  args: { quiet: true, donutLayout: "auto" },
};

/** A two-part ring under `quiet` is a split, so it is drawn as two bars against their whole. */
export const BreakdownSplitQuiet: Story = {
  args: {
    quiet: true,
    kpi: { id: "split", name: "Beneficiaries by Gender", unit: "number", definition: "Persons covered by outreach events.", span: 6 },
    reading: reading({ kind: "breakdown", chart: "donut", items: [{ label: "Women", value: 1_48_20_000 }, { label: "Men", value: 1_99_80_000 }] }),
  },
};

/** A breakdown as ranked bars. Quiet sorts largest first; a status breakdown takes status colours. */
export const BreakdownBar: Story = {
  args: {
    quiet: true,
    kpi: { id: "status", name: "Shelter Homes by Status", unit: "number", definition: "Shelter homes sanctioned under SMILE – Beggary.", span: 6 },
    reading: reading({
      kind: "breakdown",
      chart: "bar",
      items: [
        { label: "In Progress", value: 38 },
        { label: "Completed", value: 92 },
        { label: "Discontinued", value: 7 },
      ],
    }),
  },
};

/** A series as a line. Years with no figure yet are drawn as not reported, never as zero. */
export const SeriesLine: Story = {
  args: {
    kpi: { id: "calls", name: "Helpline Calls Received", unit: "number", definition: "Calls received on the toll-free helpline each year.", span: 6 },
    reading: reading({
      kind: "series",
      chart: "line",
      labels: ["2022-23", "2023-24", "2024-25", "2025-26", "2026-27"],
      series: [{ name: "Calls", data: [1_42_000, 2_28_000, 2_96_000, 3_47_000, 0], pending: [4] }],
      note: "2026-27: calls received to 30 September.",
    }),
  },
};

/** A series as bars. A crore series draws horizontal bars with each value printed whole. */
export const SeriesBar: Story = {
  args: {
    quiet: true,
    kpi: { id: "funds", name: "Funds Released", unit: "crore", definition: "Grants released to States/UTs under NMBA.", span: 6 },
    reading: reading({
      kind: "series",
      chart: "bar",
      labels: ["2023-24", "2024-25", "2025-26", "2026-27"],
      series: [
        { name: "Budget Estimate", data: [240, 280, 300, 318] },
        { name: "Released", data: [182, 214, 236, 250] },
      ],
    }),
  },
};

/** Stages as a funnel — each stage the share of the one before. */
export const Stages: Story = {
  args: {
    kpi: { id: "journey", name: "From Identification to Rehabilitation", unit: "number", definition: "Persons at each stage of the SMILE – Beggary process.", span: 6 },
    reading: reading({
      kind: "stages",
      stages: [
        { label: "Identified", value: 19_810 },
        { label: "Profiled", value: 15_340 },
        { label: "Sheltered", value: 9_870 },
        { label: "Rehabilitated", value: 9_264 },
      ],
    }),
  },
};

const STATE_ROWS = [
  { area: "Uttar Pradesh", value: 3120 },
  { area: "Maharashtra", value: 2480 },
  { area: "Bihar", value: 1960 },
  { area: "Madhya Pradesh", value: 1740 },
  { area: "Rajasthan", value: 1530 },
  { area: "Tamil Nadu", value: 1210 },
  { area: "Karnataka", value: 1090 },
  { area: "Kerala", value: 860 },
  { area: "Odisha", value: 790 },
  { area: "Punjab", value: 520 },
];

/** Areas that are States/UTs: the India map beside its ranked list. */
export const AreasAsStates: Story = {
  args: {
    quiet: true,
    areasAreStates: true,
    span: 12,
    kpi: { id: "states", name: "Persons Identified, by State/UT", unit: "number", definition: "Persons engaged in begging identified in each State/UT.", span: 12 },
    reading: reading({ kind: "areas", total: 15_310, rows: STATE_ROWS }),
  },
};

/** `stateMap="tiles"` draws every State/UT as an equal tile, so a small one is not lost. */
export const AreasAsTiles: Story = {
  args: { ...AreasAsStates.args, stateMap: "tiles" },
};

/** Areas that are not States/UTs (districts) draw as a ranked list alone. */
export const AreasAsDistricts: Story = {
  args: {
    quiet: true,
    areasAreStates: false,
    kpi: { id: "districts", name: "Persons Identified, by District", unit: "number", definition: "Districts of Maharashtra with the most persons identified.", span: 6 },
    reading: reading({
      kind: "areas",
      total: 2480,
      rows: [
        { area: "Pune", value: 612 },
        { area: "Mumbai", value: 540 },
        { area: "Nagpur", value: 388 },
        { area: "Nashik", value: 301 },
        { area: "Thane", value: 244 },
      ],
    }),
  },
};

/** A table. `againstMinimum` marks a signed-difference column in words and an icon, not colour alone. */
export const TableAgainstMinimum: Story = {
  args: {
    quiet: true,
    span: 12,
    kpi: { id: "mandate", name: "Share of Funds Released, Against the Mandated Minimum", unit: "percent", definition: "Share of each scheme's allocation released to Scheduled Castes, against the mandated 16.2 per cent.", span: 12 },
    reading: reading({
      kind: "table",
      columns: ["Scheme", "Share Released (%)", "Mandated Minimum (%)", "Difference"],
      rows: [
        ["Post Matric Scholarship for Scheduled Castes", 17.1, 16.2, 0.9],
        ["SHREYAS", 16.8, 16.2, 0.6],
        ["PM-AJAY", 15.5, 16.2, -0.7],
        ["SMILE", 14.9, 16.2, -1.3],
      ],
      againstMinimum: { column: 3, header: "Against Mandate", unit: "pp" },
    }),
  },
};

/** `quiet` against the analyst's chrome, side by side. */
export const QuietAndAnalyst: Story = {
  render: (args) => (
    <>
      <KpiView {...args} quiet={false} span={6} />
      <KpiView {...args} quiet span={6} />
    </>
  ),
};

/** `headline` sets a section's one figure at the head of the chart; `badge` and `renderOrigin` add the page's own marks. */
export const HeadlineAndMarks: Story = {
  args: {
    quiet: true,
    headline: { value: "19,810", label: "Persons Identified", detail: "Since the scheme began." },
    badge: <Badge status="warning">Officers Only</Badge>,
    renderOrigin: (origin) => <Badge status="info">{origin === "modelled" ? "Illustrative" : "Received"}</Badge>,
    reading: { ...DONUT, origin: "modelled" },
  },
};

/** `card={{ loading: true }}` draws a skeleton in the shape of the chart. */
export const Loading: Story = {
  args: { quiet: true, card: { loading: true } },
};

/** `card.state` with `onRetry` is the failed-feed state: one sentence and a retry. */
export const ErrorState: Story = {
  args: { quiet: true, card: { state: "error", onRetry: () => undefined } },
};

/** `isKpiTile` says whether a reading is a tile for a `KpiRow` (true) or a chart for `KpiView` (false). */
export const TilesAreNotDrawn: Story = {
  render: (args) => {
    const figure = reading({ kind: "figure", value: 19_810 });
    return (
      <p style={{ margin: 0 }}>
        A single figure is a tile: <code>isKpiTile</code> returns {String(isKpiTile(figure))}. A ring is a chart: it returns{" "}
        {String(isKpiTile(args.reading))}.
      </p>
    );
  },
};
