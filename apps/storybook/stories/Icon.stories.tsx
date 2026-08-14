import type { Meta, StoryObj } from "@storybook/react";
import { Button, Icon } from "@mosje/design-system";

/**
 * **Icon** — a Material Symbols Rounded glyph, the estate's single icon system.
 *
 * There is exactly one, deliberately. Do not introduce Lucide, Heroicons or a
 * hand-drawn SVG for a one-off; a second icon set is immediately visible as
 * inconsistent stroke weight across a page.
 *
 * The font must be loaded once in the app root — `import
 * "@mosje/design-system/icons.css"`. Without it, the icon name renders as
 * literal text, which is the usual explanation for "why does it say
 * `arrow_forward` on my page".
 *
 * **Accessibility is the part that goes wrong.** An icon beside a text label is
 * decoration: give it `aria-hidden`. An icon that is the *only* content of a
 * control carries the meaning, so the **control** needs the accessible name —
 * `aria-label` on the button, `aria-hidden` on the glyph. Putting the label on
 * the icon instead nests the name inside the control and reads oddly in several
 * screen readers.
 *
 * The MoSJE standard is **weight 300** for UI chrome. Use 400 for a large
 * standalone decorative glyph; both axes are variable-font settings, so
 * switching costs no extra download.
 *
 * Set size with `size`, not `style.fontSize` — `size` also drives the optical
 * size axis, so the glyph is drawn for the size it is rendered at rather than
 * scaled.
 *
 * Lifecycle: **Stable**.
 */
const meta = {
  title: "Components/Icon",
  component: Icon,
  args: {
    name: "account_circle",
    size: 24,
    weight: 300,
    fill: false,
    "aria-hidden": true,
  },
  argTypes: {
    name: { control: "text" },
    size: { control: { type: "range", min: 12, max: 72, step: 2 } },
    weight: { control: "select", options: [100, 200, 300, 400, 500, 600, 700] },
    fill: { control: "boolean" },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Icons in regular use across the portals. */
export const CommonGlyphs: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
      {[
        "dashboard",
        "description",
        "groups",
        "location_on",
        "handshake",
        "local_hospital",
        "payments",
        "bar_chart",
        "support_agent",
        "badge",
        "settings",
        "logout",
      ].map((name) => (
        <span
          key={name}
          style={{
            display: "grid",
            justifyItems: "center",
            gap: 6,
            color: "var(--sa-text-neutral-subtle)",
            fontSize: "var(--sa-type-body-3-size)",
          }}
        >
          <Icon {...args} name={name} />
          <code>{name}</code>
        </span>
      ))}
    </div>
  ),
};

/** Sizes. `size` drives the optical-size axis too, so glyphs stay crisp. */
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
      {[16, 20, 24, 32, 48].map((size) => (
        <Icon {...args} key={size} size={size} />
      ))}
    </div>
  ),
};

/** Weight 300 is the MoSJE standard for UI chrome; 400 for large decoration. */
export const Weights: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
      {([200, 300, 400, 600] as const).map((weight) => (
        <span key={weight} style={{ display: "grid", justifyItems: "center", gap: 6, color: "var(--sa-color-text-muted)" }}>
          <Icon {...args} size={32} weight={weight} />
          <code>{weight}</code>
        </span>
      ))}
    </div>
  ),
};

/** Stroke and filled are the same variable font — switching costs nothing. */
export const StrokeAndFill: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
      <Icon {...args} name="notifications" size={32} />
      <Icon {...args} name="notifications" size={32} fill />
      <Icon {...args} name="favorite" size={32} />
      <Icon {...args} name="favorite" size={32} fill />
    </div>
  ),
};

/**
 * The accessibility split. Beside a label the glyph is decoration; alone it is
 * the control that needs the name, not the icon.
 */
export const AccessibleUsage: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      {/* Decoration — the text already says what this does. */}
      <Button iconLeft={<Icon {...args} name="download" size={18} aria-hidden />}>
        Export roll-up
      </Button>
      {/* Icon-only — the BUTTON carries the name, the glyph stays hidden. */}
      <Button appearance="outlined" aria-label="Refresh figures">
        <Icon {...args} name="refresh" size={20} aria-hidden />
      </Button>
    </div>
  ),
};

/** Colour is inherited, so an icon takes the tone of whatever it sits in. */
export const InheritsColour: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
      <span style={{ color: "var(--sa-text-neutral-base)" }}>
        <Icon {...args} name="check_circle" size={28} />
      </span>
      <span style={{ color: "var(--sa-text-status-success-base)" }}>
        <Icon {...args} name="check_circle" size={28} />
      </span>
      <span style={{ color: "var(--sa-text-status-warning-base)" }}>
        <Icon {...args} name="warning" size={28} />
      </span>
      <span style={{ color: "var(--sa-text-status-error-base)" }}>
        <Icon {...args} name="error" size={28} />
      </span>
    </div>
  ),
};
