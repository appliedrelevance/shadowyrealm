import { test, expect } from "@playwright/test";

/**
 * Checks that hold on every site of the platform, whatever its content:
 *
 *   E2E_SITE=inventions E2E_BASE_URL=https://priorart.shadowyrealm.com bunx playwright test --project=site
 */
const SITE = process.env.E2E_SITE ?? "shadowyrealm";

test.describe(`Site structure (${SITE})`, () => {
  test("every API response names the site", async ({ request }) => {
    for (const path of ["/api/scores", "/api/realm", "/api/session"]) {
      const response = await request.get(path);
      expect(response.ok()).toBe(true);
      expect(response.headers()["x-site"]).toBe(SITE);
    }
  });

  test("scores are ranked largest first", async ({ request }) => {
    const body = (await (await request.get("/api/scores")).json()) as { entities: { total_magnitude: number }[] };
    const magnitudes = body.entities.map((e) => e.total_magnitude);
    expect(magnitudes).toEqual([...magnitudes].sort((a, b) => b - a));
  });

  test("the page is built for the site that serves it", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-site", SITE);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.getByText("This page cannot load")).toHaveCount(0);
  });

  test("navigation offers the four public pages and links the other sites", async ({ page }) => {
    await page.goto("/");
    const nav = page.locator("nav");
    for (const name of ["Index", "Lineage", "Compare", "How It Works"]) {
      await expect(nav.getByRole("link", { name })).toBeVisible();
    }
    await expect(page.locator("footer")).toContainText("Also from ShadowyRealm");
  });

  test("methodology lists the site's dimensions and tiers", async ({ page }) => {
    await page.goto("/methodology");
    await expect(page.locator("h1")).toHaveText("How It Works");
    await expect(page.getByRole("columnheader", { name: "Dimension" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Tiers" })).toBeVisible();
  });

  test("a missing entity says so", async ({ page }) => {
    await page.goto("/entity/nonexistent-entity-slug-12345");
    await expect(page.locator("h1")).toHaveText("Not found");
  });

  test("the crawler pages name the site's origin", async ({ request }) => {
    const sitemap = await (await request.get("/sitemap.xml")).text();
    expect(sitemap).toContain("<urlset");
    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toContain("/sitemap.xml");
  });
});

test.describe(`Mobile (375px, ${SITE})`, () => {
  test.use({ viewport: { width: 375, height: 667 } });
  for (const path of ["/", "/realm", "/compare", "/methodology"]) {
    test(`${path} has no horizontal page scroll`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator("h1")).toBeVisible();
      await page.waitForLoadState("networkidle");
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
});
