import { request as httpRequest } from "node:http";
import { NextResponse, type NextRequest } from "next/server";
import { GATE_COOKIE, GATE_EMBLEM_SRC, resolveGateToken, safeEqual } from "@/lib/site-gate";
import { ADMIN_PREVIEW_COOKIE, expectedPreviewToken } from "@/lib/admin/tokens";
import type { RegistryConfig } from "@mosje/design-system/registry";
import { blockedEntry, hiddenFrom, readRegistryConfig } from "@/lib/registry/config";

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
  // Only probed when Storybook is NOT already built into public/storybook. If
  // it is, next.config serves those static files and this probe must stay out
  // of the way — otherwise it finds :6006 down and rewrites to the "app not
  // running" page, shadowing the files Next was about to serve. The flag is
  // set in next.config, which is where the filesystem check lives.
  ...(process.env.STORYBOOK_STATIC
    ? []
    : [{ prefix: "/storybook", probeUrl: base(process.env.ZONE_DS_URL, "http://localhost:6006"), label: "Storybook", cmd: "npm run dev:storybook" }]),
  // The DoSJE website migrated to a native hub route (apps/hub/src/app/website) —
  // no zone to proxy. Storybook is the last remaining child process.
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

/*
 * Site gate — shared-password wall in front of the entire deployed estate.
 * See src/lib/site-gate.ts for the rationale and the cookie scheme.
 *
 * Assets the gate page itself needs must be reachable *before* unlocking, or
 * the wall renders unstyled/broken. `/_next/static` and `/_next/image` are
 * excluded by the matcher below; the emblem lives in public/ and so needs an
 * explicit pass here.
 */
const GATE_PUBLIC_ASSETS = [GATE_EMBLEM_SRC];

async function gateRedirect(req: NextRequest): Promise<NextResponse | null> {
  const expected = await resolveGateToken();
  // No configured token ⇒ gate disabled. This is the local-dev path, and it is
  // the first thing checked so the proxy stays cheap on every request.
  if (!expected) return null;

  const { pathname } = req.nextUrl;
  if (pathname === "/gate" || pathname.startsWith("/gate/")) return null;
  // /admin is deliberately outside the gate: it is the recovery path when the
  // gate password is lost or a bad value is written. It has its own password.
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return null;
  if (GATE_PUBLIC_ASSETS.includes(pathname)) return null;

  const presented = req.cookies.get(GATE_COOKIE)?.value;
  if (presented && safeEqual(presented, expected)) return null;

  const url = req.nextUrl.clone();
  url.search = "";
  url.pathname = "/gate";
  url.searchParams.set("next", pathname + req.nextUrl.search);
  return NextResponse.redirect(url);
}

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

/**
 * True when the request carries a valid admin *preview* cookie.
 *
 * Deliberately not the admin cookie: that one is scoped to /admin and is never
 * sent here, and widening it would let an XSS anywhere in the estate drive
 * authenticated requests against the settings page. The preview cookie
 * authorises one thing — seeing past a hidden entry.
 */
async function isAdminRequest(req: NextRequest): Promise<boolean> {
  const presented = req.cookies.get(ADMIN_PREVIEW_COOKIE)?.value;
  if (!presented) return false;
  const expected = await expectedPreviewToken();
  if (!expected) return false;
  return safeEqual(presented, expected);
}

/**
 * Block the paths an admin has switched off.
 *
 * "Hidden" means hidden: dropping the card from the explorer while the URL
 * still serves the portal would only hide it from people who were not going to
 * find it anyway. An admin passes through, so the person who hid a portal can
 * still check it before switching it back on.
 *
 * Reads the settings store directly rather than through `resolveRegistry`,
 * because middleware cannot use `unstable_cache`. The store's own 60s TTL
 * still applies, so an instance that did not handle the write can lag by up to
 * a minute — the same propagation behaviour the gate password already has.
 */
type HiddenOutcome =
  | { kind: "block"; response: NextResponse }
  /** Matched a hidden entry, but the caller is an admin — let it through. */
  | { kind: "admin-pass" }
  | null;

/**
 * Responses that must never be cached by a shared cache.
 *
 * Both directions are dangerous. A cached admin pass-through would serve a
 * hidden portal to the next anonymous visitor; a cached 503 would keep denying
 * the portal after it is switched back on. Neither is recoverable from the
 * admin page, because the request never reaches the origin.
 */
