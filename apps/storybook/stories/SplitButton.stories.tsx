import type { Meta, StoryObj } from "@storybook/react";
import { SplitButton } from "@mosje/design-system";

/**
 * **Split Button** — one default action, with its alternatives one press away.
 * "Approve", beside a trigger offering "Approve with remarks" and "Approve and
 * notify the applicant".
 *
 * **It is two buttons, not one.** The default action is a real button that
 * activates on Enter and Space; the trigger beside it is a separate control with
 * its own accessible name and its own `aria-expanded`. Merging them into a
 * single control that behaves differently depending on which half was hit is how
 * this pattern is usually built, and it is unusable from a keyboard.
 *
 * It composes `ButtonGroup attached` rather than drawing its own seam, so the
 * join, the collapsed inner corners and the group's role and name are the ones
 * the estate already publishes — and this component cannot drift from them.
 *
 * **Reach for it only when there IS a default.** Where the alternatives are
 * equally likely, a split button quietly makes one of them the path of least
 * resistance, and on an approval screen that is a thumb on the scale. Use
 * `Menu` when no option is the obvious one, and `ButtonGroup` when there are two
 * or three and all of them should be visible.
 *
 * Lifecycle: **Stable**.
 */
const meta = {
  title: "Components/Actions/Split Button",
  component: SplitButton,
  args: {
    children: "Approve",
    label: "Approve this application",
    onClick: () => {},
    onSelect: () => {},
    variant: "primary",
    size: "md",
    disabled: false,
    items: [
      { id: "remarks", label: "Approve with remarks", icon: "edit_note",
        description: "The applicant sees your note alongside the decision." },
      { id: "notify", label: "Approve and notify the applicant", icon: "mail" },
      { kind: "separator" as const },
      { id: "delegate", label: "Delegate to another officer", icon: "person_add" },
    ],
  },
  argTypes: {
    variant: { control: "inline-radio", options: ["primary", "success", "danger", "neutral"] },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    disabled: { control: "boolean" },
    label: { control: "text" },
    children: { control: "text" },
    items: { control: false },
    onClick: { control: false },
    onSelect: { control: false },
  },
  decorators: [(Story) => <div style={{ padding: 64 }}><Story /></div>],
} satisfies Meta<typeof SplitButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The default: approve, or open the alternatives. */
export const Playground: Story = {};

/**
 * A destructive default. Use this only where rejecting really is the expected
 * outcome of the screen — otherwise the danger variant on the wide half makes
 * the wrong thing the easy thing.
 */
export const Destructive: Story = {
  args: {
    children: "Reject",
    label: "Reject this application",
    variant: "danger",
    items: [
      { id: "reasons", label: "Reject with reasons", icon: "edit_note" },
      { id: "return", label: "Return for correction instead", icon: "undo", tone: "warning" as const,
        description: "The applicant can amend and resubmit." },
    ],
  },
};

/** Disabled. Both halves go together — a live menu beside a dead action is a trap. */
export const Disabled: Story = { args: { disabled: true } };
