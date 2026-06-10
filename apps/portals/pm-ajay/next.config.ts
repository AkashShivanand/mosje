import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/portals/pm-ajay",
  reactStrictMode: true,
  // Expose basePath to client components via env var (avoids hardcoding)
  env: {
    NEXT_PUBLIC_BASE_PATH: "/portals/pm-ajay",
  },
  // Shared SAMAVESH components (ZoneSwitcher) ship as TS/TSX source.
  transpilePackages: ["@mosje/design-system"],
};

export default nextConfig;
