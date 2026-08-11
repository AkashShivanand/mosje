import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardBody, Skeleton, SkeletonRow, SkeletonText } from "@mosje/design-system";

/**
 * **Skeleton** — a placeholder in the shape of the thing that is loading.
 *
 * `design.md` requires every loading container to render either a `Loader` or a
 * skeleton, never an empty box. Choose between them by **whether you know the
 * shape**: if you do — a table of rows, a card, a paragraph — a skeleton holds
 * the layout so nothing jumps when the data lands. If you do not, or the wait is
 * brief and indeterminate, a `Loader` is honest and a skeleton is a guess.
 *
 * It is always `aria-hidden`. The placeholder says nothing useful to a screen
 * reader; put `aria-busy` on the surrounding region and announce there instead.
 * The shimmer stops under `prefers-reduced-motion`.
 *
 * `SkeletonText` (a paragraph, last line deliberately short) and `SkeletonRow`
 * (a real `<tr>` of `<td>`s, so column widths stay put) are documented here
 * rather than in stories of their own.
 *
 * Lifecycle: **Stable**.
 */
const meta = {
  title: "Components/Feedback/Skeleton",
  component: Skeleton,
  args: {
    width: "100%",
    height: "1rem",
    circle: false,
  },
  argTypes: {
    width: { control: "text" },
    height: { control: "text" },
    circle: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 560 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** The three primitives: a bar, a circle, and a block. */
export const Shapes: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 12 }}>
      <Skeleton {...args} height="0.75rem" width="40%" />
      <Skeleton {...args} circle width="48px" height="48px" />
      <Skeleton {...args} height="120px" />
    </div>
  ),
};

/** `SkeletonText` — the last line is short so it reads as prose, not a slab. */
export const Paragraph: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 24 }}>
      <SkeletonText />
      <SkeletonText lines={5} />
    </div>
  ),
};

/** A card mid-load — the point is that nothing moves when the data arrives. */
export const LoadingCard: Story = {
  render: () => (
    <div aria-busy="true" aria-label="Loading scheme summary">
      <Card>
        <CardBody>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
            <Skeleton circle width="40px" height="40px" />
            <div style={{ flex: 1, display: "grid", gap: 8 }}>
              <Skeleton height="0.9rem" width="55%" />
              <Skeleton height="0.7rem" width="35%" />
            </div>
          </div>
          <SkeletonText lines={3} />
        </CardBody>
      </Card>
    </div>
  ),
};

/**
 * `SkeletonRow` renders real `<td>`s, so the columns do not resize when the
 * rows land — the failure a `<div>` placeholder cannot avoid.
 */
export const LoadingTable: Story = {
  render: () => (
    <table
      aria-busy="true"
      style={{ width: "100%", borderCollapse: "collapse", color: "var(--sa-color-text-default)" }}
    >
      <caption style={{ textAlign: "left", paddingBottom: 8, color: "var(--sa-color-text-muted)" }}>
        Loading district submissions…
      </caption>
      <thead>
        <tr style={{ textAlign: "left", color: "var(--sa-color-text-muted)" }}>
          <th style={{ padding: "8px 12px 8px 0" }}>District</th>
          <th style={{ padding: "8px 12px 8px 0" }}>Blocks reporting</th>
          <th style={{ padding: "8px 12px 8px 0" }}>Participants</th>
          <th style={{ padding: "8px 12px 8px 0" }}>Status</th>
        </tr>
      </thead>
      <tbody>
        {[0, 1, 2, 3].map((i) => (
          <SkeletonRow key={i} cols={4} />
        ))}
      </tbody>
    </table>
  ),
};
