import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AppSwitcherPanel, DEFAULT_APPS, type AppEntry } from "@mosje/design-system";

/**
 * **AppSwitcherPanel** — the searchable, grouped destination list behind the
 * Apps tab of `DemoDock`. It is pure content: a current-app indicator, a
 * search box (the `/` shortcut focuses it while the panel is mounted), and
 * the list itself, grouped **Website → Portals → Reports → Resources**. It
 * owns none of the floating chrome — no `position: fixed`, no open/close
 * state, no colour-mode handling — so a shell owns that and mounts this for
 * its body. Today that shell is `DemoDock`; the standalone FAB it used to
 * live inside (`AppSwitcher`) no longer exists.
 *
 * **Use it** wherever a searchable jump-to-anywhere list over the estate
 * registry is the job. **Do not use it** as a primary in-portal navigation
 * menu — it has no notion of "current section within a portal", only
 * "current top-level zone", and every planned entry renders disabled with a
 * "soon" badge, which is the right treatment for a cross-estate switcher and
 * the wrong one for a portal's own sidebar (`SidebarNav` is that component).
 *
 * The panel does not scroll itself — `.ds-appsw__body` has no scroll box of
 * its own, so whatever mounts it (here, the story's own wrapper; in
 * production, `DemoDock`'s `.ds-demodock__body`) owns the one scrollbar. The
 * `LongListScrolling` story below shows why that split matters: with ~26
 * registered destinations, the list needs to scroll, and its group headings
 * need to stay pinned while it does.
 *
 * `onNavigate` fires when a destination link is clicked, so a containing
 * shell can close itself on selection — `DemoDock` passes its own
 * `closePanel`. `showCurrentApp` hides the panel's own "Currently in" row for
 * a shell (again, `DemoDock`) that already states the current app once in
 * its own header and would otherwise say it twice.
 *
 * Lifecycle: **Stable**.
 */
const meta = {
  title: "Components/Navigation/AppSwitcherPanel",
  component: AppSwitcherPanel,
  args: {
    pathname: "/portals/nmba/admin/login",
    showCurrentApp: true,
  },
  argTypes: {
    pathname: { control: "text" },
    showCurrentApp: { control: "boolean" },
    apps: { control: false },
    onNavigate: { control: false },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          width: 420,
          maxHeight: 460,
          overflowY: "auto",
          border: "1px solid var(--sa-border-neutral-subtle)",
          borderRadius: "var(--sa-shape-8)",
          background: "var(--sa-bg-neutral-base)",
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AppSwitcherPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The full registry, current app resolved from `pathname`. */
export const Playground: Story = {};

/**
 * The whole point of the panel: ~26 destinations across four groups, sticky
 * group headings staying pinned as the list scrolls past them. Scroll the
 * frame below — "Portals" (the longest group) stays visible under the
 * header the entire time.
 */
export const LongListScrolling: Story = {
  args: {
    pathname: "/portals/nmba",
  },
};

/**
 * `showCurrentApp={false}` — the treatment `DemoDock` uses, because its own
 * header already states "Currently in" once. Compare against `Playground`
 * above: the current-app row at the top of the panel is gone, search moves up.
 */
export const WithoutCurrentAppRow: Story = {
  args: {
    showCurrentApp: false,
  },
};

/**
 * Typing into search narrows every group at once — try "scw", "pm-ajay", or
 * "storybook". A query that matches nothing shows the "No portals match" empty
 * state rather than a blank list.
 */
export const Search: Story = {
  render: function Render(args) {
    const [query, setQuery] = React.useState("scw");
    const filtered: AppEntry[] = React.useMemo(() => {
      const q = query.trim().toLowerCase();
      if (!q) return DEFAULT_APPS;
      return DEFAULT_APPS.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          (a.desc ?? "").toLowerCase().includes(q) ||
          (a.org ?? "").toLowerCase().includes(q),
      );
    }, [query]);
    return (
      <div style={{ display: "grid", gap: 8 }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type to filter the list below…"
          style={{
            padding: "6px 10px",
            border: "1px solid var(--sa-border-neutral-subtle)",
            borderRadius: "var(--sa-shape-6)",
            font: "inherit",
          }}
        />
        <div
          style={{
            width: 420,
            maxHeight: 380,
            overflowY: "auto",
            border: "1px solid var(--sa-border-neutral-subtle)",
            borderRadius: "var(--sa-shape-8)",
            background: "var(--sa-bg-neutral-base)",
          }}
        >
          <AppSwitcherPanel {...args} apps={filtered} />
        </div>
      </div>
    );
  },
};

/** Called on every destination click — here, logged into the panel below. */
export const OnNavigateCallback: Story = {
  render: function Render(args) {
    const [lastClicked, setLastClicked] = React.useState("—");
    return (
      <div style={{ display: "grid", gap: 8 }}>
        <p style={{ margin: 0, color: "var(--sa-color-text-default)" }}>
          Last navigated to: <code>{lastClicked}</code>
        </p>
        <div
          style={{
            width: 420,
            maxHeight: 380,
            overflowY: "auto",
            border: "1px solid var(--sa-border-neutral-subtle)",
            borderRadius: "var(--sa-shape-8)",
            background: "var(--sa-bg-neutral-base)",
          }}
          onClickCapture={(e) => {
            const link = (e.target as HTMLElement).closest("a[href]");
            if (link) setLastClicked(link.getAttribute("href") ?? "—");
          }}
        >
          <AppSwitcherPanel {...args} onNavigate={() => {}} />
        </div>
      </div>
    );
  },
};
