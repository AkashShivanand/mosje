import type { Meta, StoryObj } from "@storybook/react";
import { FormField, Select } from "@mosje/design-system";

const STATES = [
  { label: "Maharashtra", value: "MH" },
  { label: "Karnataka", value: "KA" },
  { label: "Tamil Nadu", value: "TN" },
  { label: "Uttar Pradesh", value: "UP" },
  { label: "Lakshadweep", value: "LD", disabled: true },
];

/**
 * **Select** — a native `<select>` with a SAMAVESH chevron.
 *
 * Native on purpose: it inherits the platform's keyboard behaviour, type-ahead
 * and screen-reader announcement, and on a phone it opens the OS picker. A
 * custom listbox would have to re-earn all of that.
 *
 * Use it when the applicant picks exactly one value from a known, closed list —
 * a state, a scheme, a category. Do **not** use it for a long searchable list
 * (a district out of 780) or for multiple selection; reach for `Search` plus
 * `Chip` filters there instead.
 *
 * `placeholder` renders as a disabled first option, so the field can start
 * genuinely empty rather than silently defaulting to whatever is first.
 *
 * Lifecycle: **Stable**.
 */
const meta = {
  title: "Components/Forms/Select",
  component: Select,
  args: {
    options: STATES,
    placeholder: "Select a state or union territory",
    invalid: false,
    disabled: false,
    "aria-label": "State or union territory",
  },
  argTypes: {
    invalid: { control: "boolean" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    placeholder: { control: "text" },
    defaultValue: { control: "text" },
    options: { control: "object" },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 420 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** A pre-selected value — note the placeholder is then never shown. */
export const WithValue: Story = {
  args: { defaultValue: "MH" },
};

export const States: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Select {...args} aria-label="Default" />
      <Select {...args} aria-label="Invalid" invalid />
      <Select {...args} aria-label="Disabled" disabled defaultValue="MH" />
    </div>
  ),
};

/**
 * `<option>` children work instead of `options` when the list needs grouping —
 * `<optgroup>` has no equivalent in the convenience prop.
 */
export const GroupedChildren: Story = {
  args: { options: undefined, placeholder: "Select a scheme" },
  render: (args) => (
    <Select {...args} aria-label="Scheme">
      <optgroup label="Scholarships">
        <option value="prematric">Pre-Matric Scholarship (SC)</option>
        <option value="postmatric">Post-Matric Scholarship (SC)</option>
      </optgroup>
      <optgroup label="Rehabilitation">
        <option value="smile">SMILE — Support for Marginalised Individuals</option>
        <option value="nmba">Nasha Mukt Bharat Abhiyaan</option>
      </optgroup>
    </Select>
  ),
};

/**
 * **`appearance="filter"`** — the same control, sized and weighted for a filter
 * bar rather than a form.
 *
 * The distinction is what the value *does*, not how it looks. In a form the
 * select holds an answer the applicant is submitting, so it carries the height
 * and the label treatment of every other field beside it. In a filter bar it
 * narrows a view that is already on screen, takes effect immediately, and sits
 * in a row of sibling controls — so it is more compact and reads as chrome.
 *
 * Use `"field"` (the default) inside a form. Reach for `"filter"` only where the
 * change is instant and reversible; a filter-weighted select in a form implies
 * the value is not part of what gets submitted.
 */
export const FilterAppearance: Story = {
  args: { appearance: "filter", options: STATES, placeholder: "All states" },
};

/**
 * **Status and size.** The `field` appearance runs the shared scale — `sm` 40, `md` 44, `lg` 48,
 * `xl` 56 — and carries the same three statuses as every other control. There is deliberately
 * no read-only select: HTML has none, and faking one with `disabled` would take the control out
 * of the tab order and out of the submitted form.
 */
export const StatusesAndSizes: Story = {
  render: () => {
    const options = [
      { value: "ts", label: "Telangana" },
      { value: "ka", label: "Karnataka" },
    ];
    return (
      <div style={{ display: "grid", gap: 16, maxWidth: 420 }}>
        <FormField label="Error" error="Select the State where you are applying">
          {(c) => <Select {...c} placeholder="Choose a State" options={options} />}
        </FormField>
        <FormField label="Success" success="Districts loaded for Telangana">
          {(c) => <Select {...c} status="success" defaultValue="ts" options={options} />}
        </FormField>
        <FormField label="Small">{(c) => <Select {...c} size="sm" options={options} />}</FormField>
        <FormField label="Extra large">{(c) => <Select {...c} size="xl" options={options} />}</FormField>
      </div>
    );
  },
};
