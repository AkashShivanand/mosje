import type { Meta, StoryObj } from "@storybook/react";
import { Button, Loader } from "@mosje/design-system";

/**
 * **Loader** — an indeterminate spinner with a visually-hidden label.
 *
 * Use it when you **do not know the shape** of what is coming, or the wait is
 * short: a button mid-submit, a panel fetching a figure. When you do know the
 * shape — a table, a card, a paragraph — use `Skeleton` instead, so the layout
 * does not jump when the data lands. `design.md` requires one or the other;
 * an empty box while loading is the defect both exist to prevent.
 *
 * The `label` is the announcement, not decoration: it is read by screen readers
 * through `role="status"`. Replace the default with what is actually happening
 * ("Verifying Aadhaar…") whenever you can — "Loading…" three times on one page
 * tells a non-sighted user nothing about which part finished.
 *
 * `variant="secondary"` is for placing the spinner on a filled brand surface,
 * where the primary colour would disappear into the background.
 *
 * Lifecycle: **Stable**.
 */
const meta = {
  title: "Components/Feedback/Loader",
  component: Loader,
  args: {
    size: "md",
    variant: "primary",
    label: "Loading…",
  },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    variant: { control: "inline-radio", options: ["primary", "secondary"] },
    label: { control: "text" },
  },
} satisfies Meta<typeof Loader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
      {(["sm", "md", "lg"] as const).map((size) => (
        <Loader {...args} key={size} size={size} label={`Loading (${size})`} />
      ))}
    </div>
  ),
};

/** `secondary` exists for solid brand surfaces, where primary would vanish. */
export const OnABrandSurface: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 16 }}>
      <div
        style={{
          padding: 24,
          borderRadius: "var(--ds-radius-md)",
          background: "var(--ds-surface-muted)",
        }}
      >
        <Loader {...args} variant="primary" label="Loading on a muted surface" />
      </div>
      <div
        style={{
          padding: 24,
          borderRadius: "var(--ds-radius-md)",
          background: "var(--ds-primary)",
        }}
      >
        <Loader {...args} variant="secondary" label="Loading on the brand surface" />
      </div>
    </div>
  ),
};

/**
 * A meaningful label. Say what is happening — three identical "Loading…"
 * announcements on one page tell a screen-reader user nothing.
 */
export const WithAMeaningfulLabel: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 12 }}>
      <Loader {...args} label="Verifying Aadhaar with UIDAI…" />
      <Loader {...args} label="Fetching district submissions for Maharashtra…" />
      <Loader {...args} label="Generating the Mass Pledge roll-up…" />
    </div>
  ),
};

/** In a button mid-submit — the short, shape-unknown wait Loader is for. */
export const InAButton: Story = {
  render: (args) => (
    <Button disabled iconLeft={<Loader {...args} size="sm" variant="secondary" label="Submitting…" />}>
      Submitting…
    </Button>
  ),
};
