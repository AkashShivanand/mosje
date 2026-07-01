import { defineConfig, devices } from "@playwright/test";

/**
 * Root Playwright config for the MoSJE estate (single git repo, many
 * independent Next.js apps). E2E specs live under `e2e/<app>/` — add a new
 * subfolder per app as coverage grows; this config stays app-agnostic and
 * each spec file navigates using its app's own basePath.
 *
 * `webServer` targets the NMBA treatment-centre portal (the only app with
 * E2E coverage today) and reuses an already-running dev server locally so
 * this doesn't fight a server you started yourself via `npm run dev:nmba`.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:4126",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev:nmba",
    url: "http://localhost:4126/portals/nmba/treatment-centre/login-otp",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
