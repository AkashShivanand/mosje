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
  HeartHandshake,
  ClipboardCheck,
  BarChart3,
  Menu,
} from "lucide-react";
import { SideSheet, SiteHeader } from "@mosje/design-system";
import { useToast } from "@/components/nmba/toast";
import { cn } from "@/lib/nmba/utils";
import { usePortalSession } from "@/lib/nmba/committee/session-context";
import { PORTAL_SESSION_COOKIE, roleLabel } from "@/lib/nmba/committee/session";
import { tiersForRole } from "@/lib/nmba/committee/scope";
import { resetDemoData } from "@/lib/nmba/committee/store";
import type { CommitteeTier, PortalRole } from "@/lib/nmba/committee/types";

const BASE = "/portals/nmba";

type NavItem = { label: string; href: string; icon: React.ComponentType<{ className?: string }> };

const ADMIN_NAV: NavItem[] = [
  { label: "Ministries/Line Departments/Spiritual Organisations Dashboard", href: "/portals/nmba/admin/ministries-dashboard", icon: Building2 },
  { label: "State/UT/District Dashboard", href: "/portals/nmba/admin/dashboard", icon: LayoutGrid },
  { label: "User Management", href: "/portals/nmba/admin/user-management", icon: Users },
  { label: "All Pledge Reports", href: "/portals/nmba/admin/pledge-reports", icon: FileText },
  { label: "Important Documents", href: "/portals/nmba/admin/important-documents", icon: FileStack },
  { label: "List of SNO", href: "/portals/nmba/admin/state-nodal-officers", icon: Shield },
  { label: "List of DNO", href: "/portals/nmba/admin/district-nodal-officers", icon: ShieldCheck },
  { label: "Feedback/Grievances", href: "/portals/nmba/admin/feedback", icon: MessageSquare },
];

const NAPDDR_TIER_ITEMS: Record<CommitteeTier, NavItem> = {
  STATE: { label: "State-Level Committee", href: "/portals/nmba/admin/napddr/state", icon: Landmark },
  DISTRICT: { label: "District-Level Committee", href: "/portals/nmba/admin/napddr/district", icon: Building },
  BLOCK: { label: "Block-Level Committee", href: "/portals/nmba/admin/napddr/block", icon: MapPin },
};
const NAPDDR_REPORTS: NavItem = { label: "Committee Reports", href: "/portals/nmba/admin/napddr/reports", icon: FileBarChart };

const MP = "/portals/nmba/admin/mass-pledge";

/**
 * Mass Pledge nav, by role. Admin oversees but never files; the four
 * organisation logins file but never approve; Block files and is approved by
 * District, which is in turn approved by State.
 *
 * There is no separate "report" entry: the form lives on the Mass Pledge page
 * itself and only appears on 18 August, so a permanent nav item pointing at it
 * would be dead for all but one day of the year.
 */
function massPledgeNavFor(role: PortalRole): NavItem[] {
  const reports: NavItem = { label: "Mass Pledge", href: MP, icon: HeartHandshake };
  const approvals: NavItem = { label: "Approvals", href: `${MP}/approvals`, icon: ClipboardCheck };
  const dashboard: NavItem = { label: "Pledge Dashboard", href: `${MP}/dashboard`, icon: BarChart3 };

  switch (role) {
    case "ADMIN":
      return [reports, dashboard];
    case "STATE":
    case "DISTRICT":
      return [reports, approvals, dashboard];
    case "BLOCK":
    case "ENTITY":
      return [reports];
  }
}

