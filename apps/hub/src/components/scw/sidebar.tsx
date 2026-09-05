"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { SidebarNav, OrgLogo } from "@mosje/design-system";

export interface NavItem {
  label: string;
  href: string;
  icon: string;
}

export const ADMIN_NAV: NavItem[] = [
  { label: "Dashboard", href: "/portals/scw/admin/dashboard", icon: "grid_view" },
  { label: "User Management", href: "/portals/scw/admin/user-management", icon: "person" },
  { label: "SAGE Applications", href: "/portals/scw/admin/sage-applications", icon: "description" },
  { label: "Events", href: "/portals/scw/admin/events", icon: "calendar_today" },
  { label: "Volunteer", href: "/portals/scw/admin/volunteers", icon: "group" },
  { label: "IPSrC Homes", href: "/portals/scw/admin/sage-homes", icon: "apartment" },
  { label: "RVY Assisted Devices", href: "/portals/scw/admin/assisted-devices", icon: "accessibility_new" },
];

export const USER_NAV: NavItem[] = [
  { label: "Dashboard", href: "/portals/scw", icon: "grid_view" },
  { label: "E-Pledge", href: "/portals/scw/epledge", icon: "volunteer_activism" },
  { label: "Our Services", href: "/portals/scw/our-services", icon: "support" },
];

/** Portal-local Sidebar — wraps DS SidebarNav with SCW-specific nav arrays. */
export function Sidebar({ items, home = "/portals/scw" }: { items: NavItem[]; home?: string }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <SidebarNav
      identity={{ name: "SCW", expansion: "Senior Citizens Welfare", mark: <OrgLogo path="/portals/scw" />, href: home }}
      groups={[{ items }]}
      pathname={pathname}
      collapsed={collapsed}
      onCollapsedChange={setCollapsed}
      showCollapseControl
      className="hidden shrink-0 md:flex md:flex-col"
    />
  );
}
