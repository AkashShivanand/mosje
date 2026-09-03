import type { Meta, StoryObj } from "@storybook/react";
import { FormField, Icon, Input } from "@mosje/design-system";

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
          <span style={{ color: "var(--sa-text-neutral-subtle)", fontSize: "var(--sa-type-body-3-size)" }}>
            lakh
          </span>
        }
        defaultValue="18.40"
        placeholder="0.00"
      />
    </div>
  ),
};

/**
 * **Status** — three conditions, not one. `error` blocks and sets `aria-invalid`; `warning`
 * flags an anomaly without blocking; `success` reports that a real check passed. Pass the
 * matching message on `FormField` and it derives the status for you.
 */
export const Statuses: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16, maxWidth: 420 }}>
      <FormField label="Error" error="Enter a valid 10-digit mobile number">
        {(c) => <Input {...c} defaultValue="98765" />}
      </FormField>
      <FormField label="Warning" warning="This number is registered to another applicant">
        {(c) => <Input {...c} status="warning" defaultValue="9876543210" />}
      </FormField>
      <FormField label="Success" success="Verified against the UIDAI record">
        {(c) => <Input {...c} defaultValue="Ramesh Kumar" />}
      </FormField>
    </div>
  ),
};

/**
 * **Affixes.** A `prefix` or `suffix` is fixed text inside the field's border — a currency
 * symbol, a country code, a unit. It is `aria-hidden`, because a screen reader announcing
 * "rupee sign" in the middle of a value is noise; its meaning reaches the reader through
 * `prefixLabel` / `suffixLabel` instead, which join the field's description.
 *
 * **Always pass the label when the affix is a symbol.** The fallback — announcing the affix
 * text itself — applies only when it is already a word, such as `kg`.
 */
export const Affixes: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16, maxWidth: 420 }}>
      <FormField label="Annual income" hint="As declared in your latest ITR">
        {(c) => (
          <Input {...c} prefix="₹" prefixLabel="Amount in rupees" inputMode="numeric" defaultValue="1,20,000" />
        )}
      </FormField>
      <FormField label="Weight">
        {(c) => <Input {...c} suffix="kg" suffixLabel="kilograms" inputMode="numeric" defaultValue="62" />}
      </FormField>
      <FormField label="Mobile number">
        {(c) => <Input {...c} prefix="+91" prefixLabel="India country code" type="tel" autoComplete="tel-national" />}
      </FormField>
    </div>
  ),
};

/**
 * **`pending`** — the value is being checked against something. It renders a spinner and sets
 * `aria-busy`, and deliberately does **not** disable the field: a reader who wants to correct
 * a value should not have to wait for a request they cannot see.
 */
export const Pending: Story = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <FormField label="Pincode" hint="Checking which district this falls in…">
        {(c) => <Input {...c} pending defaultValue="500032" inputMode="numeric" autoComplete="postal-code" />}
      </FormField>
    </div>
  ),
};

/**
 * **`autoComplete` is typed**, not a string. WCAG 2.2 1.3.5 (Identify Input Purpose, AA) is met
 * by putting the right autofill token on a field collecting information about the reader — and
 * it is the criterion most often claimed and least often checked, because on every other
 * framework `autoComplete="firstname"` compiles and does nothing. Here it fails the build.
 */
export const IdentifyInputPurpose: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16, maxWidth: 420 }}>
      <FormField label="Full name">{(c) => <Input {...c} autoComplete="name" />}</FormField>
      <FormField label="Email address">{(c) => <Input {...c} type="email" autoComplete="email" />}</FormField>
      <FormField label="Address line 1">{(c) => <Input {...c} autoComplete="address-line1" />}</FormField>
    </div>
  ),
};
