"use client";
import { usePathname } from "next/navigation";
import { DemoDock, type AppEntry, type DemoDockTab } from "@mosje/design-system";
import { DataModePanel } from "@/components/website/DataModePanel";
import { hasDataModes } from "@/lib/data-mode/routes";
import { WebsiteDesignPanel } from "@/components/website-design-panel";
import { DemoFillPanel, schemeFromPath } from "@/components/e-anudaan/demo-fill-panel";
import { DemoFormsPanel } from "@/components/e-anudaan/demo-forms-panel";
import { formsForPath } from "@/lib/e-anudaan/demo-forms";
import { DemoDarpanPanel } from "@/components/e-anudaan/demo-darpan-panel";
import { isDarpanDemoRoute } from "@/lib/e-anudaan/darpan-sign-in";
import { DemoErrorsPanel } from "@/components/e-anudaan/demo-errors-panel";

/**
 * Mounts the demo dock, if an admin has it switched on.
 *
 * `enabled` is resolved SERVER-SIDE — the settings store is server-only, and
 * resolving the build-time `NEXT_PUBLIC_DEMO_TOOLS` flag there too keeps the
 * whole decision in one place rather than split across a database read here
 * and an inlined constant there.
 *
 * The demo tooling is the point of this prototype, so it defaults ON and is
 * turned off for a particular audience from `/admin/portals`, not stripped
 * from a deployment.
 */
export function ConditionalDemoDock({
  apps,
  enabled = true,
}: {
  apps?: AppEntry[];
  enabled?: boolean;
}) {
  const pathname = usePathname();
  if (!enabled) return null;
  // Hidden on the hub root (it *is* the portals index), on the site gate, and
  // across the admin surface, where it offers nothing relevant.
  if (pathname === "/" || pathname === "/gate" || pathname.startsWith("/admin")) return null;
  // The Data tab appears only where a dashboard reads a report feed — the same
  // route-specific rule Sign in already follows. On every other page the switch
  // would control nothing, and a control that does nothing is worse than none.
  // Route-specific tabs, on the same rule Sign in and Data already follow: a tab appears only
  // where it controls something. Fill belongs on a grant application and nowhere else — the
  // scheme it fills is read out of the address, so off that route it has nothing to act on.
  const tabs: DemoDockTab[] = [];
  if (schemeFromPath(pathname)) {
    tabs.push({ id: "fill", label: "Fill", content: <DemoFillPanel pathname={pathname} /> });
  } else if (pathname.startsWith("/portals/e-anudaan")) {
    // Every other form: one correct fill and one preset per rule (lib/e-anudaan/demo-forms).
    const forms = formsForPath(pathname);
    if (forms.length) tabs.push({ id: "fill", label: "Fill", content: <DemoFormsPanel forms={forms} /> });
  }
  if (isDarpanDemoRoute(pathname)) {
    tabs.push({ id: "darpan", label: "NGO-DARPAN", content: <DemoDarpanPanel /> });
  }
  // Errors: every catalogued request failure, on any E-Anudaan screen (error-catalogue.ts).
  if (pathname.startsWith("/portals/e-anudaan")) {
    tabs.push({ id: "errors", label: "Errors", content: <DemoErrorsPanel /> });
  }
  // The redesign, the archived classic design and the DBIM clone share every /website address.
  if (pathname === "/website" || pathname.startsWith("/website/") || pathname.startsWith("/website-classic") || pathname.startsWith("/website-dbim")) {
    tabs.push({ id: "website-design", label: "Website", content: <WebsiteDesignPanel /> });
  }
  if (hasDataModes(pathname)) {
    tabs.push({ id: "data", label: "Data", content: <DataModePanel /> });
  }
  const extraTabs: DemoDockTab[] | undefined = tabs.length > 0 ? tabs : undefined;

  // `apps` is the registry with the admin's overrides already applied, resolved
  // server-side in the root layout. Omitting it falls back to DEFAULT_APPS.
  return <DemoDock pathname={pathname} apps={apps} extraTabs={extraTabs} />;
}
