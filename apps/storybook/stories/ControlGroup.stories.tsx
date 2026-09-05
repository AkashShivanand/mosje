import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { CheckboxGroup, Icon, Input, RadioGroup, type RadioGroupProps } from "@mosje/design-system";

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
 * renders each option as a selectable card with an optional `description`,
 * `icon` and `meta` — on BOTH groups now; `cardLayout="detailed"` is the scheme tile. `hint` and `error` are linked through
 * `aria-describedby`; the error is announced after the options, because a message
 * announced before the controls describes a failure the reader has not reached yet.
 *
 * `value` is optional: omit it (and use `defaultValue`) for an uncontrolled group a plain
 * form can post — `CheckboxGroup` takes a `name` for exactly that. `RadioGroup` never
 * invents a selection; DBIM's "pre-selected default" is the form's decision, made with
 * `defaultValue`. `disabled` is a native `<fieldset disabled>`; `readOnly`, `size` and
 * `labelPlacement` pass through to every option. `hideLegend` hides the question
 * without removing it.
 *
 * Per option: `reveal` shows content beneath the option only while it is selected (a
 * follow-up field — GOV.UK's conditional reveal), always in the DOM and hidden with
 * `hidden`. `exclusive` (CheckboxGroup) is "none of the above": it clears the others
 * and is cleared by them, and sits after an "or" divider (`exclusiveDivider`).
 * `selectAll` adds the parent box a long list needs — checked when every enabled
 * option is, indeterminate when only some are.
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
  args: { legend: "Category of the Applicant", name: "category", options: CATEGORIES },
  render: function RadiosStory(args) {
    const [v, setV] = React.useState("sc");
    return <RadioGroup {...args} value={v} onChange={setV} />;
  },
};

export const WithHintAndError: Story = {
  args: { legend: "Category of the Applicant", name: "cat2", options: CATEGORIES },
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
  args: { legend: "How Should the Grant Be Released?", name: "mode", options: [] },
  render: function CardStory(args) {
    const [v, setV] = React.useState("dbt");
    return (
      <RadioGroup
        {...args}
        variant="card"
        value={v}
        onChange={setV}
        options={[
          { value: "dbt", label: "Direct Benefit Transfer", icon: <Icon name="account_balance" />, description: "Credited to the Aadhaar-seeded bank account on record." },
          { value: "cheque", label: "Account Payee Cheque", icon: <Icon name="payments" />, description: "Issued to the applicant's registered address." },
        ]}
      />
    );
  },
};

/** `cardLayout="detailed"` with `meta` per option — a scheme picker, control trailing. */
export const DetailedCards: Story = {
  args: { legend: "Scheme", name: "scheme", options: [] },
  render: function DetailedStory(args) {
    const [v, setV] = React.useState("napddr");
    return (
      <RadioGroup {...args} variant="card" cardLayout="detailed" value={v} onChange={setV} options={[
        { value: "napddr", label: "NAPDDR - National Action Plan for Drug Demand Reduction", icon: <Icon name="workspace_premium" size={40} />, description: "Prevention, treatment, rehabilitation, social-reintegration and aftercare for persons affected by substance abuse.", meta: "Target: Persons affected by substance abuse" },
        { value: "avyay", label: "AVYAY - Atal Vayo Abhyuday Yojana", icon: <Icon name="workspace_premium" size={40} />, description: "An umbrella scheme for senior citizens: IPSrC, Old Age Homes, Rashtriya Vayoshri Yojana and Silver Economy support.", meta: "Target: Senior citizens" },
      ]} />
    );
  },
};

/** Any number, including none. The value is emitted in OPTION order, not click order. */
export const Checkboxes: Story = {
  args: { legend: "", name: "", options: [] },
  render: function CheckStory() {
    const [v, setV] = React.useState<string[]>(["hostel"]);
    return (
      <CheckboxGroup
        legend="Assistance Applied For"
        name="claims"
        value={v}
        onChange={setV}
        selectAll="Select all schemes"
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
  args: { legend: "Does the Household Hold a Ration Card?", name: "ration", options: [] },
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

/**
 * `reveal` — a follow-up beneath the option that needs one, shown only while it is
 * selected. The panel is always in the DOM (hidden with `hidden`), so `aria-controls`
 * on the option always resolves.
 */
export const ConditionalReveal: Story = {
  args: { legend: "How Should We Contact You?", name: "contact", options: [] },
  render: function RevealStory(args) {
    const [v, setV] = React.useState("email");
    return (
      <RadioGroup
        {...args}
        value={v}
        onChange={setV}
        options={[
          { value: "email", label: "Email", reveal: <Input aria-label="Email address" placeholder="name@example.gov.in" /> },
          { value: "sms", label: "SMS", reveal: <Input aria-label="Mobile number" inputMode="numeric" placeholder="10-digit mobile number" /> },
          { value: "post", label: "Post" },
        ]}
      />
    );
  },
};

/**
 * `exclusive` — "none of the above", after an "or" divider. Selecting it clears the
 * others; selecting any other clears it. The value is still emitted in option order.
 */
export const ExclusiveOption: Story = {
  args: { legend: "", name: "", options: [] },
  render: function ExclusiveStory() {
    const [v, setV] = React.useState<string[]>([]);
    return (
      <CheckboxGroup
        legend="Documents Enclosed"
        name="documents"
        value={v}
        onChange={setV}
        options={[
          { value: "caste", label: "Caste certificate" },
          { value: "income", label: "Income certificate" },
          { value: "aadhaar", label: "Aadhaar card" },
          { value: "none", label: "None of these", exclusive: true },
        ]}
      />
    );
  },
};

/** `disabled` is a native `<fieldset disabled>`; `readOnly` keeps every option in the tab order. */
export const DisabledAndReadOnly: Story = {
  args: { legend: "", name: "", options: [] },
  render: () => (
    <div style={{ display: "grid", gap: 24 }}>
      <RadioGroup legend="Category of the Applicant" name="cat-d" options={CATEGORIES} defaultValue="sc" disabled />
      <RadioGroup legend="Category of the Applicant" name="cat-r" options={CATEGORIES} defaultValue="st" readOnly hint="Recorded from the caste certificate; cannot be changed here." />
    </div>
  ),
};

/** Uncontrolled: no `value`, a `defaultValue`, and a `name` a plain form can post. */
export const Uncontrolled: Story = {
  args: { legend: "", name: "", options: [] },
  render: () => (
    <form>
      <CheckboxGroup
        legend="Assistance Applied For"
        name="claims"
        defaultValue={["hostel"]}
        size="lg"
        options={[
          { value: "hostel", label: "Hostel Accommodation" },
          { value: "scholarship", label: "Post-Matric Scholarship" },
        ]}
      />
    </form>
  ),
};
