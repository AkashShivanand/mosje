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
 *
 * `showLabel` and `hideLabel` are the reveal button's accessible names, and they
 * default to "Show password" / "Hide password". Override them **only to
 * translate**, and keep them naming the *action* rather than the state — a
 * screen-reader user needs to hear what pressing the button will do, not what
 * the field is currently doing.
 */
const meta = {
  title: "Components/PasswordInput",
  component: PasswordInput,
  args: { name: "password", autoComplete: "current-password" },
  argTypes: {
    invalid: { control: "boolean" },
    disabled: { control: "boolean" },
    hideToggle: { control: "boolean" },
    showLabel: { control: "text" },
    hideLabel: { control: "text" },
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

/**
 * Translated reveal labels. Note both still name the **action** — "दिखाएँ" /
 * "छिपाएँ" — rather than the current state.
 */
export const TranslatedRevealLabels: Story = {
  // ds-exempt(specimen): `showLabel`/`hideLabel` are string props, so the story cannot attach lang="hi"; the component owns the attribute
  args: { showLabel: "पासवर्ड दिखाएँ", hideLabel: "पासवर्ड छिपाएँ" },
};
