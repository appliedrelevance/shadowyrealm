import { test, expect } from "@playwright/test";

/** At 375px (iPhone SE) every page fits the viewport; wide charts scroll inside their own frame. */
test.use({ viewport: { width: 375, height: 667 } });

test.describe("Mobile (375px)", () => {
  test("the menu opens and navigates", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Toggle menu" }).click();
    await page.getByRole("link", { name: "How It Works" }).click();
    await expect(page.locator("h1")).toHaveText("How It Works");
  });

  for (const path of ["/", "/realm", "/compare", "/methodology", "/entity/catholic-church", "/login"]) {
    test(`${path} has no horizontal page scroll`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator("h1")).toBeVisible();
      // The sign-in page's Turnstile widget keeps polling, so it never goes network-idle.
      await page.waitForLoadState(path === "/login" ? "load" : "networkidle");
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
});
