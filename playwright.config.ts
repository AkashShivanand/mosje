import { defineConfig, devices } from "@playwright/test";

/**
 * Root Playwright config for the MoSJE estate (single git repo, many
 * independent Next.js apps). E2E specs live under `e2e/<app>/` — add a new
 * subfolder per app as coverage grows; this config stays app-agnostic and
 * each spec file navigates using its app's own basePath.
 *
 * Every portal is now mounted natively inside the hub (single origin, :3007),
 * so `webServer` targets the hub and reuses an already-running dev server
 * locally so this doesn't fight one you started yourself via `npm run dev`.
 *
 * TIMEOUTS ARE SIZED FOR A DEV SERVER, NOT A BUILT ONE. `next dev --turbopack`
 * compiles each route on its first request — measured at up to 24s for a cold
 * `/website/rti` against an idle server. Playwright's 30s default left almost
 * no room for the test itself, so a cold suite failed on navigation and a warm
 * one passed. `globalSetup` warms the known routes serially; these timeouts
 * cover whatever it misses. Do not lower them back to the defaults while the
 * suite still runs against `next dev`.
 */
export default defineConfig({
  testDir: "./e2e",
  globalSetup: "./e2e/global-setup.ts",
  fullyParallel: true,
  timeout: 90_000,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  /**
   * TWO LOCALLY, NOT "HALF THE CORES".
   *
   * `undefined` gives Playwright half the CPUs — four here — and all four point
   * at ONE Next dev server that compiles routes on demand. Measured: the ticker
   * suite passes 13/13 in 27s at four workers about two runs in three, and when
   * it does not, the run takes 60-140s and fails 1-10 tests with timeouts
   * scattered across unrelated specs. Serially it passes 13/13 every time, each
   * test in 2-8s. That is contention, not flakiness in the specs — the same
   * assertions pass instantly when the server is not being asked for four pages
   * at once.
   *
   * Two keeps most of the parallel speed without starving the server. Raising
   * it means chasing failures that say nothing about the code.
   *
   * This branch arrived at the same diagnosis independently and proposed four.
   * Two wins: it is the measured number, four was a judgement. The warming in
   * `globalSetup` is the complement, not the substitute — capping workers stops
   * them starving each other, but the FIRST worker to reach a route still pays
   * its compile. Both are needed.
   */
  workers: process.env.CI ? 1 : 2,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3007",
    trace: "on-first-retry",
    // Generous enough to survive a cold route compile, tight enough that a
    // genuinely hung navigation still fails inside the 90s test timeout.
    navigationTimeout: 60_000,
    // Actions never wait on the compiler — only on the app. Keeping this short
    // is what stops the raised navigation budget from also slowing down the
    // report of a real defect.
    actionTimeout: 15_000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    /*
     * IN CI, SERVE THE BUILT APP.
     *
     * `dev:hub` resolves `./node_modules/.bin/next` relative to `apps/hub`,
     * which does not exist under a hoisted `npm ci` install — the runner exits
     * 127 before Playwright ever starts. CI builds the hub immediately before
     * this step anyway, so `next start` is both the thing that works and the
     * more honest target: the accessibility suite then measures the production
     * output rather than a dev server's.
     *
     * Locally it stays on the dev server, and `reuseExistingServer` keeps it
     * from fighting one already running on 3007.
     */
    command: process.env.CI ? "npm --prefix apps/hub run start" : "npm run dev:hub",
    url: "http://localhost:3007/portals/nmba/treatment-centre/login-otp",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
