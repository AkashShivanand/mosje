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
  turbopack: {
    root: path.resolve(process.cwd(), "..", ".."),
  },
  basePath: "/portals/pm-ajay",
  output: "standalone",
  outputFileTracingRoot: path.resolve(process.cwd(), "..", "..", ".."),
  reactStrictMode: true,
  // Expose basePath to client components via env var (avoids hardcoding)
  env: {
    NEXT_PUBLIC_BASE_PATH: "/portals/pm-ajay",
  },
  // Shared SAMAVESH components (ZoneSwitcher) ship as TS/TSX source.
  transpilePackages: ["@mosje/design-system"],
  async headers() {
    // The immutable long-cache header is only safe in production; in dev it makes
    // the browser cache hashed chunks forever so edits never refetch (Next warns
    // about this). Apply it in production only.
    if (process.env.NODE_ENV !== "production") {
      return [{ source: "/(.*)", headers: SECURITY_HEADERS }];
    }
    return [
      { source: "/(.*)", headers: SECURITY_HEADERS },
      {
        source: "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
