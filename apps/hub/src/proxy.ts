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
  { prefix: "/design-system",       probeUrl: base(process.env.ZONE_DOCS_URL,        "http://localhost:3002") + "/design-system",              label: "SAMAVESH Docs",  cmd: "npm run dev:docs" },
  { prefix: "/portals/pm-ajay",     probeUrl: base(process.env.ZONE_PM_AJAY_URL,     "http://localhost:4124") + "/portals/pm-ajay",            label: "PM-AJAY Portal", cmd: "npm run dev:pm-ajay" },
  { prefix: "/portals/smile-admin", probeUrl: base(process.env.ZONE_SMILE_ADMIN_URL, "http://localhost:4123") + "/portals/smile-admin/login",  label: "SMILE Admin",    cmd: "npm run dev:smile" },
  { prefix: "/portals/scw",         probeUrl: base(process.env.ZONE_SCW_URL,         "http://localhost:4125") + "/portals/scw",                label: "SCW Portal",     cmd: "npm run dev:scw" },
  { prefix: "/portals/nmba",        probeUrl: base(process.env.ZONE_NMBA_URL,        "http://localhost:4126") + "/portals/nmba/admin/login",   label: "NMBA Portal",    cmd: "npm run dev:nmba" },
  { prefix: "/portals/nhapoa",      probeUrl: base(process.env.ZONE_NHAPOA_URL,      "http://localhost:4127") + "/portals/nhapoa/login",       label: "NHAPOA Portal",  cmd: "npm run dev:nhapoa" },
];

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
  if (process.env.NODE_ENV === "production") return NextResponse.next();

  const { pathname } = req.nextUrl;
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
    "/design-system",
    "/design-system/:path*",
    "/portals/:path*",
  ],
};
