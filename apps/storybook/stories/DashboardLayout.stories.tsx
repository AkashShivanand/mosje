import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  BarChart,
  Button,
  ChartCard,
  DashboardGrid,
  DonutChart,
  FilterBar,
  Icon,
  KpiRow,
  LineChart,
  Search,
  SegmentedControl,
  Select,
} from "@mosje/design-system";

/**
 * **DashboardGrid · ChartCard · KpiRow · FilterBar · SegmentedControl** — the
 * five pieces every portal dashboard is assembled from, documented together
 * because a dashboard is the composition, not any one of them.
 *
 * The layout is a **12-column grid**: `DashboardGrid` supplies it, and children
 * claim width with `span`. On mobile every child goes full width, so `span` is
 * a desktop hint, not a promise. Spans should add to 12 per row — 4 + 4 + 4, or
 * 8 + 4. They are not enforced; a row summing to 13 wraps, quietly.
 *
 * Each piece has one job:
 *
 * - **`ChartCard`** is the container: title, actions, body, footer, and — the
 *   part worth using — **`loading` and `empty` states built in**. A dashboard
 *   whose tiles collapse to nothing while data arrives is the usual reason the
 *   layout jumps on load. Set `loading`, don't render nothing. Add `exportable`
 *   for a header download control (PNG · SVG · CSV) via `ChartExport`.
 * - **`KpiRow`** lays out `MetricCard` tiles. It reuses `MetricCard` rather
 *   than reimplementing it, so a change to the card reaches every dashboard.
 * - **`FilterBar`** is layout only. It hosts controls; it holds no state and
 *   applies no filtering.
 * - **`SegmentedControl`** is a **single-select** rendered as an ARIA
 *   radiogroup. Use it for two to four mutually exclusive options that are
 *   worth showing all at once — a period toggle. Past four, or where options
 *   are not exclusive, use a `Select` or `Chip` filters instead.
 *
 * Four KPIs is the practical ceiling for a row. Past that they stop being key.
 *
 * Lifecycle: **Stable**.
 *
 * @covers DashboardGrid, ChartCard, KpiRow, FilterBar, SegmentedControl
 */
const KPIS = [
  {
    label: "Beneficiaries verified",
    value: "22,75,906",
    changeValue: "12%",
    changeLabel: "vs last month",
    changeDirection: "up" as const,
    icon: <Icon name="groups" size={20} aria-hidden />,
  },
  {
    label: "Funds released",
    value: "₹1,842.60 cr",
    changeValue: "8%",
    changeLabel: "vs last month",
    changeDirection: "up" as const,
    icon: <Icon name="payments" size={20} aria-hidden />,
  },
  {
    label: "Grievances pending",
    value: "1,284",
    changeValue: "18%",
    changeLabel: "vs last month — fewer is better",
    changeDirection: "down" as const,
    icon: <Icon name="support_agent" size={20} aria-hidden />,
  },
  {
    label: "Districts reporting",
    value: "29 of 36",
    changeValue: "0",
    changeLabel: "unchanged this quarter",
    changeDirection: "flat" as const,
    icon: <Icon name="map" size={20} aria-hidden />,
  },
];

const MONTHS = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"];

const meta = {
  title: "Components/Dashboard/Dashboard layout",
  component: ChartCard,
  args: {
    title: "Applications received by month",
    subtitle: "2026–27, all schemes",
    loading: false,
    empty: false,
    emptyLabel: "No data to display.",
  },
  argTypes: {
    loading: { control: "boolean" },
    empty: { control: "boolean" },
    span: { control: { type: "number", min: 1, max: 12 } },
    title: { control: "text" },
    subtitle: { control: "text" },
    emptyLabel: { control: "text" },
    actions: { control: false },
    footer: { control: false },
    children: { control: false },
  },
} satisfies Meta<typeof ChartCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A single card. `exportable` adds the real download control (PNG · SVG · CSV)
 * to the header — it exports the chart in this card with no wiring. `footer`
 * carries the source line.
 */
export const Card: Story = {
  render: (args) => (
    <div style={{ maxWidth: 640 }}>
      <ChartCard
        {...args}
        exportable
        footer="Source: district submissions as at 04 August 2026."
      >
        <LineChart
          labels={MONTHS}
          series={[{ name: "Applications", data: [12_400, 18_900, 24_600, 31_200, 38_400, 41_100] }]}
          title="Applications received by month"
          yLabel="Applications"
        />
      </ChartCard>
    </div>
  ),
};

/**
 * The original pair, kept because call sites still use them. `loading` holds the
 * tile's height so the grid does not jump; `empty` says so rather than leaving a
 * blank frame.
 *
 * `empty` is now a deprecated alias for `state="empty"`. It was never two states
 * — see `EveryCardState` for the six reasons a card can have nothing to draw,
 * and why each one offers the reader something different.
 */
