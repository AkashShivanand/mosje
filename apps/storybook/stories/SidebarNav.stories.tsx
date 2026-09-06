import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button, OrgLogo, SidebarNav } from "@mosje/design-system";

/**
 * **SidebarNav** — the portal app-shell left navigation.
 *
 * `pathname` is the **only** source of the active state; there is no `active`
 * flag on an item. Matching is by path, so an item's `href` has to be the real
 * route — a `#` placeholder will never light up, and a child route highlights
 * its parent group automatically, at whichever level it sits. Pass the
 * router's pathname, including the portal's basePath.
 *
 * `icon` is a **Material Symbols name string**, not a component. It used to be
 * a Lucide component type; it became a string so nav configs stay plain
 * serialisable data and the estate keeps exactly one icon system. Every item
 * needs one — in collapsed mode the icon is all that is left.
 *
 * Collapsing is controlled: `collapsed` plus `onCollapsedChange`. The portal
 * masthead's toggle drives it; `showCollapseControl` adds the rail's own at the
 * top only for a shell with neither masthead toggle nor identity. In the collapsed
 * rail a group opens a flyout, a leaf shows a tooltip, and a badge becomes a dot.
 *
 * `identity` names the portal at the head of the rail — the masthead carries the
 * Ministry and the estate, this is the one place the portal is named. Omit it on
 * a login screen, which names the portal already.
 *
 * Three levels. An item with `children` becomes a disclosure group of level-2
 * entries; a level-2 entry with `children` becomes a group of level-3 leaves.
 * Leaves cannot nest further, deliberately — a fourth level in a left rail is a
 * sign the information architecture needs the work, not the component.
 *
 * Lifecycle: **Stable**.
  *
 * `header` pins content to the head of the rail and is drawn only below 1024, where
 * the rail is a drawer. A portal puts its phone search here: the masthead shows no
 * search button when it has a sidebar toggle, so the drawer is the one place to look.
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
          {
            label: "Reports",
            href: "/portals/nmba/admin/mass-pledge/reports",
            children: [
              { label: "Weekly", href: "/portals/nmba/admin/mass-pledge/reports/weekly" },
              { label: "Monthly", href: "/portals/nmba/admin/mass-pledge/reports/monthly" },
            ],
          },
          { label: "File a Report", href: "/portals/nmba/admin/mass-pledge/new" },
          { label: "District Roll-up", href: "/portals/nmba/admin/mass-pledge/rollup" },
        ],
      },
      {
        label: "NAPDDR Committees",
        href: "/portals/nmba/admin/committees",
        icon: "groups",
        children: [
          { label: "State Committee", href: "/portals/nmba/admin/committees/state" },
          { label: "District Committees", href: "/portals/nmba/admin/committees/district" },
          { label: "Block Committees", href: "/portals/nmba/admin/committees/block", disabled: true },
        ],
      },
      { label: "Treatment Centres", href: "/portals/nmba/admin/centres", icon: "local_hospital" },
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
    identity: {
      name: "NMBA",
      expansion: "Nasha Mukt Bharat Abhiyaan",
      mark: <OrgLogo org="nmba" />,
      href: "/portals/nmba/admin",
    },
    pathname: "/portals/nmba/admin/mass-pledge/reports/weekly",
    collapsed: false,
    showCollapseControl: false,
  },
  argTypes: {
    pathname: { control: "text" },
    collapsed: { control: "boolean" },
    showCollapseControl: { control: "boolean" },
    groups: { control: false },
    identity: { control: false },
    footer: { control: false },
    onCollapsedChange: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ display: "flex", minHeight: 640 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SidebarNav>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A level-3 route is current, so its level-2 group and level-1 group are both
 * open and highlighted — driven entirely by `pathname`, with no `active` flag
 * anywhere in the config.
 */
export const Playground: Story = {};

/**
 * Collapsed to icons. The badge is a dot, a leaf shows a tooltip, and a group
 * opens a flyout of its level-2 pages. This is why every item needs an `icon`.
 */
export const Collapsed: Story = {
  args: { collapsed: true },
};

/** Controlled collapse driven from outside, as a portal's masthead drives it; the button stands in for the masthead here. */
export const Controlled: Story = {
  render: function Render(args) {
    const [collapsed, setCollapsed] = React.useState(false);
    return (
      <div style={{ display: "grid", gap: 16, justifyItems: "start" }}>
        <Button size="sm" appearance="outlined" onClick={() => setCollapsed((c) => !c)}>
          {collapsed ? "Expand the rail" : "Collapse the rail"}
        </Button>
        <SidebarNav {...args} collapsed={collapsed} onCollapsedChange={setCollapsed} />
      </div>
    );
  },
};

/** A top-level route active, with no group expanded. */
export const TopLevelActive: Story = {
  args: { pathname: "/portals/nmba/admin" },
};

/** A footer pinned above the control — sign out, a version stamp, a support link. */
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
