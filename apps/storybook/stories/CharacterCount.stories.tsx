import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { CharacterCount, FieldPolicyProvider, FormField, Textarea } from "@mosje/design-system";

/**
 * **CharacterCount** — a live count of how much of a field's limit is left.
 *
 * Three things it does that most implementations do not:
 *
 * 1. **It counts grapheme clusters**, not UTF-16 units. `"नमस्ते".length` is 6
 *    where a reader counts 3, and `"👍🏽".length` is 4 where a reader counts 1.
 * 2. **It escalates politeness** — polite while inside the limit, assertive once
 *    past it, in two separate live regions because swapping `aria-live` on one
 *    node is honoured inconsistently.
 * 3. **It is debounced**, and silent until three quarters of the limit is used.
 *
 * Prefer `FormField`'s `characterCount` prop over rendering this directly: that
 * wires its description into the field's `aria-describedby` for you.
 *
 * **Do not also set `maxLength` on the control.** A hard limit silently swallows
 * keystrokes, and a reader pasting a prepared answer loses the end of it without
 * being told. Let them go over and let the count say so.
 */
const meta = {
  title: "Components/CharacterCount",
  component: CharacterCount,
  args: { value: "The hostel warden was informed on 12 August.", maxLength: 120 },
} satisfies Meta<typeof CharacterCount>;

export default meta;
type Story = StoryObj<typeof meta>;

function Controlled({ maxLength, initial }: { maxLength: number; initial: string }) {
  const [value, setValue] = React.useState(initial);
  return (
    <div style={{ maxWidth: 460 }}>
      <FormField
        label="Describe your grievance"
        hint="Say what happened and when. Do not include your Aadhaar number."
        characterCount={{ value, maxLength }}
        required
      >
        {(c) => <Textarea {...c} value={value} onChange={(e) => setValue(e.target.value)} />}
      </FormField>
    </div>
  );
}

/** The ordinary case, wired through Form Field. */
export const InAField: Story = {
  render: () => <Controlled maxLength={120} initial="The hostel warden was informed on 12 August." />,
};

/** Past the limit: the wording changes, not only the colour, and the announcement turns assertive. */
export const OverTheLimit: Story = {
  render: () => (
    <Controlled
      maxLength={40}
      initial="The hostel warden was informed on 12 August and no action has been taken since."
    />
  ),
};

/** Devanagari, counted as a reader counts it rather than as JavaScript does. */
export const Devanagari: Story = {
  render: () => (
    <div lang="hi">
      <Controlled maxLength={60} initial="छात्रावास की शिकायत" />
    </div>
  ),
};

/** Every string replaced through the form's copy, for a Hindi portal. */
export const Localised: Story = {
  render: () => (
    <FieldPolicyProvider
      copy={{
        charactersRemaining: (n) => `${n} अक्षर शेष`,
        charactersOver: (n) => `${n} अक्षर अधिक`,
        characterLimit: (max) => `अधिकतम ${max} अक्षर`,
      }}
    >
      <div lang="hi">
        <Controlled maxLength={60} initial="छात्रावास की शिकायत" />
      </div>
    </FieldPolicyProvider>
  ),
};

/** Standalone, outside a field — the id must then be wired by the caller. */
export const Standalone: Story = {
  args: { value: "Sixty characters is not very many at all, as it turns out.", maxLength: 60 },
};

/**
 * **`threshold`** — how many characters must be used before the count starts speaking. It
 * defaults to three quarters of the limit, because a reader four characters into a
 * five-hundred-character box does not need to be told how much room is left. Lower it when the
 * limit is tight enough that running out is a real risk from the start.
 */
export const AnnouncesEarly: Story = {
  args: { value: "Ten chars.", maxLength: 200, threshold: 1 },
};
