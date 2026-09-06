import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { TimePicker } from "@mosje/design-system";

/**
 * **Time Picker** — a typed 24-hour field, with a list of times as the second
 * way in.
 *
 * `<input type="time">` was the obvious alternative and is rejected for the same
 * reason `DatePicker` rejects `<input type="date">`: its rendering, and
 * critically its 12-hour-versus-24-hour display, belong to the browser and the
 * operating system. The same government form would show "2:00 PM" to one citizen
 * and "14:00" to the next with no way to correct it — and every published
 * departmental schedule on this estate is written in 24-hour form. A form that
 * cannot state its own time format will collect wrong times.
 *
 * So the field is canonical: the value is always `HH:MM`, the format is stated
 * in the hint, and every unambiguous form commits as `09:05` on blur — `9:05`,
 * `09.05`, `0905`. A citizen is not punished for punctuation.
 *
 * `9:5` is refused rather than guessed: it could be 09:05 or 09:50, and a form
 * that quietly picks one records the wrong time without telling anybody.
 *
 * **Focus never leaves the field.** The list is a shortcut, not a replacement,
 * so the arrows move an `aria-activedescendant` marker while the input keeps
 * focus and typing keeps working. Enter chooses; Space deliberately does not,
 * because it is a printable character in a field someone is typing into.
 *
 * Where the times on offer are a fixed, bookable set rather than any time of
 * day, reach for **Time Slot** instead — it shows capacity and is a radio group.
 *
 * `id` is rarely needed: the component generates stable ids for the input, the
 * hint, the error and the list, and wires them together itself. Pass one only
 * when something outside has to point at the field — a summary of errors at the
 * top of a long form linking down to it, for instance.
 *
 * Lifecycle: **Stable**.
 */
const meta = {
  title: "Components/Forms/Time Picker",
  component: TimePicker,
  args: {
    label: "Appointment time",
    value: "14:30",
    onChange: () => {},
    hint: "24-hour clock, as hh:mm — for example 14:30.",
    step: 30,
    required: false,
    disabled: false,
  },
  argTypes: {
    label: { control: "text" },
    hint: { control: "text" },
    error: { control: "text" },
    step: { control: { type: "number", min: 5, max: 120, step: 5 } },
    min: { control: "text" },
    max: { control: "text" },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
    invalid: { control: "boolean" },
    value: { control: false },
    onChange: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 24, maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Type into it, or press Down to open the list. */
export const Playground: Story = {
  render: function PlaygroundStory(args) {
    const [value, setValue] = React.useState(args.value);
    return <TimePicker {...args} value={value} onChange={setValue} />;
  },
};

/**
 * Bounded to office hours at fifteen-minute steps. The bounds govern the list;
 * the field still accepts any minute, because a citizen reporting when something
 * happened is not choosing from an offer.
 */
export const OfficeHours: Story = {
  args: { min: "09:30", max: "17:30", step: 15, value: "", hint: "Between 09:30 and 17:30." },
  render: function OfficeStory(args) {
    const [value, setValue] = React.useState("");
    return <TimePicker {...args} value={value} onChange={setValue} />;
  },
};

/** With an error. The message is announced, and the field is marked invalid. */
export const WithAnError: Story = {
  args: {
    value: "",
    required: true,
    error: "Enter a time in 24-hour form, for example 14:30.",
  },
};

/** Disabled. It stays readable and stays in the page's outline. */
export const Disabled: Story = {
  args: { disabled: true },
};
