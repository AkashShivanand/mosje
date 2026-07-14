"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  Building2,
  Users,
  FileText,
  FileStack,
  Shield,
  ShieldCheck,
  MessageSquare,
  ChevronsLeft,
  ChevronDown,
  Landmark,
  Building,
  MapPin,
  FileBarChart,
  RotateCcw,
  LogOut,
} from "lucide-react";
import { SiteHeader } from "@mosje/design-system";
import { useToast } from "@/components/toast";
import { cn } from "@/lib/utils";
import { usePortalSession } from "@/lib/committee/session-context";
import { PORTAL_SESSION_COOKIE, roleLabel } from "@/lib/committee/session";
import { tiersForRole } from "@/lib/committee/scope";
import { resetDemoData } from "@/lib/committee/store";
import type { CommitteeTier } from "@/lib/committee/types";

const BASE = "/portals/nmba";

type NavItem = { label: string; href: string; icon: React.ComponentType<{ className?: string }> };

const ADMIN_NAV: NavItem[] = [
  { label: "Ministries/Line Departments/Spiritual Organisations Dashboard", href: "/admin/ministries-dashboard", icon: Building2 },
  { label: "State/UT/District Dashboard", href: "/admin/dashboard", icon: LayoutGrid },
  { label: "User Management", href: "/admin/user-management", icon: Users },
  { label: "All Pledge Reports", href: "/admin/pledge-reports", icon: FileText },
  { label: "Important Documents", href: "/admin/important-documents", icon: FileStack },
  { label: "List of SNO", href: "/admin/state-nodal-officers", icon: Shield },
  { label: "List of DNO", href: "/admin/district-nodal-officers", icon: ShieldCheck },
  { label: "Feedback/Grievances", href: "/admin/feedback", icon: MessageSquare },
];

const NAPDDR_TIER_ITEMS: Record<CommitteeTier, NavItem> = {
  STATE: { label: "State-Level Committee", href: "/admin/napddr/state", icon: Landmark },
  DISTRICT: { label: "District-Level Committee", href: "/admin/napddr/district", icon: Building },
  BLOCK: { label: "Block-Level Committee", href: "/admin/napddr/block", icon: MapPin },
};
const NAPDDR_REPORTS: NavItem = { label: "Committee Reports", href: "/admin/napddr/reports", icon: FileBarChart };

interface AdminShellProps {
  children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const session = usePortalSession();
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = React.useState(false);

