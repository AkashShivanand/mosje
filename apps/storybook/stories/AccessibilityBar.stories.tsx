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
 * with one mechanism.
 *
 * **There is no `tone` prop.** Blue vs Navy is the BRAND AXIS: put `data-brand="navy"`
 * on the bar or any ancestor and the same token resolves to the navy ramp (#003366).
 * Figma models it identically, as Palette collection modes — which is why the master
 * has no Tone variant. Never reintroduce a colour prop here.
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
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=55065-33766"
    }, layout: "fullscreen" },
  argTypes: {
    layout: { control: "inline-radio", options: ["narrow", "wide", "fluid"] },
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
  },
} satisfies Meta<typeof AccessibilityBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** All four controls, wide container — the default masthead bar. */
export const Playground: Story = {};

/** Navy — set by the brand axis, not a prop. Identical markup, `data-brand="navy"`. */
export const Navy: Story = {
  render: (args) => (
    <div data-brand="navy">
      <AccessibilityBar {...args} />
    </div>
  ),
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
 * **Mobile** — the Figma `Device` axis. `device` defaults to `"auto"`, which resolves
 * the same breakpoints in CSS so a single instance adapts; pin an explicit device
 * (`mobile` · `tablet` · `desktop` · `desktop-xl`) only to reproduce one Figma variant
 * for a specimen or a visual test.
 *
 * On mobile the right-hand cluster collapses — font size, accessibility and language
 * move into the consumer's own menu — but **the skip link deliberately stays**, because
 * it is the page's WCAG 2.4.1 bypass mechanism and Figma's Mobile variant dropping it
 * is the one place the code does not follow the design.
 */
export const MobileDevice: Story = {
  args: { device: "mobile" },
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

/**
 * **`skipLabel` — the skip link is translatable.** The text was a hardcoded English
 * string until 2026-08-18, which on a bilingual estate is a defect rather than a
 * design: a Hindi surface needs its own wording and could not have it without
 * forking the component. GIGW's "Skip to Main Content" remains the default, so no
 * existing call site moves.
 *
 * Mirrors Figma's `Skip label` text property, which the Code Connect template now
 * maps (it previously recorded the omission honestly, for want of a prop to map to).
 *
 * Note what does NOT change: `skipTo` is still the target id, and the link is still
 * the first interactive element on the page — translating the label does not touch
 * the WCAG 2.4.1 bypass mechanism itself.
 */
export const TranslatedSkipLabel: Story = {
  args: {
    // ds-exempt(specimen): `skipLabel` is a string prop, so the story cannot attach lang="hi"; the component owns the attribute
    skipLabel: "मुख्य सामग्री पर जाएँ",
    govLink: { label: "भारत सरकार" },
    language: { label: "हिन्दी" },
  },
};
