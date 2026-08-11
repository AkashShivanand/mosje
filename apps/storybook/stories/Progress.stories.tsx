import type { Meta, StoryObj } from "@storybook/react";
import { Progress } from "@mosje/design-system";

/**
 * **Progress** — a linear bar for a completed share of a known total.
 *
 * The one to be careful about, because three components look similar and mean
 * different things:
 *
 * - **`Progress`** — a share of a total. Neutral: 40% is neither good nor bad.
 * - **`SlaProgressIndicator`** — time against a service guarantee. It escalates,
 *   states a concrete time, and goes neutral when the clock is paused. Never
 *   hand-roll an SLA out of `Progress`; it will not carry the breach.
 * - **`Loader`** — an indeterminate wait. If you do not know the fraction, do
 *   not draw a bar; a bar that sits at 90% forever is worse than a spinner.
 *
 * `label` is required and becomes the bar's accessible name — the value is
 * exposed through `aria-valuenow`, so a screen-reader user gets "Districts
 * reporting, 82%" rather than a bare number. `showValue` controls only whether
 * the percentage is *printed*; the accessible value is always there.
 *
 * Stacking many bars is a legitimate and often better alternative to a
 * horizontal `BarChart` when each row has its own ceiling.
 *
 * Lifecycle: **Stable**.
 */
const meta = {
  title: "Components/Charts/Progress",
  component: Progress,
  args: {
    value: 82,
    max: 100,
    label: "Districts reporting",
    showValue: true,
  },
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100 } },
    max: { control: { type: "number", min: 1 } },
    label: { control: "text" },
    showValue: { control: "boolean" },
    color: { control: "text" },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 480 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** A real total rather than a percentage — 29 of 36 districts. */
export const AgainstARealTotal: Story = {
  args: { value: 29, max: 36, label: "Districts reporting (29 of 36)" },
};

/**
 * Several rows, each with its own ceiling — often clearer than a horizontal
 * bar chart, because every row is read against its own 100%.
 */
export const Stacked: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16 }}>
      {[
        ["Adarsh Gram — works completed", 84, 120],
        ["Grants-in-Aid — proposals sanctioned", 46, 52],
        ["Hostels — construction started", 12, 40],
        ["Skill training — candidates certified", 3_180, 4_000],
      ].map(([label, value, max]) => (
        <Progress key={String(label)} label={String(label)} value={Number(value)} max={Number(max)} />
      ))}
    </div>
  ),
};

/** Without the printed percentage. The accessible value is still exposed. */
export const WithoutPrintedValue: Story = {
  args: { showValue: false, label: "Upload complete" },
};

/**
 * A status colour, where the share itself carries a judgement. Colour is never
 * the only signal — the percentage is printed beside it.
 */
export const StatusColours: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16 }}>
      <Progress label="Funds utilised — on track" value={88} color="var(--sa-color-status-success)" />
      <Progress label="Funds utilised — behind schedule" value={41} color="var(--sa-color-status-warning)" />
      <Progress label="Funds utilised — at risk of lapsing" value={12} color="var(--sa-color-status-danger)" />
    </div>
  ),
};

/** The extremes, and the guard: a zero `max` renders 0% rather than dividing by zero. */
export const Extremes: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16 }}>
      <Progress label="Not started" value={0} />
      <Progress label="Complete" value={100} />
      <Progress label="Over the total — clamped at 100%" value={140} />
      <Progress label="No total recorded" value={12} max={0} />
    </div>
  ),
};
