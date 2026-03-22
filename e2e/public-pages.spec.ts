import { test, expect } from "@playwright/test";

test.describe("Public pages", () => {
  test("home page loads with index heading", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Impact Index");
    await page.screenshot({ path: "screenshots/home.png" });
  });

  test("methodology page renders ATIS documentation", async ({ page }) => {
    await page.goto("/methodology");
    await expect(page.locator("h1")).toContainText("How It Works");
    await expect(page.getByText("The Formula")).toBeVisible();
    await expect(page.getByText("Dimensional Scoring")).toBeVisible();
    await expect(page.getByText("Magnitude Tiers")).toBeVisible();
    await page.screenshot({ path: "screenshots/methodology.png" });
  });

  test("comparison page loads", async ({ page }) => {
    await page.goto("/compare");
    await expect(page.locator("h1")).toContainText("Comparative Analysis");
    await page.screenshot({ path: "screenshots/compare.png" });
  });

  test("login page renders", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("h1")).toContainText("Sign In");
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await page.screenshot({ path: "screenshots/login.png" });
  });

  test("register page renders", async ({ page }) => {
    await page.goto("/register");
    await expect(page.locator("h1")).toContainText("Sign Up");
    await page.screenshot({ path: "screenshots/register.png" });
  });

  test("nonexistent entity shows not found", async ({ page }) => {
    await page.goto("/entity/nonexistent-entity-slug-12345");
    await expect(page.locator("h1")).toContainText("Not found");
    await page.screenshot({ path: "screenshots/entity-404.png" });
  });

  test("navigation links are present", async ({ page }) => {
    await page.goto("/");
    const nav = page.locator("nav");
    await expect(nav.getByText("ShadowyRealm")).toBeVisible();
    await expect(nav.getByText("Index")).toBeVisible();
    await expect(nav.getByText("Compare")).toBeVisible();
    await expect(nav.getByText("How It Works")).toBeVisible();
    await expect(nav.getByText("Sign In")).toBeVisible();
    await expect(nav.getByText("Sign Up")).toBeVisible();
  });

  test("unauthenticated user sees no create button", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("text=Add Figure")).not.toBeVisible();
  });

  test("entity/new redirects to login when not authenticated", async ({ page }) => {
    await page.goto("/entity/new");
    await page.waitForURL(/\/login/);
    await expect(page.locator("h1")).toContainText("Sign In");
    await page.screenshot({ path: "screenshots/auth-redirect.png" });
  });
});
