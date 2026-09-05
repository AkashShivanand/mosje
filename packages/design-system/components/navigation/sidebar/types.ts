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
  href: string;
  disabled?: boolean;
  /** Level-3 pages. */
  children?: SidebarNavLeaf[];
}

export interface SidebarNavItem {
  label: string;
  href: string;
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
   * Show the rail's own collapse control — a 48px row at the TOP of the rail
   * (mirrors the Figma `Show Control` property, off by default). The portal
   * masthead's toggle drives the same state, so pass this only in a shell
   * without that toggle. Requires `onCollapsedChange`.
   */
  showCollapseControl?: boolean;
  /** Optional content pinned above the control (mirrors Figma `Show Footer`). */
  footer?: React.ReactNode;
  /** Accessible name of the navigation landmark. @default "Portal navigation" */
  label?: string;
  className?: string;
}
