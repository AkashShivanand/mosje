import type { Meta, StoryObj } from "@storybook/react";
import { Heatmap } from "@mosje/design-system";

/**
 * **Heatmap** — a matrix where colour carries the value.
 *
 * Right when you have **two categorical axes and one measure**, and the reader
 * wants the pattern rather than the numbers: which districts are quiet in which
 * months, which scheme lags in which region. Wrong when they need to compare
 * precise values — the eye reads length far better than shade, so a `BarChart`
 * wins whenever accuracy matters more than shape.
 *
 * The prop that decides whether it is honest is **`scale`**:
 *
 * - **`sequential`** (default) ramps low → high. Use it for a count, an amount,
 *   anything with a natural floor at zero.
 * - **`diverging`** centres on the midpoint, so distance from the middle is
 *   what the colour shows. Use it only when there is a **meaningful centre** —
 *   variance against a target, growth versus decline. On a plain count, a
 *   diverging ramp invents a midpoint that means nothing.
 *
 * `matrix` is row-major: `matrix[y][x]`, matching `yLabels` then `xLabels`.
 * Getting that the wrong way round produces a chart that renders perfectly and
 * says something false, so it is worth checking against a known cell.
 *
 * Colour is never the only channel — every cell is announced, and a
 * screen-reader table carries the values.
 *
 * Lifecycle: **Stable**.
 */
const DISTRICTS = ["Pune", "Thane", "Nagpur", "Nashik", "Kolhapur", "Amravati"];
const MONTHS = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"];

/** Row-major: one row per district, one column per month. */
const APPLICATIONS = [
  [3_120, 3_480, 4_010, 4_620, 5_180, 4_940],
  [3_680, 3_920, 4_460, 5_100, 5_840, 5_610],
  [2_410, 2_680, 3_140, 3_520, 3_980, 3_760],
  [1_980, 2_140, 2_520, 2_890, 3_240, 3_080],
  [1_240, 1_380, 1_610, 1_840, 2_120, 1_960],
  [860, 940, 1_120, 1_290, 1_480, 1_360],
];

/** Percentage-point variance against the district's own SLA target. */
const SLA_VARIANCE = [
  [4, 6, 2, -1, -6, -3],
  [8, 9, 7, 5, 2, 4],
  [-2, -4, -7, -9, -14, -11],
  [1, 0, -2, -3, -5, -4],
  [6, 8, 9, 11, 14, 12],
  [-9, -12, -14, -18, -21, -17],
];

const meta = {
  title: "Components/Charts/Heatmap",
  component: Heatmap,
  args: {
    xLabels: MONTHS,
    yLabels: DISTRICTS,
    matrix: APPLICATIONS,
    title: "Applications received by district and month · 2026–27",
    scale: "sequential",
  },
  argTypes: {
    scale: { control: "inline-radio", options: ["sequential", "diverging"] },
    title: { control: "text" },
    xLabels: { control: false },
    yLabels: { control: false },
    matrix: { control: false },
    valueFormat: { control: false },
  },
} satisfies Meta<typeof Heatmap>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A count, on the sequential ramp — the correct pairing. */
export const Playground: Story = {};

/**
 * A diverging scale on data with a real centre: variance against target, where
 * zero means "on target" and the two directions mean opposite things.
 */
export const DivergingWithAMeaningfulCentre: Story = {
  args: {
    matrix: SLA_VARIANCE,
    title: "SLA performance against target, percentage points · 2026–27",
    scale: "diverging",
    valueFormat: (v: number) => `${v > 0 ? "+" : ""}${v} pp`,
  },
};

/**
 * The same **count** data on a diverging ramp. It renders, and it is wrong: the
 * midpoint is an artefact of the range, so the colours imply a "neutral" level
 * of applications that does not exist.
 */
export const DivergingOnACountIsWrong: Story = {
  args: {
    scale: "diverging",
    title: "Applications on a diverging ramp — an invented midpoint",
  },
};

/** A small matrix. Two by three is still a legitimate heatmap. */
export const SmallMatrix: Story = {
  args: {
    xLabels: ["Approved", "Pending", "Returned"],
    yLabels: ["Pre-Matric", "Post-Matric"],
    matrix: [
      [8_420, 1_180, 260],
      [6_940, 2_310, 480],
    ],
    title: "Applications by scheme and status",
  },
};

export const NoData: Story = {
  args: { xLabels: [], yLabels: [], matrix: [], title: "Applications by district and month" },
};
