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
 *   layout jumps on load. Set `loading`, don't render nothing.
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

/** A single card. `actions` sits in the header; `footer` carries the source line. */
export const Card: Story = {
  render: (args) => (
    <div style={{ maxWidth: 640 }}>
      <ChartCard
        {...args}
        actions={
          <Button size="sm" appearance="text">
            Export
          </Button>
        }
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
 * The two states worth wiring. `loading` holds the tile's height so the grid
 * does not jump; `empty` says so rather than leaving a blank frame.
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
