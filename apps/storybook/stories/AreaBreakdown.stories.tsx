import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  AreaBreakdown,
  AreaExplorer,
  Button,
  DescriptionList,
  compactCount,
  type AreaMeasure,
  type AreaRow,
} from "@mosje/design-system";

/**
 * **AreaBreakdown** — one programme's figures State/UT by State/UT: the India map, a switch
 * between the figures it can show (`measures`), and the same figures ranked beside it.
 *
 * The map and the ranked list read **one** measure, so they can never disagree. Choosing a
 * State/UT on the map calls `onSelectArea` — on a dashboard that sets the page's area, so
 * the map is a way into a State's figures, not a second picture of them. With one measure
 * the switch is not drawn. `pageSize` pages the ranked list; it never scrolls inside the
 * card. Each chart keeps its table for screen readers.
 *
 * **AreaExplorer** — the map beside a panel that answers for it: the highest and lowest five
 * States/UTs until the reader picks one, then that State/UT. What a page knows about one
 * State/UT is the page's, so the picked panel's body (`selectedContent`) and footer
 * (`selectedActions`) are slots; the extremes are drawn from `rows`. `copy` re-words the
 * three labels, `extremesCount` changes how many each end lists, `labelLevel` sets the
 * heading level of the two labels.
 *
 * State/UT names must match `IndiaMap`'s spelling ("Uttar Pradesh", "Tamil Nadu").
 *
 * Lifecycle: **Beta**.
 *
 * @covers AreaBreakdown, AreaExplorer
 */

/** Persons reached under NMBA's awareness events, as on 30.09.2026 — illustrative State figures. */
const REACHED: AreaRow[] = [
  { area: "Uttar Pradesh", value: 6_42_10_000 },
  { area: "Maharashtra", value: 4_18_50_000 },
  { area: "Bihar", value: 3_76_20_000 },
  { area: "Madhya Pradesh", value: 2_91_40_000 },
  { area: "Rajasthan", value: 2_64_80_000 },
  { area: "Tamil Nadu", value: 2_21_30_000 },
  { area: "Karnataka", value: 1_98_60_000 },
  { area: "Kerala", value: 1_42_70_000 },
  { area: "Odisha", value: 1_31_90_000 },
  { area: "Punjab", value: 88_40_000 },
  { area: "Assam", value: 74_10_000 },
  { area: "Goa", value: 9_80_000 },
];

const IDENTIFIED: AreaRow[] = [
  { area: "Uttar Pradesh", value: 3_120 },
  { area: "Maharashtra", value: 2_480 },
  { area: "Bihar", value: 1_960 },
  { area: "Madhya Pradesh", value: 1_740 },
  { area: "Rajasthan", value: 1_530 },
  { area: "Tamil Nadu", value: 1_210 },
  { area: "Karnataka", value: 1_090 },
  { area: "Kerala", value: 860 },
  { area: "Odisha", value: 790 },
  { area: "Punjab", value: 520 },
  { area: "Assam", value: 410 },
  { area: "Goa", value: 60 },
];

const REHABILITATED: AreaRow[] = IDENTIFIED.map((r) => ({ area: r.area, value: Math.round(r.value * 0.47) }));

const ONE_MEASURE: AreaMeasure[] = [{ id: "reach", name: "Total Outreach", label: "Outreach", rows: REACHED }];

const TWO_MEASURES: AreaMeasure[] = [
  { id: "identified", name: "Persons Engaged in Begging Identified", label: "Identified", rows: IDENTIFIED },
  { id: "rehabilitated", name: "Persons Rehabilitated", label: "Rehabilitated", rows: REHABILITATED },
];

const meta = {
  title: "Components/Dashboard/AreaBreakdown",
  component: AreaBreakdown,
  parameters: { layout: "padded" },
  args: {
    measures: ONE_MEASURE,
    title: "State/UT-wise Figures",
    headingLevel: 3,
    switchLabel: "Figure shown",
    pageSize: 10,
    valueFormat: compactCount,
  },
  argTypes: {
    headingLevel: { control: "inline-radio", options: [2, 3, 4] },
    title: { control: "text" },
    switchLabel: { control: "text" },
    pageSize: { control: { type: "number", min: 3, max: 20, step: 1 } },
    measures: { control: false },
    valueFormat: { control: false },
    onSelectArea: { control: false },
  },
} satisfies Meta<typeof AreaBreakdown>;
export default meta;
type Story = StoryObj<typeof meta>;

/** One measure: the map and the ranked list, and no switch. */
export const OneMeasure: Story = {};

/** Two measures: the switch changes the map and the list together. */
export const TwoMeasures: Story = {
  args: {
    measures: TWO_MEASURES,
    title: "State/UT-wise Beneficiary Distribution",
    valueFormat: undefined,
  },
};

/** Picking a State/UT on the map reports it, so a page can set its area from the map. */
export const SelectingAnArea: Story = {
  args: { measures: TWO_MEASURES, valueFormat: undefined },
  render: function Render(args) {
    const [area, setArea] = React.useState<string | undefined>();
    return (
      <div style={{ display: "grid", gap: 12 }}>
        <AreaBreakdown {...args} onSelectArea={setArea} />
        <p style={{ margin: 0 }}>{area ? `Area chosen: ${area}` : "No area chosen yet."}</p>
      </div>
    );
  },
};

/** `pageSize` of 5 pages the ranked list at five rows. */
export const ShortPages: Story = {
  args: { pageSize: 5 },
};

/* ── AreaExplorer ────────────────────────────────────────────────────────── */

/** With nothing picked the panel lists the highest and lowest five. */
export const ExplorerNothingPicked: StoryObj<typeof AreaExplorer> = {
  render: function Render() {
    const [selected, setSelected] = React.useState<string | undefined>();
    return <AreaExplorer measureName="Total Outreach" rows={REACHED} valueFormat={compactCount} selected={selected} onSelect={setSelected} />;
  },
};

/** With `selected`, the panel answers for that State/UT: its rank, the page's own content and a way on. */
export const ExplorerStatePicked: StoryObj<typeof AreaExplorer> = {
  render: function Render() {
    const [selected, setSelected] = React.useState<string | undefined>("Maharashtra");
    return (
      <AreaExplorer
        measureName="Total Outreach"
        rows={REACHED}
        valueFormat={compactCount}
        selected={selected}
        onSelect={setSelected}
        selectedContent={
          <DescriptionList
            size="md"
            columns={2}
            items={[
              { term: "Total Outreach", value: "4.19 Cr" },
              { term: "Master Volunteers", value: "18,420" },
              { term: "Districts Reached", value: "36" },
              { term: "Helpline Calls", value: "1.24 lakh" },
            ]}
          />
        }
        selectedActions={
          <Button appearance="text" size="sm" onClick={() => setSelected(undefined)}>
            Back to All India
          </Button>
        }
      />
    );
  },
};

/** `copy`, `extremesCount` and `labelLevel` re-word and resize the extremes panel. */
export const ExplorerThreeEitherEnd: StoryObj<typeof AreaExplorer> = {
  render: () => (
    <AreaExplorer
      measureName="Persons Rehabilitated"
      rows={REHABILITATED}
      onSelect={() => undefined}
      extremesCount={3}
      labelLevel={3}
      copy={{ extremes: "Most and Least", highest: "Highest Three", lowest: "Lowest Three" }}
    />
  ),
};
