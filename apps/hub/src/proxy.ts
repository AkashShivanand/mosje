import { request as httpRequest } from "node:http";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Multi-zone resilience (dev-time safeguard).
 *
 * Probes each child zone with a lightweight node:http HEAD request before
 * proxying. If the zone is unreachable, rewrites to /zone-unavailable instead
 * of letting the next.config rewrite produce a raw 500.
 *
 * Two deliberate choices vs a naive fetch()-based probe:
 *  - node:http bypasses Next.js's patched global fetch, which adds significant
 *    overhead for localhost requests in Turbopack dev mode.
 *  - probeUrl uses the zone's actual basePath route (pre-compiled at startup)
 *    rather than the bare host root (which triggers a cold Turbopack compile
 *    on first hit and times out).
 *
 * Disabled in production — zones are built artifacts served by real infra.
 */

interface Zone {
  prefix: string;
  probeUrl: string;
  label: string;
  cmd: string;
}

const base = (env: string | undefined, fallback: string) => env ?? fallback;

const ZONES: Zone[] = [
  { prefix: "/website",             probeUrl: base(process.env.ZONE_WEBSITE_URL,     "http://localhost:3001") + "/website",                   label: "DoSJE Website",  cmd: "npm run dev:website" },
  { prefix: "/storybook",           probeUrl: base(process.env.ZONE_DS_URL,          "http://localhost:6006"),                                 label: "Storybook",      cmd: "npm run dev:storybook" },
  // scw migrated to a native hub route (apps/hub/src/app/portals/scw) — no zone to proxy.
  // nmba migrated to a native hub route (apps/hub/src/app/portals/nmba) — no zone to proxy.
  // tg migrated to a native hub route (apps/hub/src/app/portals/tg) — no zone to proxy.
  // nhapoa migrated to a native hub route (apps/hub/src/app/portals/nhapoa) — no zone to proxy.
  // smile-admin migrated to a native hub route (apps/hub/src/app/portals/smile-admin) — no zone to proxy.
  // pm-ajay migrated to a native hub route (apps/hub/src/app/portals/pm-ajay) — no zone to proxy.
  // design-system docs migrated to a native hub route (apps/hub/src/app/design-system) — no zone to proxy.
];

/*
 * SMILE Admin — route guard (folded in from the portal's own src/middleware.ts
 * when it mounted natively; see apps/hub/src/app/portals/MIGRATION-RECIPE.md §6).
 * All paths under /portals/smile-admin/ are protected EXCEPT:
 * - /portals/smile-admin/login             (sign-in page)
 * - /portals/smile-admin/forgot-password   (kept from the original PUBLIC_PATHS
 *   list even though the actual route is /forget-password — see note below)
 * - asset-like paths (contain a ".")
 *
 * We read the session from localStorage, but localStorage is not available in
 * middleware (Edge runtime). We use a lightweight cookie instead: set
 * "smile_session=1" in the auth-context signIn and cleared on signOut.
 *
 * Because this is a prototype, the cookie is just a presence flag — the real
 * account data still comes from localStorage on the client.
 *
 * SEC-004: The session cookie is NOT HttpOnly because it is set from client-side
 * JS (document.cookie). Before production, migrate to a server-set HttpOnly
 * cookie via an /api/auth route so JS cannot read or forge the session token.
 *
 * CRITICAL — paths are FULL, not basePath-relative. The portal's middleware ran
 * under `basePath: /portals/smile-admin`, which Next strips before middleware
 * runs (and re-adds to redirects) — so the original guard used bare paths like
 * "/login". Natively there is no basePath: `pathname` arrives as the full
 * "/portals/smile-admin/login", and redirects are NOT re-prefixed. Every path
 * below is written in full form.
 */
const SMILE_ADMIN_PUBLIC = ["/portals/smile-admin/login", "/portals/smile-admin/forgot-password"];
const SMILE_ADMIN_SESSION_COOKIE = "smile_session"; // set by the client auth-context — keep exact name

