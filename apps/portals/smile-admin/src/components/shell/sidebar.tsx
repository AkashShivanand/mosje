"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { navForRole } from "@/lib/nav";
import { useApp } from "@/store/app-context";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const { account, sidebarCollapsed } = useApp();
  if (!account) return null;
  const groups = navForRole(account.role);

  const collapsed = sidebarCollapsed;
  return (
    <TooltipProvider delayDuration={120}>
      <aside
        className={cn(
          "sticky top-[64px] z-20 hidden h-[calc(100dvh-64px-32px)] shrink-0 self-start border-r border-stroke-200 bg-white transition-[width] duration-200 ease-out md:flex md:flex-col",
          collapsed ? "w-[68px]" : "w-[240px]"
        )}
      >
        <nav className="flex-1 overflow-y-auto px-sm py-md">
          {groups.map((group, gi) => (
            <div key={gi} className="mb-md">
              {group.label && !collapsed ? (
                <div className="px-md pb-xs pt-sm text-label-3 font-semibold uppercase tracking-wider text-foreground-hint">
                  {group.label}
                </div>
              ) : null}
              {group.label && collapsed && gi !== 0 ? (
                <div className="mx-md my-sm h-px bg-stroke-100" />
              ) : null}
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                  const Icon = item.icon;
                  const content = (
                    <Link
                      href={item.href}
                      className={cn(
                        "group relative flex items-center gap-md rounded-md px-md py-2 text-body-3 font-medium transition-colors",
                        active
                          ? "bg-primary-50 text-primary"
                          : "text-foreground-muted hover:bg-neutral-50 hover:text-foreground",
                      )}
                    >
                      <Icon className={cn("h-4 w-4 shrink-0", active ? "text-primary" : "text-foreground-muted")} />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                      {!collapsed && item.badge ? (
                        <span className="ml-auto inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-info text-label-3 font-bold text-white">
                          {item.badge}
                        </span>
                      ) : null}
                      {active && <span className="absolute inset-y-1 left-0 w-0.5 rounded-full bg-primary" />}
                    </Link>
                  );
                  return (
                    <li key={item.href}>
                      {collapsed ? (
                        <Tooltip>
                          <TooltipTrigger asChild>{content}</TooltipTrigger>
                          <TooltipContent side="right">{item.label}</TooltipContent>
                        </Tooltip>
                      ) : (
                        content
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
        <div className={cn("border-t border-stroke-100 p-md", collapsed && "px-sm")}>
          <div className="flex items-center gap-sm">
            <span className="live-dot" aria-hidden />
            {!collapsed && (
              <div className="text-label-3 leading-tight">
                <div className="font-semibold uppercase tracking-wide text-success">All systems online</div>
                <div className="text-foreground-hint">SMILE Beggary Rehabilitation Portal</div>
                <div className="text-foreground-hint">v1.0.0 · Build 2026.05.15b</div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );
}
