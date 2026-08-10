import type { Meta, StoryObj } from "@storybook/react";
import { FormField, Input, Textarea, Select } from "@mosje/design-system";

/**
 * **FormField** — accessibly wires a label, hint, and error to any control via
 * `htmlFor` + `aria-describedby` + `aria-invalid` (+ `role="alert"` on errors).
 * Spread the render-prop wiring onto Input / Textarea / Select. Lifecycle: **Alpha**.
 *
 * `children` is a **render prop**, not a node: it receives the wiring object and
 * you spread it onto the control. That is the whole design — the ids have to be
 * generated before the control exists, so the field hands them to you rather
 * than guessing at what you rendered.
 *
 * `id` is generated for you. Pass one only when something outside the field
 * needs to point at the control — a "jump to the first error" link in an error
 * summary, say. Two fields sharing an `id` silently mislabel one of them.
 */
const meta = {
  title: "Components/FormField",
  component: FormField,
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TextInput: Story = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <FormField label="Aadhaar number" hint="12-digit number on your Aadhaar card" required>
        {(c) => <Input {...c} inputMode="numeric" placeholder="XXXX XXXX XXXX" />}
      </FormField>
    </div>
  ),
};

export const WithError: Story = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <FormField
        label="Email address"
        error="Enter a valid email address."
        required
      >
        {(c) => <Input {...c} type="email" defaultValue="not-an-email" />}
      </FormField>
    </div>
  ),
};

export const SelectField: Story = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <FormField label="State / UT" hint="Select your state of residence">
        {(c) => (
          <Select
            {...c}
            placeholder="Choose a state"
            options={[
              { label: "Maharashtra", value: "MH" },
              { label: "Karnataka", value: "KA" },
              { label: "Tamil Nadu", value: "TN" },
              { label: "Uttar Pradesh", value: "UP" },
            ]}
          />
        )}
      </FormField>
    </div>
  ),
};

export const TextareaField: Story = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <FormField label="Grievance details" hint="Describe your issue in plain language">
        {(c) => <Textarea {...c} rows={4} placeholder="Type here…" />}
      </FormField>
    </div>
  ),
};
