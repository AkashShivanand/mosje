import type { Meta, StoryObj } from "@storybook/react";
import { IconButton, Icon } from "@mosje/design-system";

/**
 * **IconButton** — a Button whose whole label is its icon. Lifecycle: **Stable**.
 *
 * It renders a real `Button`, so variant, appearance, `tone`, size, `disabled`,
 * `loading` and the link form all behave identically. There is one button in this
 * system; this is a shape of it, not a second implementation.
 *
 * **Why a component and not an `iconOnly` prop.** UX4G models icon-only as a property
 * of the button, which is a fair reading — it is not the one taken here. As a
 * component, **`aria-label` can be required by the type system**. On an ordinary Button
 * the accessible name arrives as `children`, and a boolean prop cannot make a *different*
 * prop mandatory, so an unlabelled icon-only button would compile. This estate has
 * already paid for that: 533 of 718 icon call sites were missing their label before
 * `Icon` started hiding itself by default.
 *
 * **Label what the control DOES, not what the glyph depicts** — "Close dialog", never
 * "Cross". The glyph is `aria-hidden` because `Icon` renders a font ligature, which is
 * real text: unhidden, a screen reader announces "close Close dialog".
 */
const meta = {
  title: "Components/IconButton",
  component: IconButton,
  args: {
    "aria-label": "Close dialog",
    icon: <Icon name="close" size={20} />,
    variant: "neutral",
    appearance: "text",
    size: "md",
  },
  argTypes: {
    variant: { control: "inline-radio", options: ["primary", "success", "danger", "neutral"] },
    appearance: { control: "inline-radio", options: ["filled", "outlined", "text"] },
    tone: { control: "inline-radio", options: ["default", "inverse"] },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
    icon: { control: false },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Square at 32 / 40 / 48 — the same rungs as the Button ladder, so the two cannot drift. */
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <IconButton {...args} size="sm" aria-label="Close, small" />
      <IconButton {...args} size="md" aria-label="Close, medium" />
      <IconButton {...args} size="lg" aria-label="Close, large" />
    </div>
  ),
};

/**
 * Every Button appearance and variant is available, because it *is* a Button.
 * Only `lg` reaches the 44×44 UX4G recommends for touch; all three clear WCAG 2.2
 * §2.5.8's 24×24 minimum.
 */
export const Appearances: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
      <IconButton {...args} appearance="filled" aria-label="Filled" />
      <IconButton {...args} appearance="outlined" aria-label="Outlined" />
      <IconButton {...args} appearance="text" aria-label="Text" />
      <IconButton
        {...args}
        variant="danger"
        appearance="outlined"
        icon={<Icon name="delete" size={20} />}
        aria-label="Delete record"
      />
    </div>
  ),
};

/** On a solid brand surface, via the `tone` axis rather than a separate appearance. */
export const InverseTone: Story = {
  render: (args) => (
    <div
      style={{
        display: "flex",
        gap: 12,
        padding: 24,
        background: "var(--sa-color-primaryScale-600)",
        borderRadius: 12,
      }}
    >
      <IconButton {...args} tone="inverse" appearance="filled" aria-label="Filled, inverse" />
      <IconButton {...args} tone="inverse" appearance="outlined" aria-label="Outlined, inverse" />
    </div>
  ),
};

/**
 * **`shape="circle"`** is for a control that floats free of a form's rhythm — a dialog's
 * close, a toast's dismiss, a floating action.
 *
 * Square stays the default because most icon buttons sit in a toolbar or a table row
 * beside square-cornered siblings, and a round control in that line reads as a different
 * kind of thing. The radius is `--sa-shape-full` rather than a large number, so it stays
 * a circle at every size on the ladder and at 200% text.
 */
export const Shape: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <IconButton aria-label="Close dialog" icon={<Icon name="close" size={20} />} appearance="outlined" />
      <IconButton
        aria-label="Close dialog"
        icon={<Icon name="close" size={20} />}
        appearance="outlined"
        shape="circle"
      />
    </div>
  ),
};

/**
 * **`tooltip` serves the people `aria-label` does not.**
 *
 * An icon-only control is already named for a screen reader. The person who can SEE the
 * glyph but does not recognise it gets nothing — and that is most people, on most icons
 * that are not a cross or a magnifier. Primer, Fluent and Carbon all pair icon buttons
 * with a tooltip for this reason.
 *
 * `tooltip` reuses the `aria-label`; pass a string to say something else. When the bubble
 * repeats the accessible name it is marked `duplicatesTriggerName`, so a screen reader
 * announces the label once rather than twice.
 *
 * Hover these, then Tab to them — a tooltip that only opens on hover is unreachable by
 * keyboard, so this one opens on focus too.
 */
export const WithTooltip: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <IconButton aria-label="Download the sanction order" icon={<Icon name="download" size={20} />} tooltip />
      <IconButton
        aria-label="Delete application"
        icon={<Icon name="delete" size={20} />}
        variant="danger"
        tooltip="Delete — this cannot be undone"
        tooltipSide="bottom"
      />
    </div>
  ),
};

/**
 * **`fullWidth` and `nowrap` are not available here, and that is deliberate.**
 *
 * They leaked in through `ButtonProps` and are meaningless on this control: it is square
 * (`aspect-ratio: 1`), so `fullWidth` would stretch it into a rectangle and break the one
 * geometric promise it makes, and `nowrap` governs a label it does not have. The type
 * omits them rather than the documentation asking nicely.
 */
export const OmittedProps: Story = {
  render: () => (
    <IconButton aria-label="Add beneficiary" icon={<Icon name="add" size={20} />} appearance="outlined" />
  ),
};
