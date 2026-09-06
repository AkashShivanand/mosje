import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Button, Icon, IconButton, Menu } from "@mosje/design-system";

/**
 * **Menu** — the WAI-ARIA menu-button pattern. A trigger opens a list of
 * *commands*, focus moves onto the first one, and the arrow keys move between
 * them.
 *
 * Three components sit near this one and none of them is interchangeable with
 * it. A `Select` edits a field's value and submits with the form. A `Popover`
 * is a dialog holding arbitrary controls. A menu performs an action, and that
 * is why it carries its own roles and its own keyboard model. Reaching for the
 * wrong one is how a form ends up with a value a screen reader never announced.
 *
 * The keyboard model is the pattern in full: Down and Up move and wrap, Home
 * and End jump to the ends, typing jumps to the next matching label, Enter and
 * Space choose, Escape closes and returns focus to the trigger, and Tab closes
 * and lets focus carry on into the page.
 *
 * Every item carries **visible text**. A row menu is where the estate puts the
 * actions whose icons are not universal — Upload, Training, Volunteers — so an
 * icon-only item would reintroduce the discoverability problem the menu was
 * added to solve.
 *
 * A disabled item stays in the menu with `aria-disabled` and is skipped by the
 * arrow keys. It is never given the native `disabled` attribute, which would
 * drop it out of the accessibility tree entirely: a screen-reader user would
 * then not learn the action exists, which is worse than learning it is
 * unavailable.
 *
 * Lifecycle: **Stable**.
 */
const meta = {
  title: "Components/Actions/Menu",
  component: Menu,
  args: {
    // Storybook's own action logger stands in for the portal's handler.
    onSelect: () => {},
    label: "Actions for this application",
    side: "bottom",
    align: "end",
    sideOffset: 4,
    disabled: false,
    items: [
      { id: "view", label: "View application", icon: "visibility" },
      { id: "assign", label: "Assign to an officer", icon: "person_add" },
      { id: "download", label: "Download as PDF", icon: "download" },
      { kind: "separator" as const },
      {
        id: "return",
        label: "Return for correction",
        icon: "undo",
        tone: "warning" as const,
        description: "The applicant is told what to change and can resubmit.",
      },
      {
        id: "reject",
        label: "Reject application",
        icon: "block",
        tone: "danger" as const,
        description: "This cannot be undone.",
      },
    ],
    children: <Button appearance="outlined">Actions</Button>,
  },
  argTypes: {
    side: { control: "inline-radio", options: ["top", "bottom", "left", "right"] },
    align: { control: "inline-radio", options: ["start", "center", "end"] },
    sideOffset: { control: { type: "number", min: 0, max: 24 } },
    disabled: { control: "boolean" },
    label: { control: "text" },
    items: { control: false },
    children: { control: false },
    onSelect: { control: false },
    open: { control: false },
    onOpenChange: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 96, display: "flex", justifyContent: "center" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The default: a row's actions, with the two consequential ones toned and explained. */
export const Playground: Story = {};

/**
 * The shape this component was built for — the dense-table `⋮`. The icon-only
 * trigger carries an `aria-label`; every item inside it does not, because each
 * one has visible text.
 */
export const RowActions: Story = {
  args: {
    children: <IconButton aria-label="Actions for this row" icon={<Icon name="more_vert" />} />,
  },
};

/**
 * `radio` items with a group heading — the "sort by" case. The tick occupies its
 * slot whether or not it is on, so the labels do not shift as the selection
 * moves.
 */
export const SingleChoice: Story = {
  args: {},
  render: function SingleChoiceStory(args) {
    const [sort, setSort] = React.useState("recent");
    return (
      <Menu
        {...args}
        label="Sort applications"
        onSelect={setSort}
        items={[
          { kind: "separator", label: "Sort by" },
          { id: "recent", label: "Most recent first", kind: "radio", checked: sort === "recent" },
          { id: "oldest", label: "Oldest first", kind: "radio", checked: sort === "oldest" },
          { id: "district", label: "District, A to Z", kind: "radio", checked: sort === "district" },
        ]}
      >
        <Button appearance="outlined">Sort</Button>
      </Menu>
    );
  },
};

/**
 * A disabled item. It stays in the menu, is announced as unavailable, and the
 * arrow keys pass over it.
 */
export const WithDisabledItem: Story = {
  args: {
    items: [
      { id: "view", label: "View application", icon: "visibility" },
      {
        id: "approve",
        label: "Approve",
        icon: "check_circle",
        disabled: true,
        description: "Available once the district officer has verified the documents.",
      },
      { id: "download", label: "Download as PDF", icon: "download" },
    ],
  },
};
