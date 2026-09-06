"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { SidebarNav, SiteHeader, OrgLogo } from "@mosje/design-system";
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
    if (hydrated && !isNgo) router.replace("/portals/e-anudaan/login?role=ngo");
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
          ministry: "Ministry of Social Justice & Empowerment",
          department: "Department of Social Justice & Empowerment",
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
              router.push("/portals/e-anudaan/login?role=ngo");
            },
          },
        ]}
      />

      <div className="flex">
        <SidebarNav
          identity={{ name: "E-Anudaan", expansion: "Grant-in-Aid Management", mark: <OrgLogo path="/portals/e-anudaan" tile={false} />, href: "/portals/e-anudaan/ngo" }}
          groups={[{ items: role.nav }]}
          pathname={pathname}
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          className="hidden shrink-0 md:flex md:flex-col"
        />
        <main id="main" className="min-w-0 flex-1 bg-surface-muted px-4 py-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
