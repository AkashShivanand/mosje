import type { Meta, StoryObj } from "@storybook/react";
import { ComboChart } from "@mosje/design-system";

/**
 * **ComboChart** — grouped bars on the left axis, lines on the right, sharing
 * one category axis.
 *
 * It exists for the MIS question that needs both: **a count and a rate**.
 * Applications received (thousands) alongside the approval rate (percent) —
 * two different units, so one axis cannot hold both, and two separate charts
 * make the reader do the alignment in their head.
 *
 * That is also its only good use. Two measures in the **same** unit belong on
 * one axis in a `BarChart` or a `LineChart`; putting them on two axes lets the
 * scales be chosen to make any relationship appear, which is the classic way a
 * dual-axis chart misleads.
 *
 * So: **label both axes**. `leftLabel` and `rightLabel` are what stop a reader
 * assuming the line and the bars are measured the same way. They are optional
 * in the type and effectively required in practice.
 *
 * Bars are grouped, never stacked here — a stack plus a line is more than one
 * chart's worth of reading.
 *
 * Lifecycle: **Stable**.
 */
const meta = {
  title: "Components/Charts/ComboChart",
  component: ComboChart,
  args: {
    labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep"],
    bars: [
      { name: "Applications received", data: [12_400, 18_900, 24_600, 31_200, 38_400, 41_100] },
    ],
    lines: [{ name: "Approval rate", data: [72, 74, 71, 78, 82, 81] }],
    title: "Applications received and approval rate · 2026–27",
    leftLabel: "Applications",
    rightLabel: "Approval rate (%)",
  },
  argTypes: {
    title: { control: "text" },
    leftLabel: { control: "text" },
    rightLabel: { control: "text" },
    caption: { control: "text" },
    width: { control: { type: "number", min: 320, max: 900, step: 20 } },
    height: { control: { type: "number", min: 200, max: 600, step: 20 } },
    labels: { control: false },
    bars: { control: false },
    lines: { control: false },
    valueFormat: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 680 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ComboChart>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The case it exists for: a count and a rate, in different units. */
export const Playground: Story = {};

/** Two bar series grouped, against one line. */
export const MultipleBarSeries: Story = {
  args: {
    bars: [
      { name: "Pre-Matric", data: [8_100, 11_400, 16_800, 22_300, 27_900, 31_600] },
      { name: "Post-Matric", data: [4_300, 7_500, 7_800, 8_900, 10_500, 9_500] },
    ],
    lines: [{ name: "Approval rate", data: [72, 74, 71, 78, 82, 81] }],
    title: "Applications by scheme, with the overall approval rate",
  },
};

/** Two lines on the right — a rate and a target, which is what a rate is read against. */
export const RateAgainstTarget: Story = {
  args: {
    lines: [
      { name: "Approval rate", data: [72, 74, 71, 78, 82, 81] },
      { name: "Target", data: [80, 80, 80, 80, 80, 80] },
    ],
    title: "Applications received, approval rate against target",
  },
};

/**
 * Both axes unlabelled. It renders, and a reader has no way to tell the line is
 * a percentage — the failure `leftLabel` and `rightLabel` exist to prevent.
 */
export const UnlabelledAxesMislead: Story = {
  args: {
    leftLabel: undefined,
    rightLabel: undefined,
    title: "Unlabelled axes — the line could be anything",
  },
};

/** A caption carries the source and the as-at date the title cannot. */
export const WithCaption: Story = {
  args: {
    caption:
      "Source: district submissions as at 04 August 2026. Approval rate is approvals as a share of applications decided in the month.",
  },
};

export const NoData: Story = {
  args: { labels: [], bars: [], lines: [], title: "Applications received and approval rate" },
};
