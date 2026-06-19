import type { NextConfig } from "next";
import path from "node:path";

const ZONE_WEBSITE     = process.env.ZONE_WEBSITE_URL     ?? "http://localhost:3001";
const ZONE_DS          = process.env.ZONE_DS_URL          ?? "http://localhost:6006";
const ZONE_PM_AJAY     = process.env.ZONE_PM_AJAY_URL     ?? "http://localhost:4124";
const ZONE_SMILE_ADMIN = process.env.ZONE_SMILE_ADMIN_URL ?? "http://localhost:4123";
const ZONE_SCW         = process.env.ZONE_SCW_URL         ?? "http://localhost:4125";
const ZONE_NMBA        = process.env.ZONE_NMBA_URL        ?? "http://localhost:4126";
const ZONE_DOCS        = process.env.ZONE_DOCS_URL        ?? "http://localhost:3002";

const nextConfig: NextConfig = {
  output: "standalone",
  // Required for Multi-Zones: prevents the hub from stripping trailing slashes
  // from child-zone paths (e.g. /website/ → /website), which would create a
  // redirect loop with any child app that has trailingSlash: true.
  skipTrailingSlashRedirect: true,
  transpilePackages: ["@mosje/design-system"],
  turbopack: {
    // Monorepo root is two levels up from apps/hub
    root: path.resolve(process.cwd(), "..", ".."),
  },
  async rewrites() {
    return [
      // dosje website zone — explicit /website/ rule guards against any future
      // trailingSlash reintroduction; skipTrailingSlashRedirect above handles it too.
      { source: "/website",         destination: `${ZONE_WEBSITE}/website` },
      { source: "/website/",        destination: `${ZONE_WEBSITE}/website/` },
      { source: "/website/:path*",  destination: `${ZONE_WEBSITE}/website/:path*` },
      // portals
      { source: "/portals/pm-ajay",              destination: `${ZONE_PM_AJAY}/portals/pm-ajay` },
      { source: "/portals/pm-ajay/:path*",       destination: `${ZONE_PM_AJAY}/portals/pm-ajay/:path*` },
      { source: "/portals/smile-admin",          destination: `${ZONE_SMILE_ADMIN}/portals/smile-admin` },
      { source: "/portals/smile-admin/:path*",   destination: `${ZONE_SMILE_ADMIN}/portals/smile-admin/:path*` },
      { source: "/portals/scw",                  destination: `${ZONE_SCW}/portals/scw` },
      { source: "/portals/scw/:path*",           destination: `${ZONE_SCW}/portals/scw/:path*` },
      { source: "/portals/nmba",                 destination: `${ZONE_NMBA}/portals/nmba` },
      { source: "/portals/nmba/:path*",          destination: `${ZONE_NMBA}/portals/nmba/:path*` },
      // eutthan-admin is a native route inside hub — no rewrite needed
      // Storybook — proxied through the hub. Always LINK to "/storybook/" (trailing
      // slash) so Storybook's relative asset URLs (./sb-manager/…, ./iframe.html)
      // resolve under /storybook/ and proxy via the :path* rule below. The no-slash
      // rule covers the normalized root request. (HMR websocket still needs :6006
      // directly; the full UI loads through the hub.)
      { source: "/storybook",         destination: `${ZONE_DS}/` },
      { source: "/storybook/:path*",  destination: `${ZONE_DS}/:path*` },
      // SAMAVESH docs portal — design-system documentation
      { source: "/design-system",         destination: `${ZONE_DOCS}/design-system` },
      { source: "/design-system/",        destination: `${ZONE_DOCS}/design-system/` },
      { source: "/design-system/:path*",  destination: `${ZONE_DOCS}/design-system/:path*` },
    ];
  },
  async redirects() {
    return [];
  },
  async headers() {
    const securityHeaders = {
      source: "/(.*)",
      headers: [
        { key: "X-Frame-Options", value: "DENY" },
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
