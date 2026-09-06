"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { SiteHeader, SidebarNav, Icon, type AccountMenuItem, type SidebarNavGroup, OrgLogo } from "@mosje/design-system";
import { type NavItem } from "@/lib/eutthan/portal-data";
import { portalLink } from "./eutthan-shared";

export function EutthanHeader({
  name,
  roleLabel,
  onLogout,
}: {
  name: string;
  roleLabel: string;
  onLogout: () => void;
}) {
  const accountMenu: AccountMenuItem[] = [
    {
      label: "Notifications",
      icon: <Icon name="notifications" size={16} />,
      onSelect: () => {},
    },
    {
      label: "Logout",
      icon: <Icon name="logout" size={16} />,
      danger: true,
      onSelect: onLogout,
    },
  ];

  return (
    <SiteHeader
      homeHref={portalLink("/")}
      variant="portal"
      sticky
      emblemSrc="/images/National-Emblem-logo.svg"
      brandLines={{
        org: "Government of India",
        ministry: "Ministry of Social Justice & Empowerment",
        department: "DAPSC Allocation & Progress Tracker",
      }}
      beta
      skipTo="#eu-main-content"
      govLink={{ href: "https://india.gov.in/", label: "Government of India" }}
      language={{ label: "English" }}
      account={{
        name,
        role: roleLabel,
      }}
      accountMenu={accountMenu}
    />
  );
}

/**
 * The rail is the design system's SidebarNav. Eutthan's nav data keeps its
 * portal-relative hrefs, so they are made absolute here; a "Reports" group has
 * no page of its own, so it carries no href — giving it its first child's href
 * would light two rows for one page.
 */
function toGroups(navItems: NavItem[]): SidebarNavGroup[] {
  return [
    {
      items: navItems.map((item) =>
        item.children
          ? {
              label: item.label,
              icon: item.icon,
              children: item.children.map((c) => ({ label: c.label, href: portalLink(c.href) })),
            }
          : { label: item.label, href: portalLink(item.href), icon: item.icon },
      ),
    },
  ];
}

export function Sidebar({ navItems }: { navItems: NavItem[] }) {
  const pathname = usePathname() ?? "";
  const groups = useMemo(() => toGroups(navItems), [navItems]);
  return (
    <SidebarNav
      identity={{ name: "E-Utthan", expansion: "DAPSC Allocation & Progress Tracker", mark: <OrgLogo path="/portals/eutthan-admin" tile={false} />, href: portalLink("/dashboard") }}
      groups={groups}
      pathname={pathname}
      label="Main navigation"
      className="eu-sidebar"
    />
  );
}
