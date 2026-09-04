import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox, FormField, Radio, Textarea, Toggle } from "@mosje/design-system";

/**
 * **Checkbox · Radio · Toggle · Textarea** — the selection and long-text
 * controls, shown together because their behaviour only makes sense in
 * contrast.
 *
 * The distinction that actually matters: a **Toggle** applies immediately, a
 * **Checkbox** is a value you submit with the rest of the form. If flipping it
 * needs a Save button afterwards, it is a checkbox. Lifecycle: **Stable**.
 *
 * `Radio` has a second `variant`: `"card"` turns each option into a full
 * selectable card with a `description`, which is worth the space when the
 * options need explaining — choosing a scheme, picking a reporting category.
 * For a short list of self-evident options, the default inline circle is
 * quicker to scan.
 *
 * `Toggle` takes a `size`; use `"small"` in a dense settings table and
 * `"default"` everywhere else.
 *
 * @covers Checkbox, Radio, Toggle, Textarea
 */
const meta = {
  title: "Components/Controls",
  component: Checkbox,
  // Checkbox is controlled, so `checked` and `onChange` are required. They live
  // here rather than on each story because every story below drives its own
  // state through `render` — without them, `StoryObj<typeof meta>` demands the
  // pair on all five.
  args: { checked: false, onChange: () => {} },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Checkboxes: Story = {
  render: function Render() {
    const [checked, setChecked] = React.useState(true);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Checkbox
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          label="I agree to the declaration"
        />
        <Checkbox checked={false} onChange={() => {}} label="Unchecked" />
        <Checkbox checked={false} indeterminate onChange={() => {}} label="Some districts selected" />
        <Checkbox checked disabled onChange={() => {}} label="Locked after approval" />
      </div>
    );
  },
};

export const Radios: Story = {
  render: function Render() {
    const [value, setValue] = React.useState("sc");
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {[
          { id: "sc", label: "Scheduled Caste" },
          { id: "obc", label: "Other Backward Class" },
          { id: "dnt", label: "De-notified tribe" },
        ].map((o) => (
          <Radio
            key={o.id}
            name="category"
            value={o.id}
            checked={value === o.id}
            onChange={() => setValue(o.id)}
            label={o.label}
          />
        ))}
      </div>
    );
  },
};

/**
 * `variant="card"` — worth the space when the options need explaining. The
 * `description` is what the extra room buys you.
 */
export const RadioCards: Story = {
  render: function Render() {
    const [scheme, setScheme] = React.useState("prematric");
    return (
      <div style={{ display: "grid", gap: 12, maxWidth: 520 }}>
        {[
          {
            id: "prematric",
            label: "Pre-Matric Scholarship (SC)",
            description: "Classes IX and X. Paid to the school; ₹12,500 a year.",
          },
          {
            id: "postmatric",
            label: "Post-Matric Scholarship (SC)",
            description:
              "Class XI upwards, including degree and professional courses. Amount varies by course.",
          },
          {
            id: "hostel",
            label: "Babu Jagjivan Ram Chhatrawas Yojana",
            description: "Hostel accommodation. Apply through the institution, not directly.",
          },
        ].map((o) => (
          <Radio
            key={o.id}
            variant="card"
            name="scheme"
            value={o.id}
            checked={scheme === o.id}
            onChange={() => setScheme(o.id)}
            label={o.label}
            description={o.description}
          />
        ))}
      </div>
    );
  },
};

/** Applies immediately — no Save step. That is what separates it from a checkbox. */
export const Toggles: Story = {
  render: function Render() {
    const [on, setOn] = React.useState(true);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Toggle checked={on} onChange={(e) => setOn(e.target.checked)} label="Email notifications" />
        <Toggle checked={false} onChange={() => {}} label="SMS notifications" />
        <Toggle checked disabled onChange={() => {}} label="Audit logging (mandatory)" />
        <Toggle
          size="small"
          checked
          onChange={() => {}}
          label="Small — for a dense settings table"
        />
      </div>
    );
  },
};

export const Textareas: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 420 }}>
      <Textarea placeholder="Remarks for the district officer…" rows={3} />
      <Textarea defaultValue="Address does not match the ration card." invalid rows={3} />
    </div>
  ),
};

/**
 * **Textarea `status`** — the same three conditions every control in the stack carries.
 * `error` blocks and sets `aria-invalid`; `warning` does not block; `success` reports a check
 * that passed.
 */
export const TextareaStatuses: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16, maxWidth: 460 }}>
      <FormField label="Grievance" error="Describe what happened in at least twenty words">
        {(c) => <Textarea {...c} defaultValue="Too short." />}
      </FormField>
      <FormField label="Remarks" warning="This will be visible to the district officer">
        {(c) => <Textarea {...c} status="warning" defaultValue="Warden was informed on 12 August." />}
      </FormField>
      <FormField label="Justification" success="Saved as a draft">
        {(c) => <Textarea {...c} defaultValue="The hostel has been without water since Monday." />}
      </FormField>
    </div>
  ),
};

/**
 * **`autoResize` and `maxRows`** — grow to fit the value, up to a ceiling, then scroll.
 *
 * Off by default, and that default is deliberate: a field that changes height under the
 * reader's cursor moves everything below it. Acceptable for a comment box at the end of a form;
 * not for a field in the middle of a long application, where the Submit button would walk down
 * the page as the reader types.
 */
export const TextareaAutoResize: Story = {
  render: () => {
    const [value, setValue] = React.useState("Type here and the field grows to fit, up to four rows.");
    return (
      <div style={{ maxWidth: 460 }}>
        <FormField label="Remarks" hint="Grows as you type, then scrolls past four rows.">
          {(c) => (
            <Textarea
              {...c}
              autoResize
              maxRows={4}
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          )}
        </FormField>
      </div>
    );
  },
};
