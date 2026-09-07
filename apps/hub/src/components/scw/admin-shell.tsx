"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { OrgLogo, PortalPage } from "@mosje/design-system";
import { ScwHeader } from "./gov-chrome";
import { ADMIN_NAV } from "./sidebar";
import { UserMenu } from "./user-menu";

/**
 * Layout shell for the SCW Admin portal (scw-admin-uat).
 *
 * **The masthead button did nothing at all, on any viewport.** The shell kept a
 * `collapsed` boolean and toggled it, and then rendered `<Sidebar>` without
 * passing it — so the rail never saw the state, and on a phone the rail was
 * `hidden md:flex` with no drawer behind it either. `PortalPage` owns that
 * state and hands it to the masthead, which is the whole reason the header is a
 * render prop.
 *
 * The nav arrays stay in `./sidebar`, which is where SCW's destinations are
 * declared; only the rail wrapper around them is no longer this portal's to
 * build.
 */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <PortalPage
      portal="scw"
      role="admin"
      pathname={pathname}
      identity={{
        name: "SCW",
        expansion: "Senior Citizens Welfare",
        mark: <OrgLogo path="/portals/scw" />,
        href: "/portals/scw/admin/dashboard",
      }}
      nav={[{ items: ADMIN_NAV }]}
      header={(nav) => (
        <ScwHeader
          onToggleNav={nav.toggle}
          navExpanded={nav.open}
          actions={
            <UserMenu
              user={{ name: "Rajesh Pilli", role: "(Admin)", initials: "RP" }}
              showProfile
            />
          }
        />
      )}
    >
      {children}
    </PortalPage>
  );
}
