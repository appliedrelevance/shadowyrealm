import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import { resolve } from "path";

export default defineConfig({
  plugins: [TanStackRouterVite({ autoCodeSplitting: true }), react(), tailwindcss()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  // _landru/ symlinks into the whole Landru media/archive tree (thousands of .html
  // files). Without these, dev-server startup scans and watches all of it and never
  // finishes.
  optimizeDeps: { entries: ["index.html"] },
  server: {
    allowedHosts: ["this-side-of-paradise.local"],
    watch: { ignored: ["**/_landru/**"] },
  },
});
