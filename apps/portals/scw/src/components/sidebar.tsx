"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  ChevronsLeft,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

export function Sidebar({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-[calc(100vh-5.75rem)] shrink-0 border-r border-line bg-white py-5 transition-all md:block",
        collapsed ? "w-[68px]" : "w-[248px]"
      )}
    >
      <nav className="flex flex-col gap-1 px-3">
        {items.map(({ label, href, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-brandwash font-semibold text-navy"
                  : "text-ink-muted hover:bg-black/5"
              )}
            >
              <Icon className={cn("h-5 w-5 shrink-0", active && "text-navy")} />
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          );
        })}
      </nav>
      <div className={cn("mt-4 flex px-3", collapsed ? "justify-center" : "justify-start")}>
        <button
          onClick={() => setCollapsed((c) => !c)}
          aria-label="Toggle sidebar"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink-muted hover:bg-black/5"
        >
          <ChevronsLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
        </button>
      </div>
    </aside>
  );
}
