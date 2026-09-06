"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Footer, Icon, SidebarNav, SideSheet, SiteHeader, SAMAVESH_COBRAND, type SidebarNavChild, type SidebarNavGroup, type SidebarNavItem, OrgLogo } from "@mosje/design-system";
import { useToast } from "@/components/nmba/toast";
import { useTCSession } from "@/lib/nmba/treatment-centre/session-context";
import { TC_SESSION_COOKIE } from "@/lib/nmba/treatment-centre/roles";
import { navForRole, type NavNode } from "./tc-nav";

const BASE = "/portals/nmba";

/**
 * The role's nav tree becomes the design system rail's data. A group has no
 * page of its own, so it carries no href and only opens; DDAC nests IRCA, ODIC
 * and CPLI as level-2 groups under one level-1 group, which is the rail's
 * third and last level. Leaf icons below level 1 are not drawn — the rail's
 * connectors carry the hierarchy instead.
 */
function toChild(node: NavNode): SidebarNavChild {
  if (node.kind === "leaf") return { label: node.label, href: node.href };
  return {
    label: node.label,
    children: node.children.flatMap((l) => (l.kind === "leaf" ? [{ label: l.label, href: l.href }] : [])),
  };
}

function toGroups(nodes: NavNode[]): SidebarNavGroup[] {
  const items: SidebarNavItem[] = nodes.map((n) =>
    n.kind === "leaf"
      ? { label: n.label, href: n.href, icon: n.icon }
      : { label: n.label, icon: n.icon, children: n.children.map(toChild) },
  );
  return [{ items }];
}

export function TreatmentCentreShell({ children }: { children: React.ReactNode }) {
  const session = useTCSession();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const groups = React.useMemo(() => toGroups(navForRole(session.role)), [session.role]);

  // Track the mobile breakpoint: below lg the masthead toggle opens the drawer,
  // at lg and above it collapses the rail.
  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Close the mobile drawer on navigation so it never lingers over the new page.
  // Reset during render on route change (React's recommended pattern) rather than
  // in an effect — avoids an extra commit and the set-state-in-effect lint rule.
  const [lastPath, setLastPath] = React.useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMobileOpen(false);
  }

  const handleLogout = () => {
    document.cookie = `${TC_SESSION_COOKIE}=; max-age=0; path=/`;
    router.push(`${BASE}/treatment-centre/login-otp`);
  };

  return (
    <div
      className="flex min-h-screen flex-col bg-surface-muted"
      style={{ "--tc-header-h": "120px" } as React.CSSProperties}
    >
      {/* Masthead — shared @mosje/design-system SiteHeader (renders the page's first skip link). */}
      <SiteHeader
        homeHref={`${BASE}/treatment-centre`}
        variant="portal"
        sticky
        beta
        emblemSrc={`${BASE}/brand/national-emblem.svg`}
        brandLines={{
          org: "Government of India",
          ministry: "Ministry of Social Justice & Empowerment",
          department: "Patient Data Monitoring System",
        }}
        cobranding={[
          { src: `${BASE}/brand/digital-india.svg`, alt: "Digital India", href: "https://www.digitalindia.gov.in/", height: 34 },
          SAMAVESH_COBRAND,
        ]}
        onToggleNav={() => (isMobile ? setMobileOpen((o) => !o) : setCollapsed((c) => !c))}
        navExpanded={isMobile ? mobileOpen : !collapsed}
        navControlsId="tc-sidebar"
        language={{
          label: "English",
          onClick: () => toast("i18n: Language switch (22 scheduled languages supported) - Demo.", "info"),
        }}
        account={{ name: session.centerName, role: `${session.role} · (TC)` }}
        accountMenu={[
          {
            label: "Sign out",
            danger: true,
            icon: <Icon name="logout" size={16} />,
            onSelect: handleLogout,
          },
        ]}
      />

      <div className="flex flex-1">
        {/* Sidebar — the rail from lg up; below that the masthead's toggle
            opens it as a drawer. */}
        <SidebarNav
          id="tc-sidebar"
          identity={{ name: "NMBA", expansion: "Nasha Mukt Bharat Abhiyaan", mark: <OrgLogo path="/portals/nmba" tile={false} />, href: "/portals/nmba/treatment-centre/dashboard" }}
          groups={groups}
          pathname={pathname}
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          label={`${session.role} navigation`}
          className="hidden shrink-0 border-r border-line lg:flex lg:flex-col"
        />

        {/* Main */}
        <main id="main-content" className="min-w-0 flex-1 px-4 py-6 lg:px-8">
          {children}
        </main>
      </div>

      <SideSheet open={mobileOpen && isMobile} onClose={() => setMobileOpen(false)} title="Navigation" side="left" size="sm">
        <SidebarNav identity={{ name: "NMBA", expansion: "Nasha Mukt Bharat Abhiyaan", mark: <OrgLogo path="/portals/nmba" tile={false} />, href: "/portals/nmba/treatment-centre/dashboard" }} groups={groups} pathname={pathname} label={`${session.role} navigation`} className="w-auto" />
      </SideSheet>

      <Footer />
      {/* AppSwitcher FAB is rendered once globally in the root layout. */}
    </div>
  );
}
