import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "@mosje/design-system";

/**
 * **Badge** — a status pill for a record's state, not a decoration. The label
 * must be readable on its own: colour is a reinforcement, never the message.
 * Lifecycle: **Stable**.
 */
const meta = {
  title: "Components/Badge",
  component: Badge,
  args: { children: "Approved", status: "success", size: "sm", emphasis: "subtle" },
  argTypes: {
    status: {
      control: "inline-radio",
      options: ["neutral", "info", "success", "warning", "danger"],
    },
    size: { control: "inline-radio", options: ["sm", "md"] },
    emphasis: { control: "inline-radio", options: ["subtle", "solid"] },
    dot: { control: "boolean" },
    pulse: { control: "boolean" },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Statuses: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <Badge {...args} status="neutral">Draft</Badge>
      <Badge {...args} status="info">Under review</Badge>
      <Badge {...args} status="success">Approved</Badge>
      <Badge {...args} status="warning">Returned</Badge>
      <Badge {...args} status="danger">Rejected</Badge>
    </div>
  ),
};

export const WithStatusDot: Story = {
  args: { dot: true, status: "info", children: "Pending at district" },
};
