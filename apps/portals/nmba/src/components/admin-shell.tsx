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
  LogOut,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

const BASE = "/portals/nmba";

const ADMIN_NAV = [
  { label: "Ministries/Line Departments/Spiritual Organisations Dashboard", href: `${BASE}/admin/ministries-dashboard`, icon: Building2 },
  { label: "State/UT/District Dashboard", href: `${BASE}/admin/dashboard`, icon: LayoutGrid },
  { label: "User Management", href: `${BASE}/admin/user-management`, icon: Users },
  { label: "All Pledge Reports", href: `${BASE}/admin/pledge-reports`, icon: FileText },
  { label: "Important Documents", href: `${BASE}/admin/important-documents`, icon: FileStack },
  { label: "List of SNO", href: `${BASE}/admin/state-nodal-officers`, icon: Shield },
  { label: "List of DNO", href: `${BASE}/admin/district-nodal-officers`, icon: ShieldCheck },
  { label: "Feedback/Grievances", href: `${BASE}/admin/feedback`, icon: MessageSquare },
];

interface AdminShellProps {
  children: React.ReactNode;
  userName?: string;
}

export function AdminShell({ children, userName = "Rajesh Pilli" }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = React.useState(false);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  const handleLogout = () => {
    document.cookie = "nmba_admin_session=; max-age=0; path=/";
    router.push(`${BASE}/admin/login`);
  };

  return (
    <div className="min-h-screen bg-surface-muted">
      {/* Gov top bar */}
      <div className="bg-navy-950 text-white">
        <div className="flex h-9 items-center justify-between px-4 text-xs">
          <a className="flex items-center gap-1.5 font-medium" href="https://india.gov.in" target="_blank" rel="noreferrer">
            <span aria-hidden>🇮🇳</span>
            <span>Government of India</span>
          </a>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 rounded px-1 hover:bg-white/10" aria-label="Language English">
              <span>English</span>
              <ChevronDown className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Masthead */}
      <header className="border-b border-line bg-white">
        <div className="flex items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3">
            <img
              src={`${BASE}/brand/national-emblem.svg`}
              alt="National Emblem of India"
              className="h-14 w-auto"
            />
            <div className="leading-tight">
              <span className="inline-block rounded bg-amber-300/80 px-1.5 py-0.5 text-[10px] font-bold text-amber-900">
                BETA
              </span>
              <div className="mt-0.5 text-[11px] text-ink-muted">Government of India</div>
              <div className="text-lg font-bold text-ink">
                Ministry of Social Justice &amp; Empowerment
              </div>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <img
              src={`${BASE}/brand/digital-india.svg`}
              alt="Digital India"
              className="hidden h-9 w-auto md:block"
            />
            <div className="hidden items-center gap-2 lg:flex">
              <img
                src={`${BASE}/brand/samavesh-logo.svg`}
                alt="SAMAVESH"
                className="h-10 w-10"
              />
              <div className="max-w-[200px] leading-tight">
                <div className="text-sm font-bold text-ink">SAMAVESH</div>
                <div className="text-[10px] text-ink-muted">
                  Single Access Mechanism for All Verticals of Empowerment &amp; Social Harmony
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
                {userName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <div className="hidden flex-col leading-tight lg:flex">
                <span className="text-sm font-semibold text-ink">{userName}</span>
                <span className="text-xs text-ink-muted">(Admin)</span>
              </div>
              <button
                onClick={handleLogout}
                aria-label="Logout"
                className="ml-2 rounded-lg p-1.5 text-ink-hint hover:bg-black/5 hover:text-ink"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "sticky top-0 min-h-[calc(100vh-8rem)] shrink-0 border-r border-line bg-white py-5 transition-all",
            collapsed ? "w-[68px]" : "w-[260px]"
          )}
        >
          <nav aria-label="Admin navigation" className="flex flex-col gap-1 px-3">
            {ADMIN_NAV.map(({ label, href, icon: Icon }) => {
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
                  {!collapsed && (
                    <span className="leading-tight">{label}</span>
                  )}
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
              <ChevronsLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
            </button>
          </div>
        </aside>

        {/* Main */}
        <main id="main-content" className="min-w-0 flex-1 px-6 py-7 lg:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}
