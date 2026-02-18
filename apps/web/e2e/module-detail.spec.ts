import { test, expect } from "@playwright/test";

/**
 * E2E tests for the module detail page (/modules/:slug).
 * Tests the Foundation module (free, always accessible).
 */
test.describe("Module Detail Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/modules/00-foundation");
  });

  test("renders module title", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("shows 'Module 0' number badge", async ({ page }) => {
    await expect(page.getByText("Module 0")).toBeVisible();
  });

  test("displays back link to all modules", async ({ page }) => {
    await expect(page.getByText("All Modules")).toBeVisible();
  });

  test("lists lessons for the module", async ({ page }) => {
    const lessonLinks = page.locator('a[href*="/modules/00-foundation/"]');
    await expect(lessonLinks.first()).toBeVisible();
    const count = await lessonLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test("lessons show Free or Premium badge", async ({ page }) => {
    await expect(
      page.getByText("Free").or(page.getByText("Premium")).first(),
    ).toBeVisible();
  });

  test("clicking a lesson navigates to lesson page", async ({ page }) => {
    const firstLesson = page
      .locator('a[href*="/modules/00-foundation/"]')
      .first();
    await firstLesson.click();
    await page.waitForURL(/\/modules\/00-foundation\/.+$/);
    await expect(page.locator("main")).toBeVisible();
  });

  test("returns 404 for nonexistent module", async ({ page }) => {
    const response = await page.goto("/modules/nonexistent-module");
    expect(response?.status()).toBe(404);
  });
});
