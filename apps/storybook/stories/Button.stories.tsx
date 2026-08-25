import type { Meta, StoryObj } from "@storybook/react";
import { Button, Icon } from "@mosje/design-system";

/**
 * **Button** — the primary action atom. Variants encode intent
 * (primary/success/danger/neutral), appearances encode prominence
 * (filled/outlined/text/tonal). Lifecycle: **Stable**.
 *
 * `variant="neutral"` is for an action with **no semantic charge** — a dismiss,
 * a reset, a "start over". Reach for it whenever you catch yourself wanting a
 * control to look different from the paragraph beside it: before it existed the
 * only way to do that was to borrow a signal colour, and the chatbot's reset
 * duly shipped outlined in the estate's *rejection* red for what is
 * housekeeping. On a portal where red means "your application was rejected",
 * spending it on a reset devalues the signal. Pair it with `appearance="text"`
 * for the quietest register the system has.
 *
 * `href` turns it into an `<a>`. Use it when the control **navigates** — a link
 * that merely looks like a button is still a link, and a keyboard user expects
 * Enter to follow it and the browser to offer "open in new tab". Do not reach
 * for it to style a form submit.
 *
 * `iconLeft` and `iconRight` are decoration and carry no accessible name; the
 * label does. For an icon-only button, put `aria-label` on the button and
 * `aria-hidden` on the glyph.
 */
const meta = {
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=609-283111"
    }
  },
  title: "Components/Button",
  component: Button,
  args: { children: "Submit application", variant: "primary", appearance: "filled", size: "md" },
  argTypes: {
    variant: { control: "inline-radio", options: ["primary", "success", "danger", "neutral"] },
    appearance: {
      control: "inline-radio",
      options: ["filled", "outlined", "text", "tonal", "inverse", "inverseOutlined"],
    },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    disabled: { control: "boolean" },
    href: { control: "text" },
    iconLeft: { control: false },
    iconRight: { control: false },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <Button {...args} variant="primary">Primary</Button>
      <Button {...args} variant="success">Success</Button>
      <Button {...args} variant="danger">Danger</Button>
      <Button {...args} variant="neutral">Neutral</Button>
    </div>
  ),
};

/**
 * **The quiet register, and the mistake it exists to prevent.**
 *
 * Top is what a reset should look like. Below it is what it looked like before
 * `neutral` existed — the only way to make a control read as a control was to
 * borrow `danger`, so a routine "clear this and start again" ended up wearing
 * the colour reserved for a rejected application.
 */
export const NeutralVsBorrowedSignal: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 20 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <Button {...args} variant="neutral" appearance="text" size="sm">Start over</Button>
        <span style={{ fontSize: "var(--sa-type-body-3-size)", color: "var(--sa-color-text-muted)" }}>
          right — no signal, still unmistakably a control
        </span>
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <Button {...args} variant="danger" appearance="outlined" size="sm">Start over</Button>
        <span style={{ fontSize: "var(--sa-type-body-3-size)", color: "var(--sa-color-text-muted)" }}>
          wrong — the rejection colour, spent on housekeeping
        </span>
      </div>
    </div>
  ),
};

export const Appearances: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <Button {...args} appearance="filled">Filled</Button>
      <Button {...args} appearance="outlined">Outlined</Button>
      <Button {...args} appearance="text">Text</Button>
      <Button {...args} appearance="tonal">Tonal</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
      <Button {...args} size="sm">Small</Button>
      <Button {...args} size="md">Medium</Button>
      <Button {...args} size="lg">Large</Button>
    </div>
  ),
};

export const Disabled: Story = { args: { disabled: true } };

/**
 * Icons are decoration — the label is the accessible name. A leading glyph
 * reinforces the verb; a trailing one implies movement onward.
 */
export const WithIcons: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
      <Button {...args} iconLeft={<Icon name="download" size={18} aria-hidden />}>
        Export roll-up
      </Button>
      <Button {...args} appearance="outlined" iconRight={<Icon name="arrow_forward" size={18} aria-hidden />}>
        Continue
      </Button>
      <Button
        {...args}
        appearance="text"
        iconLeft={<Icon name="add" size={18} aria-hidden />}
        iconRight={<Icon name="expand_more" size={18} aria-hidden />}
      >
        Add a report
      </Button>
      {/* Icon-only: the BUTTON carries the name, the glyph stays hidden. */}
      <Button {...args} appearance="outlined" aria-label="Refresh figures">
        <Icon name="refresh" size={20} aria-hidden />
      </Button>
    </div>
  ),
};

