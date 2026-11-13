import { test, expect } from "@playwright/test";

test.describe("Public pages", () => {
  test("home shows the river and a ranked index", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Who shaped the world");
    await expect(page.getByRole("img", { name: /Impact river/ })).toBeVisible();
    const rows = page.locator("table tbody tr");
    await expect(rows.first()).toBeVisible();
    expect(await rows.count()).toBeGreaterThan(10);
  });

  test("the index filters by type and name", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Events" }).click();
    await expect(page.locator("table tbody tr").first()).toBeVisible();
    await page.getByRole("searchbox", { name: "Search by name" }).fill("zzzz-no-such-entity");
    await expect(page.getByText("No entities match.")).toBeVisible();
  });

  test("an entity profile shows its score, curve, profile and evidence", async ({ page }) => {
    await page.goto("/entity/catholic-church");
    await expect(page.locator("h1")).toHaveText("Catholic Church");
    await expect(page.getByText("Total influence")).toBeVisible();
    await expect(page.getByRole("img", { name: /influence over time/ })).toBeVisible();
    await expect(page.getByRole("img", { name: /ten-number impact profile/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Draws credit from" })).toBeVisible();
    await page.getByRole("button", { name: "Show evidence" }).first().click();
    await expect(page.getByText("@cf/cloudflare/clef").first()).toBeVisible();
  });

  test("credit reaches a founder through the chain", async ({ page }) => {
    await page.goto("/entity/jesus");
    const list = page.locator("section", { has: page.getByRole("heading", { name: "Draws credit from" }) });
    await expect(list.getByRole("link", { name: /Catholic Church/ })).toBeVisible();
    await expect(list.getByRole("link", { name: /First Crusade/ })).toBeVisible();
    await expect(list.getByText("40%")).toBeVisible();
  });

  test("the lineage graph traces a selection", async ({ page }) => {
    await page.goto("/realm");
    await expect(page.locator("h1")).toHaveText("Lineage");
    await page.getByRole("button", { name: /^Jesus,/ }).click();
    await expect(page.getByRole("complementary").getByRole("heading", { name: "Jesus" })).toBeVisible();
  });

  test("compare opens with three founders side by side", async ({ page }) => {
    await page.goto("/compare");
    await expect(page.locator("h1")).toHaveText("Compare");
    await expect(page.getByRole("img", { name: /Total influence over time/ })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: /Muhammad/ })).toBeVisible();
  });

  test("methodology explains the profile and credit", async ({ page }) => {
    await page.goto("/methodology");
    await expect(page.locator("h1")).toHaveText("How It Works");
    await expect(page.getByRole("heading", { name: "Ten numbers, never netted" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Credit flows from consequence to cause" })).toBeVisible();
  });

  test("the scores endpoint ranks published entities", async ({ request }) => {
    const response = await request.get("/api/scores");
    expect(response.ok()).toBe(true);
    const body = (await response.json()) as { entities: { total_magnitude: number; profile: unknown }[] };
    expect(body.entities.length).toBeGreaterThan(10);
    const magnitudes = body.entities.map((e) => e.total_magnitude);
    expect(magnitudes).toEqual([...magnitudes].sort((a, b) => b - a));
  });

  test("a missing entity says so", async ({ page }) => {
    await page.goto("/entity/nonexistent-entity-slug-12345");
    await expect(page.locator("h1")).toHaveText("Not found");
  });

  test("navigation offers the four public pages and no sign-in", async ({ page }) => {
    await page.goto("/");
    const nav = page.locator("nav");
    for (const name of ["Index", "Lineage", "Compare", "How It Works"]) {
      await expect(nav.getByRole("link", { name })).toBeVisible();
    }
    await expect(nav.getByText("Sign In")).toHaveCount(0);
  });
});
