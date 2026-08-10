import type { Meta, StoryObj } from "@storybook/react";
import { FormField, PasswordInput } from "@mosje/design-system";

/**
 * **PasswordInput** — a password field with a reveal toggle. Use this for every
 * password field in the estate; never an `<Input type="password">` plus a
 * hand-rolled eye, which is how the submit-on-toggle bug and the missing
 * accessible name get reintroduced. Lifecycle: **Stable**.
 *
 * Always pass `autoComplete`: `"current-password"` to sign in,
 * `"new-password"` to set one. Password managers key on it.
 */
const meta = {
  title: "Components/PasswordInput",
  component: PasswordInput,
  args: { name: "password", autoComplete: "current-password" },
  argTypes: {
    invalid: { control: "boolean" },
    disabled: { control: "boolean" },
    hideToggle: { control: "boolean" },
  },
} satisfies Meta<typeof PasswordInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** The shape you should almost always ship: wrapped in a FormField. */
export const InAFormField: Story = {
  render: (args) => (
    <div style={{ maxWidth: 360 }}>
      <FormField label="Password" required>
        {(control) => <PasswordInput {...control} {...args} />}
      </FormField>
    </div>
  ),
};

export const Invalid: Story = {
  render: (args) => (
    <div style={{ maxWidth: 360 }}>
      <FormField label="Password" error="That password was not recognised." required>
        {(control) => <PasswordInput {...control} {...args} />}
      </FormField>
    </div>
  ),
};

/** Degrades to a plain password field where a reveal would be inappropriate. */
export const WithoutToggle: Story = { args: { hideToggle: true } };
