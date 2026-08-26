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
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
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
   */
  workers: process.env.CI ? 1 : 2,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3007",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev:hub",
    url: "http://localhost:3007/portals/nmba/treatment-centre/login-otp",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
