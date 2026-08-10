import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  AadhaarInput,
  FormField,
  OtpInput,
  PanInput,
  isValidAadhaar,
  isValidPan,
  panHolderType,
} from "@mosje/design-system";

/**
 * **AadhaarInput · PanInput · OtpInput** — the three India-specific identity
 * fields (UX4G 3.0: *Input – Aadhaar / Pan Card / OTP*). Shown together because
 * the rule they share is the point: **a value with a known shape and a checksum
 * never goes in a plain `Input`.** A bare text field catches a mistyped digit at
 * submission; these catch it as it is typed.
 *
 * Each one hands your state the *storage-ready* value, never what is on screen:
 *
 * - **`AadhaarInput`** — 12 digits, grouped `XXXX XXXX XXXX`, Verhoeff-checked.
 *   It **masks by default**: once complete and blurred it shows only the last
 *   four, because an Aadhaar number is sensitive personal data under the DPDP
 *   Act 2023. `onValueChange` gets raw digits, so separators never reach your
 *   API. Turn `mask` off only with a recorded reason.
 * - **`PanInput`** — ten characters, `AAAAA9999A`. Uppercases as you type, and
 *   validates the fourth character against the holder-type codes, so a PAN that
 *   matches the pattern but names no valid holder type is still rejected.
 * - **`OtpInput`** — six boxes that handle the things hand-rolled versions
 *   break: pasting the whole code into any box, SMS autofill, and backspace on
 *   an empty box stepping back. Each box is announced as "Digit 3 of 6".
 *
 * All three are controlled and use `onValueChange`, not `onChange` — the
 * formatting means the native event's value is not the value you want.
 *
 * Lifecycle: **Stable**.
 *
 * @covers AadhaarInput, PanInput, OtpInput
 */
