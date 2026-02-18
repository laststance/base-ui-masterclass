import { test, expect } from "@playwright/test";

/**
 * E2E tests for i18n locale switching.
 * Verifies content renders in both English and Japanese.
 */
test.describe("i18n Locale Switching", () => {
  test("landing page renders in English by default", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Build")).toBeVisible();
    await expect(page.getByText("Base UI")).toBeVisible();
    await expect(page.getByText("from Scratch")).toBeVisible();
  });

  test("landing page renders in Japanese at /ja", async ({ page }) => {
    await page.goto("/ja");
    await expect(page.getByText("Base UI")).toBeVisible();
    await expect(page.getByText("ゼロから構築")).toBeVisible();
  });

  test("modules page renders in Japanese at /ja/modules", async ({ page }) => {
    await page.goto("/ja/modules");
    await expect(page.getByText("全モジュール")).toBeVisible();
  });

  test("pricing page renders in Japanese at /ja/pricing", async ({ page }) => {
    await page.goto("/ja/pricing");
    await expect(page.getByText("$500")).toBeVisible();
    // Japanese-specific text
    await expect(page.getByText("買い切り").first()).toBeVisible();
  });

  test("login page renders in Japanese at /ja/login", async ({ page }) => {
    await page.goto("/ja/login");
    // Login page should show Japanese heading text
    await expect(page.getByText("ログイン").first()).toBeVisible();
  });

  test("free lesson renders in English at /modules/00-foundation/01-introduction", async ({
    page,
  }) => {
    await page.goto("/modules/00-foundation/01-introduction");
    await expect(page.locator("article")).toBeVisible();
    await expect(page.getByText("Module 0")).toBeVisible();
  });
});
