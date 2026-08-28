import type { FullConfig } from "@playwright/test";
import { request } from "@playwright/test";

/**
 * Warm every route the suite navigates to, one at a time, BEFORE any worker
 * starts.
 *
 * `webServer` runs `next dev --turbopack`, which compiles a route the first
 * time it is requested and not before. Measured on an otherwise idle server,
 * that first hit costs up to 24s (`/website/rti`: 24.1s cold, 1.0s warm) —
 * most of Playwright's 30s test timeout spent before the test has asserted
 * anything. With `fullyParallel` that cost is paid by several workers at once,
 * on different routes, against a single compiler, so the whole suite reports
 * `page.goto: Test timeout of 30000ms exceeded` on the first run after any
 * change and passes on the second. That is a compiler race, not a defect, and
 * it is indistinguishable from one in the report — which is the real damage.
 *
 * Warming serially here pays each compile once, off the test clock, and lets
 * the parallelism this config asks for actually help. It is not a substitute
 * for the raised navigation timeout in `playwright.config.ts`: a route missing
 * from the list below still gets compiled by whichever test reaches it first.
 *
 * ADD A ROUTE HERE when a new spec navigates somewhere new. Nothing enforces
 * that — a missed route costs a slow first test, not a failing one.
 */
const ROUTES = [
  // Website — the heaviest tree, and the one the visual suites hammer.
  "/website",
  "/website/about-us",
  "/website/annual-reports",
  "/website/contact-us",
  "/website/events",
  "/website/gallery",
  "/website/organisation/national-commission-for-scheduled-castes",
  "/website/schemes-services",
  "/website/tenders",
  "/website/vacancies",
  "/website/whos-who",

  // Design system — the ticker's own documentation page.
  "/design-system/components/feedback/ticker",

  // NMBA treatment-centre portal. The login screen is public; the pages behind
  // it redirect to it unauthenticated, so they compile when the spec logs in
  // rather than here. That is why the NMBA spec is the slowest first test.
  "/portals/nmba/treatment-centre/login-otp",
];

/** A cold turbopack compile can take ~25s; give one route generous headroom. */
const PER_ROUTE_TIMEOUT_MS = 90_000;

export default async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0]?.use?.baseURL ?? "http://localhost:3007";
  const ctx = await request.newContext({ baseURL });

  const started = Date.now();
  let slowest = { route: "", ms: 0 };

  for (const route of ROUTES) {
    const t0 = Date.now();
    try {
      await ctx.get(route, { timeout: PER_ROUTE_TIMEOUT_MS, failOnStatusCode: false });
    } catch {
      // A route that will not warm is not a reason to refuse to run the suite —
      // the test that needs it will fail on its own terms, with a better message
      // than anything this loop could produce.
      console.warn(`[warm] ${route} did not respond in ${PER_ROUTE_TIMEOUT_MS / 1000}s — continuing`);
      continue;
    }
    const ms = Date.now() - t0;
    if (ms > slowest.ms) slowest = { route, ms };
  }

  await ctx.dispose();

  const total = ((Date.now() - started) / 1000).toFixed(1);
  console.log(
    `[warm] ${ROUTES.length} routes in ${total}s` +
      (slowest.route ? ` — slowest ${slowest.route} at ${(slowest.ms / 1000).toFixed(1)}s` : ""),
  );
}
