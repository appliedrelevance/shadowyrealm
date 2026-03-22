import { test, expect } from "@playwright/test";
import { TEST_USER } from "./fixtures/demo-data";

/**
 * ShadowyRealm — AI Entity Creation E2E Tests
 *
 * Tests the AI-first Add Figure workflow:
 * 1. AI search, results panel, apply to form, combined submission
 * 2. Manual entry bypass and error fallback
 * 3. AI field editing removes badges
 *
 * Requires:
 * - AI Gateway "shadowyrealm" configured in Cloudflare
 * - ANTHROPIC_API_KEY set as Worker secret
 * - Test user created by global-setup
 */

async function loginTestUser(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.fill('input[type="email"]', TEST_USER.email);
  await page.fill('input[type="password"]', TEST_USER.password);
  await page.click('button[type="submit"]');
  await page.waitForURL("/", { timeout: 15000 });
  await expect(page.locator("text=Add Figure")).toBeVisible({ timeout: 5000 });
}

test.describe.serial("AI Entity Creation", () => {
  // ────────────────────────────────────────────────────
  // TEST 1: AI-first creation flow end-to-end
  // ────────────────────────────────────────────────────
  test("01 — AI research populates form and creates entity with assessment", async ({ page }) => {
    await loginTestUser(page);
    await page.goto("/entity/new");

    // Verify AI search input is visible
    await expect(page.locator("text=AI Research Assistant")).toBeVisible();
    await expect(page.locator('input[placeholder*="Marie Curie"]')).toBeVisible();

    // Enter a figure name
    await page.fill('input[placeholder*="Marie Curie"]', "Albert Einstein");
    await page.screenshot({ path: "screenshots/ai-01-search-input.png", fullPage: true });

    // Click Research and wait for results
    await page.click("text=Research");
    await expect(page.locator("text=Apply to Form")).toBeVisible({ timeout: 60000 });
    await page.screenshot({ path: "screenshots/ai-01-results-panel.png", fullPage: true });

    // Verify results panel shows key elements
    await expect(page.locator("text=AI Generated")).toBeVisible();

    // Click Apply to Form
    await page.click("text=Apply to Form");

    // Verify form fields are populated
    await expect(page.locator('input[id="name"]')).not.toHaveValue("");
    await expect(page.locator('textarea[id="description"]')).not.toHaveValue("");
    await expect(page.locator('textarea[id="biography"]')).not.toHaveValue("");
    await page.screenshot({ path: "screenshots/ai-01-form-populated.png", fullPage: true });

    // Verify impact scores section is visible
    await expect(page.locator("text=Impact Assessment")).toBeVisible();
    await expect(page.locator("text=Scientific")).toBeVisible();

    // Submit the form
    await page.click("text=Create Figure with Assessment");
    await page.waitForURL(/\/entity\//, { timeout: 15000 });

    // Verify entity profile loaded with scores
    await expect(page.locator("h1")).toContainText("Einstein", { timeout: 10000 });
    await page.screenshot({ path: "screenshots/ai-01-entity-created.png", fullPage: true });
  });

  // ────────────────────────────────────────────────────
  // TEST 2: Manual entry bypass
  // ────────────────────────────────────────────────────
  test("02 — Enter manually bypasses AI and creates entity", async ({ page }) => {
    await loginTestUser(page);
    await page.goto("/entity/new");

    // Click "Enter manually"
    await page.click("text=Enter manually instead");

    // Verify manual form appears without AI panel
    await expect(page.locator('input[id="name"]')).toBeVisible();
    await expect(page.locator("text=AI Research Assistant")).not.toBeVisible();
    await page.screenshot({ path: "screenshots/ai-02-manual-mode.png", fullPage: true });

    // Fill the form manually
    const entityName = `Manual Test ${Date.now()}`;
    await page.fill('input[id="name"]', entityName);
    await page.selectOption('select[id="entity_type"]', "event");
    await page.fill('textarea[id="description"]', "A test entity created via manual entry.");

    // Submit
    await page.click("text=Add Figure");
    await page.waitForURL(/\/entity\//, { timeout: 15000 });
    await expect(page.locator("h1")).toContainText(entityName, { timeout: 10000 });
    await page.screenshot({ path: "screenshots/ai-02-manual-created.png", fullPage: true });
  });

  // ────────────────────────────────────────────────────
  // TEST 3: Dismiss AI results without applying
  // ────────────────────────────────────────────────────
  test("03 — Dismiss AI results without applying", async ({ page }) => {
    await loginTestUser(page);
    await page.goto("/entity/new");

    // Research a figure
    await page.fill('input[placeholder*="Marie Curie"]', "Isaac Newton");
    await page.click("text=Research");
    await expect(page.locator("text=Apply to Form")).toBeVisible({ timeout: 60000 });

    // Click Dismiss
    await page.click("text=Dismiss");

    // Results panel should disappear, search input still visible
    await expect(page.locator("text=Apply to Form")).not.toBeVisible();
    await expect(page.locator("text=AI Research Assistant")).toBeVisible();
    await page.screenshot({ path: "screenshots/ai-03-dismissed.png", fullPage: true });
  });
});
