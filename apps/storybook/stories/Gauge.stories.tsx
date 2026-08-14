import type { Meta, StoryObj } from "@storybook/react";
import { Gauge, formatPercent } from "@mosje/design-system";

/**
 * **Gauge** — a semicircular dial for one value against a known ceiling.
 *
 * The ceiling is the requirement. A gauge only means anything when `max` is a
 * real limit the reader recognises — beds in a shelter, the sanctioned
 * allocation, 100% of districts. Against an arbitrary maximum it is a
 * decorated number, and a `MetricCard` says the same thing in less space and
 * more legibly.
 *
 * Do not use it for a trend (that is `Sparkline` or `LineChart`), and do not
 * line several up to compare them — a row of dials is much harder to read
 * across than a `BarChart` of the same figures.
 *
 * `color` is the threshold signal: pass a status token when crossing a
 * threshold is the point. Colour must not be the only signal, which is why the
 * value and the ceiling are always printed and a screen-reader table carries
 * both.
 *
 * Lifecycle: **Stable**.
 */
const meta = {
  title: "Components/Charts/Gauge",
  component: Gauge,
  args: {
    value: 78,
    min: 0,
    max: 100,
    title: "Shelter occupancy · Pune",
    unit: "occupancy",
  },
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100 } },
    min: { control: { type: "number" } },
    max: { control: { type: "number" } },
    title: { control: "text" },
    unit: { control: "text" },
    color: { control: "text" },
    valueFormat: { control: false },
  },
} satisfies Meta<typeof Gauge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** A real ceiling: 180 sanctioned beds, 142 occupied. */
export const AgainstARealCeiling: Story = {
  args: {
    value: 142,
    max: 180,
    title: "Beds occupied · Garima Greh, Pune",
    unit: "of 180 sanctioned beds",
  },
};

/**
 * `color` as a threshold signal. The value and ceiling are always printed, so
 * the colour is reinforcement rather than the message.
 */
export const ThresholdColours: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
      <Gauge {...args} value={42} title="Within capacity" color="var(--sa-color-status-success)" unit="occupancy" />
      <Gauge {...args} value={78} title="Approaching capacity" color="var(--sa-color-status-warning)" unit="occupancy" />
      <Gauge {...args} value={96} title="At capacity" color="var(--sa-color-status-danger)" unit="occupancy" />
    </div>
  ),
};

/** A percentage ceiling, formatted as one. */
export const AsAPercentage: Story = {
  args: {
    value: 88,
    max: 100,
    title: "Funds utilised against allocation",
    unit: "of the 2026–27 allocation",
    valueFormat: (v: number) => formatPercent(v, 0),
  },
};

/** A non-zero floor, for a measure that does not start at nothing. */
export const NonZeroMinimum: Story = {
  args: {
    value: 62,
    min: 40,
    max: 80,
    title: "Average days to disbursal",
    unit: "days (target: under 45)",
    color: "var(--sa-text-status-error-base)",
  },
};

/** The extremes — empty and full. */
export const Extremes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
      <Gauge {...args} value={0} title="Nothing recorded yet" unit="occupancy" />
      <Gauge {...args} value={100} title="Fully occupied" unit="occupancy" />
    </div>
  ),
};
