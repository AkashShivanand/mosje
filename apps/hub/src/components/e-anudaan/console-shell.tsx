"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { SidebarNav, SiteHeader } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { ROLES } from "@/lib/e-anudaan/roles";

/**
 * Authenticated shell for the 12 officer roles.
 */
export function ConsoleShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { state, hydrated, logout } = useEAnudaan();
  const [collapsed, setCollapsed] = React.useState(false);

  const isOfficer = state.session !== null && state.session !== "ngo";
  const role = isOfficer ? ROLES[state.session!] : null;

  React.useEffect(() => {
    if (hydrated && !isOfficer) router.replace("/portals/e-anudaan/login");
  }, [hydrated, isOfficer, router]);

  if (!hydrated || !role) return null;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader
        homeHref="/portals/e-anudaan/dashboard"
        variant="portal"
        emblemSrc="/images/emblem.svg"
        brandLines={{
          org: "Government of India",
          ministry: "Ministry of Social Justice & Empowerment",
          department: "Department of Social Justice & Empowerment",
        }}
        beta
        onToggleNav={() => setCollapsed(!collapsed)}
        navExpanded={!collapsed}
        account={{
          name: role.personName,
          role: role.label,
        }}
        accountMenu={[
          {
            label: "Notifications",
            onSelect: () => {
              router.push("/portals/e-anudaan/dashboard/notifications");
            },
          },
          {
            label: "Sign out",
            danger: true,
            onSelect: () => {
              logout();
              router.push("/portals/e-anudaan/login");
            },
          },
        ]}
      />

      <div className="flex flex-1 items-stretch">
        <SidebarNav
          groups={[{ items: role.nav }]}
          pathname={pathname}
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          showCollapseControl
          className="sticky top-0 hidden max-h-[100dvh] shrink-0 overflow-y-auto md:flex md:flex-col"
        />
        <main id="main" className="min-w-0 flex-1 bg-surface-muted px-4 py-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
