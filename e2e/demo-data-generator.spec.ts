import { test, expect } from "@playwright/test";
import {
  TEST_USER,
  ENTITIES,
  ASSESSMENTS,
  PERIOD,
} from "./fixtures/demo-data";

/**
 * ShadowyRealm UAT — Demo Data Generator
 *
 * This is THE canonical E2E script. It:
 * 1. Registers a test user through the UI
 * 2. Creates three entities (person, event, organization)
 * 3. Publishes all three through the full status workflow
 * 4. Adds impact assessments with 5-dimensional scores
 * 5. Adds an assessment period to the person entity
 * 6. Verifies ATIS calculation renders
 * 7. Tests comparison view with published entities
 * 8. Logs out and verifies public access
 *
 * Every step captures a screenshot for the walkthrough.
 * Run: npx playwright test e2e/demo-data-generator.spec.ts
 */

// Slugs accumulated during the test for cross-step references
const slugs: string[] = [];

test.describe.serial("ShadowyRealm UAT — Full Demo", () => {
  // ─────────────────────────────────────────────────────
  // STEP 01: Public pages load correctly
  // ─────────────────────────────────────────────────────
  test("01 — Home page loads with empty archives", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Impact Index");
    await page.screenshot({ path: "screenshots/01-home-empty.png", fullPage: true });
  });

  test("02 — Methodology page renders ATIS documentation", async ({ page }) => {
    await page.goto("/methodology");
    await expect(page.locator("h1")).toContainText("How It Works");
    await expect(page.getByText("The Formula")).toBeVisible();
    await expect(page.getByText("Dimensional Scoring")).toBeVisible();
    await expect(page.getByText("Magnitude Tiers")).toBeVisible();
    await page.screenshot({ path: "screenshots/02-methodology.png", fullPage: true });
  });

  test("03 — Comparison page loads", async ({ page }) => {
    await page.goto("/compare");
    await expect(page.locator("h1")).toContainText("Comparative Analysis");
    await page.screenshot({ path: "screenshots/03-compare-empty.png", fullPage: true });
  });

  test("04 — Login page renders", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("h1")).toContainText("Sign In");
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await page.screenshot({ path: "screenshots/04-login-page.png", fullPage: true });
  });

  test("05 — Register page renders", async ({ page }) => {
    await page.goto("/register");
    await expect(page.locator("h1")).toContainText("Sign Up");
    await page.screenshot({ path: "screenshots/05-register-page.png", fullPage: true });
  });

  // ─────────────────────────────────────────────────────
  // STEP 06: Login with pre-created test user
  // (User created by global-setup via Supabase Admin API — INSTALL-CONFIG)
  // ─────────────────────────────────────────────────────
  test("06 — Login with test user (first login)", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.screenshot({ path: "screenshots/06-login-form-filled.png", fullPage: true });

    await page.click('button[type="submit"]');
    await page.waitForURL("/", { timeout: 15000 });
    await expect(page.locator("text=Add Figure")).toBeVisible({ timeout: 5000 });
    await page.screenshot({ path: "screenshots/06-logged-in-home.png", fullPage: true });
  });

  // ─────────────────────────────────────────────────────
  // STEP 07: Login with invalid credentials shows error
  // ─────────────────────────────────────────────────────
  test("07 — Login with invalid credentials shows error", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="email"]', "wrong@example.com");
    await page.fill('input[type="password"]', "badpassword");
    await page.click('button[type="submit"]');
    await expect(page.locator("text=Invalid login credentials")).toBeVisible({
      timeout: 5000,
    });
    await page.screenshot({ path: "screenshots/07-login-error.png", fullPage: true });
  });

  // ─────────────────────────────────────────────────────
  // STEP 08: Login with valid credentials
  // ─────────────────────────────────────────────────────
  test("08 — Login with test user", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL("/", { timeout: 10000 });
    await expect(page.locator("text=Add Figure")).toBeVisible({ timeout: 5000 });
    await page.screenshot({ path: "screenshots/08-logged-in.png", fullPage: true });
  });

  // ─────────────────────────────────────────────────────
  // STEP 09-11: Create three entities (person, event, org)
  // ─────────────────────────────────────────────────────
  for (let i = 0; i < ENTITIES.length; i++) {
    const entity = ENTITIES[i];
    const stepNum = String(9 + i).padStart(2, "0");

    test(`${stepNum} — Create ${entity.entity_type}: ${entity.name}`, async ({
      page,
    }) => {
      // Login first
      await page.goto("/login");
      await page.fill('input[type="email"]', TEST_USER.email);
      await page.fill('input[type="password"]', TEST_USER.password);
      await page.click('button[type="submit"]');
      await page.waitForURL("/", { timeout: 10000 });
      await expect(page.locator("text=Add Figure")).toBeVisible({ timeout: 5000 });

      // Navigate to create form
      await page.click("text=Add Figure");
      await expect(page.locator("h1")).toContainText("Add Figure");

      // Switch to manual entry (AI Research Assistant is shown by default)
      await page.click("text=Enter manually instead");

      // Fill common fields
      await page.fill('input[id="name"]', entity.name);
      await page.selectOption('select[id="entity_type"]', entity.entity_type);
      await page.fill('textarea[id="description"]', entity.description);
      await page.fill('textarea[id="biography"]', entity.biography);

      // Type-specific fields
      if (entity.entity_type === "person") {
        const p = entity as typeof ENTITIES[0] & { entity_type: "person" };
        if ("nationality" in p && p.nationality)
          await page.fill('input[id="nationality"]', p.nationality);
        if ("birth_date" in p && p.birth_date)
          await page.fill('input[id="birth_date"]', p.birth_date);
        if ("death_date" in p && p.death_date)
          await page.fill('input[id="death_date"]', p.death_date);
      } else if (entity.entity_type === "organization") {
        const o = entity as typeof ENTITIES[2] & { entity_type: "organization" };
        if ("headquarters" in o && o.headquarters)
          await page.fill('input[id="headquarters"]', o.headquarters);
        if ("founded_date" in o && o.founded_date)
          await page.fill('input[id="founded_date"]', o.founded_date);
        if ("organization_type" in o && o.organization_type)
          await page.selectOption(
            'select[id="organization_type"]',
            o.organization_type,
          );
      } else if (entity.entity_type === "event") {
        const e = entity as typeof ENTITIES[1] & { entity_type: "event" };
        if ("location" in e && e.location)
          await page.fill('input[id="location"]', e.location);
        if ("start_date" in e && e.start_date)
          await page.fill('input[id="start_date"]', e.start_date);
        if ("end_date" in e && e.end_date)
          await page.fill('input[id="end_date"]', e.end_date);
        if ("event_type" in e && e.event_type)
          await page.selectOption('select[id="event_type"]', e.event_type);
      }

      await page.screenshot({
        path: `screenshots/${stepNum}-create-${entity.entity_type}-form.png`,
        fullPage: true,
      });

      // Submit
      await page.click('button[type="submit"]');
      await page.waitForURL(/\/entity\//, { timeout: 15000 });

      // Extract slug
      const slug = page.url().split("/entity/")[1]?.split("?")[0] ?? "";
      expect(slug).toBeTruthy();
      slugs.push(slug);

      // Verify profile — wait longer, RLS checks auth.uid() match
      await expect(page.locator("h1")).toContainText(entity.name, {
        timeout: 15000,
      });
      await expect(page.locator("text=draft")).toBeVisible({ timeout: 5000 });
      await page.screenshot({
        path: `screenshots/${stepNum}-${entity.entity_type}-profile-draft.png`,
        fullPage: true,
      });
    });
  }

  // ─────────────────────────────────────────────────────
  // STEP 12-14: Publish all three entities through workflow
  // ─────────────────────────────────────────────────────
  for (let i = 0; i < ENTITIES.length; i++) {
    const entity = ENTITIES[i];
    const stepNum = String(12 + i).padStart(2, "0");

    test(`${stepNum} — Publish ${entity.name}`, async ({ page }) => {
      // Login
      await page.goto("/login");
      await page.fill('input[type="email"]', TEST_USER.email);
      await page.fill('input[type="password"]', TEST_USER.password);
      await page.click('button[type="submit"]');
      await page.waitForURL("/", { timeout: 10000 });

      // Navigate to home first (preserves auth after login redirect)
      await expect(page.locator("text=Add Figure")).toBeVisible({ timeout: 5000 });

      // Click on entity in list to navigate via SPA (avoids full reload auth race)
      const entityLink = page.locator(`text=${entity.name}`).first();
      await expect(entityLink).toBeVisible({ timeout: 10000 });
      await entityLink.click();
      await page.waitForURL(/\/entity\//, { timeout: 5000 });
      await expect(page.locator("h1")).toContainText(entity.name, {
        timeout: 10000,
      });

      // draft → submitted
      await page.click("text=Submit for Review");
      await expect(page.getByText("submitted", { exact: true })).toBeVisible({ timeout: 5000 });
      await page.screenshot({
        path: `screenshots/${stepNum}-${entity.entity_type}-submitted.png`,
        fullPage: true,
      });

      // submitted → under_review
      await page.click("text=Begin Review");
      await expect(page.getByText("under_review", { exact: true })).toBeVisible({
        timeout: 5000,
      });

      // under_review → published
      await page.click("text=Publish");
      await expect(page.getByText("published", { exact: true })).toBeVisible({
        timeout: 5000,
      });
      await page.screenshot({
        path: `screenshots/${stepNum}-${entity.entity_type}-published.png`,
        fullPage: true,
      });
    });
  }

  // ─────────────────────────────────────────────────────
  // STEP 15-17: Add impact assessments
  // ─────────────────────────────────────────────────────
  for (let i = 0; i < ENTITIES.length; i++) {
    const entity = ENTITIES[i];
    const assessment = ASSESSMENTS[i];
    const stepNum = String(15 + i).padStart(2, "0");

    test(`${stepNum} — Score ${entity.name}`, async ({ page }) => {
      // Login
      await page.goto("/login");
      await page.fill('input[type="email"]', TEST_USER.email);
      await page.fill('input[type="password"]', TEST_USER.password);
      await page.click('button[type="submit"]');
      await page.waitForURL("/", { timeout: 10000 });

      // Navigate to entity via SPA link (avoids full reload auth race)
      await expect(page.locator("text=Add Figure")).toBeVisible({ timeout: 5000 });
      const entityLink = page.locator(`text=${entity.name}`).first();
      await expect(entityLink).toBeVisible({ timeout: 10000 });
      await entityLink.click();
      await page.waitForURL(/\/entity\//, { timeout: 5000 });
      await expect(page.locator("h1")).toContainText(entity.name, {
        timeout: 10000,
      });

      // Click "Add Assessment"
      await page.click("text=Add Assessment");
      await expect(
        page.locator("h3", { hasText: "Impact Assessment" }),
      ).toBeVisible({ timeout: 5000 });

      // Fill each dimension
      const dimensions = [
        { key: "scientific", data: assessment.scientific },
        { key: "economic", data: assessment.economic },
        { key: "human_rights", data: assessment.human_rights },
        { key: "health", data: assessment.health },
        { key: "cultural", data: assessment.cultural },
      ];

      for (const dim of dimensions) {
        // Set score via range input using name attribute from react-hook-form
        const slider = page.locator(
          `input[type="range"][name="${dim.key}_score"]`,
        );
        await slider.fill(String(dim.data.score));

        // Fill justification textarea
        const textarea = page.locator(
          `textarea[name="${dim.key}_justification"]`,
        );
        await textarea.fill(dim.data.justification);
      }

      // Set confidence
      await page
        .locator('input[type="range"][name="confidence_level"]')
        .fill(String(assessment.confidence));

      await page.screenshot({
        path: `screenshots/${stepNum}-scoring-${entity.entity_type}-filled.png`,
        fullPage: true,
      });

      // Submit assessment
      await page.click("text=Submit Assessment");

      // Wait for ATIS results to render
      await expect(page.locator("text=Dimensional Scores")).toBeVisible({
        timeout: 10000,
      });
      await expect(
        page.locator("text=ATIS Calculation Breakdown"),
      ).toBeVisible({ timeout: 5000 });

      await page.screenshot({
        path: `screenshots/${stepNum}-scored-${entity.entity_type}.png`,
        fullPage: true,
      });
    });
  }

  // ─────────────────────────────────────────────────────
  // STEP 18: Add assessment period to Marie Curie
  // ─────────────────────────────────────────────────────
  test("18 — Add assessment period to Marie Curie", async ({ page }) => {
    // Login
    await page.goto("/login");
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL("/", { timeout: 10000 });

    // Navigate to Marie Curie via SPA link
    await expect(page.locator("text=Add Figure")).toBeVisible({ timeout: 5000 });
    const entityLink = page.locator("text=Marie Curie").first();
    await expect(entityLink).toBeVisible({ timeout: 10000 });
    await entityLink.click();
    await page.waitForURL(/\/entity\//, { timeout: 5000 });
    await expect(page.locator("h1")).toContainText("Marie Curie", {
      timeout: 10000,
    });

    // Click "Add Period"
    await page.click("text=Add Period");
    await expect(page.locator("text=New Assessment Period")).toBeVisible({
      timeout: 5000,
    });

    // Fill period form
    await page.fill('input[name="label"]', PERIOD.label);
    // Clear and fill year fields (they have defaults)
    await page.locator('input[name="start_year"]').fill(String(PERIOD.start_year));
    await page.locator('input[name="end_year"]').fill(String(PERIOD.end_year));
    if (PERIOD.description) {
      await page.fill('textarea[name="description"]', PERIOD.description);
    }
    await page
      .locator('input[name="reach_factor"]')
      .fill(String(PERIOD.reach_factor));
    await page
      .locator('input[name="persistence_factor"]')
      .fill(String(PERIOD.persistence_factor));

    await page.screenshot({
      path: "screenshots/18-period-form-filled.png",
      fullPage: true,
    });

    await page.click("text=Create Period");

    // Verify period appears
    await expect(
      page.locator(`text=${PERIOD.label}`).first(),
    ).toBeVisible({ timeout: 5000 });
    await page.screenshot({
      path: "screenshots/18-period-created.png",
      fullPage: true,
    });
  });

  // ─────────────────────────────────────────────────────
  // STEP 19: Comparison view with published entities
  // ─────────────────────────────────────────────────────
  test("19 — Compare published entities", async ({ page }) => {
    await page.goto("/compare");
    await expect(page.locator("h1")).toContainText("Comparative Analysis");

    // Search and add first entity
    const searchInput = page.locator(
      'input[placeholder="Search entities to compare..."]',
    );
    await searchInput.fill("Marie");
    // Wait for dropdown results
    await expect(page.locator("text=Marie Curie").last()).toBeVisible({
      timeout: 5000,
    });
    await page.locator("text=Marie Curie").last().click();

    await page.screenshot({
      path: "screenshots/19-compare-one-entity.png",
      fullPage: true,
    });

    // Add second entity
    await searchInput.fill("World Health");
    await expect(
      page.locator("text=World Health Organization").last(),
    ).toBeVisible({ timeout: 5000 });
    await page.locator("text=World Health Organization").last().click();

    // Wait for comparison chart to render
    await expect(page.locator("text=Dimensional Comparison")).toBeVisible({
      timeout: 10000,
    });
    await expect(page.locator("text=Dimensional Differences")).toBeVisible({
      timeout: 5000,
    });

    await page.screenshot({
      path: "screenshots/19-compare-two-entities.png",
      fullPage: true,
    });
  });

  // ─────────────────────────────────────────────────────
  // STEP 20: Verify entity list shows all three
  // ─────────────────────────────────────────────────────
  test("20 — Archives show all published entities", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Impact Index");

    // All three should be visible
    await expect(page.locator("text=Marie Curie")).toBeVisible({
      timeout: 10000,
    });
    await expect(page.locator("text=The Manhattan Project")).toBeVisible();
    await expect(page.locator("text=World Health Organization")).toBeVisible();

    await page.screenshot({
      path: "screenshots/20-archives-populated.png",
      fullPage: true,
    });

    // Test type filter
    await page.selectOption("select >> nth=0", "person");
    await expect(page.locator("text=Marie Curie")).toBeVisible();
    await expect(page.locator("text=The Manhattan Project")).not.toBeVisible();
    await page.screenshot({
      path: "screenshots/20-archives-filter-person.png",
      fullPage: true,
    });

    // Reset filter
    await page.selectOption("select >> nth=0", "");
  });

  // ─────────────────────────────────────────────────────
  // STEP 21: Logout and verify public access
  // ─────────────────────────────────────────────────────
  test("21 — Logout and verify public access", async ({ page }) => {
    // Login first
    await page.goto("/login");
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL("/", { timeout: 10000 });

    // Logout
    await page.click("text=Sign Out");
    await expect(page.locator("nav >> text=Sign In")).toBeVisible({
      timeout: 5000,
    });
    await expect(page.locator("text=Add Figure")).not.toBeVisible();
    await page.screenshot({
      path: "screenshots/21-logged-out-home.png",
      fullPage: true,
    });

    // Published entities are still visible
    await expect(page.locator("text=Marie Curie")).toBeVisible();

    // Navigate to entity profile as anonymous via SPA link
    await page.locator("text=Marie Curie").first().click();
    await page.waitForURL(/\/entity\//, { timeout: 5000 });
    await expect(page.locator("h1")).toContainText("Marie Curie", {
      timeout: 10000,
    });
    // Scores visible to anonymous
    await expect(page.locator("text=Dimensional Scores")).toBeVisible();
    // No "Add Assessment" button for anonymous
    await expect(page.locator("text=Add Assessment")).not.toBeVisible();
    await page.screenshot({
      path: "screenshots/21-public-entity-view.png",
      fullPage: true,
    });
  });

  // ─────────────────────────────────────────────────────
  // STEP 22: Auth redirect works
  // ─────────────────────────────────────────────────────
  test("22 — Unauthenticated create redirects to login", async ({ page }) => {
    await page.goto("/entity/new");
    await page.waitForURL(/\/login/, { timeout: 5000 });
    const url = page.url();
    expect(url).toContain("redirect=");
    await page.screenshot({
      path: "screenshots/22-auth-redirect.png",
      fullPage: true,
    });
  });
});
