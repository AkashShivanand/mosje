import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { IndiaTileMap } from "@mosje/design-system";

/**
 * **IndiaTileMap** — every State/UT as one equal tile, placed where it sits on the map.
 *
 * For a PER-PERSON reading, where Lakshadweep deserves as much room as Uttar Pradesh. A
 * choropleth gives the north-east and the island UTs a few pixels; here each is a tile.
 *
 * `scale="quantile"` puts an equal number of States/UTs in each of five shades, so two
 * outliers cannot wash the rest out to the palest step. `size="sm"` with `legend="ramp"` is
 * the thumbnail. `onSelect` makes each tile a button; `selected` outlines one. `tileFormat`
 * and `legendFormat` print the figure without its unit where the title already carries it.
 *
 * Lifecycle: **Beta**.
 */
const DATA = [
  ["Uttar Pradesh", 1.7], ["Maharashtra", 4.7], ["Bihar", 6.9], ["West Bengal", 3.6], ["Madhya Pradesh", 163], ["Tamil Nadu", 9.2],
  ["Rajasthan", 20], ["Karnataka", 30], ["Gujarat", 25], ["Andhra Pradesh", 17], ["Odisha", 8.8], ["Telangana", 76], ["Kerala", 12],
  ["Jharkhand", 11], ["Assam", 8.8], ["Punjab", 9.9], ["Chhattisgarh", 14], ["Haryana", 18], ["Delhi", 15], ["Jammu and Kashmir", 101],
  ["Uttarakhand", 17], ["Himachal Pradesh", 27], ["Tripura", 81], ["Meghalaya", 50], ["Manipur", 29], ["Nagaland", 19], ["Goa", 14],
  ["Arunachal Pradesh", 14], ["Puducherry", 29], ["Mizoram", 45], ["Chandigarh", 417], ["Sikkim", 112],
  ["Dadra and Nagar Haveli and Daman and Diu", 368], ["Andaman and Nicobar Islands", 21], ["Ladakh", 27], ["Lakshadweep", 17],
].map(([state, value]) => ({ state: state as string, value: value as number }));

const meta = {
  title: "Components/Charts/IndiaTileMap",
  component: IndiaTileMap,
  args: { title: "People reached per 100 people, by State/UT", data: DATA, valueFormat: (v: number) => `${v} per 100 people`, tileFormat: (v: number) => String(v) },
} satisfies Meta<typeof IndiaTileMap>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Linear: Story = {};

/** Quantile shading, the chosen State/UT outlined, tiles as buttons. */
export const QuantileAndSelectable: Story = {
  render: (args) => {
    const [picked, setPicked] = React.useState<string | undefined>("Kerala");
    return <IndiaTileMap {...args} scale="quantile" legendFormat={(v) => String(v)} selected={picked} onSelect={setPicked} />;
  },
};

/** The thumbnail: codes only, a one-line ramp legend. */
export const Thumbnail: Story = {
  args: { size: "sm", legend: "ramp", scale: "quantile" },
  render: (args) => <div style={{ maxWidth: 320 }}><IndiaTileMap {...args} /></div>,
};

export const NoData: Story = { args: { data: [] } };
