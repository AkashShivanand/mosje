import type { Meta, StoryObj } from "@storybook/react";
import { IndiaMap, type IndiaMapDatum } from "@mosje/design-system";

/**
 * **IndiaMap** — a state-level choropleth of India.
 *
 * Use it when **where** is the question: which states have reported, where a
 * scheme has not reached. A map answers that instantly and a table does not.
 *
 * Use it for nothing else. Area is not value — Rajasthan is large and
 * Lakshadweep is a dot, so a map systematically over-weights big states and
 * hides small ones. Whenever the reader needs to **rank** or **compare
 * precisely**, a horizontal `BarChart` is the honest chart and the map is
 * decoration. In practice the good pattern is both: the map to find the gap,
 * a table beside it for the figures.
 *
 * On names: matching is forgiving by design — case-insensitive, and "and" and
 * "&" are interchangeable, so "Andaman & Nicobar" finds "Andaman and Nicobar
 * Islands". A state you do not supply renders as *no data*, which is visually
 * distinct from a low value; that distinction matters, because "nobody
 * reported" and "reported zero" are different findings.
 *
 * `highlightState` outlines one state — use it for the officer's own state, so
 * they can find themselves without hunting.
 *
 * Regions are keyboard-navigable and announced, and a screen-reader table
 * carries every value.
 *
 * Lifecycle: **Stable**.
 */
const PLEDGES: IndiaMapDatum[] = [
  { state: "Uttar Pradesh", value: 8_642_100 },
  { state: "Maharashtra", value: 6_284_700 },
  { state: "Bihar", value: 4_918_300 },
  { state: "West Bengal", value: 4_106_800 },
  { state: "Madhya Pradesh", value: 3_842_500 },
  { state: "Tamil Nadu", value: 3_610_400 },
  { state: "Rajasthan", value: 3_284_900 },
  { state: "Karnataka", value: 3_042_100 },
  { state: "Gujarat", value: 2_918_600 },
  { state: "Andhra Pradesh", value: 2_486_300 },
  { state: "Odisha", value: 2_104_700 },
  { state: "Telangana", value: 1_842_900 },
  { state: "Kerala", value: 1_648_200 },
  { state: "Jharkhand", value: 1_486_500 },
  { state: "Assam", value: 1_384_100 },
  { state: "Punjab", value: 1_208_400 },
  { state: "Chhattisgarh", value: 1_140_600 },
  { state: "Haryana", value: 1_086_200 },
  { state: "Delhi", value: 942_800 },
  { state: "Uttarakhand", value: 486_300 },
  { state: "Himachal Pradesh", value: 412_700 },
  { state: "Tripura", value: 284_100 },
  { state: "Meghalaya", value: 186_400 },
  { state: "Manipur", value: 164_800 },
  { state: "Nagaland", value: 142_600 },
  { state: "Goa", value: 118_200 },
  { state: "Arunachal Pradesh", value: 96_400 },
  { state: "Mizoram", value: 88_700 },
  { state: "Sikkim", value: 62_400 },
  { state: "Puducherry", value: 58_100 },
  { state: "Chandigarh", value: 46_800 },
  { state: "Andaman & Nicobar", value: 28_400 },
  { state: "Ladakh", value: 18_600 },
  { state: "Lakshadweep", value: 9_200 },
];

const meta = {
  title: "Components/Charts/IndiaMap",
  component: IndiaMap,
  args: {
    data: PLEDGES,
    title: "Pledges recorded by state · Mass Pledge, 18 August 2026",
  },
  argTypes: {
    title: { control: "text" },
    highlightState: { control: "text" },
    data: { control: false },
    valueFormat: { control: false },
  },
} satisfies Meta<typeof IndiaMap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** The officer's own state outlined, so they can find it without hunting. */
export const WithHighlightedState: Story = {
  args: { highlightState: "Maharashtra" },
};

/**
 * Sparse coverage — the case a map is genuinely best at. Twelve states have
 * reported; the unshaded ones are *no data*, not zero, and that gap is the
 * finding.
 */
export const SparseCoverage: Story = {
  args: {
    title: "States that have filed a NAPDDR committee return · as at 04 August 2026",
    data: PLEDGES.slice(0, 12),
  },
};

/**
 * Name matching is forgiving: "&" for "and", any case, and the shortened
 * "Andaman & Nicobar" still finds "Andaman and Nicobar Islands".
 */
export const ForgivingStateNames: Story = {
  args: {
    title: "Name variants all resolve to the same states",
    data: [
      { state: "maharashtra", value: 6_284_700 },
      { state: "TAMIL NADU", value: 3_610_400 },
      { state: "Andaman & Nicobar", value: 28_400 },
      { state: "Jammu & Kashmir", value: 684_200 },
      { state: "Dadra & Nagar Haveli and Daman & Diu", value: 42_100 },
    ],
    highlightState: "andaman and nicobar islands",
  },
};

export const NoData: Story = {
  args: { data: [], title: "Pledges recorded by state" },
};
