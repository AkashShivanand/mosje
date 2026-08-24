"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiteHeader, Icon, buttonClasses } from "@mosje/design-system";
import { cn } from "@/lib/nmba/utils";

const BASE = "/portals/nmba";

const NAV_ITEMS = [
  { label: "Dashboard", href: BASE, icon: "grid_view" },
  { label: "Activity Snapshot", href: `${BASE}/activities`, icon: "monitoring" },
  { label: "E-Pledge", href: `${BASE}/epledge`, icon: "volunteer_activism" },
  { label: "Nasha Mukti Mitr", href: `${BASE}/register-mitr`, icon: "person_add" },
  { label: "Facilities", href: `${BASE}/facilities`, icon: "location_on" },
  { label: "Helpline", href: `${BASE}/helpline`, icon: "call" },
];

export function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);
  const [lang, setLang] = React.useState("English");

  const isActive = (href: string) =>
    href === BASE ? pathname === BASE || pathname === `${BASE}/` : pathname.startsWith(href);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader
        homeHref={BASE}
        variant="portal"
        tone="navy"
        sticky
        emblemSrc={`${BASE}/brand/national-emblem.svg`}
        brandLines={{
          org: "Government of India",
          ministry: "Ministry of Social Justice & Empowerment",
          department: "Department of Social Justice & Empowerment",
        }}
        beta
        brandDivider
        skipTo="#main-content"
        govLink={{ href: "https://india.gov.in", label: "Government of India" }}
        language={{
          label: lang,
          onClick: () => setLang((l) => (l === "English" ? "हिंदी" : "English")),
        }}
        actions={
          <div className="flex items-center gap-3">
            <Link
              href={`${BASE}/admin/login`}
              className={buttonClasses("primary", "outlined", "sm")}
              aria-label="Admin Login"
            >
              <span className="ds-btn__icon" aria-hidden="true">
                <Icon name="login" size={16} />
              </span>
              <span className="hidden sm:inline">Admin Login</span>
            </Link>
            <a
              href="tel:14446"
              className="flex items-center gap-2 rounded-lg bg-saffron px-3 py-1.5 text-sm font-semibold text-white hover:bg-saffron-600"
              aria-label="Call National De-addiction Helpline 14446"
            >
              <Icon name="call" size={16} />
              <span className="hidden sm:inline">Helpline 14446</span>
            </a>
          </div>
        }
      />

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={cn(
            "sticky top-0 hidden h-[calc(100vh-8rem)] shrink-0 border-r border-line bg-white py-5 transition-all md:block",
            collapsed ? "w-[68px]" : "w-[220px]"
          )}
        >
          <nav aria-label="Main navigation" className="flex flex-col gap-1 px-3">
            {NAV_ITEMS.map(({ label, href, icon: iconName }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  title={collapsed ? label : undefined}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                    active
                      ? "bg-brandwash font-semibold text-navy"
                      : "text-ink-muted hover:bg-black/5"
                  )}
                >
                  <Icon name={iconName} className={cn("h-5 w-5 shrink-0", active && "text-navy")} />
                  {!collapsed && <span className="truncate">{label}</span>}
                </Link>
              );
            })}
          </nav>
          <div className={cn("mt-4 flex px-3", collapsed ? "justify-center" : "justify-start")}>
            <button
              onClick={() => setCollapsed((c) => !c)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink-muted hover:bg-black/5"
            >
              <Icon name="keyboard_double_arrow_left" className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main id="main-content" className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
