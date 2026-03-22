import { defineConfig, devices } from "@playwright/test";
import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load root .env for SUPABASE_SERVICE_ROLE_KEY (needed by global-setup)
config({
  path: resolve(__dirname, "../../.env"),
});

const isProduction = process.env.UAT_TARGET === "production";
const baseURL = isProduction
  ? "https://shadowyrealm.com"
  : "http://localhost:35420";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: "html",
  timeout: 30000,
  globalSetup: "./e2e/global-setup.ts",
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "on",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  // Only start local dev server when targeting localhost
  ...(isProduction
    ? {}
    : {
        webServer: {
          command: "bun run dev",
          url: "http://localhost:35420",
          reuseExistingServer: !process.env.CI,
          timeout: 30000,
        },
      }),
  outputDir: "./screenshots",
});
