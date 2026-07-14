"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { SidebarNav } from "@mosje/design-system";
import {
  LayoutGrid,
  User,
  FileText,
  Calendar,
  Users,
  Building2,
  Accessibility,
  HeartHandshake,
  LifeBuoy,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const ADMIN_NAV: NavItem[] = [
  { label: "Dashboard", href: "/portals/scw/admin/dashboard", icon: LayoutGrid },
  { label: "User Management", href: "/portals/scw/admin/user-management", icon: User },
  { label: "SAGE Applications", href: "/portals/scw/admin/sage-applications", icon: FileText },
  { label: "Events", href: "/portals/scw/admin/events", icon: Calendar },
  { label: "Volunteer", href: "/portals/scw/admin/volunteers", icon: Users },
  { label: "IPSrC Homes", href: "/portals/scw/admin/sage-homes", icon: Building2 },
  { label: "RVY Assisted Devices", href: "/portals/scw/admin/assisted-devices", icon: Accessibility },
];

export const USER_NAV: NavItem[] = [
  { label: "Dashboard", href: "/portals/scw", icon: LayoutGrid },
  { label: "E-Pledge", href: "/portals/scw/epledge", icon: HeartHandshake },
  { label: "Our Services", href: "/portals/scw/our-services", icon: LifeBuoy },
];

/** Portal-local Sidebar — wraps DS SidebarNav with SCW-specific nav arrays. */
export function Sidebar({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <SidebarNav
      groups={[{ items }]}
      pathname={pathname}
      collapsed={collapsed}
      onCollapsedChange={setCollapsed}
      showCollapseControl
      className="sticky top-0 hidden h-[calc(100vh-5.75rem)] shrink-0 md:flex md:flex-col"
    />
  );
}