export const CardStates: Story = {
  render: (args) => (
    <DashboardGrid>
      <ChartCard {...args} span={6} title="Loading" loading />
      <ChartCard
        {...args}
        span={6}
        title="Empty"
        empty
        emptyLabel="No applications from Nashik are pending approval in 2026–27."
      />
    </DashboardGrid>
  ),
};

/** `KpiRow` — four is the practical ceiling. Past that they stop being key. */
export const Kpis: Story = {
  render: () => (
    <DashboardGrid>
      <KpiRow span={12} items={KPIS} />
    </DashboardGrid>
  ),
};

/** `FilterBar` holds controls and no state — the page owns the values. */
export const Filters: Story = {
  render: function Render() {
    const [period, setPeriod] = React.useState<"fy" | "quarter" | "month">("quarter");
    const [query, setQuery] = React.useState("");
    return (
      <FilterBar title="Filters">
        <SegmentedControl
          ariaLabel="Period"
          value={period}
          onChange={setPeriod}
          options={[
            { label: "Financial year", value: "fy" },
            { label: "Quarter", value: "quarter" },
            { label: "Month", value: "month" },
          ]}
        />
        <Select
          aria-label="State or union territory"
          defaultValue="MH"
          options={[
            { label: "All states", value: "all" },
            { label: "Maharashtra", value: "MH" },
            { label: "Karnataka", value: "KA" },
            { label: "Tamil Nadu", value: "TN" },
          ]}
        />
        <Search
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onClear={() => setQuery("")}
          size="sm"
          placeholder="Search districts"
        />
        <Button size="sm" appearance="outlined">
          Reset
        </Button>
      </FilterBar>
    );
  },
};

/** `SegmentedControl` on its own — two to four exclusive options, all visible. */
export const Segments: Story = {
  render: function Render() {
    const [period, setPeriod] = React.useState<"fy" | "quarter" | "month">("quarter");
    const [view, setView] = React.useState<"chart" | "table">("chart");
    return (
      <div style={{ display: "grid", gap: 16, justifyItems: "start" }}>
        <SegmentedControl
          ariaLabel="Period"
          value={period}
          onChange={setPeriod}
          options={[
            { label: "Financial year", value: "fy" },
            { label: "Quarter", value: "quarter" },
            { label: "Month", value: "month" },
          ]}
        />
        <SegmentedControl
          ariaLabel="View"
          value={view}
          onChange={setView}
          options={[
            { label: "Chart", value: "chart" },
            { label: "Table", value: "table" },
          ]}
        />
        <p style={{ margin: 0, color: "var(--sa-color-text-muted)" }}>
          Showing the {period === "fy" ? "financial year" : period} as a {view}.
        </p>
      </div>
    );
  },
};

/** All five together — what a portal dashboard actually looks like. */
export const AWholeDashboard: Story = {
  render: function Render() {
    const [period, setPeriod] = React.useState<"fy" | "quarter" | "month">("quarter");
    const [query, setQuery] = React.useState("");
    return (
      <div style={{ display: "grid", gap: 16 }}>
        <FilterBar title="Nasha Mukt Bharat Abhiyaan · Maharashtra">
          <SegmentedControl
            ariaLabel="Period"
            value={period}
            onChange={setPeriod}
            options={[
              { label: "Financial year", value: "fy" },
              { label: "Quarter", value: "quarter" },
              { label: "Month", value: "month" },
            ]}
          />
          <Select
            aria-label="District"
            defaultValue="all"
            options={[
              { label: "All districts", value: "all" },
              { label: "Pune", value: "pune" },
              { label: "Nashik", value: "nashik" },
              { label: "Nagpur", value: "nagpur" },
            ]}
          />
          <Search
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClear={() => setQuery("")}
            size="sm"
            placeholder="Search blocks"
          />
        </FilterBar>

        <DashboardGrid>
          <KpiRow span={12} items={KPIS} />

          <ChartCard
            span={8}
            title="Applications received by month"
            subtitle="2026–27, all schemes"
            actions={
              <Button size="sm" appearance="text">
                Export
              </Button>
            }
            footer="Source: district submissions as at 04 August 2026."
          >
            <LineChart
              labels={MONTHS}
              series={[
                { name: "Pre-Matric", data: [12_400, 18_900, 24_600, 31_200, 38_400, 41_100] },
                { name: "Post-Matric", data: [8_100, 11_400, 16_800, 22_300, 27_900, 31_600] },
              ]}
              title="Applications received by month"
              yLabel="Applications"
            />
          </ChartCard>

          <ChartCard span={4} title="Beneficiaries by category" subtitle="2026–27">
            <DonutChart
              title="Beneficiaries by category"
              data={[
                { label: "Scheduled Caste", value: 1_284_600 },
                { label: "Other Backward Class", value: 742_310 },
                { label: "De-notified tribes", value: 186_940 },
              ]}
              centerSub="beneficiaries"
            />
          </ChartCard>

          <ChartCard span={6} title="Beneficiaries verified by district">
            <BarChart
              orientation="horizontal"
              title="Beneficiaries verified by district"
              data={[
                { label: "Thane", value: 402_310 },
                { label: "Pune", value: 386_240 },
                { label: "Nagpur", value: 298_105 },
                { label: "Nashik", value: 241_880 },
              ]}
            />
          </ChartCard>

          <ChartCard span={6} title="Block submissions" subtitle="Awaiting district scrutiny" loading />
        </DashboardGrid>
      </div>
    );
  },
};

