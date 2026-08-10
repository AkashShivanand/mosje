import type { Meta, StoryObj } from "@storybook/react";
import { DonutChart, PieChart, type ChartDatum } from "@mosje/design-system";

/**
 * **PieChart · DonutChart** — the two part-to-whole charts, shown together
 * because choosing between them is the only real decision.
 *
 * Both answer "what share of the total?", and both are only honest when the
 * parts **add up to a meaningful whole**. Six regional offices' budgets sum to
 * the budget: a pie is fine. Six schemes' satisfaction scores sum to nothing:
 * a pie there is a lie about the data. Use a `BarChart` for that.
 *
 * Between them:
 * - **`PieChart`** is static, with a side legend and a screen-reader table.
 *   Take it when the chart is print-bound or embedded in a report.
 * - **`DonutChart`** adds interactive tooltips and a centre slot, which is
 *   what makes it the dashboard default: the total lives in the hole instead
 *   of in a caption. It has a **second mode** — pass `value`/`max` instead of
 *   `data` and it becomes a single-value progress ring with an optional
 *   `target` tick.
 *
 * Beyond about six slices both become unreadable. Group the tail into "Other"
 * and give the detail to a table.
 *
 * Colours come from the categorical token ramp automatically; only set `color`
 * per datum when a category has a fixed, meaningful hue across the estate.
 *
 * Lifecycle: **Stable**.
 *
 * @covers PieChart, DonutChart
 */
const CATEGORY_SPLIT: ChartDatum[] = [
  { label: "Scheduled Caste", value: 1_284_600 },
  { label: "Other Backward Class", value: 742_310 },
  { label: "De-notified tribes", value: 186_940 },
  { label: "Senior citizens", value: 421_770 },
  { label: "Persons with disabilities", value: 139_286 },
];

const meta = {
  title: "Components/Charts/Part-to-whole",
  component: PieChart,
  args: {
    data: CATEGORY_SPLIT,
    title: "Beneficiaries by category · 2026–27",
  },
  argTypes: {
    title: { control: "text" },
    data: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 560 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PieChart>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Static, with a side legend — the print-bound case. */
export const Pie: Story = {};

/** Five slices is comfortable. Past about six, group the tail into "Other". */
export const PieTooManySlices: Story = {
  args: {
    title: "Beneficiaries by district — too many slices to read",
    data: [
      { label: "Pune", value: 386_240 },
      { label: "Nashik", value: 241_880 },
      { label: "Nagpur", value: 298_105 },
      { label: "Kolhapur", value: 152_470 },
      { label: "Solapur", value: 138_900 },
      { label: "Thane", value: 402_310 },
      { label: "Amravati", value: 96_450 },
      { label: "Latur", value: 88_220 },
      { label: "Satara", value: 79_640 },
    ],
  },
};

/** The same data as a donut: tooltips, and the total in the middle. */
export const Donut: Story = {
  render: () => (
    <DonutChart
      title="Beneficiaries by category · 2026–27"
      data={CATEGORY_SPLIT}
      centerSub="beneficiaries"
    />
  ),
};

/** A custom centre, when the headline is not simply the sum. */
export const DonutWithCustomCentre: Story = {
  render: () => (
    <DonutChart
      title="Fund utilisation by component · PM-AJAY"
      data={[
        { label: "Adarsh Gram", value: 84_200 },
        { label: "Grants-in-Aid", value: 46_800 },
        { label: "Hostels", value: 31_500 },
      ]}
      center="₹1,625 cr"
      centerSub="released this year"
    />
  ),
};

/**
 * The second mode. `value`/`max` instead of `data` makes it a progress ring —
 * and `target` draws the threshold, so "82%" can be read against "we promised
 * 90%" rather than in isolation.
 */
export const DonutAsProgressRing: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
      <DonutChart
        title="Districts reporting"
        value={82}
        max={100}
        target={90}
        centerSub="of districts"
      />
      <DonutChart
        title="Funds utilised"
        value={1_625}
        max={1_842}
        center="88%"
        centerSub="of the allocation"
      />
    </div>
  ),
};

/** Nothing to plot. Both charts say so rather than drawing an empty circle. */
export const NoData: Story = {
  args: { data: [], title: "Beneficiaries by category" },
};
