import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/portals/smile-admin",
  output: "standalone",
  // Required for webpack to resolve CSS @import from the file-linked
  // @mosje/design-system package (symlinked outside this project's root).
  transpilePackages: ["@mosje/design-system"],
};

export default nextConfig;
