"use client";

import { useEffect, useState, useLayoutEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type Role } from "@/lib/eutthan/portal-data";
import { normalizePath, DEMO_CREDENTIALS, portalLink } from "./eutthan-shared";
import { LoginPage } from "./eutthan-login";
import { EutthanHeader, eutthanNavGroups, EUTTHAN_IDENTITY } from "./eutthan-shell";
import { AdminDashboard, MinistryDashboard } from "./eutthan-dashboard";
import { adminNavItems, ministryNavItems } from "@/lib/eutthan/portal-data";

// Lazy-load heavy screen components (PERF-002)
const MapPage = dynamic(() => import("./eutthan-map").then((m) => m.MapPage));
const Statement10APage = dynamic(() =>
  import("./eutthan-statement10a").then((m) => m.Statement10APage)
);
const FinancialSummaryPage = dynamic(() =>
  import("./eutthan-financial").then((m) => m.FinancialSummaryPage)
);
const PfmsLogsPage = dynamic(() =>
  import("./eutthan-pfms").then((m) => m.PfmsLogsPage)
);
const PhysicalProgressPage = dynamic(() =>
  import("./eutthan-physical").then((m) => m.PhysicalProgressPage)
);
const TablePage = dynamic(() =>
  import("./eutthan-table").then((m) => m.TablePage)
);
const FormPage = dynamic(() =>
  import("./eutthan-form").then((m) => m.FormPage)
);

import { tableScreens } from "@/lib/eutthan/portal-data";
import { Icon, PortalPage } from "@mosje/design-system";

export default function EutthanPortal() {
  const pathname = usePathname();
  const router = useRouter();
  const path = normalizePath(pathname);

  const [role, setRole] = useState<Role | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // useLayoutEffect on mount: reads localStorage to restore the auth session
  // before first paint so returning users don't flash the login page.
  // Safe in "use client" — no SSR mismatch because we return null until hydrated.
  // SEC-005: localStorage is not XSS-safe. Replace with an HttpOnly cookie
  // session (via the /api/auth route) before production launch.
  useLayoutEffect(() => {
    const raw = localStorage.getItem("eutthan_role");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRole(raw === "admin" || raw === "ministry" ? raw : null);
     
    setHydrated(true);
  }, []);

  function handleLogin(username: string, password: string): string | null {
    for (const cred of DEMO_CREDENTIALS) {
      if (username === cred.username && password === cred.demoPin) {
        localStorage.setItem("eutthan_role", cred.role);
        setRole(cred.role);
        return null;
      }
    }
    return "Invalid user ID or password.";
  }

  function handleLogout() {
    localStorage.removeItem("eutthan_role");
    setRole(null);
  }

  /*
   * THE LOGIN HAS A URL. Signed out on any other path, the reader is moved to
   * `/login` — carrying where they were as `returnTo` — because the DemoDock
   * offers accounts only on a path ending `/login`. Signed in on `/login`, they
   * go back to `returnTo`, or the dashboard. The `[[...slug]]` catch-all serves
   * both, so no route is added.
   *
   * `returnTo` is read from `window.location` inside the effect rather than
   * `useSearchParams`, which would need a Suspense boundary around the portal.
   */
  useEffect(() => {
    if (!hydrated) return;
    if (!role && path !== "/login") {
      const here = path === "/" ? "" : path + window.location.search;
      router.replace(portalLink("/login") + (here ? `?returnTo=${encodeURIComponent(here)}` : ""));
    } else if (role && path === "/login") {
      const wanted = new URLSearchParams(window.location.search).get("returnTo");
      // Only a path inside this portal: never "//host", never back to /login.
      const safe =
        wanted && wanted.startsWith("/") && !wanted.startsWith("//") && !wanted.startsWith("/login")
          ? wanted
          : "/";
      router.replace(portalLink(safe));
    }
  }, [hydrated, role, path, router]);

  if (!hydrated) return null;
  // Rendered on any path while signed out, so the redirect above never flashes a blank page.
  if (!role) return <LoginPage onLogin={handleLogin} />;
  // Signed in on /login: the effect is already leaving for the dashboard.
  if (path === "/login") return null;

  const navItems = role === "admin" ? adminNavItems : ministryNavItems;
  const userName = role === "admin" ? "Admin User" : "Shivendra";
  const roleLabel = role === "admin" ? "Super Admin" : "Ministry";

  function renderContent() {
    if (path === "/" || path === "/dashboard") {
      return role === "admin" ? <AdminDashboard /> : <MinistryDashboard />;
    }
    if (path === "/map-ministry" || path === "/map-schema") {
      return <MapPage path={path} />;
    }
    if (path === "/reports/statement-10a") {
      return <Statement10APage />;
    }
    if (path === "/reports/financial-summary") {
      return <FinancialSummaryPage />;
    }
    if (path === "/pfms-logs") {
      return <PfmsLogsPage />;
    }
    if (path === "/ministry/physical-progress-data") {
      return <PhysicalProgressPage />;
    }
    if (path.endsWith("/add") || path.endsWith("/edit")) {
      return <FormPage path={path} />;
    }
    if (tableScreens[path]) {
      return <TablePage path={path} />;
    }
    return (
      <div className="page-stack">
        <h2 className="page-title">Page Not Found</h2>
        <p style={{ color: "var(--text-muted)" }}>
          The path <code>{path}</code> could not be found.
        </p>
        <Link
          href={portalLink("/dashboard")}
          className="primary-button"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--sa-inline-8)",
            textDecoration: "none",
            width: "fit-content",
          }}
        >
          <Icon name="arrow_back" size={16} /> Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <PortalPage
      portal="eutthan-admin"
      role="officer"
      pathname={pathname}
      identity={EUTTHAN_IDENTITY}
      nav={eutthanNavGroups(navItems)}
      /* The masthead's skipTo points here, so the id has to survive the move. */
      mainId="eu-main-content"
      header={(nav) => (
        <EutthanHeader
          name={userName}
          roleLabel={roleLabel}
          onLogout={handleLogout}
          onToggleNav={nav.toggle}
          navExpanded={nav.open}
        />
      )}
    >
      {renderContent()}
    </PortalPage>
  );
}
