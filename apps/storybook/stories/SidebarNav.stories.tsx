import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button, SidebarNav } from "@mosje/design-system";

/**
 * **SidebarNav** — the portal app-shell left navigation.
 *
 * `pathname` is the **only** source of the active state; there is no `active`
 * flag on an item. Matching is by path, so an item's `href` has to be the real
 * route — a `#` placeholder will never light up, and a child route highlights
 * its parent group automatically. Pass the router's pathname, including the
 * portal's basePath.
 *
 * `icon` is a **Material Symbols name string**, not a component. It used to be
 * a Lucide component type; it became a string so nav configs stay plain
 * serialisable data and the estate keeps exactly one icon system. Every item
 * needs one — in collapsed mode the icon is all that is left.
 *
 * Collapsing is controlled: `collapsed` plus `onCollapsedChange`. Passing
 * `showCollapseControl` without the handler renders a control that does
 * nothing.
 *
 * Two levels only. An item with `children` becomes a disclosure group; those
 * children cannot nest further, deliberately — a third level in a left rail is
 * a sign the information architecture needs the work, not the component.
 *
 * Lifecycle: **Stable**.
 */
const GROUPS = [
  {
    items: [
      { label: "Dashboard", href: "/portals/nmba/admin", icon: "dashboard" },
      {
        label: "Mass Pledge",
        href: "/portals/nmba/admin/mass-pledge",
        icon: "handshake",
        badge: 12,
        children: [
          { label: "Reports", href: "/portals/nmba/admin/mass-pledge/reports" },
          { label: "File a report", href: "/portals/nmba/admin/mass-pledge/new" },
          { label: "District roll-up", href: "/portals/nmba/admin/mass-pledge/rollup" },
        ],
      },
      {
        label: "NAPDDR Committees",
        href: "/portals/nmba/admin/committees",
        icon: "groups",
        children: [
          { label: "State committee", href: "/portals/nmba/admin/committees/state" },
          { label: "District committees", href: "/portals/nmba/admin/committees/district" },
          { label: "Block committees", href: "/portals/nmba/admin/committees/block" },
        ],
      },
      { label: "Treatment centres", href: "/portals/nmba/admin/centres", icon: "local_hospital" },
    ],
  },
  {
    label: "Administration",
    items: [
      { label: "Officers", href: "/portals/nmba/admin/officers", icon: "badge" },
      { label: "Reports", href: "/portals/nmba/admin/reports", icon: "bar_chart", badge: "New" },
      { label: "Settings", href: "/portals/nmba/admin/settings", icon: "settings" },
    ],
  },
];

const meta = {
  title: "Components/Navigation/SidebarNav",
  component: SidebarNav,
  args: {
    groups: GROUPS,
    pathname: "/portals/nmba/admin/mass-pledge/reports",
    collapsed: false,
    showCollapseControl: false,
  },
  argTypes: {
    pathname: { control: "text" },
    collapsed: { control: "boolean" },
    showCollapseControl: { control: "boolean" },
    groups: { control: false },
    footer: { control: false },
    onCollapsedChange: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ display: "flex", minHeight: 560 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SidebarNav>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The active child route highlights its parent group — driven entirely by
 * `pathname`, with no `active` flag anywhere in the config.
 */
export const Playground: Story = {};

/** Collapsed to icons. This is why every item needs an `icon`. */
export const Collapsed: Story = {
  args: { collapsed: true },
};

/** Controlled collapse, with the drag control the handler is required for. */
export const WithCollapseControl: Story = {
  render: function Render(args) {
    const [collapsed, setCollapsed] = React.useState(false);
    return (
      <SidebarNav
        {...args}
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        showCollapseControl
      />
    );
  },
};

/** A top-level route active, with no group expanded. */
export const TopLevelActive: Story = {
  args: { pathname: "/portals/nmba/admin" },
};

/** A footer pinned to the bottom — sign out, a version stamp, a support link. */
export const WithFooter: Story = {
  args: {
    footer: (
      <div style={{ display: "grid", gap: 8 }}>
        <Button size="sm" appearance="text">
          Sign out
        </Button>
        <span style={{ color: "var(--sa-text-neutral-subtle)", fontSize: "var(--sa-type-body-3-size)" }}>
          NMBA portal · v2.4.0
        </span>
      </div>
    ),
  },
};

/**
 * A flat rail with no groups and no children — the block officer's view, who
 * only reaches the Mass Pledge flow.
 */
export const FlatAndScoped: Story = {
  args: {
    pathname: "/portals/nmba/admin/mass-pledge/new",
    groups: [
      {
        items: [
          { label: "Mass Pledge", href: "/portals/nmba/admin/mass-pledge", icon: "handshake" },
          { label: "File a report", href: "/portals/nmba/admin/mass-pledge/new", icon: "post_add" },
        ],
      },
    ],
  },
};
