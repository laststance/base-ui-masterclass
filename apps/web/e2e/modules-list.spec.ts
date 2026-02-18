import { test, expect } from "@playwright/test";

/**
 * E2E tests for the modules list page (/modules).
 * Verifies page renders and lists all 13 modules.
 */
test.describe("Modules List Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/modules");
  });

  test("renders page title", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /All Modules|全モジュール/i }),
    ).toBeVisible();
  });

  test("displays curriculum subtitle", async ({ page }) => {
    await expect(page.getByText("Curriculum")).toBeVisible();
  });

  test("lists all 13 module cards as links", async ({ page }) => {
    const moduleLinks = page.locator('a[href^="/modules/"]');
    await expect(moduleLinks.first()).toBeVisible();
    const count = await moduleLinks.count();
    expect(count).toBeGreaterThanOrEqual(13);
  });

  test("first module (Foundation) has Free badge", async ({ page }) => {
    // Module 00-foundation should have a "Free" badge
    await expect(page.getByText("Free").first()).toBeVisible();
  });

  test("modules show component and lesson counts", async ({ page }) => {
    await expect(page.getByText(/lessons/).first()).toBeVisible();
  });

  test("clicking a module navigates to module detail", async ({ page }) => {
    const firstModule = page.locator('a[href^="/modules/"]').first();
    await firstModule.click();
    await page.waitForURL(/\/modules\/[^/]+$/);
    await expect(page.locator("main")).toBeVisible();
  });
});
