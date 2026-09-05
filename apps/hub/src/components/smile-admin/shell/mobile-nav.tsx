"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { navForRole } from "@/lib/smile-admin/nav";
import { useApp } from "@/store/smile-admin/app-context";
import { cn, initials } from "@/lib/smile-admin/utils";
import { ROLE_LABELS } from "@/lib/smile-admin/roles";
import { Icon, SidebarNav } from "@mosje/design-system";

export function MobileNav() {
  const pathname = usePathname();
  const { account, mobileNavOpen, setMobileNavOpen, signOut } = useApp();
  const router = useRouter();

  // Lock body scroll while open
  useEffect(() => {
    if (mobileNavOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [mobileNavOpen]);

  // Close on escape
  useEffect(() => {
    if (!mobileNavOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileNavOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileNavOpen, setMobileNavOpen]);

  // Close on route change
  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname, setMobileNavOpen]);

  if (!account) return null;
  const groups = navForRole(account.role);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 md:hidden",
        mobileNavOpen ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!mobileNavOpen}
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close menu"
        onClick={() => setMobileNavOpen(false)}
        className={cn(
          "absolute inset-0 bg-neutral-900/40 backdrop-blur-sm transition-opacity duration-200",
          mobileNavOpen ? "opacity-100" : "opacity-0",
        )}
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Main navigation"
        className={cn(
          "absolute inset-y-0 left-0 flex w-[min(88vw,320px)] flex-col bg-white shadow-xl transition-transform duration-200 ease-swift-out",
          mobileNavOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-md border-b border-stroke-200 bg-primary px-lg py-md text-white">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-white/10 ring-1 ring-inset ring-white/20">
            <span className="text-label-2 font-bold">MoSJE</span>
          </div>
          <div className="min-w-0">
            <div className="text-label-3 uppercase text-white/70">
              SMILE Admin
            </div>
            <div className="truncate text-body-2 font-semibold">
              Ministry of Social Justice
            </div>
          </div>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileNavOpen(false)}
            className="ml-auto grid h-9 w-9 shrink-0 place-items-center rounded-md text-white/80 hover:bg-white/10"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        {/* Account chip */}
        <div className="flex items-center gap-md border-b border-stroke-100 bg-neutral-50/60 px-lg py-md">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-primary text-label-1 font-bold text-white shadow-xs ring-1 ring-inset ring-primary-700/30">
            {initials(account.name)}
          </div>
          <div className="min-w-0">
            <div className="truncate text-body-2 font-semibold text-ink">
              {account.name}
            </div>
            <div className="truncate text-body-3 text-ink-muted">
              {ROLE_LABELS[account.role]}
            </div>
          </div>
        </div>

        {/* Nav — the same SidebarNav the desktop rail renders, at drawer width. */}
        <SidebarNav
          groups={groups}
          pathname={pathname}
          label="Main navigation"
          className="min-h-0 w-auto flex-1"
        />

        {/* Footer */}
        <div className="border-t border-stroke-100 bg-neutral-50/50 px-sm py-md">
          <button
            type="button"
            onClick={() => {
              /*
               * A CLIENT NAVIGATION IS ENOUGH HERE, AND THE DESKTOP HEADER ALREADY DOES IT.
               *
               * `window.location.href` forced a full document reload, which looked like it
               * was there to guarantee a clean slate. It was not doing that work: signOut()
               * in the smile-admin app-context already nulls the account state, removes the
               * `smile.session.v1` localStorage entry and expires the `smile_session`
               * cookie the proxy reads — so nothing survives the transition that a reload
               * would have cleared. The cookie write is synchronous, so the middleware sees
               * it gone on the next request either way.
               *
               * `header.tsx` runs the identical sign-out through `router.push`, so the two
               * paths out of this portal now behave the same instead of one of them
               * discarding the app shell.
               */
              signOut();
              setMobileNavOpen(false);
              router.push("/portals/smile-admin/login");
            }}
            className="flex w-full items-center gap-md rounded-md px-md py-2 text-body-2 font-semibold text-danger hover:bg-danger-50"
          >
            <Icon name="logout" size={16} />
            Sign out
          </button>
          <div className="mt-sm flex items-center gap-sm px-md text-body-3 text-ink-hint">
            <span className="live-dot" aria-hidden />
            All systems online · v1.0.0
          </div>
        </div>
      </aside>
    </div>
  );
}
