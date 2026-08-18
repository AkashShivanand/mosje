import type { Meta, StoryObj } from "@storybook/react";
import { Button, Icon, Tooltip } from "@mosje/design-system";

/**
 * **Tooltip** — a short hint attached to a control.
 *
 * The rule that decides whether you may use one: **the interface must still
 * work if the tooltip never appears.** It is supplementary. Anything the user
 * needs in order to complete the field belongs in a `FormField` hint, where it
 * is always visible, readable on a phone, and printable.
 *
 * The trigger must be a single element that can hold a ref and take focus — a
 * `<button>`, an `<a>`, or a DS component that forwards its ref. A tooltip on
 * plain text opens on hover only, which makes it unreachable by keyboard and
 * invisible on touch, and touch is how most citizens reach these portals.
 *
 * `side` is a preference, not a guarantee: it flips automatically when there is
 * no room. Opening is delayed on hover so a cursor crossing a toolbar does not
 * strobe; focus always opens instantly, because a keyboard user asked
 * deliberately.
 *
 * `duplicatesTriggerName` is for one narrow case: the bubble repeats the
 * trigger's OWN accessible name, as when CSS has clipped a label a screen
 * reader can still read in full. It drops `aria-describedby` and hides the
 * bubble from assistive technology, because without it the name is announced
 * TWICE — "Application details, tab, Application details" — which is worse than
 * the visual problem the tooltip was added to solve. Leave it OFF for any
 * tooltip that adds information; `Tabs` is currently the only caller.
 *
 * Lifecycle: **Stable**.
 */
const meta = {
  title: "Components/Feedback/Tooltip",
  component: Tooltip,
  args: {
    content: "Counted in working days, excluding gazetted holidays.",
    side: "top",
    sideOffset: 6,
    delay: 200,
    disabled: false,
    duplicatesTriggerName: false,
    children: <Button appearance="outlined">Processing time</Button>,
  },
  argTypes: {
    side: { control: "inline-radio", options: ["top", "bottom", "left", "right"] },
    sideOffset: { control: { type: "number", min: 0, max: 24 } },
    delay: { control: { type: "number", min: 0, max: 1000, step: 50 } },
    disabled: { control: "boolean" },
    duplicatesTriggerName: { control: "boolean" },
    content: { control: "text" },
    children: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 64, display: "flex", justifyContent: "center" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Hover or tab to the button. */
export const Playground: Story = {};

/** All four sides. Each flips to its opposite when the viewport is tight. */
export const Sides: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      {(["top", "bottom", "left", "right"] as const).map((side) => (
        <Tooltip {...args} key={side} side={side} content={`Anchored ${side}`}>
          <Button appearance="outlined">{side}</Button>
        </Tooltip>
      ))}
    </div>
  ),
};

/**
 * The commonest legitimate use: an icon-only control whose meaning is not
 * obvious. Note the button still has its own `aria-label` — the tooltip is not
 * an accessible name.
 */
export const OnAnIconButton: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 12 }}>
      <Tooltip {...args} content="Export the district roll-up as a spreadsheet">
        <Button appearance="outlined" aria-label="Export as spreadsheet">
          <Icon name="download" size={20} aria-hidden />
        </Button>
      </Tooltip>
      <Tooltip {...args} content="Recalculate from the latest district submissions">
        <Button appearance="outlined" aria-label="Refresh figures">
          <Icon name="refresh" size={20} aria-hidden />
        </Button>
      </Tooltip>
    </div>
  ),
};

/** No delay — for a dense toolbar where the user is already scanning. */
export const NoDelay: Story = {
  args: { delay: 0, content: "Opens immediately on hover" },
};

/** Disabled without unmounting the trigger — the button still works. */
export const Disabled: Story = {
  args: { disabled: true, children: <Button appearance="outlined">No tooltip</Button> },
};

/**
 * **The truncated-label case.** The bubble repeats the trigger's own name, so it
 * is hidden from assistive technology and carries no `aria-describedby` — the
 * full string is already the button's accessible name, and announcing it a
 * second time is a regression, not a rescue.
 *
 * Inspect the trigger while it is open: no `aria-describedby`, and the bubble is
 * `aria-hidden`. Compare with any story above, where the bubble is a real
 * `role="tooltip"` because it adds something the trigger does not say.
 */
export const DuplicatesTriggerName: Story = {
  args: {
    duplicatesTriggerName: true,
    content: "Application details",
    children: (
      <Button appearance="outlined" style={{ maxWidth: 140 }}>
        <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis" }}>
          Application details
        </span>
      </Button>
    ),
  },
};
