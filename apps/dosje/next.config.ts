import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  // Match the original dosje.gov.in URL convention (every path ends with a slash).
  trailingSlash: true,
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
