import type { Meta, StoryObj } from "@storybook/react";
import { Icon, Input } from "@mosje/design-system";

/**
 * **Input** — the single-line text field, styled on the token contract.
 *
 * Use it for free text the applicant types. Do **not** use it for a value with
 * a known shape and a checksum — an Aadhaar number, a PAN, a one-time code —
 * those have their own components that format, mask and validate as you type,
 * and a bare `Input` there means the mistake is only caught at submission.
 *
 * Almost always pair it with `FormField`, which supplies the label, hint,
 * error and the `aria-*` wiring; a naked `Input` has no accessible name.
 * Minimum height is 44px, meeting SC 2.5.5 (Level AAA) target size.
 *
 * `leftIcon` is decorative and `aria-hidden`; `rightIcon` is not, because it is
 * usually an interactive control that needs its own accessible name.
 *
 * Lifecycle: **Stable**.
 */
const meta = {
  title: "Components/Forms/Input",
  component: Input,
  args: {
    placeholder: "Enter the beneficiary's full name",
    invalid: false,
    disabled: false,
    type: "text",
    "aria-label": "Beneficiary name",
  },
  argTypes: {
    invalid: { control: "boolean" },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    required: { control: "boolean" },
    type: {
      control: "inline-radio",
      options: ["text", "email", "tel", "url", "number"],
    },
    placeholder: { control: "text" },
    defaultValue: { control: "text" },
    maxLength: { control: "number" },
    leftIcon: { control: false },
    rightIcon: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 420 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** The states that change meaning, not just appearance. */
export const States: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Input {...args} aria-label="Default" defaultValue="Sunita Deshmukh" />
      <Input
        {...args}
        aria-label="Invalid"
        invalid
        defaultValue="sunita@@example"
      />
      <Input
        {...args}
        aria-label="Disabled"
        disabled
        defaultValue="Locked after district approval"
      />
      <Input
        {...args}
        aria-label="Read only"
        readOnly
        defaultValue="MH/PUN/2026/004182"
      />
    </div>
  ),
};

/**
 * A leading glyph is decoration; a trailing slot is usually a control. Give the
 * control its own label — the icon alone is not an accessible name.
 */
export const WithAdornments: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Input
        {...args}
        aria-label="District"
        leftIcon={<Icon name="location_on" size={18} aria-hidden />}
        defaultValue="Pune"
        placeholder="District"
      />
      <Input
        {...args}
        aria-label="Sanctioned amount"
        leftIcon={<Icon name="currency_rupee" size={18} aria-hidden />}
        rightIcon={
          <span style={{ color: "var(--sa-color-text-muted)", fontSize: "var(--sa-type-body-3-size)" }}>
            lakh
          </span>
        }
        defaultValue="18.40"
        placeholder="0.00"
      />
    </div>
  ),
};
