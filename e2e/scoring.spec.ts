import { test, expect } from "@playwright/test";

const TEST_EMAIL = "test@shadowyrealm.com";
const TEST_PASSWORD = "testpassword123";

test.describe("Scoring and ATIS", () => {
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

  test("create entity and add assessment", async ({ page }) => {
    // Create entity first
    await page.goto("/entity/new");
    const entityName = `Scored Entity ${Date.now()}`;
    await page.fill('input[id="name"]', entityName);
    await page.selectOption('select[id="entity_type"]', "person");
    await page.fill('textarea[id="description"]', "Entity to test scoring.");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/entity\//);

    // Click add assessment
    await page.click("text=Add Assessment");
    await expect(page.locator("text=Impact Assessment")).toBeVisible();
    await page.screenshot({ path: "screenshots/scoring-form.png" });

    // Fill all 5 justifications
    const dimensions = [
      "scientific",
      "economic",
      "human_rights",
      "health",
      "cultural",
    ];
    for (const dim of dimensions) {
      await page.fill(
        `textarea[placeholder*="${dim.replace("_", " ")}"]`,
        `Test justification for ${dim}`,
      );
    }

    await page.screenshot({ path: "screenshots/scoring-form-filled.png" });

    // Submit assessment
    await page.click("text=Submit Assessment");

    // Wait for ATIS to appear
    await expect(page.locator("text=Dimensional Scores")).toBeVisible({
      timeout: 5000,
    });
    await expect(page.locator("text=ATIS Calculation Breakdown")).toBeVisible();
    await page.screenshot({ path: "screenshots/entity-with-scores.png" });
  });

  test("scoring form rejects empty justification", async ({ page }) => {
    // Create entity
    await page.goto("/entity/new");
    await page.fill('input[id="name"]', `Validation Test ${Date.now()}`);
    await page.selectOption('select[id="entity_type"]', "person");
    await page.fill('textarea[id="description"]', "Testing validation.");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/entity\//);

    // Open scoring form and try to submit without justifications
    await page.click("text=Add Assessment");
    await page.click("text=Submit Assessment");

    // Should show validation errors
    await expect(page.locator("text=Justification required").first()).toBeVisible();
    await page.screenshot({ path: "screenshots/scoring-validation-error.png" });
  });
});
