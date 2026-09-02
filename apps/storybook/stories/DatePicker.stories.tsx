import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { Combobox, DatePicker } from "@mosje/design-system";

/**
 * @covers DatePicker, Combobox
 *
 * **DatePicker's text input is the primary control, and that ordering is the
 * design.** A calendar-first picker asks a pensioner to page back four hundred
 * and eighty months to reach a date of birth; typing `14/08/1962` takes seconds.
 * The calendar is there for "next Tuesday", which is what it is good at.
 *
 * `<input type="date">` was rejected: its rendering, keyboard model and date
 * ORDER belong to the browser and the OS, so one government form would show
 * `mm/dd/yyyy` to one citizen and `dd/mm/yyyy` to the next. A form that cannot
 * state its own date order will collect wrong dates. `min` and `max` bound both
 * the typing and the grid; `required`, `disabled`, `hint` and `error` behave as
 * they do on every other field, and `id` and `className` are passed through.
 *
 * **Combobox is for a list longer than a person will scroll** — seven hundred
 * districts, every scheme, a beneficiary by name. Below roughly twenty options a
 * `Select` is better. It differs from `FilterSelect` in a way that is not
 * cosmetic: `FilterSelect` is a button that opens a listbox and moves focus into
 * it, while this is a real text input whose focus never leaves, with
 * `aria-activedescendant` pointing at the highlighted row. A screen reader
 * announces it as editable and reads the remaining match count after each
 * keystroke, which is the entire point of typing.
 *
 * It never silently accepts unmatched text: on blur a query matching nothing
 * reverts to the last chosen value, because a box reading "Bankuraa" over a form
 * value of "" is how a district goes missing between the screen and the
 * database. `noMatchLabel` words the filtered-to-nothing case, `placeholder` the
 * empty one.
 */
const meta = {
  title: "Forms/DatePicker",
  component: DatePicker,
  parameters: { layout: "padded" },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { label: "Date of Birth", value: "", onChange: () => {} },
  render: function Controlled(args) {
    const [v, setV] = React.useState("1962-08-14");
    return <DatePicker {...args} value={v} onChange={setV} hint="As printed on your Aadhaar." />;
  },
};

/** Bounded: an application window that closed, and one that has not opened. */
export const WithBounds: Story = {
  args: { label: "Date of Application", value: "", onChange: () => {} },
  render: function Bounded(args) {
    const [v, setV] = React.useState("2026-09-10");
    return (
      <DatePicker
        {...args}
        value={v}
        onChange={setV}
        min="2026-09-01"
        max="2026-09-30"
        hint="Applications are accepted through September 2026 only."
      />
    );
  },
};

export const Required: Story = {
  args: { label: "Date of Birth", value: "", onChange: () => {}, required: true },
};

export const WithError: Story = {
  args: {
    label: "Date of Birth",
    value: "",
    onChange: () => {},
    error: "Enter the date as dd/mm/yyyy.",
  },
};

export const Disabled: Story = {
  args: { label: "Date of Birth", value: "1962-08-14", onChange: () => {}, disabled: true },
};

const DISTRICTS = [
  { value: "ba", label: "Bankura", hint: "West Bengal" },
  { value: "bh", label: "Bhagalpur", hint: "Bihar" },
  { value: "na", label: "Nalanda", hint: "Bihar" },
  { value: "nd", label: "Nadia", hint: "West Bengal" },
  { value: "pu", label: "Purulia", hint: "West Bengal" },
  { value: "ra", label: "Ranchi", hint: "Jharkhand" },
  { value: "so", label: "Sonbhadra", hint: "Uttar Pradesh", disabled: true },
];

/** Type "na" and the list narrows to Nalanda and Nadia, and says so out loud. */
export const ComboboxPlayground: StoryObj = {
  render: function ComboboxStory() {
    const [v, setV] = React.useState("");
    return (
      <Combobox
        label="District"
        options={DISTRICTS}
        value={v}
        onChange={setV}
        hint="Type any part of the district or state name."
      />
    );
  },
};

/** The filtered-to-nothing state, which is not the same sentence as "empty". */
export const ComboboxNoMatch: StoryObj = {
  render: function ComboboxEmptyStory() {
    const [v, setV] = React.useState("");
    return (
      <Combobox
        label="District"
        options={DISTRICTS}
        value={v}
        onChange={setV}
        noMatchLabel="No district matches. Check the spelling, or clear the box to see all seven."
      />
    );
  },
};