  const isAdmin = session.role === "ADMIN";
  const napddrItems: NavItem[] = [
    ...tiersForRole(session.role).map((t) => NAPDDR_TIER_ITEMS[t]),
    NAPDDR_REPORTS,
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const napddrActive = pathname.startsWith("/admin/napddr");
  const [napddrOpen, setNapddrOpen] = React.useState(napddrActive);

  const handleLogout = () => {
    document.cookie = `${PORTAL_SESSION_COOKIE}=; max-age=0; path=/`;
    router.push("/admin/login");
  };

  const { toast } = useToast();

  const handleResetDemo = () => {
    resetDemoData();
    toast("Demo data reset to the starting point.", "success");
  };

  return (
    <div className="min-h-screen bg-surface-muted">
      <SiteHeader
        variant="portal"
        sticky
        beta
        tone="navy"
        emblemSrc={`${BASE}/brand/national-emblem.svg`}
        brandLines={{
          org: "Government of India",
          ministry: "Ministry of Social Justice & Empowerment",
          department: "Patient Data Monitoring System",
        }}
        brandDivider
        cobranding={[
          { src: `${BASE}/brand/digital-india.svg`, alt: "Digital India", height: 34 },
          { src: `${BASE}/brand/samavesh-logo.svg`, alt: "SAMAVESH", height: 40 },
        ]}
        language={{
          label: "English",
          onClick: () => toast("i18n: Language switch (22 scheduled languages supported) - Demo.", "info"),
        }}
        account={{ name: session.displayName, role: roleLabel(session.role) }}
        accountMenu={[
          {
            label: "Reset demo data",
            icon: <RotateCcw className="h-4 w-4" />,
            onSelect: handleResetDemo,
          },
          {
            label: "Sign out",
            danger: true,
            icon: <LogOut className="h-4 w-4" />,
            onSelect: handleLogout,
          },
        ]}
      />

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "sticky top-0 min-h-[calc(100vh-8rem)] shrink-0 border-r border-line bg-white py-5 transition-all",
            collapsed ? "w-[68px]" : "w-[260px]"
          )}
        >
          <nav aria-label="Portal navigation" className="flex flex-col gap-1 px-3">
            {/* Admin keeps the full portal nav; State/District officers get the
                NAPDDR flow only (admin-only items are hidden for them). */}
            {isAdmin &&
              ADMIN_NAV.map(({ label, href, icon: Icon }) => {
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
                    <Icon className={cn("h-5 w-5 shrink-0", active && "text-navy")} />
                    {!collapsed && <span className="leading-tight">{label}</span>}
                  </Link>
                );
              })}

            {isAdmin ? (
              <>
                {/* NAPDDR Three-Tier Committee — collapsible group */}
                <button
                  type="button"
                  onClick={() => setNapddrOpen((o) => !o)}
                  title="NAPDDR — National Action Plan for Drug Demand Reduction"
                  aria-expanded={napddrOpen}
                  className={cn(
                    "mt-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                    napddrActive ? "font-semibold text-navy" : "text-ink-muted hover:bg-black/5"
                  )}
                >
                  <Landmark className={cn("h-5 w-5 shrink-0", napddrActive && "text-navy")} />
                  {!collapsed && (
                    <>
                      <span className="leading-tight">NAPDDR Three-Tier Committee</span>
                      <ChevronDown
                        className={cn("ml-auto h-4 w-4 transition-transform", napddrOpen && "rotate-180")}
                      />
                    </>
                  )}
                </button>
                {napddrOpen && !collapsed && (
                  <div className="ml-3 flex flex-col gap-1 border-l border-line pl-3">
                    {napddrItems.map(({ label, href, icon: Icon }) => {
                      const active = isActive(href);
                      return (
                        <Link
                          key={href}
                          href={href}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                            active ? "bg-brandwash font-semibold text-navy" : "text-ink-muted hover:bg-black/5"
                          )}
                        >
                          <Icon className={cn("h-4 w-4 shrink-0", active && "text-navy")} />
                          <span className="leading-tight">{label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              <>
                {!collapsed && (
                  <p
                    className="px-3 pb-1 pt-1 text-xs font-semibold uppercase tracking-wide text-ink-hint"
                    title="National Action Plan for Drug Demand Reduction"
                  >
                    NAPDDR Three-Tier Committee
                  </p>
                )}
                {napddrItems.map(({ label, href, icon: Icon }) => {
                  const active = isActive(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      title={collapsed ? label : undefined}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                        active ? "bg-brandwash font-semibold text-navy" : "text-ink-muted hover:bg-black/5"
                      )}
                    >
                      <Icon className={cn("h-5 w-5 shrink-0", active && "text-navy")} />
                      {!collapsed && <span className="leading-tight">{label}</span>}
                    </Link>
                  );
                })}
              </>
            )}
          </nav>
          <div className={cn("mt-4 flex px-3", collapsed ? "justify-center" : "justify-start")}>
            <button
              onClick={() => setCollapsed((c) => !c)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink-muted hover:bg-black/5"
            >
              <ChevronsLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
            </button>
          </div>
        </aside>

        {/* Main */}
        <main id="main-content" className="min-w-0 flex-1 px-6 py-7 lg:px-10">
          {children}
        </main>
      </div>
      {/* AppSwitcher FAB is rendered once globally in the root layout. */}
    </div>
  );
}
