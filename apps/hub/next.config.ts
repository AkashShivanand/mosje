import type { NextConfig } from "next";
import path from "node:path";

const ZONE_WEBSITE     = process.env.ZONE_WEBSITE_URL     ?? "http://localhost:3001";
const ZONE_DS          = process.env.ZONE_DS_URL          ?? "http://localhost:6006";
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
      // eutthan-admin, scw, nmba, tg, nhapoa, smile-admin, and pm-ajay are native
      // routes inside hub — no rewrite needed
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
