import type { NextConfig } from "next";
import path from "node:path";

const ZONE_WEBSITE       = process.env.ZONE_WEBSITE_URL       ?? "http://localhost:3001";
const ZONE_DS            = process.env.ZONE_DS_URL            ?? "http://localhost:6006";
const ZONE_PM_AJAY       = process.env.ZONE_PM_AJAY_URL       ?? "http://localhost:4124";
const ZONE_SMILE_ADMIN   = process.env.ZONE_SMILE_ADMIN_URL   ?? "http://localhost:4123";
const ZONE_EUTTHAN_ADMIN = process.env.ZONE_EUTTHAN_ADMIN_URL ?? "http://localhost:4125";

const nextConfig: NextConfig = {
  // Required for Multi-Zones: prevents the hub from stripping trailing slashes
  // from child-zone paths (e.g. /website/ → /website), which would create a
  // redirect loop with any child app that has trailingSlash: true.
  skipTrailingSlashRedirect: true,
  transpilePackages: ["@mosje/design-system"],
  turbopack: {
    // Monorepo root is two levels up from apps/hub
    root: path.resolve(process.cwd(), "..", ".."),
  },
  async rewrites() {
    return [
      // dosje website zone — explicit /website/ rule guards against any future
      // trailingSlash reintroduction; skipTrailingSlashRedirect above handles it too.
      { source: "/website",         destination: `${ZONE_WEBSITE}/website` },
      { source: "/website/",        destination: `${ZONE_WEBSITE}/website/` },
      { source: "/website/:path*",  destination: `${ZONE_WEBSITE}/website/:path*` },
      // portals
      { source: "/portals/pm-ajay",              destination: `${ZONE_PM_AJAY}/portals/pm-ajay` },
      { source: "/portals/pm-ajay/:path*",       destination: `${ZONE_PM_AJAY}/portals/pm-ajay/:path*` },
      { source: "/portals/smile-admin",          destination: `${ZONE_SMILE_ADMIN}/portals/smile-admin` },
      { source: "/portals/smile-admin/:path*",   destination: `${ZONE_SMILE_ADMIN}/portals/smile-admin/:path*` },
      { source: "/portals/eutthan-admin",        destination: `${ZONE_EUTTHAN_ADMIN}/portals/eutthan-admin` },
      { source: "/portals/eutthan-admin/:path*", destination: `${ZONE_EUTTHAN_ADMIN}/portals/eutthan-admin/:path*` },
      // Storybook — proxied through the hub. Always LINK to "/storybook/" (trailing
      // slash) so Storybook's relative asset URLs (./sb-manager/…, ./iframe.html)
      // resolve under /storybook/ and proxy via the :path* rule below. The no-slash
      // rule covers the normalized root request. (HMR websocket still needs :6006
      // directly; the full UI loads through the hub.)
      { source: "/storybook",         destination: `${ZONE_DS}/` },
      { source: "/storybook/:path*",  destination: `${ZONE_DS}/:path*` },
    ];
  },
  async redirects() {
    return [
      // /design-system is reserved for the upcoming Next docs portal; until it ships,
      // send visitors to Storybook so the route is never blank. (Temporary 307.)
      { source: "/design-system", destination: "/storybook/", permanent: false },
      { source: "/design-system/:path*", destination: "/storybook/", permanent: false },
    ];
  },
};

export default nextConfig;
