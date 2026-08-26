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
  // Bounded on purpose. Every worker shares ONE dev server, so past a point
  // parallelism stops buying speed and just queues on the same compiler — the
  // unbounded default (one per two cores) is what turned a slow first run into
  // a failing one. Four is a judgement, not a measurement: enough to keep the
  // suite near its serial-plus-parallel best, few enough to stop the thrash.
  workers: process.env.CI ? 1 : 4,
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
    command: "npm run dev:hub",
    url: "http://localhost:3007/portals/nmba/treatment-centre/login-otp",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
