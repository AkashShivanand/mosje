"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { navForRole } from "@/lib/smile-admin/nav";
import { useApp } from "@/store/smile-admin/app-context";
import { initials } from "@/lib/smile-admin/utils";
import { ROLE_LABELS } from "@/lib/smile-admin/roles";
import { Avatar, Button, Icon, OrgLogo, SideSheet, SidebarNav } from "@mosje/design-system";

export function MobileNav() {
  const pathname = usePathname();
  const { account, mobileNavOpen, setMobileNavOpen, signOut } = useApp();
  const router = useRouter();

  // Close on route change
  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname, setMobileNavOpen]);

  if (!account) return null;
  const groups = navForRole(account.role);

  /*
   * The design system's SideSheet, from the left — the side a navigation drawer
   * slides out of. It owns the backdrop, focus trap, Escape and scroll lock that
   * this drawer used to hand-build, and it had no focus trap at all.
   */
  return (
    <SideSheet
      open={mobileNavOpen}
      onClose={() => setMobileNavOpen(false)}
      title="Menu"
      side="left"
      size="sm"
      /* The drawer's own width, as before: `sm` is 400px, wider than a 390px phone.
         The body's padding is dropped because SidebarNav carries its own. */
      className="w-[min(88vw,320px)] [&_.ds-sheet\_\_body]:p-0"
      footer={
        <div className="w-full">
          <Button
            variant="danger"
            appearance="text"
            fullWidth
            iconLeft={<Icon name="logout" size={16} />}
            onClick={() => {
              /*
               * A CLIENT NAVIGATION IS ENOUGH HERE, AND THE DESKTOP HEADER ALREADY DOES IT.
               * signOut() nulls the account, removes `smile.session.v1` and expires the
               * `smile_session` cookie the proxy reads, so a full reload clears nothing
               * more. `header.tsx` signs out through `router.push` the same way.
               */
              signOut();
              setMobileNavOpen(false);
              router.push("/portals/smile-admin/login");
            }}
          >
            Sign Out
          </Button>
          <div className="mt-sm flex items-center gap-sm px-md text-body-3 text-ink-hint">
            <span className="live-dot" aria-hidden />
            All systems online · v1.0.0
          </div>
        </div>
      }
    >
      {/* Account chip */}
      <div className="flex items-center gap-md border-b border-stroke-100 bg-neutral-50/60 px-lg py-md">
        <Avatar size={40} shape="rounded" initials={initials(account.name)} />
        <div className="min-w-0">
          <div className="truncate text-body-2 font-semibold text-ink">{account.name}</div>
          <div className="truncate text-body-3 text-ink-muted">{ROLE_LABELS[account.role]}</div>
        </div>
      </div>

      {/* Nav — the same SidebarNav the desktop rail renders, at drawer width. */}
      <SidebarNav
        identity={{ name: "SMILE", expansion: "Beggary Rehabilitation Portal", mark: <OrgLogo path="/portals/smile-admin" />, href: "/portals/smile-admin/dashboard" }}
        groups={groups}
        pathname={pathname}
        label="Main navigation"
        className="w-auto"
      />
    </SideSheet>
  );
}
