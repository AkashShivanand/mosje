import type { Meta, StoryObj } from "@storybook/react";
import { PasswordStrengthMeter } from "@mosje/design-system";

/**
 * **PasswordStrengthMeter** — four segments and a word, under a password the
 * user is **creating**.
 *
 * `score` is a zxcvbn score (0–4), or `null` when the field is empty. Pass
 * zxcvbn's own number: do **not** compute it from character classes ("one
 * capital, one symbol"), which measure the wrong thing — they fail a strong
 * passphrase and pass `Passw0rd!`. 0 and 1 both read as Weak, so the four
 * segments map to four named buckets. `strengthFromScore` is exported if you
 * need the same mapping elsewhere.
 *
 * **When not to use it.** Never beside a password someone is *entering*. On a
 * sign-in screen it tells an attacker how close a guess is and tells a
 * legitimate user something they cannot act on. Registration and reset only.
 *
 * **It is advisory, not a gate.** Do not block submit on a Fair score — if a
 * policy minimum exists, enforce it in the field's own error message where it
 * can say what to change. A colour bar cannot.
 *
 * The word carries the meaning, not the colour: a red bar and an amber bar are
 * the same bar to a colour-blind user, which is why `caption` and the strength
 * word are always rendered. Changes announce politely so a screen-reader user is
 * not interrupted mid-word; `aria-describedby` links the meter to its field, and
 * `id` and `className` are passed through.
 *
 * Lifecycle: **Stable**.
 */
const meta = {
  title: "Components/Forms/PasswordStrengthMeter",
  component: PasswordStrengthMeter,
  args: { score: 2, caption: "Password strength" },
  argTypes: {
    score: { control: { type: "select" }, options: [null, 0, 1, 2, 3, 4] },
    caption: { control: "text" },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 390 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PasswordStrengthMeter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Every bucket, including the resting state before anything is typed. */
export const AllStrengths: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 24 }}>
      <PasswordStrengthMeter score={null} />
      <PasswordStrengthMeter score={0} />
      <PasswordStrengthMeter score={2} />
      <PasswordStrengthMeter score={3} />
      <PasswordStrengthMeter score={4} />
    </div>
  ),
};
