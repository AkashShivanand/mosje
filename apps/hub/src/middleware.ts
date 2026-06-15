import { NextResponse, type NextRequest } from "next/server";

/**
 * Multi-zone resilience (dev-time safeguard).
 *
 * The hub proxies each child app via next.config rewrites. If a child dev
 * server is down, the rewrite proxy fails with a raw 500. This middleware runs
 * BEFORE the rewrite: it does a short, cached reachability probe of the target
 * zone and — when the zone is unreachable — rewrites to a friendly
 * "/zone-unavailable" page instead of letting the proxy error out.
 *
 * Disabled in production: there, zones are built artifacts served by real infra,
 * so the per-request probe is unnecessary overhead.
 */

interface Zone {
  prefix: string;
  url: string;
  label: string;
  cmd: string;
}

const ZONES: Zone[] = [
  { prefix: "/website",              url: process.env.ZONE_WEBSITE_URL     ?? "http://localhost:3001", label: "DoSJE Website",     cmd: "npm run dev:website" },
  { prefix: "/storybook",            url: process.env.ZONE_DS_URL          ?? "http://localhost:6006", label: "Storybook",         cmd: "npm run dev:storybook" },
  { prefix: "/design-system",        url: process.env.ZONE_DOCS_URL        ?? "http://localhost:3002", label: "SAMAVESH Docs",     cmd: "npm run dev:docs" },
  { prefix: "/portals/pm-ajay",      url: process.env.ZONE_PM_AJAY_URL     ?? "http://localhost:4124", label: "PM-AJAY Portal",    cmd: "npm run dev:pm-ajay" },
  { prefix: "/portals/smile-admin",  url: process.env.ZONE_SMILE_ADMIN_URL ?? "http://localhost:4123", label: "SMILE Admin",       cmd: "npm run dev:smile" },
  { prefix: "/portals/scw",          url: process.env.ZONE_SCW_URL         ?? "http://localhost:4125", label: "SCW Portal",        cmd: "npm run dev:scw" },
];

// Per-process reachability cache so we probe each zone at most once per TTL.
const PROBE_TTL_MS = 5000;
const PROBE_TIMEOUT_MS = 1500;
const cache = new Map<string, { up: boolean; at: number }>();

async function zoneIsUp(url: string): Promise<boolean> {
  const now = Date.now();
  const hit = cache.get(url);
  if (hit && now - hit.at < PROBE_TTL_MS) return hit.up;

  let up = false;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);
    // ANY HTTP response (even 404/500) means the server is listening = "up".
    // Only a thrown error (ECONNREFUSED / timeout) counts as "down".
    await fetch(url, { method: "HEAD", signal: controller.signal, cache: "no-store" });
    clearTimeout(timer);
    up = true;
  } catch {
    up = false;
  }
  cache.set(url, { up, at: now });
  return up;
}

export async function middleware(req: NextRequest): Promise<NextResponse> {
  if (process.env.NODE_ENV === "production") return NextResponse.next();

  const { pathname } = req.nextUrl;
  const zone = ZONES.find((z) => pathname === z.prefix || pathname.startsWith(z.prefix + "/"));
  if (!zone) return NextResponse.next();

  if (await zoneIsUp(zone.url)) return NextResponse.next();

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
    "/design-system",
    "/design-system/:path*",
    "/portals/:path*",
  ],
};
