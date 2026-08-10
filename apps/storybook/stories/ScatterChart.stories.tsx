import type { Meta, StoryObj } from "@storybook/react";
import { ScatterChart, type ScatterSeries } from "@mosje/design-system";

/**
 * **ScatterChart** — two measures plotted against each other, one dot per unit.
 *
 * The only chart here that answers "do these two things move together?", and
 * the only one where the **outlier is the point**. A district sitting far from
 * the cloud is the row an officer should open; that is invisible in a bar chart
 * of either measure on its own.
 *
 * Give every point a `label`. Without one the tooltip can only read out
 * coordinates, and a dot the reader cannot name is a dot they cannot act on.
 *
 * Two cautions worth stating plainly. Correlation on this chart is not cause —
 * districts with more officers processing more applications may simply be
 * larger. And a scatter needs enough points to show a shape: below about ten,
 * a table is more honest than a cloud.
 *
 * Use `series` to separate groups (by region, by scheme) — the colours then
 * carry a second dimension without a second chart.
 *
 * Lifecycle: **Stable**.
 */
const SERIES: ScatterSeries[] = [
  {
    name: "Western Maharashtra",
    points: [
      { x: 42, y: 8_420, label: "Pune" },
      { x: 28, y: 5_180, label: "Satara" },
      { x: 31, y: 6_240, label: "Kolhapur" },
      { x: 24, y: 4_110, label: "Solapur" },
      { x: 19, y: 3_260, label: "Sangli" },
    ],
  },
  {
    name: "Vidarbha",
    points: [
      { x: 38, y: 6_940, label: "Nagpur" },
      { x: 22, y: 3_480, label: "Amravati" },
      { x: 14, y: 2_120, label: "Yavatmal" },
      { x: 9, y: 1_180, label: "Gadchiroli" },
      { x: 26, y: 1_640, label: "Chandrapur — far below the trend" },
    ],
  },
];

const meta = {
  title: "Components/Charts/ScatterChart",
  component: ScatterChart,
  args: {
    series: SERIES,
    title: "Applications processed against officers deployed · Maharashtra",
    xLabel: "Officers deployed",
    yLabel: "Applications processed",
  },
  argTypes: {
    title: { control: "text" },
    xLabel: { control: "text" },
    yLabel: { control: "text" },
    width: { control: { type: "number", min: 320, max: 900, step: 20 } },
    height: { control: { type: "number", min: 200, max: 600, step: 20 } },
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
} satisfies Meta<typeof ScatterChart>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Two regions in one chart. Chandrapur sits well below the trend — the outlier
 * is the whole reason to draw this rather than two bar charts.
 */
export const Playground: Story = {};

/** One series, when there is no grouping to carry. */
export const SingleSeries: Story = {
  args: {
    series: [SERIES[0]],
    title: "Applications processed against officers deployed · Western Maharashtra",
  },
};

/** A clear relationship — spend per beneficiary against beneficiaries reached. */
export const StrongRelationship: Story = {
  args: {
    title: "Beneficiaries reached against funds released · PM-AJAY districts",
    xLabel: "Funds released (₹ lakh)",
    yLabel: "Beneficiaries reached",
    series: [
      {
        name: "Adarsh Gram districts",
        points: [
          { x: 42, y: 1_180, label: "Wagholi" },
          { x: 68, y: 1_940, label: "Shirur" },
          { x: 96, y: 2_720, label: "Baramati" },
          { x: 124, y: 3_480, label: "Maval" },
          { x: 150, y: 4_260, label: "Junnar" },
          { x: 182, y: 5_010, label: "Ambegaon" },
          { x: 210, y: 5_880, label: "Khed" },
        ],
      },
    ],
  },
};

/** Too few points to show a shape. A table would be more honest than this. */
export const TooFewPoints: Story = {
  args: {
    title: "Only four districts — a table would say more",
    series: [
      {
        name: "Districts",
        points: [
          { x: 42, y: 8_420, label: "Pune" },
          { x: 38, y: 6_940, label: "Nagpur" },
          { x: 24, y: 4_110, label: "Solapur" },
          { x: 9, y: 1_180, label: "Gadchiroli" },
        ],
      },
    ],
  },
};

export const NoData: Story = {
  args: { series: [], title: "Applications processed against officers deployed" },
};
