import type { Meta, StoryObj } from "@storybook/react-vite";
import { WaffleChart } from "@mosje/design-system";

/**
 * **WaffleChart** — a unit chart. `scale="count"` draws one square per unit; `scale="percent"`
 * draws each row as 100 squares in proportion. `unit` names a square for the accessible
 * name; `hideLegend` drops the legend where the surface already names the colours.
 *
 * Lifecycle: **Beta**.
 */
const CATS = [
  { id: "live", label: "Live on This Dashboard", color: "var(--sa-chart-cat-4)" },
  { id: "partial", label: "API Partial", color: "var(--sa-chart-cat-6)" },
  { id: "none", label: "No API", color: "var(--sa-chart-cat-2)" },
  { id: "ns", label: "Not Yet Stated", color: "var(--sa-chart-cat-7)" },
];
const meta = {
  title: "Components/Charts/WaffleChart",
  component: WaffleChart,
  args: {
    title: "Indicators by data feed, per programme",
    unit: "indicator",
    categories: CATS,
    rows: [
      { label: "SMILE", counts: { ns: 42 } },
      { label: "NMBA", counts: { live: 5, none: 1 } },
      { label: "Senior Citizens", counts: { partial: 5, none: 22, live: 0 } },
    ],
  },
} satisfies Meta<typeof WaffleChart>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Counts: Story = {};
export const ShareOfHundred: Story = {
  args: {
    title: "Every 100 SHRESHTA students, by mode",
    scale: "percent",
    unit: "student",
    categories: [{ id: "m1", label: "Mode-I" }, { id: "m2", label: "Mode-II" }],
    rows: [{ label: "", counts: { m1: 4562, m2: 2914 } }],
  },
};
export const WithoutLegend: Story = { args: { hideLegend: true } };
export const NoData: Story = { args: { rows: [] } };
