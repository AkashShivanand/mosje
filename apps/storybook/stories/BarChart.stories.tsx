import type { Meta, StoryObj } from "@storybook/react";
import { BarChart, formatCompact } from "@mosje/design-system";

/**
 * **BarChart** — the default chart. When in doubt, this is the right answer.
 *
 * It reads comparisons more accurately than any other form, which is why it
 * survives cases a pie cannot: parts that do not sum to a whole, negative
 * values, long category names, more than six categories.
 *
 * Two choices carry meaning:
 *
 * - **`orientation`** is decided by the labels, not by taste. Go `horizontal`
 *   once category names are long or numerous — rotated vertical labels are the
 *   commonest reason a dashboard chart is unreadable on a laptop.
 * - **`variant`** only applies to multiple series, and the two say different
 *   things. **`stacked`** claims the series add up to a meaningful total;
 *   **`grouped`** compares them side by side. Stacking things that do not sum
 *   — a count and a percentage, say — is a chart that lies.
 *
 * Pass `data` for one series, or `labels` + `series` for several.
 * `showValues` prints the numbers on the bars: worth it for five bars in a
 * report, noise for twenty on a dashboard.
 *
 * Lifecycle: **Stable**.
 */
const DISTRICTS = [
  { label: "Pune", value: 386_240 },
  { label: "Thane", value: 402_310 },
  { label: "Nagpur", value: 298_105 },
  { label: "Nashik", value: 241_880 },
  { label: "Kolhapur", value: 152_470 },
];

const meta = {
  title: "Components/Charts/BarChart",
  component: BarChart,
  args: {
    data: DISTRICTS,
    title: "Beneficiaries verified by district · Maharashtra",
    orientation: "vertical",
    variant: "grouped",
    yLabel: "Beneficiaries",
    showValues: false,
  },
  argTypes: {
    orientation: { control: "inline-radio", options: ["vertical", "horizontal"] },
    variant: { control: "inline-radio", options: ["grouped", "stacked"] },
    showValues: { control: "boolean" },
    title: { control: "text" },
    yLabel: { control: "text" },
    caption: { control: "text" },
    width: { control: { type: "number", min: 320, max: 900, step: 20 } },
    height: { control: { type: "number", min: 180, max: 600, step: 20 } },
    data: { control: false },
    valueFormat: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 640 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/**
 * Long or numerous category names go horizontal. The vertical version below is
 * the failure this prop exists to avoid.
 */
export const HorizontalForLongLabels: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 32 }}>
      <BarChart
        {...args}
        orientation="horizontal"
        title="Horizontal — labels are readable"
        data={[
          { label: "Chhatrapati Sambhajinagar", value: 184_200 },
          { label: "Ahilyanagar", value: 141_770 },
          { label: "Dharashiv", value: 96_310 },
          { label: "Gadchiroli", value: 48_940 },
          { label: "Palghar", value: 122_580 },
        ]}
      />
      <BarChart
        {...args}
        orientation="vertical"
        title="Vertical — the same labels, rotated and cramped"
        data={[
          { label: "Chhatrapati Sambhajinagar", value: 184_200 },
          { label: "Ahilyanagar", value: 141_770 },
          { label: "Dharashiv", value: 96_310 },
          { label: "Gadchiroli", value: 48_940 },
          { label: "Palghar", value: 122_580 },
        ]}
      />
    </div>
  ),
};

/** `grouped` — compare the series against each other, period by period. */
export const Grouped: Story = {
  render: () => (
    <BarChart
      title="Applications by scheme and quarter · 2026–27"
      yLabel="Applications"
      variant="grouped"
      labels={["Q1", "Q2", "Q3", "Q4"]}
      series={[
        { name: "Pre-Matric", data: [42_100, 48_600, 51_200, 46_900] },
        { name: "Post-Matric", data: [31_400, 36_800, 39_100, 42_300] },
      ]}
    />
  ),
};

/**
 * `stacked` — only legitimate because approved + pending + returned really do
 * sum to every application received.
 */
export const Stacked: Story = {
  render: () => (
    <BarChart
      title="Applications by status and district"
      yLabel="Applications"
      variant="stacked"
      labels={["Pune", "Thane", "Nagpur", "Nashik", "Kolhapur"]}
      series={[
        { name: "Approved", data: [3_120, 3_480, 2_640, 2_110, 1_380] },
        { name: "Pending", data: [640, 720, 480, 390, 260] },
        { name: "Returned", data: [180, 210, 140, 120, 90] },
      ]}
    />
  ),
};

/** Values printed on the bars — worth it for five bars, noise for twenty. */
export const WithValues: Story = {
  args: {
    showValues: true,
    orientation: "horizontal",
    valueFormat: formatCompact,
    title: "Beneficiaries verified by district",
  },
};

/** A caption carries what the title cannot — the source and the as-at date. */
export const WithCaption: Story = {
  args: {
    caption: "Source: district submissions as at 04 August 2026. Excludes applications returned for correction.",
  },
};

export const NoData: Story = {
  args: { data: [], title: "Beneficiaries verified by district" },
};
