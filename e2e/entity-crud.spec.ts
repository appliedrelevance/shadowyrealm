import { test, expect } from "@playwright/test";

const TEST_EMAIL = "test@shadowyrealm.com";
const TEST_PASSWORD = "testpassword123";

test.describe("Entity CRUD lifecycle", () => {
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

  test("create entity and view profile", async ({ page }) => {
    // Navigate to create form
    await page.click("text=Summon Entity");
    await expect(page.locator("h1")).toContainText("Summon Entity");
    await page.screenshot({ path: "screenshots/entity-create-form.png" });

    // Fill form
    const entityName = `Test Entity ${Date.now()}`;
    await page.fill('input[id="name"]', entityName);
    await page.selectOption('select[id="entity_type"]', "person");
    await page.fill('textarea[id="description"]', "A test entity for E2E testing.");
    await page.fill('textarea[id="biography"]', "Created during automated testing.");

    // Fill person metadata
    await page.fill('input[id="nationality"]', "Global");

    await page.screenshot({ path: "screenshots/entity-form-filled.png" });

    // Submit
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/entity\//);

    // Verify profile renders
    await expect(page.locator("h1")).toContainText(entityName);
    await expect(page.locator("text=draft")).toBeVisible();
    await expect(page.locator("text=person")).toBeVisible();
    await page.screenshot({ path: "screenshots/entity-profile-draft.png" });
  });

  test("entity list shows filters", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Arcane Archives");
    const typeFilter = page.locator("select").first();
    await expect(typeFilter).toBeVisible();
    await page.screenshot({ path: "screenshots/entity-list-filters.png" });
  });

  test("status workflow buttons visible on own draft", async ({ page }) => {
    // Create a draft entity
    await page.goto("/entity/new");
    const entityName = `Workflow Test ${Date.now()}`;
    await page.fill('input[id="name"]', entityName);
    await page.selectOption('select[id="entity_type"]', "event");
    await page.fill('textarea[id="description"]', "Testing publication workflow.");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/entity\//);

    // Should see workflow buttons
    await expect(page.locator("text=Submit for Review")).toBeVisible();
    await expect(page.locator("text=Edit")).toBeVisible();
    await page.screenshot({ path: "screenshots/entity-workflow-buttons.png" });

    // Submit for review
    await page.click("text=Submit for Review");
    await expect(page.locator("text=submitted")).toBeVisible();
    await page.screenshot({ path: "screenshots/entity-submitted.png" });
  });
});
