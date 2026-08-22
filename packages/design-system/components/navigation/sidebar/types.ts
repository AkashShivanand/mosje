import type * as React from "react";

export interface SidebarNavChild {
  label: string;
  href: string;
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
  /** Badge count / label (e.g. unread notifications) */
  badge?: number | string;
  /** When set, the item becomes a collapsible group with these children */
  children?: SidebarNavChild[];
}

export interface SidebarNavGroup {
  /** Optional section label (hidden in collapsed mode) */
  label?: string;
  items: SidebarNavItem[];
}

export interface SidebarNavProps {
  /**
   * DOM id for the <aside>. Pass it when a header toggle points at this
   * sidebar with `aria-controls` — an aria-controls that names nothing is
   * worse than none at all.
   */
  id?: string;
  groups: SidebarNavGroup[];
  /** Current route path — used to derive active states */
  pathname: string;
  /** Controlled collapsed state */
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  /**
   * Show a drag-handle control on the right edge of the sidebar
   * (mirrors Figma `showControl` prop). Requires `onCollapsedChange`.
   */
  showCollapseControl?: boolean;
  /** Optional content pinned to the sidebar footer */
  footer?: React.ReactNode;
  className?: string;
}