function noStore(response: NextResponse): NextResponse {
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

async function hiddenCheck(
  req: NextRequest,
  configPromise: Promise<RegistryConfig | null>,
): Promise<HiddenOutcome> {
  const { pathname } = req.nextUrl;

  const config = await configPromise;
  // The overwhelmingly common case: nothing is hidden, so this costs one
  // cached store read and no further work.
  if (!config) return null;

  const hidden = hiddenFrom(config);
  if (hidden.length === 0) return null;

  // The admin check is deliberately last — it is the only part that costs an
  // HMAC, and it only matters once a path has actually matched.
  const provisional = blockedEntry({ pathname, hidden, isAdmin: false });
  if (!provisional) return null;

  if (await isAdminRequest(req)) return { kind: "admin-pass" };

  const url = req.nextUrl.clone();
  url.pathname = "/unavailable";
  url.search = "";
  url.searchParams.set("entry", provisional.name);
  // Rewrite, not redirect: the URL the visitor typed stays in the address bar,
  // so a bookmark that starts working again later still points at the portal.
  return {
    kind: "block",
    response: noStore(NextResponse.rewrite(url, { status: 503 })),
  };
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

  /*
   * Start the registry read now, before awaiting the gate.
   *
   * Both the gate token and the registry come from the same settings store,
   * and both are cold on a fresh instance. Awaited in sequence they stack two
   * 1.5s timeouts onto the first request of every serverless instance; started
   * together they overlap. The cost when the gate redirects is one extra read
   * that the 60s cache absorbs — and it warms the cache for the request that
   * follows the unlock.
   */
  const registryPromise = readRegistryConfig();

  // Site gate runs first — nothing behind it should be reachable, including the
  // portal login pages that the guards below treat as public.
  const gated = await gateRedirect(req);
  if (gated) {
    // Never leave the read unobserved: an unhandled rejection in middleware
    // takes down the request that would otherwise have redirected cleanly.
    void registryPromise.catch(() => {});
    return gated;
  }

  // Entries an admin has switched off, blocked before any portal guard runs —
  // a hidden portal must not even offer its login page.
  const hidden = await hiddenCheck(req, registryPromise);
  if (hidden?.kind === "block") return hidden.response;

  /*
   * An admin looking at a hidden portal still has to clear that portal's own
   * session guard — the block is about visibility, not authentication, and
   * bypassing it here would let /admin double as a portal login.
   *
   * So the pass-through only tags the eventual response as uncacheable, and
   * every remaining branch returns through `finish`.
   */
  const finish =
    hidden?.kind === "admin-pass" ? noStore : (response: NextResponse) => response;

  // SMILE Admin route guard — must run in every environment (it's a real auth
  // check, not a dev convenience), so it sits before the dev-only production
  // early-return below.
  if (pathname === "/portals/smile-admin" || pathname.startsWith("/portals/smile-admin/")) {
    const isPublic = SMILE_ADMIN_PUBLIC.some(
      (p) => pathname === p || pathname.startsWith(p + "/"),
    );
    // Let public pages and asset-like paths (e.g. the portal's public/ files,
    // now served at /portals/smile-admin/…) through unguarded.
    if (isPublic || pathname.includes(".")) return finish(NextResponse.next());
    if (!req.cookies.get(SMILE_ADMIN_SESSION_COOKIE)) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/portals/smile-admin/login";
      return finish(NextResponse.redirect(loginUrl));
    }
    return finish(NextResponse.next());
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
    if (isPublic || pathname.includes(".")) return finish(NextResponse.next());
    if (!req.cookies.get(PM_AJAY_SESSION_COOKIE)) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/portals/pm-ajay/login";
      return finish(NextResponse.redirect(loginUrl));
    }
    return finish(NextResponse.next());
  }

  if (process.env.NODE_ENV === "production") return finish(NextResponse.next());

  const zone = ZONES.find(
    (z) => pathname === z.prefix || pathname.startsWith(z.prefix + "/"),
  );
  if (!zone) return finish(NextResponse.next());

  if (await zoneIsUp(zone.probeUrl)) return finish(NextResponse.next());

  const url = req.nextUrl.clone();
  url.pathname = "/zone-unavailable";
  url.search = "";
  url.searchParams.set("zone", zone.label);
  url.searchParams.set("cmd", zone.cmd);
  url.searchParams.set("from", pathname);
  return finish(NextResponse.rewrite(url, { status: 503 }));
}

export const config = {
  matcher: [
    /*
     * Catch-all, because the site gate has to cover every route — a wall with
     * holes in it is not a wall. This used to list only /storybook and
     * /portals/* to keep the proxy off the website's ~79 routes; that overhead
     * is now the price of the gate, and it is small: when SITE_PASSWORD is
     * unset (local dev) gateRedirect returns on its first line, and when it is
     * set the check is a cookie read plus a comparison against a memoised
     * digest.
     *
     * Excluded: Next's own static output and image optimiser, which serve the
     * gate page's CSS/JS and must load before unlocking, plus the icons.
     */
    "/((?!_next/static|_next/image|favicon\\.ico|icon\\.svg|robots\\.txt).*)",
  ],
};
