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
import { SiteHeader, AppSwitcher } from "@mosje/design-system";
import { useToast } from "@/components/toast";
import { cn } from "@/lib/utils";

const BASE = "/portals/nmba";

const ADMIN_NAV = [
  { label: "Ministries/Line Departments/Spiritual Organisations Dashboard", href: "/admin/ministries-dashboard", icon: Building2 },
  { label: "State/UT/District Dashboard", href: "/admin/dashboard", icon: LayoutGrid },
  { label: "User Management", href: "/admin/user-management", icon: Users },
  { label: "All Pledge Reports", href: "/admin/pledge-reports", icon: FileText },
  { label: "Important Documents", href: "/admin/important-documents", icon: FileStack },
  { label: "List of SNO", href: "/admin/state-nodal-officers", icon: Shield },
  { label: "List of DNO", href: "/admin/district-nodal-officers", icon: ShieldCheck },
  { label: "Feedback/Grievances", href: "/admin/feedback", icon: MessageSquare },
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
    router.push("/admin/login");
  };

  const { toast } = useToast();

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
        account={{ name: userName, role: "Admin" }}
        accountMenu={[
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
      <AppSwitcher devMode={process.env.NODE_ENV === "development"} />
    </div>
  );
}
