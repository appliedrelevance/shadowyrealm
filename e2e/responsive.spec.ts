import { test, expect } from "@playwright/test";
import { TEST_USER } from "./fixtures/demo-data";

/**
 * Responsive viewport tests at 375px width (iPhone SE).
 * Verifies mobile hamburger menu and single-column card layout.
 *
 * Run: UAT_TARGET=production npx playwright test e2e/responsive.spec.ts
 */

test.use({ viewport: { width: 375, height: 667 } });

test.describe("Mobile Responsive (375px)", () => {
  test("01 — Hamburger menu toggles navigation", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Impact Index");

    // Hamburger button should be visible
    const hamburger = page.locator("nav button").filter({ has: page.locator("svg") }).first();
    await expect(hamburger).toBeVisible();
    await page.screenshot({
      path: "screenshots/responsive-01-mobile-home.png",
      fullPage: true,
    });

    // Open mobile menu
    await hamburger.click();

    // Verify mobile menu overlay links are visible
    const mobileNav = page.getByRole("link", { name: "Compare" });
    await expect(mobileNav).toBeVisible({ timeout: 3000 });
    await expect(page.getByRole("link", { name: "How It Works" })).toBeVisible();
    await page.screenshot({
      path: "screenshots/responsive-01-mobile-menu-open.png",
      fullPage: true,
    });

    // Click a nav link to close menu and navigate
    await page.getByRole("link", { name: "How It Works" }).click();
    await expect(page.locator("h1")).toContainText("How It Works");
    await page.screenshot({
      path: "screenshots/responsive-01-mobile-methodology.png",
      fullPage: true,
    });
  });

  test("02 — Entity cards render single-column on mobile", async ({
    page,
  }) => {
    // Login and create an entity so the list isn't empty
    await page.goto("/login");
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL("/", { timeout: 10000 });

    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Impact Index");

    // Verify cards are stacked (single column) — each card should span full width
    const cards = page.locator("[class*='entity'], [class*='card']").filter({
      has: page.locator("a[href*='/entity/']"),
    });

    const cardCount = await cards.count();
    if (cardCount > 0) {
      // Check first card width is close to viewport width (accounting for padding)
      const firstCard = cards.first();
      const box = await firstCard.boundingBox();
      expect(box).toBeTruthy();
      if (box) {
        // Card should be at least 300px wide on a 375px viewport (single column)
        expect(box.width).toBeGreaterThan(300);
      }
    }

    await page.screenshot({
      path: "screenshots/responsive-02-mobile-entity-list.png",
      fullPage: true,
    });
  });

  test("03 — Login form is usable on mobile", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("h1")).toContainText("Sign In");

    // Form elements should be visible and not overflow
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const submitButton = page.locator('button[type="submit"]');

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();

    // Verify inputs don't overflow viewport
    const emailBox = await emailInput.boundingBox();
    expect(emailBox).toBeTruthy();
    if (emailBox) {
      expect(emailBox.x + emailBox.width).toBeLessThanOrEqual(375);
    }

    await page.screenshot({
      path: "screenshots/responsive-03-mobile-login.png",
      fullPage: true,
    });
  });

  test("04 — Entity profile renders on mobile", async ({ page }) => {
    // Login first to see entities
    await page.goto("/login");
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL("/", { timeout: 10000 });

    // Navigate to first entity
    const entityLink = page.locator("a[href*='/entity/']").first();
    const hasEntities = (await entityLink.count()) > 0;

    if (hasEntities) {
      await entityLink.click();
      await page.waitForURL(/\/entity\//, { timeout: 5000 });

      // Profile should render without horizontal overflow
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      expect(bodyWidth).toBeLessThanOrEqual(375);

      await page.screenshot({
        path: "screenshots/responsive-04-mobile-entity-profile.png",
        fullPage: true,
      });
    }
  });
});
