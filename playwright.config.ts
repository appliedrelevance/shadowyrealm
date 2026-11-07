import { defineConfig, devices } from "@playwright/test";

/**
 * The e2e suite is read-only: it browses whatever the target serves and
 * writes nothing, so it is safe to run against production. Content is loaded
 * through the MCP tools (tools/realm-load.ts), never by the tests.
 *
 *   bunx playwright test                                  # https://shadowyrealm.com
 *   E2E_BASE_URL=http://localhost:35421 bunx playwright test   # a local wrangler dev
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  timeout: 30000,
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "https://shadowyrealm.com",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  outputDir: "./test-results",
});
