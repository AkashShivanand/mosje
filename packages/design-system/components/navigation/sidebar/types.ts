import type * as React from "react";

/**
 * A level-3 page — the deepest the rail goes. It has no icon and no children,
 * deliberately: a fourth level in a left rail is an information-architecture
 * problem, not a component gap.
 */
export interface SidebarNavLeaf {
  label: string;
  href: string;
  /** Rendered, named, and not operable — a page the role cannot reach today. */
  disabled?: boolean;
}

/**
 * A level-2 entry. Give it `children` and it becomes a level-2 group whose
 * children are level-3 leaves.
 */
export interface SidebarNavChild {
  label: string;
  /**
   * The entry's own page. Required for a leaf. A level-2 GROUP may omit it when
   * the group has no page of its own — its row then only opens and closes, and
   * it is highlighted when one of its leaves is current. Never give a group the
   * href of its first child: two entries with one href are two current pages.
   */
  href?: string;
  disabled?: boolean;
  /** Level-3 pages. */
  children?: SidebarNavLeaf[];
}

export interface SidebarNavItem {
  label: string;
  /**
   * The item's own page. Required for a leaf. A GROUP may omit it when the
   * group has no page of its own (NMBA's "NAPDDR Three-Tier Committee", the
   * treatment-centre registers): its row then only opens and closes, in the
   * collapsed rail its flyout lists the pages, and it is highlighted when one
   * of them is current.
   */
  href?: string;
  /**
   * Material Symbols Rounded name, rendered through the DS `<Icon>` —
   * e.g. `"dashboard"`, `"group"`, `"location_on"`.
   * Full catalog: https://fonts.google.com/icons
   *
   * This used to be a Lucide-compatible component type. It is a name string so
   * that nav configs stay plain serialisable data and the estate has exactly
   * one icon system (see the icon rule in CLAUDE.md / design.md).
   */
  icon: string;
  /**
   * Badge count / label (e.g. unread notifications). Shown as a count when the
   * rail is expanded and as a dot on the icon when it is collapsed, so the
   * signal survives the collapse.
   */
  badge?: number | string;
  /**
   * When set, the item becomes a collapsible group with these level-2 children.
   * Five is the design limit and seven the ceiling; past seven, development
   * warns — split the group or move the list onto the section's own page.
   */
  children?: SidebarNavChild[];
  disabled?: boolean;
}

/**
 * Which portal the signed-in user is in. The masthead carries the Ministry and
 * the estate; this block at the head of the rail is the one place the PORTAL
 * is named. Rendered as a link to the portal's home; in the collapsed rail the
 * mark stands alone and the name travels as its tooltip and accessible label.
 */
export interface SidebarNavIdentity {
  /** Short name, Title Case — "NOS", "SAMBAL". No version string here. */
  name: string;
  /** The department's own full name, two lines at most. */
  expansion?: string;
  /** The mark — an `<OrgLogo>` from the registry, never a pasted image. */
  mark: React.ReactNode;
  /** The portal's home route. */
  href: string;
}

export interface SidebarNavGroup {
  /**
   * Optional section label. Read by assistive technology as the group's name
   * in both modes; visually hidden when the rail is collapsed, where a divider
   * carries the break instead.
   */
  label?: string;
  items: SidebarNavItem[];
}

export interface SidebarNavProps {
  /**
   * DOM id for the root. Pass it when a header toggle points at this sidebar
   * with `aria-controls` — an aria-controls that names nothing is worse than
   * none at all.
   */
  id?: string;
  groups: SidebarNavGroup[];
  /** Current route path — the ONLY source of the active state. */
  pathname: string;
  /** Controlled collapsed state. */
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  /**
   * Show the rail's own collapse control (mirrors Figma `Show Control` on the
   * identity block, off by default). With an `identity` it sits in that row —
   * trailing when expanded, beneath the mark when collapsed; without one it
   * takes a 48px row at the top. The portal masthead's toggle drives the same
   * state, so pass this only in a shell without that toggle. Requires
   * `onCollapsedChange`.
   */
  showCollapseControl?: boolean;
  /**
   * The portal identity at the head of the rail (mirrors Figma `Show Identity`,
   * on by default there). Omit on a login screen: PortalLoginShell already
   * names the portal.
   */
  identity?: SidebarNavIdentity;
  /** Optional content pinned to the foot (mirrors Figma `Show Footer`). */
  footer?: React.ReactNode;
  /**
   * Optional content pinned to the head, rendered only below the laptop anchor
   * (1024) — where the rail is a drawer. A portal's search lives here on a phone:
   * the masthead shows no search button when it has a sidebar toggle, so the
   * drawer is the one place to look. From 1024 up the masthead's own field is on
   * the row and this slot is not drawn.
   */
  header?: React.ReactNode;
  /**
   * Accessible name of the navigation landmark.
   * @default `${identity.name} navigation`, or "Portal navigation" without an identity
   */
  label?: string;
  className?: string;
}
