import { test, expect } from "./helpers/fixtures";
import { test as baseTest, expect as baseExpect } from "@playwright/test";

/**
 * E2E tests for the dashboard page (/dashboard).
 * Tests auth redirect, user greeting, and progress display.
 */
baseTest.describe("Dashboard — unauthenticated", () => {
  baseTest("redirects to login when not authenticated", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForURL("**/login**");
  });
});

test.describe("Dashboard — authenticated", () => {
  test("shows user name and welcome message", async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.goto("/dashboard");
    await expect(authenticatedPage.getByText("E2E User")).toBeVisible();
    await expect(
      authenticatedPage.getByText(/Welcome back|ようこそ/),
    ).toBeVisible();
  });

  test("displays overall progress section", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/dashboard");
    await expect(
      authenticatedPage.getByText(/Overall Progress|全体の進捗/),
    ).toBeVisible();
    // Should show percentage
    await expect(authenticatedPage.getByText(/%/)).toBeVisible();
  });

  test("lists all 13 modules with progress bars", async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.goto("/dashboard");
    // Each module has a link card — verify we have multiple module entries
    const moduleLinks = authenticatedPage.locator('a[href^="/modules/"]');
    await expect(moduleLinks.first()).toBeVisible();
    const count = await moduleLinks.count();
    expect(count).toBeGreaterThanOrEqual(13);
  });

  test("module cards link to module detail page", async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.goto("/dashboard");
    const firstModule = authenticatedPage
      .locator('a[href^="/modules/"]')
      .first();
    const href = await firstModule.getAttribute("href");
    expect(href).toMatch(/^\/modules\//);
  });
});
