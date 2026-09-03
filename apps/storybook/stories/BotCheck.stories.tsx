import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { BotCheck } from "@mosje/design-system";

/**
 * **BotCheck** — the estate's replacement for a captcha field.
 *
 * The distorted-characters test is both the least accessible option and the
 * least effective one, so it is not the default here; it is a deprecated mode
 * kept only for a portal that has not yet migrated off it.
 *
 * **`invisible` is the default and it usually draws nothing.** The server
 * decides from a proof-of-work token, a honeypot and rate limiting, and the
 * component renders only when that check has *failed* — because a form that
 * silently refuses to submit is the worst of the three outcomes. So the story
 * below that shows "nothing" is not a broken story; it is the state a citizen
 * should almost always be in.
 *
 * **`helpHref` is required, and deliberately not optional.** A reputation or
 * proof-of-work check has no accessible workaround of its own: a citizen on a
 * shared connection, a screen reader that cannot complete the gesture, or an
 * older device that fails the work factor is simply stuck. This link is the
 * alternative WCAG 2.2 §3.3.8 asks for, and making it optional is exactly how
 * it gets dropped from the one portal that needed it.
 */
const meta = {
  title: "Components/Forms/BotCheck",
  component: BotCheck,
  args: { helpHref: "/website/contact-us" },
  argTypes: {
    mode: { control: "inline-radio", options: ["invisible", "checkbox", "challenge"] },
    status: { control: "inline-radio", options: ["idle", "verifying", "verified", "failed"] },
    helpHref: { control: "text" },
    helpLabel: { control: "text" },
    error: { control: "text" },
    label: { control: "text" },
    disabled: { control: "boolean" },
  },
  decorators: [(Story) => <div style={{ maxWidth: 420 }}><Story /></div>],
} satisfies Meta<typeof BotCheck>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The default, mid-check. It draws nothing, and that is correct. */
export const Playground: Story = {};

/**
 * **The invisible check across its four states.**
 *
 * `idle` and `verifying` are not the same thing, and neither draws a control —
 * the citizen is not being asked for anything, so there is nothing to show. Only
 * `failed` renders, because that is the only state where the citizen has to act.
 *
 * Each block below is labelled so the empty ones read as deliberate.
 */
export const InvisibleStates: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      {(["idle", "verifying", "verified", "failed"] as const).map((s) => (
        <div key={s}>
          <div
            style={{
              fontSize: "var(--sa-type-label-2-size)",
              lineHeight: "var(--sa-type-label-2-lh)",
              fontWeight: 700,
              textTransform: "uppercase",
              marginBottom: "var(--sa-stack-8)",
            }}
          >
            {s}
          </div>
          <BotCheck
            {...args}
            mode="invisible"
            status={s}
            error={s === "failed" ? "We could not verify this browser. Try again, or use the link below." : undefined}
          />
        </div>
      ))}
    </div>
  ),
};

/**
 * **`checkbox`** — one deliberate human gesture, on top of the invisible signal.
 *
 * It is not a cognitive function test, so WCAG 2.2 §3.3.8 permits it. Reach for
 * it only where the server genuinely wants a gesture; every extra step in front
 * of a citizen needs to earn itself.
 */
export const Checkbox: Story = {
  render: (args) => {
    const [status, setStatus] = React.useState<"idle" | "verifying" | "verified">("idle");
    return (
      <BotCheck
        {...args}
        mode="checkbox"
        status={status}
        onVerify={() => {
          setStatus("verifying");
          window.setTimeout(() => setStatus("verified"), 700);
        }}
      />
    );
  },
};

/**
 * **`challenge` — deprecated.** Shown so the mode is documented, not so it is
 * chosen. It is the least accessible option and the least effective one; the
 * component's own docstring carries the measurements.
 *
 * `onRefresh` must also clear `value` — a new challenge with the previous answer
 * still typed in reads as though the reader's input was accepted.
 *
 * `placeholder` overrides the default "Enter the characters" and applies to this
 * mode only; the other two have no field to place text in. `id` is set here so
 * the surrounding form can point its own `<label for>` at the input — pass it
 * whenever the check sits inside a form that labels its fields itself, and let it
 * default otherwise so two instances on one page cannot collide.
 */
export const ChallengeDeprecated: Story = {
  render: (args) => {
    const [value, setValue] = React.useState("");
    return (
      <BotCheck
        {...args}
        mode="challenge"
        status="idle"
        id="bot-check-challenge"
        placeholder="Type the six characters shown"
        challenge={{ type: "text", characters: "K7QN2M" }}
        value={value}
        onValueChange={setValue}
        onRefresh={() => setValue("")}
      />
    );
  },
};

/**
 * **Failed, with an error.** A red border on its own is not an error — the
 * sentence is what tells a citizen what happened and what to do, and it is what
 * a screen reader announces.
 */
export const Failed: Story = {
  args: {
    mode: "checkbox",
    status: "failed",
    error: "That did not verify. Try once more, or use the link below.",
  },
};

/** Disabled, and with the help label overridden for a portal that has its own route. */
export const DisabledWithCustomHelp: Story = {
  args: {
    mode: "checkbox",
    status: "idle",
    disabled: true,
    helpLabel: "Trouble verifying? Call the PM-AJAY helpdesk",
  },
};
