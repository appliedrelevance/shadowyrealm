import { type Page, expect } from "@playwright/test";
import type {
  EntityFixture,
  PersonFixture,
  OrganizationFixture,
  EventFixture,
  AssessmentFixture,
  PeriodFixture,
} from "../fixtures/demo-data";

/**
 * Register a new user account via the UI.
 * Returns after redirect to home page.
 */
export async function registerUser(
  page: Page,
  email: string,
  password: string,
): Promise<void> {
  await page.goto("/register");
  await expect(page.locator("h1")).toContainText("Sign Up");
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL("/", { timeout: 10000 });
  await expect(page.locator("text=Add Figure")).toBeVisible({
    timeout: 5000,
  });
}

/**
 * Log in via the UI. Returns after redirect to home.
 */
export async function loginUser(
  page: Page,
  email: string,
  password: string,
): Promise<void> {
  await page.goto("/login");
  await expect(page.locator("h1")).toContainText("Sign In");
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL("/", { timeout: 10000 });
  await expect(page.locator("text=Add Figure")).toBeVisible({
    timeout: 5000,
  });
}

/**
 * Log out via the nav. Returns after seeing "Enter" link.
 */
export async function logoutUser(page: Page): Promise<void> {
  await page.click("text=Sign Out");
  await expect(page.locator("nav >> text=Sign In")).toBeVisible({ timeout: 5000 });
}

/**
 * Create an entity through the UI form. Returns the slug from the URL.
 */
export async function createEntity(
  page: Page,
  fixture: EntityFixture,
): Promise<string> {
  await page.click("text=Add Figure");
  await expect(page.locator("h1")).toContainText("Add Figure");

  // Common fields
  await page.fill('input[id="name"]', fixture.name);
  await page.selectOption('select[id="entity_type"]', fixture.entity_type);
  await page.fill('textarea[id="description"]', fixture.description);
  await page.fill('textarea[id="biography"]', fixture.biography);

  // Type-specific metadata
  if (fixture.entity_type === "person") {
    const p = fixture as PersonFixture;
    if (p.nationality) await page.fill('input[id="nationality"]', p.nationality);
    if (p.birth_date) await page.fill('input[id="birth_date"]', p.birth_date);
    if (p.death_date) await page.fill('input[id="death_date"]', p.death_date);
  } else if (fixture.entity_type === "organization") {
    const o = fixture as OrganizationFixture;
    if (o.headquarters)
      await page.fill('input[id="headquarters"]', o.headquarters);
    if (o.founded_date)
      await page.fill('input[id="founded_date"]', o.founded_date);
    if (o.organization_type)
      await page.selectOption(
        'select[id="organization_type"]',
        o.organization_type,
      );
  } else if (fixture.entity_type === "event") {
    const e = fixture as EventFixture;
    if (e.location) await page.fill('input[id="location"]', e.location);
    if (e.start_date) await page.fill('input[id="start_date"]', e.start_date);
    if (e.end_date) await page.fill('input[id="end_date"]', e.end_date);
    if (e.event_type)
      await page.selectOption('select[id="event_type"]', e.event_type);
  }

  // Submit and wait for redirect to entity profile
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/entity\//, { timeout: 15000 });

  // Extract slug from URL
  const url = page.url();
  const slug = url.split("/entity/")[1]?.split("?")[0] ?? "";
  expect(slug).toBeTruthy();

  // Verify profile rendered
  await expect(page.locator("h1")).toContainText(fixture.name);

  return slug;
}

/**
 * Advance entity through the full publication workflow:
 * draft → submitted → under_review → published
 */
export async function publishEntity(page: Page): Promise<void> {
  // draft → submitted
  await page.click("text=Submit for Review");
  await expect(page.locator("text=submitted")).toBeVisible({ timeout: 5000 });

  // submitted → under_review
  await page.click("text=Begin Review");
  await expect(page.locator("text=under_review")).toBeVisible({
    timeout: 5000,
  });

  // under_review → published
  await page.click("text=Publish");
  await expect(page.locator("text=published")).toBeVisible({ timeout: 5000 });
}

/**
 * Add an impact assessment to the current entity profile page.
 */
export async function addAssessment(
  page: Page,
  assessment: AssessmentFixture,
): Promise<void> {
  await page.click("text=Add Assessment");
  await expect(page.locator("text=Impact Assessment")).toBeVisible({
    timeout: 5000,
  });

  // Set each dimension's score slider and justification
  const dimensions = [
    { key: "scientific", data: assessment.scientific },
    { key: "economic", data: assessment.economic },
    { key: "human_rights", data: assessment.human_rights },
    { key: "health", data: assessment.health },
    { key: "cultural", data: assessment.cultural },
  ];

  for (const dim of dimensions) {
    // Set score via range input
    const slider = page.locator(
      `input[type="range"][name="${dim.key}_score"]`,
    );
    await slider.fill(String(dim.data.score));

    // Fill justification
    const justField = page.locator(
      `textarea[name="${dim.key}_justification"]`,
    );
    await justField.fill(dim.data.justification);
  }

  // Set confidence
  const confidenceSlider = page.locator(
    'input[type="range"][name="confidence_level"]',
  );
  await confidenceSlider.fill(String(assessment.confidence));

  // Submit
  await page.click("text=Submit Assessment");

  // Wait for scores to render
  await expect(page.locator("text=Dimensional Scores")).toBeVisible({
    timeout: 10000,
  });
}

/**
 * Add an assessment period to the current entity profile page.
 */
export async function addPeriod(
  page: Page,
  period: PeriodFixture,
): Promise<void> {
  await page.click("text=Add Period");
  await expect(page.locator("text=New Assessment Period")).toBeVisible({
    timeout: 5000,
  });

  await page.fill('input[name="label"]', period.label);
  await page.fill('input[name="start_year"]', String(period.start_year));
  await page.fill('input[name="end_year"]', String(period.end_year));
  if (period.description) {
    await page.fill('textarea[name="description"]', period.description);
  }
  await page.fill('input[name="reach_factor"]', String(period.reach_factor));
  await page.fill(
    'input[name="persistence_factor"]',
    String(period.persistence_factor),
  );

  await page.click("text=Create Period");

  // Wait for period to appear
  await expect(page.locator(`text=${period.label}`)).toBeVisible({
    timeout: 5000,
  });
}
