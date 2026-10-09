import type { Meta, StoryObj } from "@storybook/react-vite";
import { DotPlot } from "@mosje/design-system";

/**
 * **DotPlot** — one dot per row on a shared scale, with an optional `reference` line through
 * every row. The chart for PACE: the gap between dot and line is the finding. `size="sm"`
 * is the thumbnail; `detail` carries the two figures a share is made of; `max` sets the end
 * of the scale; `valueFormat` prints the value.
 *
 * Lifecycle: **Beta**.
 */
const meta = {
  title: "Components/Charts/DotPlot",
  component: DotPlot,
  args: {
    title: "Spent as a share of the Budget Estimate, by scheme",
    reference: { value: 50, label: "Year elapsed" },
    max: 100,
    valueFormat: (v: number) => `${v}%`,
    rows: [
      { label: "IPSrC", value: 42.7, detail: "₹162.4 Cr of ₹380 Cr" },
      { label: "RVY", value: 41, detail: "₹47.2 Cr of ₹115 Cr" },
      { label: "SAGE", value: 31.5, detail: "₹6.3 Cr of ₹20 Cr" },
      { label: "PM-SPECIAL", value: 24.2, detail: "₹14.5 Cr of ₹60 Cr" },
    ],
  },
} satisfies Meta<typeof DotPlot>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Pace: Story = {};
export const Small: Story = { args: { size: "sm" } };
export const NoReference: Story = { args: { reference: undefined } };
export const NoData: Story = { args: { rows: [] } };
