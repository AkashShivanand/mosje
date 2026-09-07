"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Icon, OrgLogo, PortalPage, type AccountMenuItem } from "@mosje/design-system";
import { TgHeader } from "./gov-chrome";
import { useTg } from "@/lib/tg/store/store";
import { ROLES } from "@/lib/tg/roles";

/**
 * Shared admin layout shell for the 4 authenticated TG officer roles. Guards
 * access: with no mock session (or a citizen session) it bounces to /admin/login.
 * The signed-in role drives the sidebar nav and the user chip.
 *
 * The chrome is `PortalPage`; what is left here is the guard and the role
 * lookup, which is the division that template asks for.
 *
 * **The masthead button used to do nothing on a phone.** It toggled `collapsed`
 * — the desktop rail's state — while the rail carried `hidden md:flex`, so below
 * 768px it collapsed a column that was not on screen and an officer had no way
 * to reach another page. `PortalPage` reads the viewport at click time and gives
 * the button its two meanings.
 */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { state, hydrated, logout } = useTg();

  const isAdmin = state.session !== null && state.session !== "citizen";
  const role = isAdmin ? ROLES[state.session as keyof typeof ROLES] : null;

  React.useEffect(() => {
    if (hydrated && !isAdmin) router.replace("/portals/tg/admin/login");
  }, [hydrated, isAdmin, router]);

  if (!hydrated || !role) return null;

  const accountMenu: AccountMenuItem[] = [
    {
      label: "Log out",
      icon: <Icon name="logout" size={16} />,
      danger: true,
      onSelect: () => {
        logout();
        router.push("/portals/tg/admin/login");
      },
    },
  ];

  return (
    <PortalPage
      portal="tg"
      /* Every one of the four signed-in roles here is a departmental officer;
         the citizen session is bounced above and never reaches this shell. */
      role="officer"
      pathname={pathname}
      identity={{
        name: "TG Portal",
        expansion: "National Portal for Transgender Persons",
        mark: <OrgLogo path="/portals/tg" />,
        href: "/portals/tg/admin",
      }}
      nav={[{ items: role.nav }]}
      header={(nav) => (
        <TgHeader
          onToggleNav={nav.toggle}
          navExpanded={nav.open}
          account={{ name: role.label, role: "Officer" }}
          accountMenu={accountMenu}
        />
      )}
    >
      {children}
    </PortalPage>
  );
}
