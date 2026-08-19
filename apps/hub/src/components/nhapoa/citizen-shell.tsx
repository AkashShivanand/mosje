"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { SidebarNav, Divider } from "@mosje/design-system";
import { GovTopBar, GovMasthead } from "./gov-chrome";

const CITIZEN_NAV = [
  { label: "Dashboard", href: "/portals/nhapoa", icon: "grid_view" },
  { label: "Register Grievance", href: "/portals/nhapoa/register-grievance", icon: "note_add" },
  { label: "Register Rescue", href: "/portals/nhapoa/register-rescue", icon: "support" },
  { label: "Track Status", href: "/portals/nhapoa/track-status", icon: "find_in_page" },
  { label: "Help & FAQs", href: "/portals/nhapoa/help-faqs", icon: "help" },
];

/** Public citizen shell — gov chrome + sidebar + footer. No auth (all public). */
export function CitizenShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <GovTopBar />
      <GovMasthead />
      <div className="flex flex-1">
        <SidebarNav
          groups={[{ items: CITIZEN_NAV }]}
          pathname={pathname}
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          showCollapseControl
          className="sticky top-0 hidden h-[calc(100vh-5.75rem)] shrink-0 md:flex md:flex-col"
        />
        <main id="main" className="min-w-0 flex-1 bg-surface-muted px-4 py-8 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-5xl">{children}</div>
        </main>
      </div>
      <footer className="bg-navy-950 text-white">
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-xs sm:px-6">
          <span>© 2026 Ministry of Social Justice &amp; Empowerment, Government of India · SAMBAL</span>
          <div className="flex items-center gap-3">
            <a href="#" className="hover:underline">Terms &amp; Conditions</a>
            <Divider orientation="vertical" tone="inverse-subtle" length={12} />
            <a href="#" className="hover:underline">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
