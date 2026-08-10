import type { Meta, StoryObj } from "@storybook/react";
import { AppSwitcher, ColorModeProvider, DEFAULT_APPS } from "@mosje/design-system";

/**
 * **AppSwitcher** — the searchable cross-zone control panel, pinned bottom-left.
 *
 * It is **mandatory on every page of every portal** except the hub root. The
 * estate is 20 portals behind one gate; without it, moving between them means
 * going back to the hub and starting again. See
 * `.claude/rules/portal-appswitcher.md`.
 *
 * Two things it needs from the app:
 *
 * - It must be rendered **inside a `ColorModeProvider`** — the panel header
 *   carries the colour-mode swatches, so without the provider it throws. That
 *   is why the stories below wrap it.
 * - It renders plain `<a href>` links, not a router's `Link`, so navigation
 *   works from inside any basePath-ed zone. Nothing to configure; just do not
 *   swap them.
 *
 * **`devMode` is a deprecated no-op**, and the reason is worth keeping: it used
 * to hide a "Dev" section holding the design system and Storybook. The people
 * who most need to check what a component is meant to do — BAs, QAs, designers
 * — never run a dev build, so gating those two on `NODE_ENV` hid them from
 * exactly the wrong audience. They now live under "Resources" and are always
 * shown. The prop is kept so existing call sites still compile; remove it when
 * you touch one.
 *
 * `/` focuses the search box while the panel is open.
 *
 * Lifecycle: **Stable**.
 */
const meta = {
  title: "Components/Navigation/AppSwitcher",
  component: AppSwitcher,
  args: {
    label: "Apps",
  },
  argTypes: {
    label: { control: "text" },
    apps: { control: false },
    devMode: { control: false },
  },
  decorators: [
    (Story) => (
      <ColorModeProvider>
        {/* The FAB is position:fixed, so give the canvas somewhere to sit. */}
        <div style={{ minHeight: 520, position: "relative" }}>
          <p style={{ margin: 0, color: "var(--ds-ink-muted)" }}>
            The switcher is pinned to the bottom-left of the viewport. Open it, then press
            <kbd style={{ margin: "0 4px" }}>/</kbd> to jump to the search box.
          </p>
          <Story />
        </div>
      </ColorModeProvider>
    ),
  ],
} satisfies Meta<typeof AppSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The full estate registry — website, portals and resources. */
export const Playground: Story = {};

/** A custom FAB label, where "Apps" is not the right word for the audience. */
export const CustomLabel: Story = {
  args: { label: "Switch portal" },
};

/**
 * A cut-down registry. `apps` overrides the default estate list — useful for a
 * standalone deployment that only carries a few zones.
 */
export const ScopedRegistry: Story = {
  args: {
    apps: DEFAULT_APPS.slice(0, 5),
  },
};

/**
 * `devMode` retained from an older call site. It does nothing — the design
 * system and Storybook are always listed under Resources.
 */
export const DeprecatedDevModeIsANoOp: Story = {
  args: { devMode: true },
};
