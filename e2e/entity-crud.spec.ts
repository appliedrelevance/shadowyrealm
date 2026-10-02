import { test, expect } from "@playwright/test";

const TEST_EMAIL = "test@shadowyrealm.com";
const TEST_PASSWORD = "testpassword123";

test.describe("Entity list", () => {
  test.skip(
    !process.env.TEST_USER_EXISTS,
    "Set TEST_USER_EXISTS=1 after creating test user in Supabase",
  );

  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="email"]', TEST_EMAIL);
    await page.fill('input[type="password"]', TEST_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL("/");
  });


  test("entity list shows filters", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Impact Index");
    const typeFilter = page.locator("select").first();
    await expect(typeFilter).toBeVisible();
    await page.screenshot({ path: "screenshots/entity-list-filters.png" });
  });

});
