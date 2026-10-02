import { test, expect } from "@playwright/test";

// These tests require a running local Supabase with auth enabled.
// Test user credentials are created via Supabase dashboard or seed.

const TEST_EMAIL = "test@shadowyrealm.com";
const TEST_PASSWORD = "testpassword123";

test.describe("Authentication", () => {
  test("login with invalid credentials shows error", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="email"]', "wrong@example.com");
    await page.fill('input[type="password"]', "wrongpassword");
    await page.click('button[type="submit"]');
    await expect(page.locator("text=Invalid login credentials")).toBeVisible({
      timeout: 5000,
    });
    await page.screenshot({ path: "screenshots/login-error.png" });
  });


  test.describe("authenticated flow", () => {
    test.skip(
      !process.env.TEST_USER_EXISTS,
      "Set TEST_USER_EXISTS=1 after creating test user in Supabase",
    );

    test("login shows Sign Out", async ({ page }) => {
      await page.goto("/login");
      await page.fill('input[type="email"]', TEST_EMAIL);
      await page.fill('input[type="password"]', TEST_PASSWORD);
      await page.click('button[type="submit"]');
      await page.waitForURL("/");
      await expect(page.locator("text=Sign Out")).toBeVisible();
      await page.screenshot({ path: "screenshots/authenticated-home.png" });
    });

    test("logout hides auth controls", async ({ page }) => {
      // Login first
      await page.goto("/login");
      await page.fill('input[type="email"]', TEST_EMAIL);
      await page.fill('input[type="password"]', TEST_PASSWORD);
      await page.click('button[type="submit"]');
      await page.waitForURL("/");

      // Logout
      await page.click("text=Sign Out");
      await expect(page.locator("text=Sign In")).toBeVisible();
      await page.screenshot({ path: "screenshots/logged-out.png" });
    });
  });
});
