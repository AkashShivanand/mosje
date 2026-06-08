import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@mosje/design-system";

/**
 * **Button** — the primary action atom. Variants encode intent (primary/success/danger),
 * appearances encode prominence (filled/outlined/text/tonal). Lifecycle: **Stable**.
 */
const meta = {
  title: "Components/Button",
  component: Button,
  args: { children: "Submit application", variant: "primary", appearance: "filled", size: "md" },
  argTypes: {
    variant: { control: "inline-radio", options: ["primary", "success", "danger"] },
    appearance: { control: "inline-radio", options: ["filled", "outlined", "text", "tonal"] },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    disabled: { control: "boolean" },
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
