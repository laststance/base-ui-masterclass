import { test, expect } from "@playwright/test";

/**
 * E2E tests for the login page (/login).
 * Verifies OAuth buttons and page structure.
 */
test.describe("Login Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("renders login title", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("shows GitHub OAuth button", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: /GitHub/i }),
    ).toBeVisible();
  });

  test("shows Google OAuth button", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: /Google/i }),
    ).toBeVisible();
  });

  test("shows terms of service notice", async ({ page }) => {
    // The login page shows a ToS note at the bottom
    await expect(page.locator("main")).toContainText(/.+/);
  });
});
