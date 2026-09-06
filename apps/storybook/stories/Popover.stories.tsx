import type { Meta, StoryObj } from "@storybook/react";
import { Button, Checkbox, Popover, Select } from "@mosje/design-system";

/**
 * **Popover** — a dismissible panel anchored to a trigger, holding content the
 * reader can interact with.
 *
 * The line between this and `Tooltip` is not stylistic, it is structural. A
 * tooltip describes its trigger, contains no controls, opens on hover, and is
 * announced through `aria-describedby`. A popover is a non-modal `dialog`: it
 * takes focus, holds controls, and opens on click. **Put a link or a button in
 * a tooltip and nobody can reach it** — hover-opened content cannot be tabbed
 * into. That is the reason this component exists.
 *
 * It is also not a `Modal`. A modal owns the screen and demands an answer
 * before anything else can happen; a popover leaves the page operable behind
 * it. Filters, row actions and field guidance are popovers. Confirming a
 * deletion is a modal.
 *
 * `side` and `align` are preferences. The panel flips when the preferred side
 * would leave the viewport and clamps on the cross axis, so it stays on screen
 * on a 320px phone without the caller doing anything.
 *
 * The keyboard model is the whole point. Escape closes and returns focus to
 * the trigger; Tab past the last control closes it and carries on into the page
 * — it is non-modal, so it must not trap; and `aria-expanded` on the trigger
 * reports the state without an announcement of its own.
 *
 * `title` renders a visible heading and becomes the panel's accessible name —
 * better than an invisible one, because the string a screen reader announces is
 * then the same string everyone else can see and the two cannot drift apart.
 * Give a title to any panel holding more than a sentence; use `label` on its
 * own for a short passage of guidance, where a heading would be longer than the
 * content. One of the two is always required.
 *
 * Lifecycle: **Stable**.
 */
const meta = {
  title: "Components/Feedback/Popover",
  component: Popover,
  args: {
    label: "Processing time",
    side: "bottom",
    align: "start",
    sideOffset: 8,
    disabled: false,
    matchTriggerWidth: false,
    content:
      "Applications are processed in the order they are received. The stated period counts working days and excludes gazetted holidays.",
    children: <Button appearance="outlined">Processing time</Button>,
  },
  argTypes: {
    side: { control: "inline-radio", options: ["top", "bottom", "left", "right"] },
    align: { control: "inline-radio", options: ["start", "center", "end"] },
    sideOffset: { control: { type: "number", min: 0, max: 24 } },
    disabled: { control: "boolean" },
    matchTriggerWidth: { control: "boolean" },
    label: { control: "text" },
    content: { control: false },
    children: { control: false },
    open: { control: false },
    defaultOpen: { control: false },
    onOpenChange: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 96, display: "flex", justifyContent: "center" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The default: a short passage of guidance that would not fit beside the control. */
export const Playground: Story = {};

/**
 * The case a tooltip cannot serve. Every control here is reachable by Tab
 * because the panel opened on click and took focus; the same markup inside a
 * tooltip would be unreachable.
 */
export const WithControls: Story = {
  args: {
    title: "Filter applications",
    label: undefined,
    children: <Button appearance="outlined">Filter</Button>,
    content: ({ close }) => (
      <div style={{ display: "grid", gap: 12 }}>
        <Select
          aria-label="Status"
          options={[
            { value: "all", label: "All statuses" },
            { value: "pending", label: "Pending verification" },
            { value: "approved", label: "Approved" },
            { value: "returned", label: "Returned for correction" },
          ]}
        />
        <Checkbox label="Only applications assigned to me" />
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <Button appearance="text" onClick={close}>
            Cancel
          </Button>
          <Button onClick={close}>Apply</Button>
        </div>
      </div>
    ),
  },
};

/**
 * Anchored to a field and matched to its width. Use this for a picker that
 * belongs to one control; leave `matchTriggerWidth` off for a panel of
 * arbitrary content, which should size to what it holds.
 */
export const MatchedToTrigger: Story = {
  args: {
    label: "Recent searches",
    matchTriggerWidth: true,
    children: (
      <Button appearance="outlined" style={{ width: 320 }}>
        Search the beneficiary register
      </Button>
    ),
    content: (
      <div style={{ display: "grid", gap: 8 }}>
        <div>Application MOSJE/2026/004821</div>
        <div>Bankura district — Adarsh Gram</div>
        <div>Shelter home, Guwahati</div>
      </div>
    ),
  },
};

/**
 * Each side, so the flip can be seen. Drag the Storybook viewport narrow and
 * the panel moves to the side that fits rather than leaving the screen.
 */
export const Sides: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
      {(["top", "bottom", "left", "right"] as const).map((side) => (
        <Popover
          {...args}
          key={side}
          side={side}
          label={`Guidance, ${side}`}
          content={`Preferred side: ${side}. It flips when there is no room.`}
        >
          <Button appearance="outlined">{side}</Button>
        </Popover>
      ))}
    </div>
  ),
};

/** Disabled: the trigger stays on the page and stays focusable; nothing opens. */
export const Disabled: Story = {
  args: { disabled: true },
};
