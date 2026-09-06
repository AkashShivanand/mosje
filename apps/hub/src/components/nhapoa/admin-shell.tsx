"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { OrgLogo, PortalPage, type PortalNavGroup } from "@mosje/design-system";
import { NhapoaHeader } from "./gov-chrome";
import { UserMenu } from "./user-menu";
import { useNhapoa } from "@/lib/nhapoa/store/store";
import { ROLES } from "@/lib/nhapoa/roles";
import type { RoleId } from "@/lib/nhapoa/store/types";

/**
 * Shared admin shell for the 7 authenticated SAMBAL roles — a wrapper around
 * `PortalPage`.
 *
 * Takes a `roleId` string (not the role object) so server-component layouts can
 * pass it across the RSC boundary. Guards access: with no mock session, bounce
 * to `/login`.
 *
 * Two things it gained by moving off a hand-assembled shell, both the same as
 * the citizen shell beside it:
 *
 * **Navigation on a phone.** The rail carried `hidden shrink-0 md:flex` and the
 * masthead's button drove the desktop rail's collapsed state, so below the
 * tablet anchor an officer had a button that collapsed a rail they could not see
 * and no route to another screen.
 *
 * **`pending` instead of `return null` while the store hydrates**, which flashed
 * a blank page and then reflowed the layout when the session landed.
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

  // The route group fixes the nav (roleId), but the user chip shows whoever is
  // actually signed in — e.g. an SHO reuses the District-Officer routes but is
  // still labelled "Station House Officer".
  const sessionRole = state.session && state.session !== "citizen" ? ROLES[state.session] : null;
  const displayLabel = sessionRole?.label ?? role.label;

  /* Unconditional, so the hook order never changes with the role. */
  const nav = React.useMemo<PortalNavGroup[]>(() => [{ items: role.nav }], [role]);

  // Only enforce the auth guard once the store has hydrated from localStorage —
  // otherwise a fresh page load redirects before the persisted session is read.
  React.useEffect(() => {
    if (hydrated && state.session === null) router.replace("/portals/nhapoa/login");
  }, [hydrated, state.session, router]);

  return (
    <PortalPage
      portal="nhapoa"
      role="officer"
      pathname={pathname}
      nav={nav}
      identity={{
        name: "SAMBAL",
        expansion: "National Helpline Against Atrocities",
        mark: <OrgLogo path="/portals/nhapoa" />,
        href: "/portals/nhapoa",
      }}
      pending={!hydrated || state.session === null}
      header={(navState) => (
        <NhapoaHeader
          onToggleNav={navState.toggle}
          navExpanded={navState.open}
          actions={<UserMenu name={displayLabel} roleLabel={`(${displayLabel})`} />}
        />
      )}
    >
      {children}
    </PortalPage>
  );
}
