"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { SidebarNav, Icon, type AccountMenuItem, OrgLogo } from "@mosje/design-system";
import { TgHeader } from "./gov-chrome";
import { useTg } from "@/lib/tg/store/store";
import { ROLES } from "@/lib/tg/roles";

/**
 * Shared admin layout shell for the 4 authenticated TG officer roles. Guards
 * access: with no mock session (or a citizen session) it bounces to /admin/login.
 * The signed-in role drives the sidebar nav and the user chip.
 */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { state, hydrated, logout } = useTg();
  const [collapsed, setCollapsed] = React.useState(false);

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
    <div className="min-h-screen">
      <TgHeader
        onToggleNav={() => setCollapsed(!collapsed)}
        navExpanded={!collapsed}
        account={{
          name: role.label,
          role: "Officer",
        }}
        accountMenu={accountMenu}
      />
      <div className="flex">
        <SidebarNav
          identity={{ name: "TG Portal", expansion: "National Portal for Transgender Persons", mark: <OrgLogo path="/portals/tg" />, href: "/portals/tg/admin" }}
          groups={[{ items: role.nav }]}
          pathname={pathname}
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          className="sticky top-0 hidden h-[calc(100vh-5.75rem)] shrink-0 md:flex md:flex-col"
        />
        <main id="main" className="min-w-0 flex-1 bg-surface-muted px-6 py-7 lg:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}
