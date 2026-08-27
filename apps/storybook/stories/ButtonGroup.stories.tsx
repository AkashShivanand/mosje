import type { Meta, StoryObj } from "@storybook/react";
import { Button, ButtonGroup, IconButton, Icon } from "@mosje/design-system";

/**
 * **ButtonGroup** — related actions kept together *and kept apart*. Lifecycle: **Stable**.
 *
 * **The spacing is the load-bearing half, and it is the one that gets forgotten.**
 * UX4G 3.0 asks for 8px between adjacent targets, and WCAG 2.2 §2.5.8 lets a target
 * smaller than 24×24 be met by SPACING instead. A row of adjacent `sm` buttons with no
 * gap is exactly the case that fails — and a group is exactly where adjacency happens.
 * Reaching for a bare flex `div` is what produces those rows.
 *
 * It also gives the row a `role="group"` and a required name, so a screen reader
 * announces "Record actions, group" rather than reading four loose buttons.
 */
const meta = {
  title: "Components/ButtonGroup",
  component: ButtonGroup,
  args: { "aria-label": "Record actions", align: "start", vertical: false, attached: false },
  argTypes: {
    align: { control: "inline-radio", options: ["start", "end", "between"] },
    vertical: { control: "boolean" },
    attached: { control: "boolean" },
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="primary" appearance="filled">Save</Button>
      <Button variant="neutral" appearance="outlined">Cancel</Button>
    </ButtonGroup>
  ),
};

/** The usual dialog footer: the group pushed to the end of its container. */
export const DialogFooter: Story = {
  render: (args) => (
    <div style={{ border: "1px solid var(--sa-border-neutral-subtle)", borderRadius: 12, padding: 16 }}>
      <ButtonGroup {...args} align="end" aria-label="Dialog actions">
        <Button variant="neutral" appearance="text">Cancel</Button>
        <Button variant="primary" appearance="filled">Submit application</Button>
      </ButtonGroup>
    </div>
  ),
};

/**
 * `attached` joins the buttons into ONE segmented control — no gap, collapsed seams,
 * rounded only at the two outer ends.
 *
 * Use it only when the buttons are ALTERNATIVES to one another, like this view switcher.
 * Never for unrelated actions: attaching Save to Delete tells the reader they are the
 * same kind of thing, and puts the destructive one a pixel from the safe one.
 */
export const Attached: Story = {
  render: (args) => (
    <ButtonGroup {...args} attached aria-label="View">
      <Button variant="neutral" appearance="outlined">Day</Button>
      <Button variant="neutral" appearance="outlined">Week</Button>
      <Button variant="neutral" appearance="outlined">Month</Button>
    </ButtonGroup>
  ),
};

/** A toolbar of icon-only controls — the case §2.5.8's spacing rule exists for. */
export const IconToolbar: Story = {
  render: (args) => (
    <ButtonGroup {...args} aria-label="Table actions">
      <IconButton variant="neutral" appearance="outlined" size="sm" icon={<Icon name="edit" size={16} />} aria-label="Edit record" />
      <IconButton variant="neutral" appearance="outlined" size="sm" icon={<Icon name="content_copy" size={16} />} aria-label="Duplicate record" />
      <IconButton variant="danger" appearance="outlined" size="sm" icon={<Icon name="delete" size={16} />} aria-label="Delete record" />
    </ButtonGroup>
  ),
};

/** Stacked, for a narrow column or a card footer on a phone. */
export const Vertical: Story = {
  render: (args) => (
    <div style={{ width: 220 }}>
      <ButtonGroup {...args} vertical aria-label="Scheme actions">
        <Button variant="primary" appearance="filled">Apply now</Button>
        <Button variant="neutral" appearance="outlined">Check eligibility</Button>
        <Button variant="neutral" appearance="text">Download guidelines</Button>
      </ButtonGroup>
    </div>
  ),
};
