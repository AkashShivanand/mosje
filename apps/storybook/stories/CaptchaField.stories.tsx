import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { CaptchaField } from "@mosje/design-system";

/**
 * **CaptchaField** — a security-check challenge, a refresh control, an answer.
 *
 * **Read this before adding one.** A captcha is an accessibility *risk*, not a
 * feature. WCAG 2.2 SC 3.3.8 *Accessible Authentication (Minimum)* is Level AA
 * and this estate targets AA, so a cognitive-function test with no alternative
 * is a conformance failure rather than a hardening measure. Prefer rate
 * limiting, a server-side signal, or nothing. If you must ship one, ship an
 * audio alternative beside it.
 *
 * Exactly one surface in the estate uses this today (SMILE-Transgender /
 * Garima Greh). Adding it to a second portal is a decision someone should be
 * able to justify out loud.
 *
 * `challenge` is a discriminated union: `{type:"image", src, alt}` for the real
 * server-rendered image, or `{type:"text", characters}` for the local fallback
 * shown here. `value` / `onValueChange` control the answer, `onRefresh` asks the
 * server for a new challenge — and it **must also clear `value`**, which is why
 * the refresh control says so in its accessible name rather than wiping the
 * field silently. `error` renders the message and the invalid state together; a
 * red border with no message is not an error. `label`, `placeholder`,
 * `disabled`, `id` and `className` are the rest.
 *
 * Lifecycle: **Stable**.
 */
const meta = {
  title: "Components/Forms/CaptchaField",
  component: CaptchaField,
  // Required controlled props live here so every story inherits them; the
  // stories below drive their own state through `render`.
  args: {
    challenge: { type: "text", characters: "7K4M9P" },
    value: "",
    onValueChange: () => {},
    onRefresh: () => {},
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 390 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CaptchaField>;

export default meta;
type Story = StoryObj<typeof meta>;

function Demo({ error }: { error?: string }) {
  const [value, setValue] = React.useState("");
  const [code, setCode] = React.useState("7K4M9P");
  return (
    <CaptchaField
      challenge={{ type: "text", characters: code }}
      value={value}
      onValueChange={setValue}
      onRefresh={() => {
        setCode("Q2W8N5");
        setValue("");
      }}
      error={error}
    />
  );
}

export const Playground: Story = { render: () => <Demo /> };

/** The error state always carries a message — the border alone is not one. */
export const WithError: Story = {
  render: () => <Demo error="That code did not match. Try again or refresh." />,
};
