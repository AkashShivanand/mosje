import type { Meta, StoryObj } from "@storybook/react";
import { IndiaBubbleMap, IndiaMap, type IndiaBubbleDatum } from "@mosje/design-system";

/**
 * **IndiaBubbleMap** — one circle per state, **area** proportional to the value.
 *
 * Use it for a **count**: villages, hostels, offices, centres, cases — things
 * that stand at points and happen to be tallied by state.
 *
 * Use `IndiaMap` instead for a **rate**: literacy, coverage, a percentage —
 * anything that genuinely belongs to the whole territory.
 *
 * That distinction is the whole reason both exist, and getting it wrong is not
 * a matter of taste. A choropleth gives each state as much ink as it has land,
 * so a map of counts reports "big state" as "big number": in the PM-AJAY data
 * below, Rajasthan (1,493 villages) and Delhi (1) differ by 1,493× in the
 * figures and by roughly 250× in area — shaded, the two effects fight, and area
 * wins. The `WrongToolForCounts` story renders the same data both ways so the
 * failure is visible rather than described.
 *
 * **Area, not radius.** `r ∝ √v`. Scaling the radius by the value squares the
 * difference the eye receives — a 4× count would draw 16× the ink — and it is
 * the most common defect in published bubble maps.
 *
 * Circles are painted largest-first so small ones stay visible and clickable
 * inside their neighbours. Every circle is keyboard-reachable and announced,
 * and the frame emits a full screen-reader table, so nothing here is mouse-only
 * or sight-only. Pass `onSelectState` to make the circles activate a drill-down;
 * without it they are `role="img"` and merely describe themselves.
 *
 * Lifecycle: **New**.
 */

/** PM-AJAY Adarsh Gram villages by state — the department's own published feed. */
const VILLAGES: IndiaBubbleDatum[] = [
  { state: "West Bengal", value: 5792 },
  { state: "Bihar", value: 2853 },
  { state: "Tamil Nadu", value: 2184 },
  { state: "Uttar Pradesh", value: 2083 },
  { state: "Rajasthan", value: 1493 },
  { state: "Karnataka", value: 1301 },
  { state: "Odisha", value: 776 },
  { state: "Andhra Pradesh", value: 746 },
  { state: "Madhya Pradesh", value: 459 },
  { state: "Maharashtra", value: 311 },
  { state: "Chhattisgarh", value: 277 },
  { state: "Assam", value: 269 },
  { state: "Haryana", value: 264 },
  { state: "Jharkhand", value: 226 },
  { state: "Punjab", value: 182 },
  { state: "Telangana", value: 163 },
  { state: "Uttarakhand", value: 137 },
  { state: "Himachal Pradesh", value: 105 },
  { state: "Jammu and Kashmir", value: 62 },
  { state: "Gujarat", value: 36 },
  { state: "Tripura", value: 35 },
  { state: "Manipur", value: 10 },
  { state: "Meghalaya", value: 3 },
  { state: "Delhi", value: 1 },
];

/** PM-AJAY hostels by state — two orders of magnitude smaller, same feed. */
const HOSTELS: IndiaBubbleDatum[] = [
  { state: "Assam", value: 33 },
  { state: "Tamil Nadu", value: 32 },
  { state: "Andhra Pradesh", value: 26 },
  { state: "Karnataka", value: 16 },
  { state: "Nagaland", value: 16 },
  { state: "Odisha", value: 15 },
  { state: "Uttarakhand", value: 9 },
  { state: "Manipur", value: 8 },
  { state: "Tripura", value: 8 },
  { state: "Madhya Pradesh", value: 7 },
  { state: "Uttar Pradesh", value: 6 },
  { state: "Meghalaya", value: 5 },
  { state: "Sikkim", value: 5 },
  { state: "Mizoram", value: 3 },
  { state: "Rajasthan", value: 3 },
  { state: "Chhattisgarh", value: 2 },
  { state: "Haryana", value: 2 },
  { state: "Himachal Pradesh", value: 2 },
  { state: "Kerala", value: 2 },
  { state: "Telangana", value: 2 },
  { state: "Punjab", value: 1 },
];

const meta = {
  title: "Data Display/Charts/IndiaBubbleMap",
  component: IndiaBubbleMap,
  parameters: { layout: "padded" },
  args: {
    data: VILLAGES,
    title: "Adarsh Gram villages by state",
  },
  argTypes: {
    maxRadius: { control: { type: "range", min: 12, max: 60, step: 2 } },
    highlightState: { control: "text" },
  },
} satisfies Meta<typeof IndiaBubbleMap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** A count spanning three orders of magnitude, from 5,792 down to 1. */
export const Villages: Story = {
  render: (args) => <div style={{ maxWidth: 620 }}>{<IndiaBubbleMap {...args} />}</div>,
};

/**
 * The same component on a much smaller range. `maxRadius` is a constant, so the
 * largest circle is the same size whatever the numbers are — the map shows
 * distribution, and the total belongs beside it in words.
 */
export const Hostels: Story = {
  args: { data: HOSTELS, title: "Hostels by state" },
  render: (args) => <div style={{ maxWidth: 620 }}>{<IndiaBubbleMap {...args} />}</div>,
};

/** `highlightState` outlines one state — the officer's own, or a hovered row. */
export const WithHighlight: Story = {
  args: { highlightState: "Bihar" },
  render: (args) => <div style={{ maxWidth: 620 }}>{<IndiaBubbleMap {...args} />}</div>,
};

/**
 * **The reason this component exists.** Identical data, drawn both ways.
 *
 * On the left, area is the message. On the right, area is the accident of where
 * a border falls: Rajasthan and Madhya Pradesh dominate on land alone, West
 * Bengal — which reports more villages than any other state, by a factor of two
 * — reads as a small dark patch, and Delhi's single village is invisible either
 * way but for opposite reasons.
 */
export const WrongToolForCounts: Story = {
  render: (args) => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
      <div>
        <IndiaBubbleMap {...args} title="Right: circles carry the count" />
      </div>
      <div>
        <IndiaMap data={VILLAGES} title="Wrong: shading gives ink to land area" />
      </div>
    </div>
  ),
};

/**
 * **`valueFormat` changes what the tooltip says, not what the circle is.** It
 * defaults to `formatIndian`, so 19768 reads as "19,768" — the lakh/crore
 * grouping a reader of a government page expects, not the thousands grouping.
 *
 * Override it when the raw count is not the useful unit. Budget in rupees is the
 * common case: nobody reads ₹92,50,00,00,000, they read ₹9,250 Cr. The circle
 * still scales on the underlying number, so the geometry is unchanged and only
 * the label is translated.
 *
 * Keep the unit IN the string. A tooltip reading "9,250" beside a map titled
 * "Allocation" invites the reader to supply their own unit, and they will
 * usually guess wrong by a factor of a hundred.
 */
export const CustomValueFormat: Story = {
  args: {
    title: "FY 2025-26 allocation by State / UT",
    valueFormat: (v: number) => `₹${(v / 1e7).toLocaleString("en-IN")} Cr`,
  },
};
