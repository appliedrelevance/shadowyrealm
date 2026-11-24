import { defineConfig, devices } from "@playwright/test";

/**
 * The e2e suite is read-only: it browses whatever the target serves and
 * writes nothing, so it is safe to run against production. Content is loaded
 * through the MCP tools (tools/realm-load.ts), never by the tests.
 *
 * Three projects: "history" and "music" check those sites' own content, each at its own address
 * unless E2E_BASE_URL names another; "site" checks what holds on every site of the platform.
 *
 *   bunx playwright test                                              # both, against https://shadowyrealm.com
 *   E2E_SITE=inventions E2E_BASE_URL=https://inventions.shadowyrealm.com bunx playwright test --project=site
 *   E2E_BASE_URL=http://localhost:35421 bunx playwright test          # a local wrangler dev
 *   E2E_CHANNEL=chrome bunx playwright test                           # the installed Chrome instead of Playwright's
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
  projects: [
    {
      name: "history",
      testDir: "./e2e/history",
      use: { ...devices["Desktop Chrome"], ...(process.env.E2E_CHANNEL ? { channel: process.env.E2E_CHANNEL } : {}) },
    },
    {
      name: "music",
      testDir: "./e2e/music",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: process.env.E2E_BASE_URL ?? "https://music.shadowyrealm.com",
        ...(process.env.E2E_CHANNEL ? { channel: process.env.E2E_CHANNEL } : {}),
      },
    },
    {
      name: "site",
      testDir: "./e2e/site",
      use: { ...devices["Desktop Chrome"], ...(process.env.E2E_CHANNEL ? { channel: process.env.E2E_CHANNEL } : {}) },
    },
  ],
  outputDir: "./test-results",
});
