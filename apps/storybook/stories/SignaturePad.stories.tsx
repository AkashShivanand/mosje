import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { SignaturePad, type SignatureValue } from "@mosje/design-system";

/**
 * A signature on a consent form, given by drawing or by typing.
 *
 * **Use it** where a form needs an attestation and the department has decided
 * what that attestation says.
 *
 * **Do not use it** as decoration on a form that does not need a signature, and
 * never without a `declaration` — which is why the prop is required.
 *
 * **The typed alternative is not optional and cannot be switched off.** WCAG 2.2
 * §2.5.7 requires a single-pointer path that is not a drag, and drawing a
 * signature is a drag by definition, so a pad that only draws excludes every
 * reader using a keyboard, a switch or a head pointer. Both paths are always
 * offered and both produce a value; which the department accepts is stated in
 * `declaration`. The component does not decide what counts as consent — it makes
 * it impossible to ship a form that has not answered the question.
 *
 * `label` says whose signature it is. `value` is `{ method, value }` — a PNG data
 * URL when drawn, the typed name when typed — or `null` when unsigned, and
 * `onChange` receives it. `typedLabel` and `clearLabel` name the alternative
 * field and the clear control; `disabled` withdraws the whole thing.
 *
 * The declaration sits above the pad, because a citizen who signs and then reads
 * is a citizen who did not read. Clearing is always available, because a
 * signature nobody can withdraw is not consent. The drawn stroke is captured at
 * device resolution, so a signature given on a phone is not a blurred smear in
 * the record it is filed against.
 */
const meta = {
  title: "Forms/SignaturePad",
  component: SignaturePad,
  parameters: { layout: "padded" },
} satisfies Meta<typeof SignaturePad>;

export default meta;
type Story = StoryObj<typeof meta>;

const DECLARATION =
  "I declare that the information given in this application is true to the best of my knowledge, and I consent to its verification by the Department.";

function Controlled(props: Partial<React.ComponentProps<typeof SignaturePad>>) {
  const [value, setValue] = React.useState<SignatureValue | null>(null);
  return (
    <SignaturePad
      label="Signature of the applicant"
      declaration={DECLARATION}
      value={value}
      onChange={setValue}
      {...props}
    />
  );
}

export const Playground: Story = {
  args: { label: "Signature of the applicant", declaration: DECLARATION, value: null, onChange: () => {} },
  render: () => <Controlled />,
};

/** The two labels renamed for a witness rather than the applicant. */
export const Witness: Story = {
  args: { label: "Signature of the witness", declaration: DECLARATION, value: null, onChange: () => {} },
  render: () => (
    <Controlled
      label="Signature of the witness"
      declaration="I confirm that the applicant signed this form in my presence."
      typedLabel="Type the witness's full name instead"
      clearLabel="Start again"
    />
  ),
};

/** Withdrawn — the form has already been submitted. */
export const Disabled: Story = {
  args: { label: "Signature of the applicant", declaration: DECLARATION, value: null, onChange: () => {} },
  render: () => <Controlled disabled />,
};
