import type { Meta, StoryObj } from "@storybook/react";
import { InlineBar, RankedBarList } from "@mosje/design-system";

/**
 * **RankedBarList** — a label, a figure and a thin bar per row.
 *
 * The most-drawn chart in the portal handoffs: "Top States by Pledges", "SLA
 * Compliance by District", "Category Distribution", "District-wise Fund
 * Utilisation" are all this component. It is NOT a `BarChart`: the figure is
 * printed beside each row, so the bar is an aid to the text rather than the
 * encoding, and the ordered list is the accessible reading.
 *
 * Pin `max` for a percentage, or the highest row draws at full width and reads
 * as "complete". Set a tone only through a stated threshold — green means on
 * track on this estate. Pass `pageSize` for a long list; it pages, and it
 * never scrolls inside its card.
 *
 * `InlineBar` is the same bar alone, for a table cell beside a printed figure.
 *
 * Lifecycle: **Beta**.
 *
 * @covers RankedBarList, InlineBar
 */
const PLEDGES = [
  { label: "Maharashtra", value: 2_29_400 },
  { label: "Uttar Pradesh", value: 2_18_100 },
  { label: "Gujarat", value: 1_45_300 },
  { label: "Madhya Pradesh", value: 1_36_800 },
  { label: "Rajasthan", value: 1_02_600 },
  { label: "Haryana", value: 88_700 },
  { label: "Punjab", value: 76_200 },
  { label: "Odisha", value: 0, withheld: { kind: "not-reported" as const } },
  { label: "Kerala", value: 41_300 },
  { label: "Assam", value: 38_100 },
];

const meta = {
  title: "Components/Charts/RankedBarList",
  component: RankedBarList,
  args: {
    title: "Top states by pledges",
    items: PLEDGES,
    showRank: true,
    sort: "desc",
  },
  argTypes: {
    showRank: { control: "boolean" },
    sort: { control: "inline-radio", options: ["desc", "asc", "none"] },
    pageSize: { control: { type: "number", min: 0, max: 20, step: 1 } },
    max: { control: { type: "number" } },
    title: { control: "text" },
    items: { control: false },
    toneFor: { control: false },
    valueFormat: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 420 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RankedBarList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** A percentage against a target: `max={100}`, a threshold rule, and a caption that states it. */
export const AgainstATarget: Story = {
  args: {
    title: "SLA compliance by district",
    items: [
      { label: "Lucknow", value: 88 },
      { label: "Kanpur", value: 94 },
      { label: "Varanasi", value: 79 },
      { label: "Agra", value: 83 },
      { label: "Meerut", value: 71 },
    ],
    max: 100,
    showRank: false,
    valueFormat: (n: number) => `${n}%`,
    toneFor: (item) => (item.value >= 90 ? "success" : item.value >= 80 ? "warning" : "danger"),
    caption: "Target 90%. Green meets it, amber is within ten points, red is further.",
  },
};

/** Ten rows, five per page. The card keeps one height whatever is in it. */
export const Paged: Story = {
  args: { pageSize: 5 },
};

/** A breakdown whose parts have a fixed order — `sort="none"` and a share in `detail`. */
export const Breakdown: Story = {
  args: {
    title: "Grievances by category",
    showRank: false,
    sort: "none",
    items: [
      { label: "Assault / Attack", value: 4_358, detail: "(35%)" },
      { label: "Housing / Benefit", value: 3_487, detail: "(28%)" },
      { label: "Fund Misuse", value: 2_241, detail: "(18%)" },
      { label: "Victimisation", value: 1_494, detail: "(12%)" },
      { label: "Social Boycott", value: 872, detail: "(7%)" },
    ],
  },
};

/** The bar alone, in a table cell, beside the printed figure. */
export const InlineInATable: Story = {
  render: () => (
    <table style={{ borderCollapse: "collapse", width: 420 }}>
      <thead>
        <tr>
          <th style={{ textAlign: "left", padding: 8 }}>District</th>
          <th style={{ textAlign: "left", padding: 8 }}>Utilisation</th>
        </tr>
      </thead>
      <tbody>
        {[
          ["Lucknow", 9.2, 30],
          ["Varanasi", 7.8, 28],
          ["Kanpur", 6.4, 25],
        ].map(([d, u, s]) => (
          <tr key={String(d)}>
            <td style={{ padding: 8 }}>{d}</td>
            <td style={{ padding: 8 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <InlineBar value={Number(u)} max={Number(s)} />
                <span style={{ whiteSpace: "nowrap" }}>
                  ₹{u}L of ₹{s}L
                </span>
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/** Loading, empty, error and filtered-to-nothing, in the frame's own words. */
export const States: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(2, minmax(0, 1fr))", width: 720 }}>
      <RankedBarList {...args} state="loading" />
      <RankedBarList {...args} state="empty" />
      <RankedBarList {...args} state="error" onRetry={() => {}} />
      <RankedBarList {...args} state="no-results" filterLabel="state filter" onRetry={() => {}} />
    </div>
  ),
};
