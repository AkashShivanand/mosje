import type { NextConfig } from "next";
import path from "node:path";

const SECURITY_HEADERS = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
];

const nextConfig: NextConfig = {
  basePath: "/website",
  images: {
    // Custom loader injects the basePath onto image URLs. Required because, under
    // basePath + Multi-Zones, next/image otherwise emits basePath-less URLs that
    // 404 (SVGs) / 400 (optimizer can't resolve /images/* without /website). See
    // ./image-loader.ts. A custom loader serves files directly (no optimizer).
    loader: "custom",
    loaderFile: "./image-loader.ts",
  },
  output: "standalone",
  // trailingSlash was removed because it causes a redirect loop in the Multi-Zones
  // proxy setup: dosje would redirect /website → /website/ which the hub would then
  // strip back → infinite 308. Default Next.js behaviour (no trailing slash) is fine.
  // Monorepo root is the MoSJE workspace (one level up) so Turbopack can resolve the
  // shared @mosje/design-system package (file: linked from ../packages) without
  // "leaves the filesystem root" errors in dev.
  turbopack: {
    // Monorepo root is two levels up now (apps/dosje → repo root).
    root: path.resolve(process.cwd(), "..", ".."),
  },
  // Transpile the shared design-system package (ships TS/TSX source, not pre-compiled).
  transpilePackages: ["@mosje/design-system"],
  async headers() {
    const securityHeaders = { source: "/(.*)", headers: SECURITY_HEADERS };
    // The immutable long-cache header is ONLY safe in production. Turbopack's dev
    // chunk URLs are stable, so in dev this pins the browser to the first build it
    // ever fetched: edits never refetch and the stale client hydrates against fresh
    // server HTML, surfacing as bogus hydration mismatches. Apply it in prod only.
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
  // Legacy hand-coded org slugs → real ingested slugs (safety net for bookmarks).
  async redirects() {
    const map = {
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
    return Object.entries(map).map(([from, to]) => ({
      source: `/organisation/${from}`,
      destination: `/organisation/${to}`,
      permanent: true,
    }));
  },
};

export default nextConfig;
