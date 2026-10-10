import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  AreaBreakdown,
  DashboardCard,
  DashboardCardList,
  DashboardHeader,
  DashboardScreen,
  DescriptionList,
  FilterSelect,
  HeadlineBand,
  HeadlineFigure,
  KpiView,
  OrgLogo,
  compactCount,
  type KpiReading,
  type KpiSpec,
} from "@mosje/design-system";

/**
 * **DashboardScreen** — the nineteenth screen template: figures about a programme, or
 * several, for a reader who wants to know how things stand, filtered by area and period.
 *
 * It draws the same things on every dashboard: the way back (`back`), the **area bar**
 * ("Figures for All India", announced when it changes, with the `filters` on one baseline),
 * one sentence (`areaNote`) where an area choice changes only part of the page, then the
 * view. It owns the states through `ScreenBody` — loading, error, empty, filtered to
 * nothing — the focus move to the view's first heading when `viewKey` changes (with
 * `shouldMoveFocus` to keep focus on a filter), and the area's live announcement.
 *
 * **Pick it from the data you have.** `OverviewScreen` is a portal's signed-in home: a
 * greeting, four KPI tiles, recent records. This is a dashboard a citizen or officer reads —
 * one or many programmes, an area filter, views that open from one another. Compose the view
 * from `HeadlineBand`, `DashboardCardList` of `DashboardCard`s, `DashboardHeader`, `KpiView`,
 * `AreaBreakdown` and `AreaExplorer`.
 *
 * `count` is how many sections the view holds; `0` resolves to empty (or filtered, with
 * `filtered`). `copy` is the bilingual seam and `skeleton` the loading shape. Storybook has no
 * router, so `linkAs` is not passed.
 *
 * Lifecycle: **Beta**.
 */