interface AdminShellProps {
  children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const session = usePortalSession();
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);

  const isAdmin = session.role === "ADMIN";
  const napddrTiers = tiersForRole(session.role);
  // Block and organisation logins exist for Mass Pledge only — showing them a
  // committee section with nothing in it would read as a broken menu.
  const showNapddr = napddrTiers.length > 0;
  const napddrItems: NavItem[] = [
    ...napddrTiers.map((t) => NAPDDR_TIER_ITEMS[t]),
    NAPDDR_REPORTS,
  ];
  const massPledgeItems = massPledgeNavFor(session.role);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const napddrActive = pathname.startsWith("/portals/nmba/admin/napddr");
  const [napddrOpen, setNapddrOpen] = React.useState(napddrActive);

  const handleLogout = () => {
    document.cookie = `${PORTAL_SESSION_COOKIE}=; max-age=0; path=/`;
    router.push("/portals/nmba/admin/login");
  };

  const { toast } = useToast();

  const handleResetDemo = () => {
    resetDemoData();
    toast("Demo data reset to the starting point.", "success");
  };

  /**
   * One nav definition, rendered twice: in the persistent sidebar and in the
   * mobile drawer. `compact` is the icon-only sidebar state; the drawer always
   * passes false because there is room for labels there.
   */
  const renderNav = (compact: boolean, onNavigate?: () => void) => (
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
              onClick={onNavigate}
              title={compact ? label : undefined}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-brandwash font-semibold text-navy"
                  : "text-ink-muted hover:bg-black/5"
              )}
            >
              <Icon className={cn("h-5 w-5 shrink-0", active && "text-navy")} />
              {!compact && <span className="leading-tight">{label}</span>}
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
            {!compact && (
              <>
                <span className="leading-tight">NAPDDR Three-Tier Committee</span>
                <ChevronDown
                  className={cn("ml-auto h-4 w-4 transition-transform", napddrOpen && "rotate-180")}
                />
              </>
            )}
          </button>
          {napddrOpen && !compact && (
            <div className="ml-3 flex flex-col gap-1 border-l border-line pl-3">
              {napddrItems.map(({ label, href, icon: Icon }) => {
                const active = isActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
              onClick={onNavigate}
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
        showNapddr && (
        <>
          {!compact && (
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
              onClick={onNavigate}
                title={compact ? label : undefined}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  active ? "bg-brandwash font-semibold text-navy" : "text-ink-muted hover:bg-black/5"
                )}
              >
                <Icon className={cn("h-5 w-5 shrink-0", active && "text-navy")} />
                {!compact && <span className="leading-tight">{label}</span>}
              </Link>
            );
          })}
        </>
        )
      )}

      {/* Mass Pledge — 18 August 2026. Every role has something here, so
          this section is never conditional on role, only its items are. */}
      {!compact && (
        <p className="px-3 pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-ink-hint">
          Mass Pledge · 18 Aug 2026
        </p>
      )}
      {massPledgeItems.map(({ label, href, icon: Icon }) => {
        const active = isActive(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            title={compact ? label : undefined}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
              active ? "bg-brandwash font-semibold text-navy" : "text-ink-muted hover:bg-black/5"
            )}
          >
            <Icon className={cn("h-5 w-5 shrink-0", active && "text-navy")} />
            {!compact && <span className="leading-tight">{label}</span>}
          </Link>
        );
      })}
    </nav>
  );

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
        {/* Sidebar — persistent from lg up. Below that it would eat most of a
            phone screen, so it moves into a drawer instead. */}
        <aside
          className={cn(
            "sticky top-0 hidden min-h-[calc(100vh-8rem)] shrink-0 border-r border-line bg-white py-5 transition-all lg:block",
            collapsed ? "w-[68px]" : "w-[260px]"
          )}
        >
          {renderNav(collapsed)}
          <div className={cn("mt-4 flex px-3", collapsed ? "justify-center" : "justify-start")}>
            <button
              onClick={() => setCollapsed((c) => !c)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink-muted hover:bg-black/5"
            >
              <ChevronsLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
            </button>
          </div>
        </aside>

        {/* Main */}
        <main id="main-content" className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-10 lg:py-7">
          {/* Mobile nav trigger. 44px tall so it clears the touch-target floor. */}
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="mb-5 inline-flex h-11 items-center gap-2 rounded-lg border border-line bg-white px-4 text-sm font-semibold text-ink transition-colors hover:bg-black/5 lg:hidden"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
            Menu
          </button>
          {children}
        </main>
      </div>

      <SideSheet
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        title="Navigation"
        side="left"
        size="sm"
      >
        {renderNav(false, () => setMobileNavOpen(false))}
      </SideSheet>

      {/* AppSwitcher FAB is rendered once globally in the root layout. */}
    </div>
  );
}
