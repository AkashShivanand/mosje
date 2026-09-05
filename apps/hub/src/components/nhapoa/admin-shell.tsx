"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { SidebarNav, OrgLogo } from "@mosje/design-system";
import { NhapoaHeader } from "./gov-chrome";
import { UserMenu } from "./user-menu";
import { useNhapoa } from "@/lib/nhapoa/store/store";
import { ROLES } from "@/lib/nhapoa/roles";
import type { RoleId } from "@/lib/nhapoa/store/types";

/**
 * Shared admin layout shell for the 7 authenticated NHAPOA roles.
 * Takes a `roleId` string (not the role object) so server-component layouts can
 * pass it across the RSC boundary. Guards access: if there is no mock session,
 * bounce to /login.
 */
export function AdminShell({
  roleId,
  children,
}: {
  roleId: Exclude<RoleId, "citizen">;
  children: React.ReactNode;
}) {
  const role = ROLES[roleId];
  const pathname = usePathname();
  const router = useRouter();
  const { state, hydrated } = useNhapoa();
  const [collapsed, setCollapsed] = React.useState(false);

  // The route group fixes the nav (roleId), but the user chip shows whoever is
  // actually signed in — e.g. an SHO reuses the District-Officer routes but is
  // still labelled "Station House Officer".
  const sessionRole = state.session && state.session !== "citizen" ? ROLES[state.session] : null;
  const displayLabel = sessionRole?.label ?? role.label;

  // Only enforce the auth guard once the store has hydrated from localStorage —
  // otherwise a fresh page load redirects before the persisted session is read.
  React.useEffect(() => {
    if (hydrated && state.session === null) router.replace("/portals/nhapoa/login");
  }, [hydrated, state.session, router]);

  // While hydrating (or mid-redirect) render nothing to avoid a flash.
  if (!hydrated || state.session === null) return null;

  return (
    <div className="min-h-screen">
      <NhapoaHeader
        onToggleNav={() => setCollapsed(!collapsed)}
        navExpanded={!collapsed}
        actions={<UserMenu name={displayLabel} roleLabel={`(${displayLabel})`} />}
      />
      <div className="flex">
        <SidebarNav
          identity={{ name: "SAMBAL", expansion: "National Helpline Against Atrocities", mark: <OrgLogo path="/portals/nhapoa" />, href: "/portals/nhapoa" }}
          groups={[{ items: role.nav }]}
          pathname={pathname}
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          className="sticky top-0 hidden h-[calc(100vh-5.75rem)] shrink-0 md:flex md:flex-col"
        />
        <main id="main" className="min-w-0 flex-1 px-6 py-7 lg:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}
