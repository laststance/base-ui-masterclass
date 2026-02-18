import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for E2E tests.
 * Uses BetterAuth testUtils plugin for OAuth bypass.
 *
 * @example
 * pnpm --filter web test:e2e          # run all tests
 * pnpm --filter web test:e2e:ui       # open Playwright UI
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "html",

  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
    env: {
      E2E_TESTING: "true",
    },
  },
});
