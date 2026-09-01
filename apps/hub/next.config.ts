import fs from "node:fs";
import type { NextConfig } from "next";
import path from "node:path";

const ZONE_DS          = process.env.ZONE_DS_URL          ?? "http://localhost:6006";

/**
 * Storybook ships INSIDE this deployment: the hub's prebuild builds it into
 * public/storybook, and Next serves it as static files. There is no second
 * Vercel project, deliberately:
 *
 *  - It sits behind the site gate. Anything under public/ passes through the
 *    proxy, so /storybook inherits the password like every other route. A
 *    separate project's origin is a public URL nobody can gate.
 *  - Assets come off the CDN rather than being proxied through a function per
 *    request, which is what a rewrite to an external origin costs.
 *  - One project, one deploy, one thing to keep alive.
 *
 * Resolution order, the SAME in dev and production so /storybook behaves
 * identically in both:
 *
 *   1. public/storybook exists  → serve it. Locally: `npm run build:storybook`.
 *   2. dev, no static build     → proxy the live :6006 process, so a bare
 *                                 `npm run dev` still works with hot reload.
 *   3. prod, no static build    → the prebuild failed; explain, don't 404.
 *
 * Authoring stories? Run `npm run dev:storybook` and use localhost:6006
 * directly for hot reload — once a static build exists it takes precedence at
 * /storybook, and is only refreshed when you rebuild.
 *
 * The prebuild is non-fatal, so a Storybook break can never stop the estate
 * deploying; case 3 catches it.
 */
const IS_DEV = process.env.NODE_ENV !== "production";
const STORYBOOK_STATIC_BUILT = fs.existsSync(
  path.join(process.cwd(), "public", "storybook", "index.html"),
);

const STORYBOOK_UNAVAILABLE =
  "/zone-unavailable?zone=Storybook&cmd=npm+run+dev%3Astorybook&from=%2Fstorybook%2F";

function storybookRewrites() {
  // 1. Static build present — dev or production alike. Next serves
  //    public/storybook/* directly, so assets need no rewrite and must not get
  //    one, or it would shadow them. The only gap is the directory index: Next
  //    resolves /storybook/index.html but NOT the bare /storybook/, which
  //    404s. Map exactly those two paths and nothing else.
  if (STORYBOOK_STATIC_BUILT) {
    return [
      { source: "/storybook", destination: "/storybook/index.html" },
      { source: "/storybook/", destination: "/storybook/index.html" },
    ];
  }
  // 2. Dev without one — proxy the live :6006 process. The proxy's own probe
  //    falls back to the explanation page when it is not running.
  if (IS_DEV) {
    return [
      { source: "/storybook", destination: `${ZONE_DS}/` },
      { source: "/storybook/:path*", destination: `${ZONE_DS}/:path*` },
    ];
  }
  // 3. Production without one — the prebuild failed. Explain rather than 404.
  return [
    { source: "/storybook", destination: STORYBOOK_UNAVAILABLE },
    { source: "/storybook/:path*", destination: STORYBOOK_UNAVAILABLE },
  ];
}

