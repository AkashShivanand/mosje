import type { Meta, StoryObj } from "@storybook/react";
import { Button, Icon } from "@mosje/design-system";

/**
 * **Button** — the primary action atom. Variants encode intent (primary/success/danger),
 * appearances encode prominence (filled/outlined/text/tonal). Lifecycle: **Stable**.
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
  title: "Components/Button",
  component: Button,
  args: { children: "Submit application", variant: "primary", appearance: "filled", size: "md" },
  argTypes: {
    variant: { control: "inline-radio", options: ["primary", "success", "danger"] },
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
        borderRadius: "var(--ds-radius-md)",
        background: "var(--ds-primary)",
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
