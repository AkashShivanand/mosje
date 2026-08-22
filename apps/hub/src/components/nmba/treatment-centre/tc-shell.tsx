"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Footer, Icon, SiteHeader } from "@mosje/design-system";
import { useToast } from "@/components/nmba/toast";
import { cn } from "@/lib/nmba/utils";
import { useTCSession } from "@/lib/nmba/treatment-centre/session-context";
import { TC_SESSION_COOKIE } from "@/lib/nmba/treatment-centre/roles";
import { navForRole, type NavNode } from "./tc-nav";

const BASE = "/portals/nmba";

function useIsActive() {
  const pathname = usePathname();
  return React.useCallback(
    (href: string) => pathname === href || pathname.startsWith(href + "/"),
    [pathname],
  );
}

/** Does a nav subtree contain the active route? Used to auto-expand groups. */
function subtreeHasActive(node: NavNode, isActive: (href: string) => boolean): boolean {
  if (node.kind === "leaf") return isActive(node.href);
  return node.children.some((c) => subtreeHasActive(c, isActive));
}

function NavTree({
  nodes,
  depth,
  isActive,
}: {
  nodes: NavNode[];
  depth: number;
  isActive: (href: string) => boolean;
}) {
  return (
    <ul className={cn("flex flex-col gap-1", depth > 0 && "mt-1")}>
      {nodes.map((node) =>
        node.kind === "leaf" ? (
          <li key={node.href}>
            <Link
              href={node.href}
              aria-current={isActive(node.href) ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                depth > 0 && "pl-9",
                isActive(node.href)
                  ? "bg-brandwash font-semibold text-navy"
                  : "text-ink-muted hover:bg-black/5",
              )}
            >
              <Icon
                name={node.icon}
                size={20}
                className={cn(isActive(node.href) && "text-navy")}
                aria-hidden
              />
              <span className="leading-tight">{node.label}</span>
            </Link>
          </li>
        ) : (
          <NavGroupItem key={node.label} group={node} depth={depth} isActive={isActive} />
        ),
      )}
    </ul>
  );
}

function NavGroupItem({
  group,
  depth,
  isActive,
}: {
  group: Extract<NavNode, { kind: "group" }>;
  depth: number;
  isActive: (href: string) => boolean;
}) {
  const active = subtreeHasActive(group, isActive);
  const [open, setOpen] = React.useState(active);
  const contentId = React.useId();
  // Re-open when the active route moves into this group (e.g. browser back/forward).
  // Render-time sync on the `active` prop — React's recommended pattern, which
  // also avoids a set-state-in-effect.
  const [wasActive, setWasActive] = React.useState(active);
  if (active !== wasActive) {
    setWasActive(active);
    if (active) setOpen(true);
  }
  return (
    <li>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={contentId}
        className={cn(
          "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors",
          depth > 0 && "pl-6",
          active ? "text-navy" : "text-ink hover:bg-black/5",
        )}
      >
        <Icon name={group.icon} size={20} aria-hidden />
        <span className="flex-1 text-left leading-tight">{group.label}</span>
        <Icon name="keyboard_arrow_down" className={cn("h-4 w-4 shrink-0 transition-transform", open && "rotate-180")} aria-hidden />
      </button>
      {open && (
        <div id={contentId} className="ml-3 border-l border-line pl-1">
          <NavTree nodes={group.children} depth={depth + 1} isActive={isActive} />
        </div>
      )}
    </li>
  );
}

export function TreatmentCentreShell({ children }: { children: React.ReactNode }) {
  const session = useTCSession();
  const router = useRouter();
  const pathname = usePathname();
  const isActive = useIsActive();
  const { toast } = useToast();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const sidebarRef = React.useRef<HTMLElement>(null);
  const nav = React.useMemo(() => navForRole(session.role), [session.role]);

  // Track the mobile breakpoint so the drawer's modal semantics + focus trap only
  // apply when the sidebar is actually an overlay (below lg it is; at lg it's static).
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

  // Focus trap + Escape for the open mobile drawer (WCAG 2.1.2 / 2.4.3).
  React.useEffect(() => {
    if (!mobileOpen || !isMobile) return;
    const aside = sidebarRef.current;
    if (!aside) return;
    const opener = document.activeElement as HTMLElement | null;
    aside.querySelector<HTMLElement>("a, button")?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const f = aside.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (f.length === 0) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => {
      document.removeEventListener("keydown", handler);
      opener?.focus?.();
    };
  }, [mobileOpen, isMobile]);

  const handleLogout = () => {
    document.cookie = `${TC_SESSION_COOKIE}=; max-age=0; path=/`;
    router.push(`${BASE}/treatment-centre/login-otp`);
  };

  const drawerModal = mobileOpen && isMobile;

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
        onToggleNav={() => setMobileOpen((o) => !o)}
        navExpanded={mobileOpen}
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
        {/* Sidebar */}
        <aside
          id="tc-sidebar"
          ref={sidebarRef}
          role={drawerModal ? "dialog" : undefined}
          aria-modal={drawerModal || undefined}
          aria-label="Sidebar navigation"
          className={cn(
            "shrink-0 border-r border-line bg-white",
            "fixed inset-y-0 left-0 z-40 w-[290px] overflow-y-auto pt-3 transition-transform lg:sticky lg:top-[var(--tc-header-h)] lg:z-0 lg:h-[calc(100vh-var(--tc-header-h))] lg:translate-x-0",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <nav aria-label={`${session.role} navigation`} className="px-3 pb-8">
            <NavTree nodes={nav} depth={0} isActive={isActive} />
          </nav>
        </aside>

        {/* Mobile backdrop */}
        {mobileOpen && (
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          />
        )}

        {/* Main */}
        <main id="main-content" className="min-w-0 flex-1 px-4 py-6 lg:px-8">
          {children}
        </main>
      </div>

      <Footer />
      {/* AppSwitcher FAB is rendered once globally in the root layout. */}
    </div>
  );
}
