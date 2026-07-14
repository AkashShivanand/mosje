"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { SidebarNav } from "@mosje/design-system";
import { GovTopBar, GovMasthead } from "./gov-chrome";
import { UserMenu } from "./user-menu";
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
  const { state, hydrated } = useTg();
  const [collapsed, setCollapsed] = React.useState(false);

  const isAdmin = state.session !== null && state.session !== "citizen";
  const role = isAdmin ? ROLES[state.session as keyof typeof ROLES] : null;

  React.useEffect(() => {
    if (hydrated && !isAdmin) router.replace("/portals/tg/admin/login");
  }, [hydrated, isAdmin, router]);

  if (!hydrated || !role) return null;

  return (
    <div className="min-h-screen">
      <GovTopBar />
      <GovMasthead
        right={<UserMenu name={role.label} roleLabel={`(${role.label})`} loginHref="/portals/tg/admin/login" />}
      />
      <div className="flex">
        <SidebarNav
          groups={[{ items: role.nav }]}
          pathname={pathname}
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          showCollapseControl
          className="sticky top-0 hidden h-[calc(100vh-5.75rem)] shrink-0 md:flex md:flex-col"
        />
        <main id="main" className="min-w-0 flex-1 bg-surface-muted px-6 py-7 lg:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}
