import type { NextConfig } from "next";
import path from "node:path";

const ZONE_WEBSITE       = process.env.ZONE_WEBSITE_URL       ?? "http://localhost:3001";
const ZONE_DS            = process.env.ZONE_DS_URL            ?? "http://localhost:6006";
const ZONE_PM_AJAY       = process.env.ZONE_PM_AJAY_URL       ?? "http://localhost:4124";
const ZONE_SMILE_ADMIN   = process.env.ZONE_SMILE_ADMIN_URL   ?? "http://localhost:4123";
const ZONE_EUTTHAN_ADMIN = process.env.ZONE_EUTTHAN_ADMIN_URL ?? "http://localhost:4125";

const nextConfig: NextConfig = {
  transpilePackages: ["@mosje/design-system"],
  turbopack: {
    // Monorepo root is two levels up from apps/hub
    root: path.resolve(process.cwd(), "..", ".."),
  },
  async rewrites() {
    return [
      // dosje website zone
      { source: "/website",        destination: `${ZONE_WEBSITE}/website` },
      { source: "/website/:path*", destination: `${ZONE_WEBSITE}/website/:path*` },
      // portals
      { source: "/portals/pm-ajay",              destination: `${ZONE_PM_AJAY}/portals/pm-ajay` },
      { source: "/portals/pm-ajay/:path*",       destination: `${ZONE_PM_AJAY}/portals/pm-ajay/:path*` },
      { source: "/portals/smile-admin",          destination: `${ZONE_SMILE_ADMIN}/portals/smile-admin` },
      { source: "/portals/smile-admin/:path*",   destination: `${ZONE_SMILE_ADMIN}/portals/smile-admin/:path*` },
      { source: "/portals/eutthan-admin",        destination: `${ZONE_EUTTHAN_ADMIN}/portals/eutthan-admin` },
      { source: "/portals/eutthan-admin/:path*", destination: `${ZONE_EUTTHAN_ADMIN}/portals/eutthan-admin/:path*` },
      // design system — Storybook dev server (note: root-relative Storybook assets
      // won't resolve through this proxy in dev; open localhost:6006 directly for
      // full HMR. This rewrite works correctly with a static Storybook export in prod.)
      { source: "/design-system",        destination: `${ZONE_DS}/` },
      { source: "/design-system/:path*", destination: `${ZONE_DS}/:path*` },
    ];
  },
};

export default nextConfig;
