import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { TimeSlot, type TimeSlotGroup } from "@mosje/design-system";

const GROUPS: TimeSlotGroup[] = [
  {
    label: "Morning",
    slots: [
      { id: "0930", label: "09:30 – 10:00", remaining: 4 },
      { id: "1000", label: "10:00 – 10:30", remaining: 1 },
      { id: "1030", label: "10:30 – 11:00", remaining: 0 },
      { id: "1100", label: "11:00 – 11:30", remaining: 6 },
      { id: "1130", label: "11:30 – 12:00", remaining: 2 },
    ],
  },
  {
    label: "Afternoon",
    slots: [
      { id: "1400", label: "14:00 – 14:30", remaining: 8 },
      { id: "1430", label: "14:30 – 15:00", remaining: 0 },
      { id: "1500", label: "15:00 – 15:30", remaining: 5 },
      {
        id: "1530",
        label: "15:30 – 16:00",
        disabled: true,
        unavailableReason: "Centre closed",
      },
    ],
  },
];

/**
 * **Time Slot** — a grid of bookable windows. The shape behind Garima Greh's
 * daily programme, SCW's events, and any appointment a citizen has to choose.
 *
 * **It is a radio group built from real radios.** Each slot is an
 * `<input type="radio">` visually replaced by its label, so the arrow keys move
 * between slots, only one can be chosen, the choice submits with the form, and
 * a screen reader announces "3 of 12" — none of which is written here. A grid of
 * buttons carrying a `selected` class has none of it.
 *
 * **A full slot stays on the page.** It renders as unavailable rather than
 * disappearing, because "10:30 is taken" and "there is no 10:30" are different
 * facts, and a citizen deciding when to travel needs the first one. The reason
 * sits inside the slot's own label, so it is part of the control's accessible
 * name.
 *
 * Unlike `Menu`, an unavailable slot takes the **native `disabled` attribute**
 * rather than `aria-disabled`. The two components reach opposite conclusions for
 * the same reason: a radio group selects on arrow, so an `aria-disabled` slot
 * would be chosen the moment the arrow key landed on it. `disabled` is what
 * makes the arrow keys step over it.
 *
 * Lifecycle: **Stable**.
 */
const meta = {
  title: "Components/Forms/Time Slot",
  component: TimeSlot,
  args: {
    groups: GROUPS,
    value: "1000",
    onChange: () => {},
    label: "Appointment time",
    description: "Choose a window. You may reschedule once, up to 24 hours before.",
  },
  argTypes: {
    label: { control: "text" },
    description: { control: "text" },
    groups: { control: false },
    value: { control: false },
    onChange: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 24, maxWidth: 620 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TimeSlot>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Two groups, one slot with a single place left, one full, one closed. */
export const Playground: Story = {
  render: function PlaygroundStory(args) {
    const [value, setValue] = React.useState<string | null>(args.value);
    return <TimeSlot {...args} value={value} onChange={setValue} />;
  },
};

/** Nothing chosen yet — how the grid looks when the citizen arrives. */
export const NothingChosen: Story = {
  args: { value: null },
  render: function NothingStory(args) {
    const [value, setValue] = React.useState<string | null>(null);
    return <TimeSlot {...args} value={value} onChange={setValue} />;
  },
};

/**
 * Capacity not tracked: omit `remaining` and a slot is simply available, with no
 * count under it. Use this where the centre does not publish places left —
 * inventing "6 left" would be a number with no source.
 */
export const WithoutCapacity: Story = {
  args: {
    value: null,
    description: undefined,
    groups: [
      {
        label: "Wednesday, 10 September",
        slots: [
          { id: "a", label: "10:00 – 11:00" },
          { id: "b", label: "11:00 – 12:00" },
          { id: "c", label: "12:00 – 13:00", disabled: true, unavailableReason: "Lunch" },
          { id: "d", label: "14:00 – 15:00" },
        ],
      },
    ],
  },
  render: function NoCapStory(args) {
    const [value, setValue] = React.useState<string | null>(null);
    return <TimeSlot {...args} value={value} onChange={setValue} />;
  },
};
