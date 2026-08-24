"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { TgHeader } from "./gov-chrome";
import { cn } from "@/lib/tg/utils";
import { useTg } from "@/lib/tg/store/store";
import { DEMO_CITIZEN } from "@/lib/tg/store/seed";
import { Icon, type AccountMenuItem } from "@mosje/design-system";

const NAV = [
  { label: "Dashboard", href: "/portals/tg/citizen/dashboard", icon: "grid_view" },
  { label: "Certificate/ID", href: "/portals/tg/citizen/certificate", icon: "badge" },
  { label: "Grievances", href: "/portals/tg/citizen/grievances", icon: "feedback" },
];

/**
 * Citizen zone shell — a horizontal gov nav (matching tg-user-dev), guarded on a
 * "citizen" mock session. Apply CTA is always visible; logout returns to sign-in.
 */
export function CitizenShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { state, hydrated, logout } = useTg();

  React.useEffect(() => {
    if (hydrated && state.session !== "citizen") router.replace("/portals/tg/citizen/sign-in");
  }, [hydrated, state.session, router]);

  if (!hydrated || state.session !== "citizen") return null;

  const accountMenu: AccountMenuItem[] = [
    {
      label: "Log out",
      icon: <Icon name="logout" size={16} />,
      danger: true,
      onSelect: () => {
        logout();
        router.push("/portals/tg/citizen/sign-in");
      },
    },
  ];

  return (
    <div className="min-h-screen bg-surface-muted">
      <TgHeader
        account={{
          name: DEMO_CITIZEN.chosenName,
          role: "Citizen",
        }}
        accountMenu={accountMenu}
      />
      <nav aria-label="Citizen navigation" className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-1 px-4">
          <span className="mr-3 py-3 text-sm font-bold text-navy">Transgender</span>
          {NAV.map(({ label, href, icon: iconName }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-1.5 border-b-2 px-3 py-3 text-sm font-medium transition-colors",
                  active ? "border-navy text-navy" : "border-transparent text-ink-muted hover:text-navy",
                )}
              >
                <Icon name={iconName} size={16} />
                {label}
              </Link>
            );
          })}
          <Link
            href="/portals/tg/citizen/apply"
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-navy px-3.5 py-2 text-sm font-semibold text-white hover:bg-navy-800"
          >
            <Icon name="note_add" size={16} />
            Apply
          </Link>
        </div>
      </nav>
      <main id="main" className="mx-auto max-w-6xl px-4 py-8">
        {children}
      </main>
    </div>
  );
}
