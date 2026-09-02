import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FilterSelect, type FilterSelectOption } from "@mosje/design-system";

/**
 * **FilterSelect** — the compact dashboard filter, as a real listbox. Lifecycle: **New**.
 *
 * **Prefer `Select` in a form.** `Select` is a native `<select>`, which is the
 * right answer for a field a citizen submits: every assistive technology and
 * every mobile keyboard already knows it. Reach for `FilterSelect` only in a
 * dashboard filter row, where the control is a QUERY rather than an answer.
 *
 * It exists because a native select cannot carry a hint beside an option, cannot
 * hold a dashboard's 40px filter height on every platform, and cannot be styled
 * at all on iOS — so four portals hand-rolled a button-plus-listbox instead, and
 * every accessibility fix shipped to this package for three months reached none
 * of them. `check:shadow-ui` counts those copies; this is what lets them go.
 *
 * **The keyboard model is the listbox pattern, not a menu and not a combobox.**
 * There is no text input, so focus moves to the LISTBOX and the active option is
 * named by `aria-activedescendant`. Moving DOM focus onto each option instead is
 * the common mistake: it works with a mouse and makes the list unreadable, because
 * a screen reader then announces a focus change rather than a selection.
 *
 * `placeholder` shows when `value` matches no option — the state a filter is in
 * before anyone has chosen, and the one that must not read as a chosen answer.
 * `id` is only worth passing when another element has to reference the control;
 * it falls back to a generated `useId()`, which is what makes two of these on one
 * dashboard safe.
 *
 * Down/Up move (wrapping), Home/End jump, Enter or Space selects, Escape closes
 * **and returns focus to the trigger**, Tab closes and moves on — a filter must
 * never trap — and typing letters jumps to a label, resetting after a second.
 */
const OPTIONS: FilterSelectOption[] = [
  { value: "all", label: "All districts", hint: "38" },
  { value: "patna", label: "Patna", hint: "1,204" },
  { value: "gaya", label: "Gaya", hint: "878" },
  { value: "nalanda", label: "Nalanda", hint: "651" },
  { value: "bhagalpur", label: "Bhagalpur", hint: "540" },
  { value: "araria", label: "Araria", hint: "—", disabled: true },
];

const meta = {
  title: "Forms/FilterSelect",
  component: FilterSelect,
  args: {
    label: "District",
    options: OPTIONS,
    value: "all",
    width: 240,
    // Required, so every story owes it. The stories that demonstrate the control
    // hold their own state and override this; it exists so a story that only
    // shows the resting appearance does not have to.
    onChange: () => {},
  },
  parameters: { layout: "centered" },
} satisfies Meta<typeof FilterSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Controlled, as it always is — the filter's value belongs to the page. */
export const Playground: Story = {
  render: function Render(args) {
    const [value, setValue] = React.useState(args.value);
    return <FilterSelect {...args} value={value} onChange={setValue} />;
  },
};

/**
 * `hint` carries the count beside each option — the number a reader is choosing
 * on. It is the thing a native `<select>` cannot render, and the reason these
 * were hand-rolled.
 */
export const WithCounts: Story = { ...Playground };

/**
 * A filter row, which is the only place this belongs. Note that each keeps its
 * own visible label: a row of unlabelled chips is a row of mysteries.
 */
export const InAFilterRow: Story = {
  render: function Render() {
    const [district, setDistrict] = React.useState("all");
    const [year, setYear] = React.useState("2026");
    return (
      <div style={{ display: "flex", gap: "var(--sa-inline-16)", flexWrap: "wrap" }}>
        <FilterSelect label="District" options={OPTIONS} value={district} onChange={setDistrict} width={200} />
        <FilterSelect
          label="Financial year"
          options={[
            { value: "2026", label: "2026–27" },
            { value: "2025", label: "2025–26" },
            { value: "2024", label: "2024–25" },
          ]}
          value={year}
          onChange={setYear}
          width={180}
        />
      </div>
    );
  },
};

/** A disabled option stays listed and is skipped by the keyboard, rather than vanishing. */
export const WithADisabledOption: Story = { ...Playground };

export const Disabled: Story = {
  args: { disabled: true },
  render: function Render(args) {
    const [value, setValue] = React.useState(args.value);
    return <FilterSelect {...args} value={value} onChange={setValue} />;
  },
};
