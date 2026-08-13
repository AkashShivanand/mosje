"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Icon, SidebarNav } from "@mosje/design-system";
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
      <header className="flex items-center justify-between border-b border-line bg-surface px-4 py-3 lg:px-6">
        <Link href="/portals/e-anudaan" className="flex items-center gap-3">
          <Icon name="account_balance" size={32} className="text-navy" aria-hidden />
          <span>
            <span className="flex items-center gap-2">
              <span className="rounded bg-gov-yellow px-1.5 py-0.5 text-[0.625rem] font-bold uppercase text-ink">
                Beta
              </span>
              <span className="text-xs text-ink-muted">Government of India</span>
            </span>
            <span className="block text-base font-bold text-ink">
              Ministry of Social Justice &amp; Empowerment
            </span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="hidden sm:block text-right">
            <span className="block text-sm font-semibold text-ink">{role.personName}</span>
            <span className="block text-xs text-ink-muted">(NGO)</span>
          </span>
          <button
            type="button"
            onClick={() => {
              logout();
              router.push("/portals/e-anudaan/sign-in");
            }}
            className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-ink hover:bg-surface-muted"
          >
            Sign out
          </button>
        </div>
      </header>

      <div className="flex">
        <SidebarNav
          groups={[{ items: role.nav }]}
          pathname={pathname}
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          showCollapseControl
          className="sticky top-0 hidden h-screen shrink-0 md:flex md:flex-col"
        />
        <main id="main" className="min-w-0 flex-1 bg-surface-muted px-4 py-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