/*
 * PM-AJAY — route guard (folded in from the portal's own src/middleware.ts
 * when it mounted natively; see apps/hub/src/app/portals/MIGRATION-RECIPE.md §6).
 * All paths under /portals/pm-ajay/ are protected EXCEPT:
 * - /portals/pm-ajay/login             (sign-in page)
 * - /portals/pm-ajay/forgot-password   (the route folder really is
 *   "forgot-password" here — verified via `git show main:...`, unlike
 *   smile-admin's PUBLIC_PATHS/route-folder mismatch noted above)
 * - asset-like paths (contain a ".")
 *
 * We read the session from localStorage, but localStorage is not available in
 * middleware (Edge runtime). We use a lightweight cookie instead: set
 * "pmajay_session=1" in the auth-context signIn and cleared on signOut.
 *
 * Because this is a prototype, the cookie is just a presence flag — the real
 * account data still comes from localStorage on the client.
 *
 * SEC-006: The session cookie is NOT HttpOnly because it is set from client-side
 * JS (document.cookie). Before production, migrate to a server-set HttpOnly
 * cookie via an /api/auth route so JS cannot read or forge the session token.
 *
 * CRITICAL — paths are FULL, not basePath-relative. The portal's middleware ran
 * under `basePath: /portals/pm-ajay`, which Next strips before middleware
 * runs (and re-adds to redirects) — so the original guard used bare paths like
 * "/login". Natively there is no basePath: `pathname` arrives as the full
 * "/portals/pm-ajay/login", and redirects are NOT re-prefixed. Every path
 * below is written in full form.
 */
const PM_AJAY_PUBLIC = ["/portals/pm-ajay/login", "/portals/pm-ajay/forgot-password"];
const PM_AJAY_SESSION_COOKIE = "pmajay_session"; // set by the client auth-context — keep exact name

const PROBE_TTL_MS     = 5_000;
const PROBE_TIMEOUT_MS = 4_000; // generous for Turbopack cold-start on first hit
const cache = new Map<string, { up: boolean; at: number }>();

function httpProbe(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const { hostname, port, pathname } = new URL(url);
      const req = httpRequest(
        { hostname, port: Number(port) || 80, path: pathname, method: "HEAD", timeout: PROBE_TIMEOUT_MS },
        (res) => { res.resume(); resolve(true); },
      );
      req.on("timeout", () => { req.destroy(); resolve(false); });
      req.on("error",   () => resolve(false));
      req.end();
    } catch {
      resolve(false);
    }
  });
}

async function zoneIsUp(probeUrl: string): Promise<boolean> {
  const now = Date.now();
  const hit = cache.get(probeUrl);
  if (hit && now - hit.at < PROBE_TTL_MS) return hit.up;

  const up = await httpProbe(probeUrl);
  cache.set(probeUrl, { up, at: now });
  return up;
}

export async function proxy(req: NextRequest): Promise<NextResponse> {
  const { pathname } = req.nextUrl;

  // SMILE Admin route guard — must run in every environment (it's a real auth
  // check, not a dev convenience), so it sits before the dev-only production
  // early-return below.
  if (pathname === "/portals/smile-admin" || pathname.startsWith("/portals/smile-admin/")) {
    const isPublic = SMILE_ADMIN_PUBLIC.some(
      (p) => pathname === p || pathname.startsWith(p + "/"),
    );
    // Let public pages and asset-like paths (e.g. the portal's public/ files,
    // now served at /portals/smile-admin/…) through unguarded.
    if (isPublic || pathname.includes(".")) return NextResponse.next();
    if (!req.cookies.get(SMILE_ADMIN_SESSION_COOKIE)) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/portals/smile-admin/login";
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // PM-AJAY route guard — must run in every environment (it's a real auth
  // check, not a dev convenience), so it sits before the dev-only production
  // early-return below.
  if (pathname === "/portals/pm-ajay" || pathname.startsWith("/portals/pm-ajay/")) {
    const isPublic = PM_AJAY_PUBLIC.some(
      (p) => pathname === p || pathname.startsWith(p + "/"),
    );
    // Let public pages and asset-like paths (e.g. the portal's public/ files,
    // now served at /portals/pm-ajay/…) through unguarded.
    if (isPublic || pathname.includes(".")) return NextResponse.next();
    if (!req.cookies.get(PM_AJAY_SESSION_COOKIE)) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/portals/pm-ajay/login";
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  if (process.env.NODE_ENV === "production") return NextResponse.next();

  const zone = ZONES.find(
    (z) => pathname === z.prefix || pathname.startsWith(z.prefix + "/"),
  );
  if (!zone) return NextResponse.next();

  if (await zoneIsUp(zone.probeUrl)) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/zone-unavailable";
  url.search = "";
  url.searchParams.set("zone", zone.label);
  url.searchParams.set("cmd", zone.cmd);
  url.searchParams.set("from", pathname);
  return NextResponse.rewrite(url, { status: 503 });
}

export const config = {
  matcher: [
    "/website",
    "/website/:path*",
    "/storybook",
    "/storybook/:path*",
    "/portals/:path*",
  ],
};
