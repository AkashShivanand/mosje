import type { Meta, StoryObj } from "@storybook/react";
import {
  Alert,
  Button,
  Card,
  CardBody,
  ColorModeProvider,
  ColorModeSwitcher,
} from "@mosje/design-system";

/**
 * **ColorModeSwitcher** — the brand-axis picker.
 *
 * The thing to be clear about: **colour mode is not the theme.** They are
 * separate axes and both exist.
 *
 * - **Colour mode** (`data-color-mode`, this component) is the *brand* axis —
 *   which palette a property wears. `blue-light` is the default; `blue-dark` is
 *   a different brand treatment, not a dark theme.
 * - **Theme** (light / dark / high contrast) is the *user's* axis, and it is
 *   owned by the official UX4G accessibility widget, which is the single
 *   canonical mechanism estate-wide. Do not build a second dark-mode toggle.
 *
 * It must be rendered inside a **`ColorModeProvider`**, which owns the state and
 * persists it to a cookie so the choice survives navigation between zones.
 * Without the provider it throws — which is why the stories wrap it.
 *
 * Implemented as a WAI-ARIA radiogroup with a roving tabindex: arrow keys move
 * *and* select, Home and End jump to the ends. It reads the mode list from the
 * design system, so a mode added there appears here with no change to this
 * component.
 *
 * `compact` drops the swatch names for a toolbar; `hideLabel` drops the group
 * label but keeps it as the accessible name.
 *
 * Lifecycle: **Stable**.
 */
const meta = {
  title: "Foundations/ColorModeSwitcher",
  component: ColorModeSwitcher,
  args: {
    label: "Colour mode",
    hideLabel: false,
    compact: false,
  },
  argTypes: {
    label: { control: "text" },
    hideLabel: { control: "boolean" },
    compact: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <ColorModeProvider>
        <Story />
      </ColorModeProvider>
    ),
  ],
} satisfies Meta<typeof ColorModeSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** The three presentations. All are the same radiogroup underneath. */
export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 32, justifyItems: "start" }}>
      <ColorModeSwitcher {...args} />
      <ColorModeSwitcher {...args} hideLabel />
      <ColorModeSwitcher {...args} compact />
    </div>
  ),
};

/** A custom group label, where "Colour mode" is not the right phrase. */
export const CustomLabel: Story = {
  args: { label: "Brand palette" },
};

/**
 * Switch modes and watch the components beside it re-tone. Nothing here reads
 * the mode — everything is drawn from `--ds-*` tokens, which is the point.
 */
export const AffectsEverything: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 24, maxWidth: 520 }}>
      <ColorModeSwitcher {...args} />
      <Card>
        <CardBody>
          <div style={{ display: "grid", gap: 12 }}>
            <Alert status="info" title="Application received">
              We will write to you once a district officer has reviewed it.
            </Alert>
            <div style={{ display: "flex", gap: 8 }}>
              <Button>Approve</Button>
              <Button appearance="outlined">Return for correction</Button>
              <Button appearance="text">Cancel</Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  ),
};
