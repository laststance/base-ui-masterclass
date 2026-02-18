import { test, expect } from "./helpers/fixtures";
import { test as baseTest, expect as baseExpect } from "@playwright/test";

/**
 * E2E tests for the lesson page (/modules/:module/:lesson).
 * Tests free lesson access, premium paywall, and navigation.
 */
baseTest.describe("Lesson — free lesson (unauthenticated)", () => {
  baseTest("renders free lesson content in article", async ({ page }) => {
    await page.goto("/modules/00-foundation/01-introduction");
    await baseExpect(page.locator("article")).toBeVisible();
  });

  baseTest("shows breadcrumb navigation", async ({ page }) => {
    await page.goto("/modules/00-foundation/01-introduction");
    await baseExpect(page.getByText(/Module 0/)).toBeVisible();
    await baseExpect(page.getByText(/Lesson 1 of/)).toBeVisible();
  });

  baseTest("shows prev/next navigation", async ({ page }) => {
    await page.goto("/modules/00-foundation/01-introduction");
    // First lesson should have a "Next" link but not necessarily a "Previous"
    await baseExpect(page.getByText("Next")).toBeVisible();
  });
});

test.describe("Lesson — premium (no purchase)", () => {
  test("shows paywall for premium lesson", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/modules/01-primitives/01-button");
    // Should see purchase prompt instead of lesson content
    await expect(
      authenticatedPage
        .getByText(/Purchase|購入/)
        .first(),
    ).toBeVisible();
  });
});

test.describe("Lesson — premium (with purchase)", () => {
  test("renders premium lesson content", async ({ purchasedPage }) => {
    await purchasedPage.goto("/modules/01-primitives/01-button");
    await expect(purchasedPage.locator("article")).toBeVisible();
  });

  test("shows breadcrumb with module info", async ({ purchasedPage }) => {
    await purchasedPage.goto("/modules/01-primitives/01-button");
    await expect(purchasedPage.getByText(/Module 1/)).toBeVisible();
  });
});