/**
 * `href` renders an `<a>`. Reach for it only when the control navigates — a
 * link styled as a button is still a link, and users expect it to behave like
 * one.
 */
export const AsALink: Story = {
  args: { href: "/schemes/pm-ajay", children: "Read the PM-AJAY guidelines" },
};

/**
 * `inverse` and `inverseOutlined` exist for a button sitting directly on a
 * solid brand surface, where the normal appearances disappear into it.
 */
export const OnABrandSurface: Story = {
  render: (args) => (
    <div
      style={{
        display: "flex",
        gap: 12,
        padding: 24,
        borderRadius: "var(--sa-shape-8)",
        background: "var(--sa-bg-brand-primary-bolder)",
      }}
    >
      <Button {...args} appearance="inverse">
        Apply online
      </Button>
      <Button {...args} appearance="inverseOutlined">
        Learn more
      </Button>
    </div>
  ),
};

/**
 * **Known defects, rendered rather than described.**
 *
 * A design system that only demonstrates its happy path teaches the happy path.
 * These three are real, measured on 2026-08-25, and open — the brief that closes
 * them is `docs/design-system/components/button-cleanup-prompt.md`. They are here
 * so a reviewer can see them, and so they cannot be quietly forgotten.
 */
export const KnownDefects: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 32, maxWidth: 720 }}>
      <section>
        <h3 style={{ margin: "0 0 4px", fontSize: 14 }}>
          1 · <code>disabled</code> does nothing on a link-button
        </h3>
        <p style={{ margin: "0 0 12px", fontSize: 13, color: "var(--sa-color-text-muted)" }}>
          `href` renders an `&lt;a&gt;`, and `disabled` is not a valid attribute there.
          Measured: pointer-events auto, opacity 1, cursor pointer, no `aria-disabled`,
          still in the tab order. Tab to it — it takes focus. Do not ship one.
        </p>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Button disabled>Disabled button — correct</Button>
          <Button href="/nowhere" disabled>
            Disabled link — still live
          </Button>
        </div>
      </section>

      <section>
        <h3 style={{ margin: "0 0 4px", fontSize: 14 }}>
          2 · A fixed height clips the label at 200% text (WCAG 1.4.4)
        </h3>
        <p style={{ margin: "0 0 12px", fontSize: 13, color: "var(--sa-color-text-muted)" }}>
          Sizes set `height`, not `min-height`. At 200% the box stays 40px while the
          content needs 41.
        </p>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Button>Apply now</Button>
          <Button style={{ fontSize: 32 }}>Apply now</Button>
        </div>
      </section>

      <section>
        <h3 style={{ margin: "0 0 4px", fontSize: 14 }}>
          3 · Tonal has no perceivable edge (WCAG 1.4.11 needs 3:1)
        </h3>
        <p style={{ margin: "0 0 12px", fontSize: 13, color: "var(--sa-color-text-muted)" }}>
          Boundary against the page: primary 1.42, success 1.52, danger 1.21,
          neutral 1.35. You cannot tell where the control is except by reading it.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {(["primary", "success", "danger", "neutral"] as const).map((v) => (
            <Button key={v} variant={v} appearance="tonal">
              {v}
            </Button>
          ))}
        </div>
      </section>
    </div>
  ),
};

/**
 * `inverseOutlined` renders **identically for all four variants** — white text,
 * white border — so `variant="danger"` silently loses its signal. Compare the
 * top row (inverse, which does respect the variant) with the bottom.
 */
export const InverseIgnoresVariant: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gap: 16,
        padding: 24,
        borderRadius: "var(--sa-shape-8)",
        background: "var(--sa-bg-brand-primary-bolder)",
      }}
    >
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {(["primary", "success", "danger", "neutral"] as const).map((v) => (
          <Button key={v} variant={v} appearance="inverse">
            {v}
          </Button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {(["primary", "success", "danger", "neutral"] as const).map((v) => (
          <Button key={v} variant={v} appearance="inverseOutlined">
            {v}
          </Button>
        ))}
      </div>
    </div>
  ),
};

/**
 * There is **no** `loading` prop. Pass `aria-busy` and `disabled` yourself and
 * swap the label — this is the pattern to copy, not something the component does.
 */
export const LoadingIsConsumerSupplied: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <Button>Submit application</Button>
      <Button disabled aria-busy="true">
        Submitting…
      </Button>
    </div>
  ),
};
