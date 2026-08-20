"use client";
import { usePathname } from "next/navigation";
import { DemoDock, type AppEntry } from "@mosje/design-system";

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
  // `apps` is the registry with the admin's overrides already applied, resolved
  // server-side in the root layout. Omitting it falls back to DEFAULT_APPS.
  return <DemoDock pathname={pathname} apps={apps} />;
}
