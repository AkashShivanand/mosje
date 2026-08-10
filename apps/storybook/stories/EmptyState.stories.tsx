import type { Meta, StoryObj } from "@storybook/react";
import { Button, EmptyState, Icon } from "@mosje/design-system";

/**
 * **EmptyState** — what a collection shows when it has nothing in it.
 *
 * The distinction that saves people writing the wrong one: **"nothing yet" and
 * "nothing matched" are different states.** A first-time officer with no
 * applications needs to be told what will appear here and given the action that
 * starts it. Someone who has filtered a list down to zero needs to be told
 * their filter is the reason, and given a way to clear it. Showing the first
 * message to the second person reads as a broken page.
 *
 * A third case is worth separating too: nothing to do because everything is
 * done. "No pending approvals" is good news and should not be dressed as a
 * shortfall.
 *
 * Never use it for a *failure*. A request that errored is not empty — say so
 * with an `Alert` and offer a retry, or the user will assume there is genuinely
 * no data.
 *
 * Keep `action` to one button. Two competing calls to action in an empty state
 * is how a user ends up doing neither.
 *
 * Lifecycle: **Stable**.
 */
const meta = {
  title: "Components/Feedback/EmptyState",
  component: EmptyState,
  args: {
    title: "No applications yet",
    description:
      "Applications forwarded by block officers will appear here for your review.",
    icon: <Icon name="inbox" size={40} aria-hidden />,
  },
  argTypes: {
    title: { control: "text" },
    description: { control: "text" },
    icon: { control: false },
    action: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 560 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Nothing yet — say what will appear, and offer the action that starts it. */
export const NothingYet: Story = {
  args: {
    title: "No beneficiaries added",
    description:
      "Add beneficiaries individually, or import them from a spreadsheet issued by the district office.",
    action: <Button>Add a beneficiary</Button>,
  },
};

/** Nothing matched — name the filter as the cause and offer to clear it. */
export const NoResults: Story = {
  args: {
    icon: <Icon name="search_off" size={40} aria-hidden />,
    title: "No applications match these filters",
    description:
      "No Pre-Matric applications from Nashik are pending approval in 2026–27. Widen the district or the status to see more.",
    action: <Button appearance="outlined">Clear all filters</Button>,
  },
};

/** Nothing to do because it is all done — good news, styled as such. */
export const AllCaughtUp: Story = {
  args: {
    icon: <Icon name="task_alt" size={40} aria-hidden />,
    title: "No pending approvals",
    description:
      "All 42 applications forwarded to you this week have been decided. New ones arrive as blocks submit them.",
  },
};

/** The minimum — a title alone is a legitimate empty state. */
export const TitleOnly: Story = {
  args: { icon: undefined, description: undefined, title: "No remarks recorded" },
};
