"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { OrgLogo, PortalPage } from "@mosje/design-system";
import { ScwHeader, Ux4gFooter } from "./gov-chrome";
import { USER_NAV } from "./sidebar";
import { UserMenu, type AccountUser } from "./user-menu";

/**
 * Layout shell for the SCW citizen/beneficiary portal (scw-user-uat).
 *
 * This shell was held back from the first migration pass on the grounds that it
 * rendered a portal-local `Sidebar` — a possible shadow-UI question. It is not
 * one: `./sidebar` is a thin wrapper over the design system's `SidebarNav` that
 * exists to carry SCW's two nav arrays. The arrays stay where they are; only
 * the wrapper around them is no longer this portal's to build.
 *
 * **It passed `collapsed` through, and still could not be navigated on a phone.**
 * The wrapper carries `hidden md:flex`, so below 768px the rail is not rendered
 * and there was no drawer behind it — a beneficiary on a phone could reach
 * nothing but the page they landed on.
 */
export function UserShell({
  children,
  user,
}: {
  children: React.ReactNode;
  /** When present, the masthead shows the account menu; otherwise a Login button. */
  user?: AccountUser;
}) {
  const pathname = usePathname();

  return (
    <PortalPage
      portal="scw"
      role="citizen"
      pathname={pathname}
      identity={{
        name: "SCW",
        expansion: "Senior Citizens Welfare",
        mark: <OrgLogo path="/portals/scw" />,
        href: "/portals/scw",
      }}
      nav={[{ items: USER_NAV }]}
      footer={<Ux4gFooter />}
      header={(nav) => (
        <ScwHeader
          onToggleNav={nav.toggle}
          navExpanded={nav.open}
          actions={
            user ? (
              <UserMenu user={user} />
            ) : (
              <Link
                href="/portals/scw/login"
                className="rounded-lg px-4 py-2 text-label-1 text-ink-muted hover:bg-black/5"
              >
                Login
              </Link>
            )
          }
        />
      )}
    >
      {/* The measure stays the caller's. Portals are fluid on this estate, but
          this one has always capped its citizen pages at 6xl and narrowing that
          decision into a migration would be a visual change nobody asked for. */}
      <div className="mx-auto max-w-6xl">{children}</div>
    </PortalPage>
  );
}
