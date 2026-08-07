"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Header } from "@/components/smile-admin/shell/header";
import { Sidebar } from "@/components/smile-admin/shell/sidebar";
import { Footer } from "@/components/smile-admin/shell/footer";
import { MobileNav } from "@/components/smile-admin/shell/mobile-nav";
import { useApp } from "@/store/smile-admin/app-context";

const RETURN_TO_KEY = "smile.returnTo.v1";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { account, hydrated } = useApp();

  useEffect(() => {
    // Wait until AppProvider has tried to load the session from localStorage.
    if (!hydrated) return;
    if (!account) {
      // Remember the original deep-link target so /login can return the user
      // after sign-in. Skip storing /login itself.
      try {
        if (pathname && pathname !== "/portals/smile-admin/login") {
          sessionStorage.setItem(RETURN_TO_KEY, pathname);
        }
      } catch {
        /* ignore */
      }
      router.replace("/portals/smile-admin/login");
    }
  }, [account, hydrated, pathname, router]);

  // While hydrating, show the same loading shell — avoids a flash to /login.
  if (!hydrated || !account) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="grid min-h-dvh place-items-center bg-surface-muted"
      >
        <div className="text-body-2 text-ink-muted">Verifying session…</div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-surface-muted">
      <Header />
      <div className="mx-auto flex max-w-[1600px] gap-lg px-md md:px-lg">
        <Sidebar />
        <main id="main-content" className="min-w-0 flex-1 py-md md:py-lg">
          {children}
        </main>
      </div>
      <Footer />
      <MobileNav />
    </div>
  );
}
