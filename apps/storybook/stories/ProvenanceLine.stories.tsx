import type { Meta, StoryObj } from "@storybook/react";
import { ChartCard, MetricCard, ProvenanceLine, Sparkline } from "@mosje/design-system";

/**
 * **ProvenanceLine** — source · as of · status, as one muted line.
 *
 * A government figure without its source and date is unusable in a deck, so
 * provenance travels WITH the data (`DataProvenance`) rather than being typed
 * into a caption. `ChartCard` and `MetricCard` print it through their
 * `provenance` prop and drop it whenever the card has nothing to show — a
 * source line under "This could not be loaded" describes figures that are not
 * there.
 *
 * It is the one piece of self-description `ui-restraint-and-copy.md` permits
 * on a citizen's page. Feed diagnostics still belong in the audit doc.
 *
 * Lifecycle: **Beta**.
 *
 * @covers ProvenanceLine
 */
const meta = {
  title: "Components/Dashboard/ProvenanceLine",
  component: ProvenanceLine,
  args: {
    provenance: {
      source: "PM-AJAY MIS, Department of Social Justice and Empowerment",
      asOf: "2026-08-27",
      status: "provisional",
    },
  },
  argTypes: { provenance: { control: "object" } },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 560 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProvenanceLine>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Final figures carry no status word; provisional and revised ones do. */
export const Statuses: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 12 }}>
      <ProvenanceLine provenance={{ source: "NHAPOA MIS", asOf: "2026-08-31" }} />
      <ProvenanceLine provenance={{ source: "NHAPOA MIS", asOf: "2026-08-31", status: "provisional" }} />
      <ProvenanceLine provenance={{ source: "NHAPOA MIS", asOf: "2026-06-30", status: "revised", note: "Bihar restated" }} />
    </div>
  ),
};

/** Where it actually appears: under a card's body and under a metric tile. */
export const InsideACard: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 16, gridTemplateColumns: "2fr 1fr", width: 720 }}>
      <ChartCard title="Allocation, monthly" subtitle="FY 2025–26 · ₹ crore" provenance={args.provenance}>
        <Sparkline data={[7_800, 8_100, 8_400, 8_650, 8_900, 9_050, 9_250]} width={400} height={80} label="Allocation, monthly" />
      </ChartCard>
      <MetricCard label="Total allocation" value="₹9,250 Cr" provenance={args.provenance} />
    </div>
  ),
};
