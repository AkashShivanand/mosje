import type * as React from "react";

export interface SidebarNavChild {
  label: string;
  href: string;
}

export interface SidebarNavItem {
  label: string;
  href: string;
  /** Lucide-compatible icon component */
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
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
