"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Icon, SidebarNav } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { ROLES } from "@/lib/e-anudaan/roles";

/**
 * Authenticated shell for the 12 officer roles.
 *
 * Guards access — with no session, or an NGO session, it bounces to the officer login. The
 * signed-in role drives the sidebar and the identity chip, mirroring the live portal where the
 * parenthesised role string in the masthead is how you tell which grade you are.
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

  const unread = state.notifications.filter((n) => !n.read).length;
  const initials = role.personName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  return (
    <div className="min-h-screen">
      {/* Masthead — emblem, BETA pill, ministry name, bell, identity chip. Transcribed from
          the live admin portal; see docs/research/eanudaan-admin-dev.mosje.in/INVENTORY.md §2. */}
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
          <Link
            href="/portals/e-anudaan/dashboard/notifications"
            className="relative rounded-full p-2 text-ink-muted hover:bg-surface-muted"
            aria-label={`Notifications, ${unread} unread`}
          >
            <Icon name="notifications" size={20} aria-hidden />
            {unread > 0 && (
              <span className="absolute -right-0.5 -top-0.5 min-w-4 rounded-full bg-danger px-1 text-[0.625rem] font-semibold leading-4 text-white">
                {unread}
              </span>
            )}
          </Link>
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="grid h-9 w-9 place-items-center rounded-full bg-brandwash text-sm font-semibold text-navy"
            >
              {initials}
            </span>
            <span className="hidden sm:block">
              <span className="block text-sm font-semibold text-ink">{role.personName}</span>
              <span className="block text-xs text-ink-muted">({role.label})</span>
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              logout();
              router.push("/portals/e-anudaan/login");
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
