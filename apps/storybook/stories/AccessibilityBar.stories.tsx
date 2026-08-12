import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AccessibilityBar } from "@mosje/design-system";

/**
 * **AccessibilityBar** — the government top utility bar (UX4G / GIGW).
 *
 * The "Government of India" link sits on the left; the accessibility controls sit
 * on the right, each independently toggleable: **Skip to content**, **Font size**
 * (A−/A/A+), **Accessibility**, and **Language**. It IS the accessibility surface,
 * so every control is keyboard-operable and announced.
 *
 * This is the canonical, Figma-matching bar (SAMAVESH → *Accessibility Bar*). Note
 * that `SiteHeader` renders its OWN Tier-1 bar with font-size deliberately removed
 * per the accessibility-consolidation spec (the UX4G widget is the single canonical
 * mechanism for font-size/contrast estate-wide). This standalone component keeps
 * font-size because the Figma component does — use it directly when you want the
 * full bar, or drive `SiteHeader` for the assembled masthead.
 *
 * `layout` sets the inner content-container width — **narrow** (720), **wide**
 * (1200), or **fluid** (full-bleed) — reproducing UX4G's per-breakpoint padding
 * with one mechanism. `tone` is the brand fill (`blue` default, or `navy`).
 *
 * `maxWidth` is an escape hatch that overrides the `layout` preset with an
 * explicit pixel width — `SiteHeader` passes its own `maxWidth` so the bar's
 * container lines up with the brand/nav rows below it. **Prefer `layout` for
 * standalone use**; reach for `maxWidth` only when aligning to an existing grid.
 *
 * The font-size control drives a `--sa-font-scale` CSS variable on `:root` and a
 * `data-sa-font-scale` attribute; pass `onFontScaleChange` to persist the reader's
 * choice. Content that sizes in `rem` (or reads the variable) then reflows.
 *
 * Lifecycle: **Stable**.
 */
const meta = {
  title: "Navigation/AccessibilityBar",
  component: AccessibilityBar,
  parameters: { layout: "fullscreen" },
  argTypes: {
    layout: { control: "inline-radio", options: ["narrow", "wide", "fluid"] },
    tone: { control: "inline-radio", options: ["blue", "navy"] },
    showSkip: { control: "boolean" },
    fontSize: { control: "boolean" },
    accessibility: { control: "boolean" },
  },
  args: {
    govLink: { href: "https://india.gov.in/", label: "Government of India" },
    skipTo: "#main-content",
    showSkip: true,
    fontSize: true,
    accessibility: true,
    language: { label: "English" },
    layout: "wide",
    tone: "blue",
  },
} satisfies Meta<typeof AccessibilityBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** All four controls, wide container — the default masthead bar. */
export const Playground: Story = {};

/** Portal chrome tone. */
export const Navy: Story = {
  args: { tone: "navy" },
};

/** Full-bleed: the content spans the whole viewport (only edge padding). */
export const Fluid: Story = {
  args: { layout: "fluid" },
};

/** The most inset container — content matches a 720px page column. */
export const Narrow: Story = {
  args: { layout: "narrow" },
};

/**
 * Font-size stepper only — with a live readout of the scale it publishes, so you
 * can see A−/A/A+ drive `--sa-font-scale`.
 */
export const FontSizeControl: Story = {
  render: (args) => {
    const [scale, setScale] = React.useState(1);
    return (
      <div>
        <AccessibilityBar {...args} onFontScaleChange={setScale} />
        <p style={{ padding: "16px", fontSize: `calc(1rem * ${scale})` }}>
          This paragraph scales with the reader's chosen text size (current scale:{" "}
          {scale.toFixed(2)}×). Try the A− / A / A+ buttons in the bar above.
        </p>
      </div>
    );
  },
  args: { showSkip: false, accessibility: false, language: false },
};

/**
 * The accessibility entry as a button (opens a dialog/widget) rather than a link
 * to the statement page. Set `onAccessibility` OR `accessibilityHref`, not both.
 */
export const AccessibilityAsButton: Story = {
  args: {
    onAccessibility: () => window.alert("Open accessibility options"),
  },
};
