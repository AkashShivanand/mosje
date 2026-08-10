"use client";
import { usePathname } from "next/navigation";
import { DemoDock, type AppEntry } from "@mosje/design-system";

export function ConditionalDemoDock({ apps }: { apps?: AppEntry[] }) {
  const pathname = usePathname();
  // Estate-wide off switch for a genuinely public deployment.
  if (process.env.NEXT_PUBLIC_DEMO_TOOLS === "false") return null;
  // Hidden on the hub root (it *is* the portals index), on the site gate, and
  // across the admin surface, where it offers nothing relevant.
  if (pathname === "/" || pathname === "/gate" || pathname.startsWith("/admin")) return null;
  // `apps` is the registry with the admin's overrides already applied, resolved
  // server-side in the root layout. Omitting it falls back to DEFAULT_APPS.
  return <DemoDock pathname={pathname} apps={apps} />;
}