const meta = {
  title: "Components/Forms/India ID inputs",
  component: AadhaarInput,
  args: {
    value: "",
    onValueChange: () => {},
    mask: true,
    invalid: false,
  },
  argTypes: {
    mask: { control: "boolean" },
    invalid: { control: "boolean" },
    disabled: { control: "boolean" },
    value: { control: false },
    onValueChange: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 420 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AadhaarInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Type 12 digits, then click away: it masks to the last four. The raw value
 * below is what your form state actually holds.
 */
export const Aadhaar: Story = {
  render: function Render(args) {
    const [value, setValue] = React.useState("");
    const complete = value.length === 12;
    return (
      <div style={{ display: "grid", gap: 8 }}>
        <FormField
          label="Aadhaar number"
          required
          hint="12 digits, as printed on your Aadhaar"
          error={complete && !isValidAadhaar(value) ? "Enter a valid 12-digit Aadhaar number." : undefined}
        >
          {(c) => <AadhaarInput {...args} {...c} value={value} onValueChange={setValue} />}
        </FormField>
        <p style={{ margin: 0, color: "var(--ds-ink-muted)", fontSize: "var(--ds-type-body-3-size)" }}>
          Value in state: <code>{value || "(empty)"}</code>
        </p>
      </div>
    );
  },
};

/** A complete, checksum-valid number. Focus the field to reveal it in full. */
export const AadhaarMasked: Story = {
  render: function Render(args) {
    const [value, setValue] = React.useState("499234212348");
    return (
      <FormField label="Aadhaar number" hint="Masked until you focus the field">
        {(c) => <AadhaarInput {...args} {...c} value={value} onValueChange={setValue} />}
      </FormField>
    );
  },
};

/**
 * Masking off. Only do this where the full number is genuinely required on
 * screen — a verification desk, say — and record why.
 */
export const AadhaarUnmasked: Story = {
  render: function Render(args) {
    const [value, setValue] = React.useState("499234212348");
    return (
      <FormField label="Aadhaar number" hint="Unmasked — verification desk only">
        {(c) => <AadhaarInput {...args} {...c} mask={false} value={value} onValueChange={setValue} />}
      </FormField>
    );
  },
};

/** A wrong checksum sets `aria-invalid` on its own — no `invalid` prop needed. */
export const AadhaarFailingChecksum: Story = {
  render: function Render(args) {
    const [value, setValue] = React.useState("499234212341");
    return (
      <FormField label="Aadhaar number" error="Enter a valid 12-digit Aadhaar number.">
        {(c) => <AadhaarInput {...args} {...c} mask={false} value={value} onValueChange={setValue} />}
      </FormField>
    );
  },
};

/** Type in lower case — it normalises. The fourth character names the holder type. */
export const Pan: Story = {
  render: function Render() {
    const [value, setValue] = React.useState("");
    const complete = value.length === 10;
    const holder = isValidPan(value) ? panHolderType(value) : undefined;
    return (
      <div style={{ display: "grid", gap: 8 }}>
        <FormField
          label="PAN"
          hint="10 characters, as printed on your PAN card"
          error={complete && !isValidPan(value) ? "Enter a valid PAN, e.g. ABCPE1234F." : undefined}
        >
          {(c) => <PanInput {...c} value={value} onValueChange={setValue} />}
        </FormField>
        <p style={{ margin: 0, color: "var(--ds-ink-muted)", fontSize: "var(--ds-type-body-3-size)" }}>
          Holder type: <strong>{holder ?? "—"}</strong>
        </p>
      </div>
    );
  },
};

/** A valid individual PAN, and one whose fourth character names no holder type. */
export const PanStates: Story = {
  render: function Render() {
    const [valid, setValid] = React.useState("ABCPE1234F");
    const [broken, setBroken] = React.useState("ABCXE1234F");
    return (
      <div style={{ display: "grid", gap: 16 }}>
        <FormField label="PAN — valid (individual)">
          {(c) => <PanInput {...c} value={valid} onValueChange={setValid} />}
        </FormField>
        <FormField
          label="PAN — invalid holder type"
          error="The fourth character must be one of P C H F A T B L J G E."
        >
          {(c) => <PanInput {...c} value={broken} onValueChange={setBroken} />}
        </FormField>
      </div>
    );
  },
};

/** Paste `483920` into any box — all six fill. `onComplete` fires on the last digit. */
export const Otp: Story = {
  render: function Render() {
    const [value, setValue] = React.useState("");
    const [verified, setVerified] = React.useState(false);
    return (
      <div style={{ display: "grid", gap: 12 }}>
        <OtpInput
          label="One-time password"
          value={value}
          onValueChange={(v) => {
            setValue(v);
            if (v.length < 6) setVerified(false);
          }}
          onComplete={() => setVerified(true)}
        />
        <p style={{ margin: 0, color: "var(--ds-ink-muted)", fontSize: "var(--ds-type-body-3-size)" }}>
          {verified ? "Code complete — verify call would fire here." : "Sent to 98900 01234."}
        </p>
      </div>
    );
  },
};

/** Four boxes instead of six, the error state, and the disabled state. */
export const OtpVariants: Story = {
  render: function Render() {
    const [four, setFour] = React.useState("1234");
    const [wrong, setWrong] = React.useState("483921");
    return (
      <div style={{ display: "grid", gap: 20 }}>
        <div style={{ display: "grid", gap: 6 }}>
          <span style={{ color: "var(--ds-ink-muted)" }}>Four digits</span>
          <OtpInput label="Four-digit code" length={4} value={four} onValueChange={setFour} />
        </div>
        <div style={{ display: "grid", gap: 6 }}>
          <span style={{ color: "var(--ds-ink-muted)" }}>Incorrect code</span>
          <OtpInput
            label="One-time password"
            value={wrong}
            onValueChange={setWrong}
            invalid
            aria-describedby="sb-otp-error"
          />
          <p id="sb-otp-error" role="alert" style={{ margin: 0, color: "var(--ds-danger)" }}>
            That code is incorrect or has expired.
          </p>
        </div>
        <div style={{ display: "grid", gap: 6 }}>
          <span style={{ color: "var(--ds-ink-muted)" }}>Disabled while resending</span>
          <OtpInput label="One-time password" value="" onValueChange={() => {}} disabled />
        </div>
        <div style={{ display: "grid", gap: 6 }}>
          <span style={{ color: "var(--ds-ink-muted)" }}>
            <code>autoFocus</code> — right on a dedicated OTP screen, where the code is the
            only thing to do. Wrong on a page with anything above it: it yanks a screen-reader
            user past the heading that says what the code is for.
          </span>
          <OtpInput label="One-time password" value="" onValueChange={() => {}} autoFocus />
        </div>
      </div>
    );
  },
};
