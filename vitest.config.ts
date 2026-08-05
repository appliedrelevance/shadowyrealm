import { defineConfig } from "vitest/config";

// Standalone config so vitest doesn't load vite.config.ts (Cloudflare
// plugin) and doesn't collide with the Playwright specs in e2e/.
export default defineConfig({
  test: {
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
