import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox, Radio, Textarea, Toggle } from "@mosje/design-system";

/**
 * **Checkbox · Radio · Toggle · Textarea** — the selection and long-text
 * controls, shown together because their behaviour only makes sense in
 * contrast.
 *
 * The distinction that actually matters: a **Toggle** applies immediately, a
 * **Checkbox** is a value you submit with the rest of the form. If flipping it
 * needs a Save button afterwards, it is a checkbox. Lifecycle: **Stable**.
 *
 * @covers Checkbox, Radio, Toggle, Textarea
 */
const meta = {
  title: "Components/Controls",
  component: Checkbox,
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

/** Applies immediately — no Save step. That is what separates it from a checkbox. */
export const Toggles: Story = {
  render: function Render() {
    const [on, setOn] = React.useState(true);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Toggle checked={on} onChange={(e) => setOn(e.target.checked)} label="Email notifications" />
        <Toggle checked={false} onChange={() => {}} label="SMS notifications" />
        <Toggle checked disabled onChange={() => {}} label="Audit logging (mandatory)" />
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
