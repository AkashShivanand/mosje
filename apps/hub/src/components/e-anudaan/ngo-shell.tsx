"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { SidebarNav, SiteHeader } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { ROLES } from "@/lib/e-anudaan/roles";

/** Authenticated shell for the NGO applicant. Bounces to /sign-in without an NGO session. */
export function NgoShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { state, hydrated, logout } = useEAnudaan();
  const [collapsed, setCollapsed] = React.useState(false);

  const isNgo = state.session === "ngo";
  const role = ROLES.ngo;

  React.useEffect(() => {
    if (hydrated && !isNgo) router.replace("/portals/e-anudaan/sign-in");
  }, [hydrated, isNgo, router]);

  if (!hydrated || !isNgo) return null;

  return (
    <div className="min-h-screen">
      <SiteHeader
        homeHref="/portals/e-anudaan"
        variant="portal"
        emblemSrc="/images/emblem.svg"
        brandLines={{
          org: "Government of India",
          department: "Ministry of Social Justice & Empowerment",
        }}
        beta
        onToggleNav={() => setCollapsed(!collapsed)}
        navExpanded={!collapsed}
        account={{
          name: role.personName,
          role: "NGO Applicant",
        }}
        accountMenu={[
          {
            label: "Sign out",
            danger: true,
            onSelect: () => {
              logout();
              router.push("/portals/e-anudaan/sign-in");
            },
          },
        ]}
      />

      <div className="flex">
        {/* Wrapped rather than given `hidden md:flex` directly: the DS sets `display: flex`
            on `.ds-sidebar`, which out-specifies Tailwind's `.hidden`, so the utility lost and
            the sidebar stayed open on mobile — pushing the page off-screen. The live portal
            collapses it behind the masthead hamburger below 768px. */}
        <div className="hidden md:block">
          <SidebarNav
            groups={[{ items: role.nav }]}
            pathname={pathname}
            collapsed={collapsed}
            onCollapsedChange={setCollapsed}
            showCollapseControl
            className="sticky top-0 h-screen shrink-0 md:flex md:flex-col"
          />
        </div>
        <main id="main" className="min-w-0 flex-1 bg-surface-muted px-4 py-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
