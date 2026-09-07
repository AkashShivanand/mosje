"use client";

import { SiteHeader, Icon, type AccountMenuItem, type SidebarNavGroup, type SidebarNavIdentity, OrgLogo } from "@mosje/design-system";
import { type NavItem } from "@/lib/eutthan/portal-data";
import { portalLink } from "./eutthan-shared";

export function EutthanHeader({
  name,
  roleLabel,
  onLogout,
  onToggleNav,
  navExpanded,
}: {
  name: string;
  roleLabel: string;
  onLogout: () => void;
  /** Wired by PortalPage's header render prop — one button, two meanings. */
  onToggleNav?: () => void;
  navExpanded?: boolean;
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
      onToggleNav={onToggleNav}
      navExpanded={navExpanded}
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
 * Eutthan's nav data becomes the rail's groups.
 *
 * The portal-relative hrefs are made absolute here; a "Reports" group has no
 * page of its own, so it carries no href — giving it its first child's href
 * would light two rows for one page.
 *
 * This used to be a `Sidebar` component that rendered `SidebarNav` itself. The
 * rail is `PortalPage`'s now, so what is left is the data, which is the part
 * that was ever Eutthan's.
 */
export function eutthanNavGroups(navItems: NavItem[]): SidebarNavGroup[] {
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

/** The organisation block at the head of the rail. */
export const EUTTHAN_IDENTITY: SidebarNavIdentity = {
  name: "E-Utthan",
  expansion: "DAPSC Allocation & Progress Tracker",
  mark: <OrgLogo path="/portals/eutthan-admin" />,
  href: portalLink("/dashboard"),
};