const meta = {
  title: "Templates/Dashboard screen",
  component: DashboardScreen,
  parameters: { layout: "fullscreen" },
  args: { children: null },
  argTypes: {
    children: { control: false },
    notice: { control: false },
    filters: { control: false },
    areaNote: { control: false },
    copy: { control: false },
    linkAs: { control: false },
    shouldMoveFocus: { control: false },
    onRetry: { control: false },
    onClearFilters: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 24 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DashboardScreen>;
export default meta;
type Story = StoryObj<typeof meta>;

const SOURCE = "Nasha Mukt Bharat Abhiyaan MIS";

const FUNDS_SPEC: KpiSpec = { id: "nmba-funds", name: "Funds Released", unit: "crore", definition: "Grants released to States/UTs under NMBA, by financial year.", span: 6 };
const FUNDS: KpiReading = {
  origin: "snapshot",
  source: SOURCE,
  asOn: "30.09.2026",
  value: {
    kind: "series",
    chart: "bar",
    labels: ["2023-24", "2024-25", "2025-26", "2026-27"],
    series: [{ name: "Released", data: [182, 214, 236, 250] }],
  },
};

const REACH_ROWS = [
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
];

/** The sections a real dashboard view is made of. */
function Sections() {
  return (
    <div style={{ display: "grid", gap: 32 }}>
      <HeadlineBand
        title="At a Glance, All India"
        lead={{ value: "34.81 crore", label: "People reached in Total Outreach", context: "Nasha Mukt Bharat Abhiyaan, as on 30.09.2026." }}
        figures={[
          { key: "volunteers", value: "1.12 lakh", label: "Master Volunteers", href: "#nmba" },
          { key: "calls", value: "10.33 lakh", label: "Helpline Calls", href: "#nmba" },
        ]}
      />
      <DashboardCardList
        aria-label="Dashboards"
        items={[
          {
            key: "nmba",
            content: (
              <DashboardCard
                tone="primary"
                mark={<OrgLogo org="nmba" size="md" name="" />}
                title="NMBA"
                subtitle="Nasha Mukt Bharat Abhiyaan"
                href="#nmba"
                linkLabel="View the NMBA Dashboard"
                figure={<HeadlineFigure size="md" value="34.81 crore" label="People reached" />}
              >
                <DescriptionList size="md" columns={2} items={[{ term: "Master Volunteers", value: "1.12 lakh" }, { term: "Districts Reached", value: "372" }]} />
              </DashboardCard>
            ),
          },
          {
            key: "smile",
            content: (
              <DashboardCard
                tone="info"
                mark={<OrgLogo org="smile" size="md" name="" />}
                title="SMILE – Beggary"
                subtitle="Comprehensive Rehabilitation of Persons Engaged in Begging"
                href="#smile"
                linkLabel="View the SMILE – Beggary Dashboard"
                figure={<HeadlineFigure size="md" value="19,810" label="Persons identified" />}
              />
            ),
          },
        ]}
      />
      <AreaBreakdown measures={[{ id: "reach", name: "Total Outreach", label: "Outreach", rows: REACH_ROWS }]} valueFormat={compactCount} />
      <KpiView kpi={FUNDS_SPEC} reading={FUNDS} areasAreStates={false} quiet span={12} />
    </div>
  );
}

const filters = (
  <>
    <FilterSelect label="State/UT" value="" onChange={() => undefined} options={[{ value: "", label: "All India" }, { value: "MH", label: "Maharashtra" }, { value: "KL", label: "Kerala" }]} />
    <FilterSelect label="Financial Year" value="2026-27" onChange={() => undefined} options={[{ value: "2026-27", label: "2026-27" }, { value: "2025-26", label: "2025-26" }]} />
  </>
);

/** Populated: the back link, the area bar with its filters, one area note and the view. */
export const Populated: Story = {
  args: {
    back: { href: "#dashboards", label: "All Dashboards" },
    area: "All India",
    areaLabel: "Figures for",
    filters,
    areaNote: "Choosing a State/UT changes NMBA's figures. SMILE – Beggary and the Department's figures are published for All India only.",
    viewKey: "?programme=nmba",
    count: 4,
    children: <Sections />,
  },
};

/** A page with a heading of its own above the bar: `notice` is for who the figures are drawn for, when that is not the public. */
export const WithNotice: Story = {
  args: {
    ...Populated.args,
    notice: <p style={{ margin: 0 }}>Officer view: figures include entries pending verification.</p>,
    area: "Maharashtra",
    children: <DashboardHeader title="NMBA" subtitle="Nasha Mukt Bharat Abhiyaan" summary="A campaign to create awareness on substance abuse and to treat and rehabilitate persons affected by it." meta="As on 30.09.2026" />,
  },
};

/** A view that moves focus on `viewKey` change, unless `shouldMoveFocus` says the reader is on a filter. */
export const KeepsFocusOnFilter: Story = {
  render: function Render(args) {
    const [key, setKey] = React.useState("?state=");
    return (
      <DashboardScreen
        {...args}
        area={key === "?state=" ? "All India" : "Kerala"}
        viewKey={key}
        shouldMoveFocus={() => false}
        filters={
          <FilterSelect
            label="State/UT"
            value={key === "?state=" ? "" : "KL"}
            onChange={(v) => setKey(v ? "?state=KL" : "?state=")}
            options={[{ value: "", label: "All India" }, { value: "KL", label: "Kerala" }]}
          />
        }
        count={1}
      >
        <HeadlineBand title="At a Glance" lead={{ value: "10.33 lakh", label: "Helpline Calls" }} />
      </DashboardScreen>
    );
  },
};

/** Loading: a skeleton in the shape of the result (`skeleton="cards"`), with the area bar already shown. */
export const Loading: Story = {
  args: { area: "All India", filters, loading: true, skeleton: "cards", children: null },
};

/** Error: one sentence and a retry. No status codes on a citizen's page. */
export const ErrorState: Story = {
  args: { area: "All India", filters, error: new Error("upstream timeout"), onRetry: () => undefined, children: null },
};

/** Empty: the register holds nothing for the dashboard. */
export const Empty: Story = {
  args: { area: "All India", filters, count: 0, children: null },
};

/** Filtered to nothing: worded differently from empty, and offers to clear the filters. */
export const FilteredToNothing: Story = {
  args: { area: "Goa", filters, count: 0, filtered: true, onClearFilters: () => undefined, children: null },
};

/** Not yet asked: `asked={false}` resolves to idle, not empty. */
export const NotYetAsked: Story = {
  args: { area: "All India", filters, asked: false, children: null },
};
