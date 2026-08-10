import fs from "node:fs";
import type { NextConfig } from "next";
import path from "node:path";

const ZONE_DS          = process.env.ZONE_DS_URL          ?? "http://localhost:6006";

/**
 * Storybook: proxied in dev, baked into this deployment in production.
 *
 * In DEV it stays a separate process on :6006 so stories hot-reload; the
 * proxy's own probe falls back to /zone-unavailable when it is not running.
 *
 * In PRODUCTION the hub's prebuild step builds Storybook straight into
 * public/storybook, so Vercel serves it as static files from this same
 * deployment. That is deliberate, and it is why there is no second Vercel
 * project any more:
 *
 *  - It sits behind the site gate. Anything under public/ passes through the
 *    proxy, so /storybook inherits the password like every other route. A
 *    separate project's origin is a public URL nobody can gate.
 *  - Assets are served from the CDN rather than proxied through a function
 *    per request, which is what a rewrite to an external origin costs.
 *  - One project, one deploy, one thing to keep alive.
 *
 * The prebuild step is non-fatal: if Storybook fails to build, the estate
 * still deploys and the check below routes /storybook to the explanation page
 * rather than a 404.
 */
const IS_DEV = process.env.NODE_ENV !== "production";
const STORYBOOK_STATIC_BUILT = fs.existsSync(
  path.join(process.cwd(), "public", "storybook", "index.html"),
);

const STORYBOOK_UNAVAILABLE =
  "/zone-unavailable?zone=Storybook&cmd=npm+run+dev%3Astorybook&from=%2Fstorybook%2F";

function storybookRewrites() {
  // Dev: proxy the live :6006 process so stories hot-reload.
  if (IS_DEV) {
    return [
      { source: "/storybook", destination: `${ZONE_DS}/` },
      { source: "/storybook/:path*", destination: `${ZONE_DS}/:path*` },
    ];
  }
  // Production with the static build present: Next serves public/storybook/*
  // directly, so assets need no rewrite — and must not get one, or it would
  // shadow them. The one gap is the directory index: Next resolves
  // /storybook/index.html but NOT the bare /storybook/, which 404s. Map only
  // those two exact paths.
  if (STORYBOOK_STATIC_BUILT) {
    return [
      { source: "/storybook", destination: "/storybook/index.html" },
      { source: "/storybook/", destination: "/storybook/index.html" },
    ];
  }
  // Production without it (the prebuild failed): explain rather than 404.
  return [
    { source: "/storybook", destination: STORYBOOK_UNAVAILABLE },
    { source: "/storybook/:path*", destination: STORYBOOK_UNAVAILABLE },
  ];
}

const nextConfig: NextConfig = {
  output: "standalone",
  // Required for the one remaining zone (Storybook): prevents the hub from
  // stripping the trailing slash off /storybook/, which Storybook's relative
  // asset URLs depend on.
  skipTrailingSlashRedirect: true,
  // react-live powers the SAMAVESH docs portal's live component playground
  // (native route at /design-system) — must be transpiled here now that docs
  // is mounted natively instead of running as its own zone.
  transpilePackages: ["@mosje/design-system", "react-live"],
  turbopack: {
    // Monorepo root is two levels up from apps/hub
    root: path.resolve(process.cwd(), "..", ".."),
  },
  async rewrites() {
    return [
      // The DoSJE website, eutthan-admin, scw, nmba, tg, nhapoa, smile-admin,
      // pm-ajay and the design-system docs portal are all native routes inside
      // the hub — no rewrite needed. Storybook is the only remaining zone.
      //
      // Storybook — proxied through the hub. Always LINK to "/storybook/" (trailing
      // slash) so Storybook's relative asset URLs (./sb-manager/…, ./iframe.html)
      // resolve under /storybook/ and proxy via the :path* rule below. The no-slash
      // rule covers the normalized root request. (HMR websocket still needs :6006
      // directly; the full UI loads through the hub.)
      ...storybookRewrites(),
    ];
  },
  // Legacy hand-coded org slugs → real ingested slugs (safety net for bookmarks).
  // Ported verbatim from apps/dosje/next.config.ts when the website mounted
  // natively; the only change is the now-explicit /website prefix, which the
  // app's basePath used to add for us.
  async redirects() {
    const legacyOrgSlugs = {
      nsfdc: "national-scheduled-castes-finance-and-development-corporation",
      nskfdc: "national-safai-karamcharis-finance-development-corporation",
      nbcfdc: "national-backward-classes-financeand-development-corporationnbcfdc",
      nisd: "national-institute-of-social-defence",
      nmba: "nasha-mukt-bharat-abhiyaan",
      dwbdnc: "development-and-welfare-board-for-de-notified-nomadic-and-semi-nomadic",
      "senior-citizens-welfare": "senior-citizens-welfarescw",
      "pm-ajay": "pradhan-mantri-anusuchit-jaati-abhyuday-yojnapm-ajay",
      "transgender-portal": "national-portal-for-transgender-persons",
    };
    return Object.entries(legacyOrgSlugs).map(([from, to]) => ({
      source: `/website/organisation/${from}`,
      destination: `/website/organisation/${to}`,
      permanent: true,
    }));
  },
  async headers() {
    const securityHeaders = {
      source: "/(.*)",
      headers: [
        // SAMEORIGIN, not DENY. The clickjacking threat is a *hostile* origin
        // framing us, and SAMEORIGIN still blocks that completely. DENY also
        // blocked the estate framing itself, which broke Storybook: it renders
        // every story inside /storybook/iframe.html, so the shell loaded and
        // the canvas stayed empty.
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=()",
        },
        { key: "X-XSS-Protection", value: "1; mode=block" },
      ],
    };
    // The immutable long-cache header is ONLY safe in production. In dev it makes
    // the browser cache hashed chunks forever, so CSS/JS edits never refetch and
    // appear "stale" (Next.js warns about exactly this). Apply it in prod only.
    if (process.env.NODE_ENV !== "production") {
      return [securityHeaders];
    }
    return [
      securityHeaders,
      {
        source: "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
