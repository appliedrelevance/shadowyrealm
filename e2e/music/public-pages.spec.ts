import { test, expect } from "@playwright/test";

test.describe("Music", () => {
  test("home draws the stream by family, tables the families and ranks the index", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Which music has given the most?");
    const stream = page.getByRole("img", { name: /Centred stream of .* entities by family/ });
    await expect(stream).toBeVisible();
    expect(await stream.locator("a path").count()).toBeGreaterThan(2000);
    await expect(page.getByRole("heading", { name: "The families" })).toBeVisible();
    await expect(page.getByRole("cell", { name: "Classical", exact: true })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "Benefit · Harm" })).toHaveCount(0);
  });

  test("a band opens the entry's profile, with no harm anywhere", async ({ page }) => {
    await page.goto("/");
    await page.locator('a[href="/entity/the-beatles"]').dispatchEvent("click");
    await expect(page).toHaveURL(/\/entity\/the-beatles$/);
    await expect(page.locator("h1")).toHaveText("The Beatles");
    await expect(page.getByText("Total influence")).toBeVisible();
    await expect(page.getByRole("img", { name: /own and credited influence over time/ })).toBeVisible();
    await expect(page.getByRole("img", { name: /four-number impact profile/ })).toBeVisible();
    await expect(page.getByText("Harm", { exact: true })).toHaveCount(0);
  });
});