const nextConfig: NextConfig = {
  output: "standalone",
  staticPageGenerationTimeout: 180,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "durwo6bhtjtqt.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "*.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "www.dosje.gov.in",
      },
      {
        protocol: "https",
        hostname: "dosje.gov.in",
      },
      {
        protocol: "https",
        hostname: "*.gov.in",
      },
      {
        protocol: "https",
        hostname: "*.nic.in",
      },
    ],
  },
  // Told to the proxy so its dev zone-probe knows to leave /storybook alone
  // when the static build is serving it. Without this the probe finds :6006
  // down and rewrites to the "app not running" page, shadowing the very files
  // Next was about to serve.
  env: { STORYBOOK_STATIC: STORYBOOK_STATIC_BUILT ? "1" : "" },
  // Required for the one remaining zone (Storybook): prevents the hub from
  // stripping the trailing slash off /storybook/, which Storybook's relative
  // asset URLs depend on.
  skipTrailingSlashRedirect: true,
  // react-live powers the SAMAVESH docs portal's live component playground
  // (native route at /design-system) — must be transpiled here now that docs
  // is mounted natively instead of running as its own zone.
  transpilePackages: ["@mosje/design-system", "react-live"],
  turbopack: {
    // Monorepo root is two levels up from apps/hub
    root: path.resolve(process.cwd(), "..", ".."),
  },
  async rewrites() {
    return [
      // The DoSJE website, eutthan-admin, scw, nmba, tg, nhapoa, smile-admin,
      // pm-ajay and the design-system docs portal are all native routes inside
      // the hub — no rewrite needed. Storybook is the only remaining zone.
      //
      // Storybook — proxied through the hub. Always LINK to "/storybook/" (trailing
      // slash) so Storybook's relative asset URLs (./sb-manager/…, ./iframe.html)
      // resolve under /storybook/ and proxy via the :path* rule below. The no-slash
      // rule covers the normalized root request. (HMR websocket still needs :6006
      // directly; the full UI loads through the hub.)
      ...storybookRewrites(),
    ];
  },
  // Legacy hand-coded org slugs → real ingested slugs (safety net for bookmarks).
  // Ported verbatim from apps/dosje/next.config.ts when the website mounted
  // natively; the only change is the now-explicit /website prefix, which the
  // app's basePath used to add for us.
  async redirects() {
    const legacyOrgSlugs = {
      nsfdc: "national-scheduled-castes-finance-and-development-corporation",
      nskfdc: "national-safai-karamcharis-finance-development-corporation",
      nbcfdc: "national-backward-classes-financeand-development-corporationnbcfdc",
      nisd: "national-institute-of-social-defence",
      nmba: "nasha-mukt-bharat-abhiyaan",
      dwbdnc: "development-and-welfare-board-for-de-notified-nomadic-and-semi-nomadic",
      "senior-citizens-welfare": "senior-citizens-welfarescw",
      "pm-ajay": "pradhan-mantri-anusuchit-jaati-abhyuday-yojnapm-ajay",
      "transgender-portal": "national-portal-for-transgender-persons",
    };
    return Object.entries(legacyOrgSlugs).map(([from, to]) => ({
      source: `/website/organisation/${from}`,
      destination: `/website/organisation/${to}`,
      permanent: true,
    }));
  },
  async headers() {
    /*
     * ── WHO MAY FRAME THE EMBED ──────────────────────────────────────────────
     *
     * `X-Frame-Options: SAMEORIGIN` below blocks every other origin, which is
     * right for the estate and wrong for `/embed/*`, whose entire purpose is
     * being framed by the department's WordPress site.
     *
     * The header cannot express "same origin PLUS this one" — its ALLOW-FROM
     * form takes a single origin and no current browser implements it. CSP
     * `frame-ancestors` is the replacement, it takes a list, and where both are
     * present `frame-ancestors` wins in every browser that supports it. So the
     * embed routes send a `frame-ancestors` that names the hosts allowed, and
     * do NOT send `X-Frame-Options` at all — leaving it would deny the frame in
     * any browser that ignored the CSP.
     *
     * AN ALLOW-LIST, NEVER `*`. `frame-ancestors *` lets any site on the
     * internet put a Government of India map inside their own page, under their
     * own branding, with their own text around it. The default is the
     * department's own domains; `EMBED_FRAME_ANCESTORS` widens it for a staging
     * host without a code change, space-separated.
     */
    const frameAncestors =
      process.env.EMBED_FRAME_ANCESTORS?.trim() ||
      "'self' https://dosje.gov.in https://*.dosje.gov.in";

    const embedHeaders = {
      source: "/embed/:path*",
      headers: [
        { key: "Content-Security-Policy", value: `frame-ancestors ${frameAncestors};` },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=()",
        },
        /*
         * An embed is a fragment with no heading above it and no navigation —
         * the canonical home of this content is the organisation page that
         * frames it properly. `robots.ts` covers crawling; this covers the
         * indexer that reached the URL some other way.
         */
        { key: "X-Robots-Tag", value: "noindex, nofollow" },
      ],
    };

    const securityHeaders = {
      source: "/(.*)",
      headers: [
        // SAMEORIGIN, not DENY. The clickjacking threat is a *hostile* origin
        // framing us, and SAMEORIGIN still blocks that completely. DENY also
        // blocked the estate framing itself, which broke Storybook: it renders
        // every story inside /storybook/iframe.html, so the shell loaded and
        // the canvas stayed empty.
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=()",
        },
        { key: "X-XSS-Protection", value: "1; mode=block" },
      ],
    };
    // The immutable long-cache header is ONLY safe in production. In dev it makes
    // the browser cache hashed chunks forever, so CSS/JS edits never refetch and
    // appear "stale" (Next.js warns about exactly this). Apply it in prod only.
    if (process.env.NODE_ENV !== "production") {
      // Embed rules FIRST: Next applies every matching entry in order, and the
      // catch-all below would otherwise put `X-Frame-Options` back on them.
      return [embedHeaders, securityHeaders];
    }
    return [
      embedHeaders,
      securityHeaders,
      {
        source: "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
