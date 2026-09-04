"use client";

import { usePathname } from "next/navigation";
import { SidebarNav } from "@mosje/design-system";
import { navForRole } from "@/lib/smile-admin/nav";
import { useApp } from "@/store/smile-admin/app-context";

function StatusFooter({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="flex items-center gap-sm">
      <span className="live-dot" aria-hidden />
      {!collapsed && (
        <div className="text-body-3">
          <div className="text-label-3 uppercase text-success">All systems online</div>
          <div className="text-ink-hint">SMILE Beggary Rehabilitation Portal</div>
          <div className="text-ink-hint">v1.0.0 · Build 2026.05.15b</div>
        </div>
      )}
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { account, sidebarCollapsed, setSidebarCollapsed } = useApp();
  if (!account) return null;

  const groups = navForRole(account.role);

  return (
    <SidebarNav
      id="smile-admin-sidebar"
      groups={groups}
      pathname={pathname}
      collapsed={sidebarCollapsed}
      onCollapsedChange={setSidebarCollapsed}
      footer={<StatusFooter collapsed={sidebarCollapsed} />}
      className="sticky top-[136px] hidden h-[calc(100dvh-136px-32px)] shrink-0 self-start border-r border-stroke-200 md:flex md:flex-col"
    />
  );
}
