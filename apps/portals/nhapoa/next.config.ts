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
    root: path.resolve(process.cwd(), "..", "..", ".."),
  },
  basePath: "/portals/nhapoa",
  output: "standalone",
  outputFileTracingRoot: path.resolve(process.cwd(), "..", "..", ".."),
  // Required for webpack to resolve CSS @import from the file-linked
  // @mosje/design-system package (symlinked outside this project's root).
  transpilePackages: ["@mosje/design-system"],
  async headers() {
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
