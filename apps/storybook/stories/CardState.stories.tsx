import type { Meta, StoryObj } from "@storybook/react";
import { CardState, CardSkeleton, ChartCard, DashboardGrid } from "@mosje/design-system";

/**
 * **CardState** — what a card shows when it has nothing to draw.
 *
 * **Six reasons, not two, and that is the whole point.** "No data to display"
 * is the sentence that fits every one of these and helps with none of them: a
 * filter that matched nothing, a feed that is down, and a figure the department
 * has not begun publishing each want a different next action, and only the
 * first is the reader's to take. Choosing the wrong one is not a cosmetic slip
 * — telling someone "nothing to show yet" about a figure that will never appear
 * under their current filters sends them looking for a control that does not
 * exist.
 *
 * **Drawn in the system's own grammar.** The illustrations are not stock icons
 * in a circle. Each is built from the marks the charts themselves draw — an
 * axis, a baseline, a series of bars, a ring — arranged to depict what has
 * happened, so a card whose chart is missing shows that chart's own skeleton
 * with the data taken out. Three things make the six read as one family: they
 * stand on the same axis, they split into the same two ink layers (a `ghost`
 * carrying the chart that would have been there and an `ink` carrying what
 * happened to it), and they sit on the same two-layer plate.
 *
 * **Three tones, not six.** Neutral where there is nothing to do, info where
 * the reader can change something, warning where something went wrong. A tone
 * per state would make the set a traffic light and leave people decoding colour
 * before reading words. Colour is never the only signal — each state carries
 * its own headline.
 *
 * **Reach for `ChartCard`'s `state` prop, not this directly.** The card also
 * suppresses its own footer and export control, which a card that cannot show
 * its data must do: a footer still reading "2023-24 is the largest year at
 * 7,343 approvals" over a body saying the figures did not arrive is a card
 * contradicting itself.
 *
 * `action` takes the ONE thing that would resolve the state. Omit it where
 * nothing the reader can do would help — a button that does nothing is worse
 * than no button.
 *
 * @covers CardState, CardSkeleton
 */
const meta: Meta<typeof CardState> = {
  title: "Dashboard/CardState",
  component: CardState,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof CardState>;

export const Playground: Story = {
  args: { kind: "empty" },
  argTypes: {
    kind: {
      control: "select",
      options: ["empty", "no-results", "not-published", "error", "restricted", "offline"],
    },
    compact: { control: "boolean" },
  },
};

/** All six, side by side — the family resemblance is the thing to judge here. */
export const EveryState: Story = {
  render: () => (
    <DashboardGrid>
      {(
        [
          ["empty", "No villages have been selected in this district yet."],
          ["no-results", "No state matches both filters. Try clearing the year."],
          ["not-published", "The department does not publish gender figures for this scheme yet."],
          ["error", "The approvals feed did not answer. Everything else on this page is unaffected."],
          ["restricted", "District-level figures are not part of the public release."],
          ["offline", "This card needs a connection. Nothing is wrong with the service."],
        ] as const
      ).map(([kind, description]) => (
        <ChartCard key={kind} span={4} title={kind} state={kind} emptyLabel={description} />
      ))}
    </DashboardGrid>
  ),
};

/**
 * An error is the one state that usually earns an action, because it is the one
 * a reader can sometimes clear. Give it the action that genuinely resolves what
 * is on screen, not a hopeful "Try again".
 */
export const WithAction: Story = {
  render: () => (
    <ChartCard
      span={6}
      title="Approvals by financial year"
      state="error"
      onRetry={() => {}}
      footer={<p>This footer is deliberately hidden while the card cannot show its data.</p>}
    />
  ),
};

/**
 * **CardSkeleton** — the loading placeholder, shaped like what is coming.
 *
 * A donut card that shimmers as a bar chart promises the wrong picture and then
 * replaces it, which is worse than a plain grey block because it was specific
 * and wrong. Every shape shimmers on one clock and staggers on one 90ms step,
 * so six loading cards read as a page arriving rather than six spinners.
 */
export const LoadingShapes: Story = {
  render: () => (
    <DashboardGrid>
      {(["bars", "line", "donut", "rows", "region", "figures"] as const).map((shape) => (
        <ChartCard key={shape} span={4} title={shape} loading skeleton={shape} />
      ))}
    </DashboardGrid>
  ),
};

/** Outside a card, the skeleton stands on its own. */
export const SkeletonAlone: Story = {
  render: () => <CardSkeleton shape="line" />,
};
