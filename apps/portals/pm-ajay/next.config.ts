import type { NextConfig } from "next";

const SECURITY_HEADERS = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
];

const nextConfig: NextConfig = {
  basePath: "/portals/pm-ajay",
  output: "standalone",
  reactStrictMode: true,
  // Expose basePath to client components via env var (avoids hardcoding)
  env: {
    NEXT_PUBLIC_BASE_PATH: "/portals/pm-ajay",
  },
  // Shared SAMAVESH components (ZoneSwitcher) ship as TS/TSX source.
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
