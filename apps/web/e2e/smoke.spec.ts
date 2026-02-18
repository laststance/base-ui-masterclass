import { test, expect } from "./helpers/fixtures";
import { test as baseTest, expect as baseExpect } from "@playwright/test";

/**
 * Smoke tests verifying OAuth bypass and core page access.
 * Uses BetterAuth testUtils to seed sessions without real OAuth.
 */

baseTest.describe("Unauthenticated access", () => {
  baseTest("landing page loads", async ({ page }) => {
    await page.goto("/");
    await baseExpect(page.locator("main")).toBeVisible();
  });

  baseTest("modules list is public", async ({ page }) => {
    await page.goto("/modules");
    await baseExpect(page.locator("main")).toBeVisible();
  });

  baseTest("dashboard redirects to login", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForURL("**/login**");
  });
});

test.describe("Authenticated access (no purchase)", () => {
  test("dashboard shows user name", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/dashboard");
    await expect(authenticatedPage.getByText("E2E User")).toBeVisible();
  });

  test("premium lesson shows paywall", async ({ authenticatedPage }) => {
    // Navigate to a premium lesson (module 01 lessons are premium)
    await authenticatedPage.goto("/modules/01-primitives/01-button");
    // Should see purchase prompt, not lesson content
    await expect(
      authenticatedPage.getByText("Purchase Required").or(
        authenticatedPage.getByText("購入が必要です"),
      ),
    ).toBeVisible();
  });
});

test.describe("Purchased access", () => {
  test("premium lesson renders content", async ({ purchasedPage }) => {
    await purchasedPage.goto("/modules/01-primitives/01-button");
    // Should see lesson content (article element with prose)
    await expect(purchasedPage.locator("article")).toBeVisible();
  });

  test("free lesson still accessible", async ({ purchasedPage }) => {
    await purchasedPage.goto("/modules/00-foundation/01-introduction");
    await expect(purchasedPage.locator("article")).toBeVisible();
  });
});
