import type { Meta, StoryObj } from "@storybook/react";
import { FunnelChart, formatIndian } from "@mosje/design-system";

/**
 * **FunnelChart** — how many survive each stage of a workflow.
 *
 * The requirement is stricter than it looks: the stages must be **sequential
 * and nested**, each one a subset of the one above. Proposal → scrutinised →
 * sanctioned → released is a funnel. Applications split by district is not —
 * those are peers, and a funnel would invent an order between them. That is a
 * `BarChart`.
 *
 * It follows that the values should never rise. If stage 3 exceeds stage 2 the
 * bar simply overflows its own scale, because the chart is telling you the data
 * is not a funnel.
 *
 * Each bar is sized as a share of the **first** stage, and the trailing figure
 * is the conversion from that first stage — so the reader sees the cumulative
 * drop-off, which is the question a funnel is asked. For the step-to-step drop,
 * put it in the label.
 *
 * Lifecycle: **Stable**.
 */
const meta = {
  title: "Components/Charts/FunnelChart",
  component: FunnelChart,
  args: {
    title: "PM-AJAY proposals · Adarsh Gram component, FY 2026–27",
    stages: [
      { label: "Proposals received", value: 4_820 },
      { label: "Scrutinised by district", value: 3_940 },
      { label: "Recommended by state", value: 2_610 },
      { label: "Sanctioned by ministry", value: 1_842 },
      { label: "First instalment released", value: 1_486 },
    ],
  },
  argTypes: {
    title: { control: "text" },
    stages: { control: "object" },
    valueFormat: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 720 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FunnelChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** A short funnel — three stages is enough when the drop-off is the story. */
export const ThreeStages: Story = {
  args: {
    title: "Scholarship applications · Pre-Matric (SC), 2026–27",
    stages: [
      { label: "Applications submitted", value: 128_400 },
      { label: "Verified by district", value: 96_180 },
      { label: "Disbursed", value: 88_620 },
    ],
  },
};

/** A steep drop, which is what the chart exists to make visible. */
export const SteepDropOff: Story = {
  args: {
    title: "Grievances · escalation to the state nodal officer",
    stages: [
      { label: "Grievances logged", value: 12_840 },
      { label: "Acknowledged within SLA", value: 11_260 },
      { label: "Escalated to district", value: 3_180 },
      { label: "Escalated to state", value: 412 },
      { label: "Referred to the ministry", value: 38 },
    ],
  },
};

/** Compact formatting, for a dashboard tile where the exact digits do not fit. */
export const CompactValues: Story = {
  args: { valueFormat: (v: number) => formatIndian(Math.round(v / 1_000)) + "k" },
};

/** Nothing to plot — it says so rather than drawing an empty frame. */
export const NoData: Story = {
  args: { stages: [], title: "PM-AJAY proposals" },
};
