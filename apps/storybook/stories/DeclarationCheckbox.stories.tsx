import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { DeclarationCheckbox } from "@mosje/design-system";

/**
 * **DeclarationCheckbox** — the statutory certification block that closes a
 * government form.
 *
 * Not a styled `Checkbox`. The wording is legal text the applicant is attesting
 * to, so it has to read as a distinct, deliberate act rather than one more
 * field in a grid — a bordered panel, its own heading, and the statement bound
 * to the control with `aria-describedby` so a screen-reader user hears what
 * they are agreeing to before the box, not after.
 *
 * Use it once, at the end of a submission. For an ordinary opt-in ("email me
 * updates") use `Checkbox` — dressing a preference as a declaration devalues
 * the real one.
 *
 * Put the points in a `<ul>` when the declaration covers several, so each is
 * separately readable rather than one wall of text.
 *
 * Lifecycle: **Stable**.
 */
const meta = {
  title: "Components/Forms/DeclarationCheckbox",
  component: DeclarationCheckbox,
  args: {
    checked: false,
    onChange: () => {},
    title: "Declaration",
    lead: "I certify that:",
    disabled: false,
    children: (
      <ul>
        <li>the information given above is true to the best of my knowledge;</li>
        <li>
          the beneficiary belongs to the category claimed and holds a valid caste
          certificate issued by the competent authority;
        </li>
        <li>
          no assistance for the same purpose has been received under any other
          Central or State scheme.
        </li>
      </ul>
    ),
  },
  argTypes: {
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
    title: { control: "text" },
    lead: { control: "text" },
    error: { control: "text" },
    children: { control: false },
    onChange: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 720 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DeclarationCheckbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: function Render(args) {
    const [checked, setChecked] = React.useState(false);
    return <DeclarationCheckbox {...args} checked={checked} onChange={setChecked} />;
  },
};

/** Submission was attempted unchecked. The error is announced via `role="alert"`. */
export const Unconfirmed: Story = {
  args: {
    checked: false,
    error: "You must agree to the declaration before submitting.",
  },
};

export const Confirmed: Story = {
  args: { checked: true },
};

/** Locked once the district officer has approved the submission. */
export const Disabled: Story = {
  args: { checked: true, disabled: true },
};

/** A single-sentence declaration, with the panel heading reworded to suit. */
export const SingleStatement: Story = {
  args: {
    title: "Undertaking",
    lead: undefined,
    children: (
      <p>
        I undertake to refund the full grant if the Adarsh Gram works are not
        completed within twelve months of the first instalment.
      </p>
    ),
  },
};
