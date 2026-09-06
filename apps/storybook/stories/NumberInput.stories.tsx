import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { NumberInput } from "@mosje/design-system";

/**
 * **Number Input** — a quantity, an amount, a count.
 *
 * **It is not `<input type="number">`, and that is deliberate.** The native
 * number input silently discards what it cannot parse, so a citizen who types
 * "1,50,000" — the way an amount is written in India — submits an empty field
 * and is told nothing. It also changes the value on a mouse wheel over a focused
 * field, which has altered figures on forms without anybody touching the
 * keyboard. This is a text field carrying `role="spinbutton"` with the ARIA
 * value properties, so assistive technology gets everything the native control
 * would give it and none of the behaviour that harms.
 *
 * **Empty is not zero.** `value` is `number | null`, and a cleared field reports
 * `null`. A form that stores zero for "the applicant did not answer" has
 * invented a figure, and on a grant application that figure is money.
 *
 * The value commits on **blur**, not on keystroke — "1," is not a number, and it
 * is also not empty. Spaces and commas are stripped, so the way people actually
 * write amounts is accepted rather than punished.
 *
 * The steppers are a convenience and never the only route. They are hidden from
 * assistive technology because the spinbutton role already advertises the arrow
 * keys, and announcing both would say the same thing twice.
 *
 * `id` is rarely needed: the component generates stable ids for the input, the
 * hint and the error and wires them together itself. Pass one only when
 * something outside has to point at the field — an error summary at the top of a
 * long form linking down to it, for instance.
 *
 * Lifecycle: **Stable**.
 */
const meta = {
  title: "Components/Forms/Number Input",
  component: NumberInput,
  args: {
    label: "Number of beneficiaries",
    value: 120,
    onValueChange: () => {},
    min: 0,
    step: 1,
    precision: 0,
    required: false,
    disabled: false,
    hideSteppers: false,
  },
  argTypes: {
    label: { control: "text" },
    hint: { control: "text" },
    error: { control: "text" },
    prefix: { control: "text" },
    suffix: { control: "text" },
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
    precision: { control: { type: "number", min: 0, max: 4 } },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
    hideSteppers: { control: "boolean" },
    value: { control: false },
    onValueChange: { control: false },
  },
  decorators: [(Story) => <div style={{ padding: 24, maxWidth: 320 }}><Story /></div>],
} satisfies Meta<typeof NumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The default. Arrow keys nudge it; the steppers do the same thing with a pointer. */
export const Playground: Story = {
  render: function P(args) {
    const [v, setV] = React.useState<number | null>(args.value);
    return <NumberInput {...args} value={v} onValueChange={setV} />;
  },
};

/**
 * An amount, with the rupee sign as a prefix. Type "4,50,000" and it commits as
 * 450000 — the separators are stripped rather than the entry rejected.
 */
export const AnAmount: Story = {
  args: {
    label: "Grant amount sought",
    prefix: "₹",
    value: 450000,
    step: 50000,
    min: 0,
    hint: "Whole rupees. Commas and spaces are accepted.",
    hideSteppers: true,
  },
  render: function P(args) {
    const [v, setV] = React.useState<number | null>(args.value);
    return <NumberInput {...args} value={v} onValueChange={setV} />;
  },
};

/** A percentage, to one decimal place, with a suffix and both bounds. */
export const APercentage: Story = {
  args: { label: "Utilisation", suffix: "%", value: 62.5, min: 0, max: 100, step: 0.5, precision: 1 },
  render: function P(args) {
    const [v, setV] = React.useState<number | null>(args.value);
    return <NumberInput {...args} value={v} onValueChange={setV} />;
  },
};

/** Empty — which reports `null`, not zero. */
export const Empty: Story = {
  args: { value: null, hint: "Leave blank if not applicable." },
  render: function P(args) {
    const [v, setV] = React.useState<number | null>(null);
    return <NumberInput {...args} value={v} onValueChange={setV} />;
  },
};

/** With an error. The message is announced and the field is marked invalid. */
export const WithAnError: Story = {
  args: { value: null, required: true, error: "Enter the number of beneficiaries." },
};

/** Disabled. It stays readable and keeps its place in the page's outline. */
export const Disabled: Story = { args: { disabled: true } };
