import type { Meta, StoryObj } from "@storybook/react";
import { Icon, MetricCard } from "@mosje/design-system";

/**
 * **MetricCard** — one number that matters, with its trend.
 *
 * `value` is a **pre-formatted string**, deliberately. Indian digit grouping is
 * not what `toLocaleString` gives you by default (22,75,906 — lakh and crore,
 * not thousands), and the component has no business guessing your locale or
 * your unit. Format it, then pass it. `formatIndian` from the charts module
 * does the grouping if you need it.
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
