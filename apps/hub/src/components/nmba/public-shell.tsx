"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiteHeader, SidebarNav, Icon, buttonClasses, OrgLogo } from "@mosje/design-system";

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

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader
        onToggleNav={() => setCollapsed((c) => !c)}
        navExpanded={!collapsed}
        homeHref={BASE}
        variant="portal"
        sticky
        emblemSrc={`${BASE}/brand/national-emblem.svg`}
        brandLines={{
          org: "Government of India",
          ministry: "Ministry of Social Justice & Empowerment",
          department: "Department of Social Justice & Empowerment",
        }}
        beta
        skipTo="#main-content"
        govLink={{ href: "https://india.gov.in", label: "Government of India" }}
        language={{
          label: lang,
          lang: lang === "English" ? "en" : "hi",
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
              // saffron-600, not the bare `saffron` (#ec6a1f): white on that is 3.15:1 and
              // fails WCAG 1.4.3 for this 14px label. saffron-600 #b8500f is 5.01:1.
              className="flex items-center gap-2 rounded-lg bg-saffron-600 px-3 py-1.5 text-label-1 font-semibold text-white hover:bg-saffron-dark"
              aria-label="Call National De-addiction Helpline 14446"
            >
              <Icon name="call" size={16} />
              <span className="hidden sm:inline">Helpline 14446</span>
            </a>
          </div>
        }
      />

      <div className="flex flex-1">
        <SidebarNav
          identity={{ name: "NMBA", expansion: "Nasha Mukt Bharat Abhiyaan", mark: <OrgLogo path="/portals/nmba" />, href: "/portals/nmba" }}
          groups={[{ items: NAV_ITEMS }]}
          pathname={pathname}
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          label="Main navigation"
          className="hidden shrink-0 border-r border-line md:flex md:flex-col"
        />

        {/* Main content */}
        <main id="main-content" className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
