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
    formats: ["image/avif", "image/webp"],
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
