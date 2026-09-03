import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { CheckboxGroup, RadioGroup, type RadioGroupProps } from "@mosje/design-system";

/**
 * @covers RadioGroup, CheckboxGroup
 *
 * The grouped form of the selection controls — and the reason they exist is a
 * single sentence: **`Radio` and `Checkbox` label themselves, but neither can
 * label the QUESTION.**
 *
 * A screen-reader user tabbing into four bare radios hears "Scheduled Caste,
 * radio button, 1 of 4" and never hears "Category of the Applicant" — the one
 * piece of information that makes the four options mean anything. `<fieldset>`
 * + `<legend>` is the only construct in HTML that supplies it, which is what
 * WCAG 1.3.1 and 3.3.2 ask for on a grouped control.
 *
 * **Use `RadioGroup`** when exactly one answer is allowed, **`CheckboxGroup`**
 * when any number is (including none), and a lone **`Checkbox`** for a single
 * declaration that has no siblings.
 *
 * `legend` is REQUIRED, not optional. If a nearby heading already asks the
 * question, pass the legend anyway and hide it with `sa-sr-only` — a
 * visually-hidden legend is still a legend. Omitting it is the defect this
 * component was built to stop.
 *
 * `orientation="horizontal"` wraps rather than scrolling, and `variant="card"`
 * renders each option as a selectable card with an optional `description`.
 * `hint` and `error` are linked through `aria-describedby`; the error is
 * announced after the options, because a message announced before the controls
 * describes a failure the reader has not reached yet.
 *
 * `id` is generated when omitted and is worth passing only when something
 * outside the group has to point at it — an `ErrorSummary` entry whose
 * `fieldId` must resolve to this group, say. Every option's own id is derived
 * from it, so setting it makes the whole group's ids predictable.
 *
 * **`invalid`** is a legacy alias that sets the error state without a message. It exists only
 * so that spreading `FormField`'s render-prop object onto this component degrades instead of
 * breaking — `FormField` hands over `invalid`, this component asks for `error`. Prefer `error`:
 * a field marked wrong with nothing said about it tells the reader only that they are stuck.
 */
const meta = {
  title: "Forms/ControlGroup",
  component: RadioGroup,
  parameters: { layout: "padded" },
} satisfies Meta<RadioGroupProps>;

export default meta;
type Story = StoryObj<RadioGroupProps>;

const CATEGORIES = [
  { value: "sc", label: "Scheduled Caste" },
  { value: "st", label: "Scheduled Tribe" },
  { value: "obc", label: "Other Backward Class" },
  { value: "gen", label: "General" },
];

export const Radios: Story = {
  args: { legend: "Category of the Applicant", name: "category", options: CATEGORIES, value: "sc", onChange: () => {} },
  render: function RadiosStory(args) {
    const [v, setV] = React.useState("sc");
    return <RadioGroup {...args} value={v} onChange={setV} />;
  },
};

export const WithHintAndError: Story = {
  args: { legend: "Category of the Applicant", name: "cat2", options: CATEGORIES, value: "", onChange: () => {} },
  render: function ErrStory(args) {
    const [v, setV] = React.useState("");
    return (
      <RadioGroup
        {...args}
        required
        value={v}
        onChange={setV}
        hint="As recorded on the caste certificate issued by the competent authority."
        error={v ? undefined : "Select the applicant's category"}
      />
    );
  },
};

/** Cards carry a second line, for options that need explaining. */
export const AsCards: Story = {
  args: { legend: "How Should the Grant Be Released?", name: "mode", options: [], value: "", onChange: () => {} },
  render: function CardStory(args) {
    const [v, setV] = React.useState("dbt");
    return (
      <RadioGroup
        {...args}
        variant="card"
        value={v}
        onChange={setV}
        options={[
          { value: "dbt", label: "Direct Benefit Transfer", description: "Credited to the Aadhaar-seeded bank account on record." },
          { value: "cheque", label: "Account Payee Cheque", description: "Issued to the applicant's registered address." },
        ]}
      />
    );
  },
};

/** Any number, including none. The value is emitted in OPTION order, not click order. */
export const Checkboxes: Story = {
  args: { legend: "", name: "", options: [], value: "", onChange: () => {} },
  render: function CheckStory() {
    const [v, setV] = React.useState<string[]>(["hostel"]);
    return (
      <CheckboxGroup
        legend="Assistance Applied For"
        value={v}
        onChange={setV}
        hint="Select every scheme the applicant is claiming under."
        options={[
          { value: "hostel", label: "Hostel Accommodation" },
          { value: "scholarship", label: "Post-Matric Scholarship" },
          { value: "device", label: "Assistive Device" },
          { value: "skill", label: "Skill Development Training", disabled: true },
        ]}
      />
    );
  },
};

/** Wraps rather than scrolling sideways — the page body never scrolls horizontally. */
export const Horizontal: Story = {
  args: { legend: "Does the Household Hold a Ration Card?", name: "ration", options: [], value: "", onChange: () => {} },
  render: function HStory(args) {
    const [v, setV] = React.useState("yes");
    return (
      <RadioGroup
        {...args}
        orientation="horizontal"
        value={v}
        onChange={setV}
        options={[
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
          { value: "unknown", label: "Not Known" },
        ]}
      />
    );
  },
};
