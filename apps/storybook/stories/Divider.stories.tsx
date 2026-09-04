import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Divider } from "@mosje/design-system";

/**
 * **Divider** — the estate's thin rule. Code counterpart of the SAMAVESH Figma master
 * `Divider` (Orientation × Tone = 6 variants).
 *
 * It existed in Figma from the day the AccessibilityBar was built and had **no code
 * counterpart at all** until 2026-08-18, so every consumer hand-rolled its own rule —
 * the bar with a styled `<span>`, others with a bordered `<div>`. That is how a 1px
 * hairline ends up with several slightly different colours across one estate. If you
 * are about to write `border-top: 1px solid …`, use this instead.
 *
 * **Thickness is the only component-scoped value** (`cmp/divider/width`). The tones
 * bind straight to `border/neutral/*`, because a rule's colour is a shared semantic and
 * not this component's private business.
 *
 * **`length` is optional and usually wrong to set.** Omit it and the rule stretches:
 * horizontal fills its container's width, vertical stretches to its tallest sibling in
 * an auto-layout row. Pass a length only when the design calls for a short rule — the
 * AccessibilityBar does, because Figma draws its separators at the 20px height of the
 * glyph beside them rather than the full 46px row.
 */
const meta = {
  title: "Layout/Divider",
  component: Divider,
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=55061-700"
    }, layout: "padded" },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  args: { orientation: "horizontal" },
};

/**
 * Vertical rules stretch to their tallest sibling in a flex row — that is
 * `align-self: stretch`, not `height: 100%`, which resolves against a parent with no
 * explicit height and collapses to nothing.
 */
export const Vertical: Story = {
  render: (args) => (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", height: "40px" }}>
      <span>Before</span>
      <Divider {...args} orientation="vertical" />
      <span>After</span>
    </div>
  ),
};

/**
 * **The three tones, and which to reach for.** `default` is for light surfaces.
 * `inverse` is full-strength white, for a rule separating *sections* on a dark surface.
 * `inverse-subtle` is white at 40% and is the one for rules between *controls* inside a
 * brand surface — at full strength the rule competes with the thing it separates, which
 * is why the AccessibilityBar uses the subtle one.
 */
export const Tones: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "24px" }}>
      <div>
        <p style={{ marginBottom: 8, fontSize: "var(--sa-type-body-3-size)", lineHeight: "var(--sa-type-body-3-lh)" }}>default — on a light surface</p>
        <Divider tone="default" />
      </div>
      <div style={{ background: "var(--sa-bg-brand-primary-bolder)", padding: "16px" }}>
        <p style={{ marginBottom: 8, fontSize: "var(--sa-type-body-3-size)", lineHeight: "var(--sa-type-body-3-lh)", color: "#fff" }}>inverse — sections on a dark surface</p>
        <Divider tone="inverse" />
        <p style={{ margin: "16px 0 8px", fontSize: "var(--sa-type-body-3-size)", lineHeight: "var(--sa-type-body-3-lh)", color: "#fff" }}>inverse-subtle — between controls</p>
        <Divider tone="inverse-subtle" />
      </div>
    </div>
  ),
};

/**
 * **`decorative` decides whether assistive technology hears it, and the default is
 * deliberate.** A rule between the controls of a toolbar is presentation — announcing
 * "separator" between every pair of buttons in the accessibility bar is noise — so the
 * default is `aria-hidden` with no role.
 *
 * Pass `decorative={false}` for a rule that is a genuine thematic break between
 * sections. It then renders a real `<hr>`, which already carries `role="separator"`.
 */
export const ThematicBreak: Story = {
  args: { decorative: false },
  render: (args) => (
    <div>
      <p>End of one section.</p>
      <Divider {...args} />
      <p>Start of the next.</p>
    </div>
  ),
};

/**
 * An explicit `length` — what the AccessibilityBar passes, so its separators match the
 * 20px glyphs beside them instead of stretching the full 46px row.
 */
export const ExplicitLength: Story = {
  render: () => (
    <div
      style={{
        display: "flex", alignItems: "center", gap: "12px", height: "46px",
        background: "var(--sa-bg-brand-primary-bolder)", padding: "0 16px", color: "#fff",
      }}
    >
      <span style={{ fontSize: "var(--sa-type-body-3-size)", lineHeight: "var(--sa-type-body-3-lh)" }}>Skip to Main Content</span>
      <Divider orientation="vertical" tone="inverse-subtle" length={20} />
      <span style={{ fontSize: "var(--sa-type-body-3-size)", lineHeight: "var(--sa-type-body-3-lh)" }}>A− A A+</span>
      <Divider orientation="vertical" tone="inverse-subtle" length={20} />
      <span style={{ fontSize: "var(--sa-type-body-3-size)", lineHeight: "var(--sa-type-body-3-lh)" }}>English</span>
    </div>
  ),
};
