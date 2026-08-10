import type { Meta, StoryObj } from "@storybook/react";
import { AreaChart, LineChart, MetricCard, Sparkline } from "@mosje/design-system";

/**
 * **LineChart · AreaChart · Sparkline** — the three ways to show change over
 * time, documented together because they are the same idea at three sizes and
 * picking the wrong size is the usual mistake.
 *
 * - **`LineChart`** compares several series over a shared axis. This is the
 *   default for a trend.
 * - **`AreaChart`** is `LineChart` with the fill switched on. The fill implies
 *   **volume accumulating**, so use it for one series, or for series that
 *   genuinely stack. Two overlapping filled series hide each other — that is a
 *   `LineChart`.
 * - **`Sparkline`** is a trend with the axes removed, sized to sit inside a
 *   table cell or a `MetricCard`. It shows *shape*, never a value, which is
 *   why it is `aria-hidden` unless you give it a `label` — and you should only
 *   give it one when it is not already beside the number it describes.
 *
 * A line chart needs an axis that is genuinely ordered in time. Categories that
 * merely sit in a row — districts, schemes — are a `BarChart`; joining them
 * with a line invents a trend that is not there.
 *
 * `showDots` defaults on at 16 points or fewer. Leave it: past that the markers
 * become the noise rather than the signal.
 *
 * Lifecycle: **Stable**.
 *
 * @covers LineChart, AreaChart, Sparkline
 */
const MONTHS = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];

const APPLICATIONS = [
  { name: "Pre-Matric", data: [12_400, 18_900, 24_600, 31_200, 38_400, 41_100, 39_800, 44_200] },
  { name: "Post-Matric", data: [8_100, 11_400, 16_800, 22_300, 27_900, 31_600, 34_100, 36_800] },
];

const meta = {
  title: "Components/Charts/Trends",
  component: LineChart,
  args: {
    labels: MONTHS,
    series: APPLICATIONS,
    title: "Applications received by month · 2026–27",
    yLabel: "Applications",
    area: false,
  },
  argTypes: {
    area: { control: "boolean" },
    showDots: { control: "boolean" },
    title: { control: "text" },
    yLabel: { control: "text" },
    caption: { control: "text" },
    width: { control: { type: "number", min: 320, max: 900, step: 20 } },
    height: { control: { type: "number", min: 180, max: 600, step: 20 } },
    labels: { control: false },
    series: { control: false },
    valueFormat: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 640 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LineChart>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Two series over a shared time axis — the default trend. */
export const Line: Story = {};

/** One series. With nothing to overlap, the fill is free information. */
export const LineSingleSeries: Story = {
  args: {
    series: [APPLICATIONS[0]],
    title: "Pre-Matric applications received by month",
  },
};

/**
 * `AreaChart` — the fill implies accumulating volume, so one series. Compare
 * with the two-series version below, where the fills fight.
 */
export const Area: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 32 }}>
      <AreaChart
        labels={MONTHS}
        series={[APPLICATIONS[0]]}
        title="One series — the fill reads as volume"
        yLabel="Applications"
      />
      <AreaChart
        labels={MONTHS}
        series={APPLICATIONS}
        title="Two series — the fills hide each other; use a LineChart"
        yLabel="Applications"
      />
    </div>
  ),
};

/** A series can opt out of the fill individually with `fill: false`. */
export const AreaWithOneSeriesUnfilled: Story = {
  render: () => (
    <AreaChart
      labels={MONTHS}
      series={[
        { name: "Applications received", data: APPLICATIONS[0].data },
        { name: "Applications approved", data: APPLICATIONS[1].data, fill: false },
      ]}
      title="Received (filled) against approved (line only)"
      yLabel="Applications"
    />
  ),
};

/** Many points — the dots stand down so the line stays readable. */
export const ManyPoints: Story = {
  args: {
    labels: Array.from({ length: 30 }, (_, i) => `${i + 1} Aug`),
    series: [
      {
        name: "Pledges recorded",
        data: Array.from({ length: 30 }, (_, i) =>
          Math.round(180_000 + Math.sin(i / 3) * 40_000 + i * 6_400),
        ),
      },
    ],
    title: "Mass Pledge — pledges recorded per day",
    yLabel: "Pledges",
  },
};

/**
 * `Sparkline` — shape without a value, sized for a cell. Decorative by
 * default, which is right here: the number is already beside it.
 */
export const Sparklines: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 24, maxWidth: 560 }}>
      <MetricCard
        label="Applications received"
        value="44,200"
        changeValue="11%"
        changeLabel="vs last month"
        changeDirection="up"
        icon={<Sparkline data={APPLICATIONS[0].data} width={72} height={28} />}
      />
      <table style={{ width: "100%", borderCollapse: "collapse", color: "var(--ds-ink)" }}>
        <thead>
          <tr style={{ textAlign: "left", color: "var(--ds-ink-muted)" }}>
            <th style={{ padding: "8px 12px 8px 0" }}>District</th>
            <th style={{ padding: "8px 12px 8px 0" }}>This month</th>
            <th style={{ padding: "8px 12px 8px 0" }}>Trend</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["Pune", "8,420", [3100, 4200, 5100, 6400, 7200, 8420]],
            ["Thane", "9,180", [4800, 5100, 4900, 6200, 7900, 9180]],
            ["Nagpur", "6,240", [5900, 5600, 5100, 4800, 5400, 6240]],
          ].map(([district, count, trend]) => (
            <tr key={String(district)} style={{ borderTop: "1px solid var(--ds-border)" }}>
              <td style={{ padding: "10px 12px 10px 0" }}>{district}</td>
              <td style={{ padding: "10px 12px 10px 0" }}>{count}</td>
              <td style={{ padding: "10px 12px 10px 0" }}>
                <Sparkline data={trend as number[]} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};

/** Sparkline variants — filled or line-only, and labelled when it stands alone. */
export const SparklineVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
      <Sparkline data={APPLICATIONS[0].data} />
      <Sparkline data={APPLICATIONS[0].data} fill={false} />
      <Sparkline data={APPLICATIONS[0].data} width={160} height={48} />
      <Sparkline
        data={APPLICATIONS[0].data}
        label="Pre-Matric applications rose steadily from April to November 2026."
      />
      {/* Fewer than two points cannot be a trend — it renders nothing. */}
      <Sparkline data={[1]} />
    </div>
  ),
};

export const NoData: Story = {
  args: { labels: [], series: [], title: "Applications received by month" },
};
