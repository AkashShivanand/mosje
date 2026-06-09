import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  basePath: "/website",
  // output: "standalone" is production-only; omit in dev so the dev server
  // works normally through the hub proxy. Re-enable for Docker/production builds.
  // output: "standalone",
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
};

export default nextConfig;
