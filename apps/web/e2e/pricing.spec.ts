import { test, expect } from "@playwright/test";

/**
 * E2E tests for the pricing page (/pricing).
 * Verifies price display, feature list, comparison table, FAQ, and checkout button.
 */
test.describe("Pricing Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/pricing");
  });

  test("displays $500 price prominently", async ({ page }) => {
    await expect(page.getByText("$500").first()).toBeVisible();
    await expect(
      page.getByText(/One-time purchase/i).first(),
    ).toBeVisible();
  });

  test("shows feature list with all items", async ({ page }) => {
    await expect(page.getByText("13 Modules, 35+ Interactive")).toBeVisible();
    await expect(page.getByText("Full source code")).toBeVisible();
    await expect(page.getByText("Discord Community")).toBeVisible();
    await expect(page.getByText("Lifetime updates")).toBeVisible();
  });

  test("shows comparison table: Self-learning vs This Course", async ({
    page,
  }) => {
    await expect(page.getByText("Self-learning vs This Course")).toBeVisible();
    await expect(page.getByRole("table")).toBeVisible();
    await expect(page.getByText("Structure")).toBeVisible();
    await expect(page.getByText("Exercises")).toBeVisible();
  });

  test("FAQ section has expandable items", async ({ page }) => {
    const faqItem = page.getByText("Is this a subscription?");
    await expect(faqItem).toBeVisible();
    // Click to expand
    await faqItem.click();
    await expect(
      page.getByText("No. It is a one-time purchase"),
    ).toBeVisible();
  });

  test("checkout button links to Lemon Squeezy", async ({ page }) => {
    const checkout = page
      .getByRole("link", { name: /Buy Now|購入/i })
      .first();
    await expect(checkout).toHaveAttribute("href", /lemonsqueezy/);
  });

  test("shows 30-day money-back guarantee", async ({ page }) => {
    await expect(
      page.getByText(/30-Day Money-Back Guarantee/i).first(),
    ).toBeVisible();
  });
});