/**
 * **Every reason a card has nothing to draw, and what each one offers the reader.**
 *
 * `state` replaced a pair of booleans because "empty" and "error" were being made
 * to carry six different situations, and the right next action differs in each.
 * Only some of them are the reader's to take: a filter that matched nothing is
 * theirs to widen, a figure the source has not published yet is nobody's to fix.
 * `onRetry` is therefore optional by design — omit it where no action would help,
 * and the card states the reason without offering a button that cannot deliver.
 *
 * `retryLabel` defaults to what the state can actually do, so it is only worth
 * setting when the wording should be more specific than "Try again".
 *
 * `emptyTitle`, `errorTitle` and `errorLabel` override the headline and the line
 * beneath it. The deprecated `error` boolean still maps onto `state="error"` for
 * call sites that predate the six-way `state`; new code should not reach for it.
 */
export const EveryCardState: Story = {
  render: () => (
    <div style={{ padding: "1.5rem" }}>
      <DashboardGrid>
        <ChartCard
          span={4}
          title="Districts reporting"
          state="no-results"
          emptyTitle="No districts match those filters"
          emptyLabel="Nagpur division has no blocks with submissions after 31 March."
          onRetry={() => {}}
          retryLabel="Clear filters"
        />

        <ChartCard
          span={4}
          title="Per-capita disbursement"
          state="not-published"
          emptyTitle="Not published for 2026-27 yet"
          emptyLabel="The source releases this figure after the fourth-quarter audit."
        />

        <ChartCard
          span={4}
          title="Verification throughput"
          error
          errorTitle="Could not load throughput"
          errorLabel="The reporting service did not respond. The rest of this page is unaffected."
          onRetry={() => {}}
        />
      </DashboardGrid>
    </div>
  ),
};

/**
 * **A skeleton must share the silhouette of what is coming.**
 *
 * `skeleton` picks the shape of the loading placeholder. A donut card that
 * shimmers as bars promises the wrong thing and makes the real chart feel like
 * a substitution when it lands, so the shape is set per card rather than being
 * one generic shimmer. `"region"` is the honest choice where there is no chart
 * geometry to promise at all — a map, or a card whose body is prose.
 */
export const SkeletonShapes: Story = {
  render: () => (
    <div style={{ padding: "1.5rem" }}>
      <DashboardGrid>
        <ChartCard span={4} title="Monthly releases" loading skeleton="bars" />
        <ChartCard span={4} title="Disbursement trend" loading skeleton="line" />
        <ChartCard span={4} title="Share by category" loading skeleton="donut" />
        <ChartCard span={6} title="Top districts" loading skeleton="rows" />
        <ChartCard span={6} title="Coverage map" loading skeleton="region" />
      </DashboardGrid>
    </div>
  ),
};

/**
 * **Exporting what the reader is looking at.**
 *
 * `exportable` adds the download control; it exports the chart rendered inside
 * this card with no wiring. `exportName` sets the filename stem and the heading
 * on the download menu — worth setting when the card title is long or contains
 * punctuation that reads badly as a filename.
 *
 * `exportFormats` narrows the offer. Restrict it where a format would mislead:
 * CSV on a card whose body is a map has no sensible rows behind it, so offering
 * it produces a file that looks authoritative and is not.
 */
export const ExportOptions: Story = {
  render: () => (
    <div style={{ padding: "1.5rem" }}>
      <DashboardGrid>
        <ChartCard
          span={6}
          title="Beneficiaries verified by district"
          subtitle="All three formats"
          exportable
          exportName="beneficiaries-verified-by-district-2026-27"
        >
          <BarChart
            orientation="horizontal"
            title="Beneficiaries verified by district"
            data={[
              { label: "Thane", value: 402_310 },
              { label: "Pune", value: 386_240 },
              { label: "Nagpur", value: 298_105 },
            ]}
          />
        </ChartCard>

        <ChartCard
          span={6}
          title="Beneficiaries by category"
          subtitle="Images only — no honest CSV behind a donut"
          exportable
          exportName="beneficiaries-by-category"
          exportFormats={["png", "svg"]}
        >
          <DonutChart
            title="Beneficiaries by category"
            data={[
              { label: "Scheduled Caste", value: 1_284_600 },
              { label: "Other Backward Class", value: 742_310 },
            ]}
            centerSub="beneficiaries"
          />
        </ChartCard>
      </DashboardGrid>
    </div>
  ),
};
