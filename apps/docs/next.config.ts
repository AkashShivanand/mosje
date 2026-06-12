import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  basePath: "/design-system",
  output: "standalone",
  skipTrailingSlashRedirect: true,
  transpilePackages: ["@mosje/design-system", "react-live"],
  turbopack: {
    root: path.resolve(process.cwd(), "..", ".."),
  },
};

export default nextConfig;
