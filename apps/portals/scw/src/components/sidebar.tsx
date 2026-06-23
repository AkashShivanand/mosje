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
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutGrid },
  { label: "User Management", href: "/admin/user-management", icon: User },
  { label: "SAGE Applications", href: "/admin/sage-applications", icon: FileText },
  { label: "Events", href: "/admin/events", icon: Calendar },
  { label: "Volunteer", href: "/admin/volunteers", icon: Users },
  { label: "IPSrC Homes", href: "/admin/sage-homes", icon: Building2 },
  { label: "RVY Assisted Devices", href: "/admin/assisted-devices", icon: Accessibility },
];

export const USER_NAV: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutGrid },
  { label: "E-Pledge", href: "/epledge", icon: HeartHandshake },
  { label: "Our Services", href: "/our-services", icon: LifeBuoy },
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
