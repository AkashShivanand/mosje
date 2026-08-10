import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox, Input, Label, Select } from "@mosje/design-system";

/**
 * **Label** — a standalone `<label>` matching the FormField label exactly.
 *
 * Reach for this **only** when you are hand-wiring `htmlFor` and
 * `aria-describedby` yourself: a checkbox row, a toolbar select, a filter
 * control that lives outside a form. For a field in a form, use `FormField` —
 * it renders its own label and does the wiring, and two labels on one control
 * is a defect, not a belt-and-braces.
 *
 * `required` renders an `aria-hidden` asterisk. It is decoration: the control
 * itself still needs the real `required` attribute, because a screen reader
 * must hear "required" from the field, not infer it from a star.
 *
 * Lifecycle: **Stable**.
 */
const meta = {
  title: "Components/Forms/Label",
  component: Label,
  args: {
    children: "District",
    required: false,
  },
  argTypes: {
    required: { control: "boolean" },
    hint: { control: "text" },
    children: { control: "text" },
    htmlFor: { control: "text" },
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Label {...args}>Plain label</Label>
      <Label {...args} required>
        Required field
      </Label>
      <Label {...args} hint="as printed on the ration card">
        Head of household
      </Label>
    </div>
  ),
};

/** Hand-wired to a control via `htmlFor` — the case this component exists for. */
export const WiredToAControl: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 16, maxWidth: 420 }}>
      <div style={{ display: "grid", gap: 6 }}>
        <Label {...args} htmlFor="sb-label-district" required hint="Maharashtra only">
          District
        </Label>
        <Select
          id="sb-label-district"
          required
          placeholder="Select a district"
          options={[
            { label: "Pune", value: "pune" },
            { label: "Nashik", value: "nashik" },
            { label: "Nagpur", value: "nagpur" },
          ]}
        />
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        <Label {...args} htmlFor="sb-label-officer">
          Reporting officer
        </Label>
        <Input id="sb-label-officer" defaultValue="R. Kulkarni, District Nodal Officer" />
      </div>
    </div>
  ),
};

/**
 * A checkbox row — `Checkbox` already renders its own associated label, so use
 * `Label` here for the *group* heading, never a second label on the box.
 */
export const AsAGroupHeading: Story = {
  render: (args) => (
    <fieldset style={{ border: 0, padding: 0, margin: 0, display: "grid", gap: 8 }}>
      <Label {...args} hint="select all that apply">
        Documents received
      </Label>
      <Checkbox checked onChange={() => {}} label="Aadhaar" />
      <Checkbox checked={false} onChange={() => {}} label="Caste certificate" />
      <Checkbox checked={false} onChange={() => {}} label="Income certificate" />
    </fieldset>
  ),
};
