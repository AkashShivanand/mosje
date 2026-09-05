import type { Meta, StoryObj } from "@storybook/react";
import { Icon, MetricCard, Sparkline } from "@mosje/design-system";

/**
 * **MetricCard** — one number that matters, with its trend.
 *
 * `value` is a **pre-formatted string**, deliberately. Indian digit grouping is
 * not what `toLocaleString` gives you by default (22,75,906 — lakh and crore,
 * not thousands), and the component has no business guessing your locale or
 * your unit. Format it, then pass it. `formatIndian` from the charts module
 * does the grouping if you need it.
 *
 * `value` is OPTIONAL, and that is the point of `loading` and `state`. A KPI
 * tile is the most-read element on a government dashboard and the one most
 * likely to be fetched, so "still loading" and "could not be loaded" have to be
 * expressible — without them the card could only ever show a finished number,
 * and a failed request rendered as `aria-label="Total beneficiaries: —"`.
 * `loading` draws the skeleton; `state` takes a `CardStateKind` and borrows
 * `CardState`'s own wording, so a tile and the chart beside it describe one
 * failed request with one sentence. Both suppress the trend indicator, because
 * a change against a figure you do not have is not a change.
 *
 * On the trend: `changeDirection` is the *arrow*, not the judgement. Down is not
 * automatically bad — a falling number of pending grievances is the goal. Say
 * what it means in `changeLabel` ("vs last month"), because the arrow alone
 * invites the reader to assume.
 *
 * Direction is never conveyed by colour or arrow alone: each carries
 * visually-hidden text ("Increase" / "Decrease" / "No change") for WCAG 1.4.1.
 *
 * Use it for a headline figure. Four of them across the top of a dashboard is
 * `KpiRow`, which lays these out; a metric that needs a shape rather than a
 * number is a chart.
 *
 * Lifecycle: **Stable**.
 */
const meta = {
  title: "Components/Data display/MetricCard",
  component: MetricCard,
  args: {
    label: "Beneficiaries verified",
    value: "22,75,906",
    changeValue: "12%",
    changeLabel: "vs last month",
    changeDirection: "up",
    size: "md",
    icon: <Icon name="groups" size={20} aria-hidden />,
  },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md"] },
    changeDirection: { control: "inline-radio", options: ["up", "down", "flat"] },
    label: { control: "text" },
    value: { control: "text" },
    changeValue: { control: "text" },
    changeLabel: { control: "text" },
    icon: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MetricCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/**
 * All three directions. Note the middle one: a fall in pending grievances is
 * good news, which is why the arrow is not the judgement — the label is.
 */
export const Trends: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(3, minmax(0, 1fr))", width: 900 }}>
      <MetricCard
        {...args}
        label="Beneficiaries verified"
        value="22,75,906"
        changeValue="12%"
        changeLabel="vs last month"
        changeDirection="up"
        icon={<Icon name="groups" size={20} aria-hidden />}
      />
      <MetricCard
        {...args}
        label="Grievances pending"
        value="1,284"
        changeValue="18%"
        changeLabel="vs last month — fewer is better"
        changeDirection="down"
        icon={<Icon name="support_agent" size={20} aria-hidden />}
      />
      <MetricCard
        {...args}
        label="Districts reporting"
        value="36 of 36"
        changeValue="0"
        changeLabel="unchanged this quarter"
        changeDirection="flat"
        icon={<Icon name="map" size={20} aria-hidden />}
      />
    </div>
  ),
};

/** `sm` for a dense dashboard, `md` for a page header. */
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 16, width: 640 }}>
      <MetricCard {...args} size="sm" label="Small — dense dashboard" />
      <MetricCard {...args} size="md" label="Medium — page header" />
    </div>
  ),
};

/** Without a change, when there is no comparable previous period. */
export const ValueOnly: Story = {
  args: {
    label: "Funds released this financial year",
    value: "₹1,842.60 crore",
    changeValue: undefined,
    changeLabel: undefined,
    changeDirection: "flat",
    icon: <Icon name="payments" size={20} aria-hidden />,
  },
};

/**
 * Without `changeValue` the change renders as plain inline text rather than a
 * tinted pill — the older treatment, still used where a pill would crowd.
 */
export const InlineChangeText: Story = {
  args: {
    label: "Treatment centres onboarded",
    value: "1,097",
    changeValue: undefined,
    changeLabel: "+34 since April",
    changeDirection: "up",
    icon: <Icon name="local_hospital" size={20} aria-hidden />,
  },
};

/** No icon — legitimate when the label already carries the meaning. */
export const WithoutIcon: Story = {
  args: { icon: undefined },
};

/**
 * The figure against its target. `progress` draws the bar, the tick and the
 * scale row; the reader's question is how far there is to go, and a second
 * number would not answer it.
 */
export const AgainstATarget: Story = {
  args: {
    label: "Utilisation of release",
    value: "79.0%",
    changeValue: "1.6 pts",
    changeDirection: "down",
    changeLabel: "utilised ÷ released",
    icon: undefined,
    progress: { value: 79, max: 100, target: 85, targetLabel: "Target 85%" },
  },
};

/**
 * A status chip carries the WORDS; `tone` carries the colour. The chip is what
 * lets the tint be a tint — a red figure with no words is a claim the reader
 * has to guess at.
 */
export const WithStatus: Story = {
  args: {
    label: "Hotspots covered",
    value: "10.2%",
    detail: "90 of 883 surveyed",
    status: { label: "Below target", tone: "danger" },
    changeValue: undefined,
    changeLabel: undefined,
    icon: undefined,
    progress: { value: 90, max: 883, target: 883 },
  },
};

/** The queue's "due soon" and "overdue" tiles: a tone is set only against a stated rule. */
export const Toned: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(2, minmax(0, 1fr))", width: 640 }}>
      <MetricCard {...args} icon={undefined} label="Due soon" value="24" tone="warning" changeValue="5.4%" changeDirection="up" changeLabel="vs last month" />
      <MetricCard {...args} icon={undefined} label="Overdue applications" value="54" tone="danger" changeValue="14.5%" changeDirection="up" changeLabel="vs last month" />
    </div>
  ),
};

/** Where the figure came from, as one muted line. Dropped with the change indicator when there is no figure. */
export const WithProvenance: Story = {
  args: {
    label: "Resolved cases",
    value: "31,200",
    detail: "75% resolution rate",
    changeValue: undefined,
    changeLabel: undefined,
    icon: undefined,
    provenance: { source: "NHAPOA MIS", asOf: "2026-08-31", status: "provisional" },
  },
};

/**
 * The figure WITH ITS TREND: a `Sparkline` in `aside`. It is decorative there —
 * no label, no axis — because the figure and its change carry the meaning; the
 * shape only says which way it has been going.
 */
export const WithTrend: Story = {
  args: {
    label: "Total allocation",
    value: "₹9,250 Cr",
    changeValue: "4.2%",
    changeDirection: "up",
    changeLabel: "FY budget",
    icon: undefined,
    aside: <Sparkline data={[7_800, 8_100, 8_400, 8_650, 8_900, 9_050, 9_250]} width={72} height={24} />,
  },
};
