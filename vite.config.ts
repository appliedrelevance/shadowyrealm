import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import { resolve } from "path";
import { siteFor } from "./src/sites";
import type { SiteConfig } from "./src/sites/types";

/**
 * One build per site. SITE names it (a key of src/sites); the Vite mode stays
 * development or production, so .env and .env.production keep choosing the
 * Supabase project. A missing or unknown SITE fails the build.
 */
const site = siteFor(process.env.SITE);

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Fills index.html's %SITE_*% fields from the site's brand. */
function siteHead(s: SiteConfig): Plugin {
  const fields: Record<string, string> = {
    SITE_KEY: s.key,
    SITE_TITLE: s.brand.title,
    SITE_NAME: s.brand.name,
    SITE_DESCRIPTION: s.brand.description,
    SITE_THEME_COLOR: s.brand.themeColor,
    SITE_OG_IMAGE: s.brand.ogImage,
    SITE_OG_IMAGE_ALT: s.brand.ogImageAlt,
    SITE_FONTS_HREF: s.brand.fontsHref,
  };
  return {
    name: "site-head",
    transformIndexHtml(html) {
      const out = html.replace(/%(SITE_[A-Z_]+)%/g, (whole, name: string) => {
        if (!(name in fields)) throw new Error(`index.html names ${whole}, which the site head does not fill`);
        return escapeHtml(fields[name]);
      });
      return out;
    },
  };
}

export default defineConfig({
  plugins: [TanStackRouterVite({ autoCodeSplitting: true }), react(), tailwindcss(), siteHead(site)],
  define: {
    "import.meta.env.VITE_SITE": JSON.stringify(site.key),
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  publicDir: resolve(__dirname, "public", site.key),
  build: {
    outDir: resolve(__dirname, "dist", site.key),
    emptyOutDir: true,
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
