import { test, expect } from "@playwright/test";

/**
 * E2E tests for the landing page (/).
 * Verifies hero, curriculum, pricing CTA, and footer sections.
 */
test.describe("Landing Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders hero section with title and CTA buttons", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Base UI",
    );
    await expect(
      page.getByRole("link", { name: /Start Free Preview/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Buy Now/i }),
    ).toBeVisible();
  });

  test("displays stats with component, module, and lesson counts", async ({
    page,
  }) => {
    await expect(page.getByText("Components")).toBeVisible();
    await expect(page.getByText("13 Modules")).toBeVisible();
    await expect(page.getByText("45+ Lessons")).toBeVisible();
  });

  test("shows 'What You'll Build' category grid", async ({ page }) => {
    await expect(page.getByText("What You'll Build")).toBeVisible();
    await expect(page.getByText("Overlays")).toBeVisible();
    await expect(page.getByText("Forms")).toBeVisible();
    await expect(page.getByText("Navigation")).toBeVisible();
  });

  test("shows full curriculum with 13 modules", async ({ page }) => {
    await expect(page.getByText("13 Modules")).toBeVisible();
    // At least the first and last modules should be visible
    await expect(page.getByText("Foundation")).toBeVisible();
  });

  test("shows pricing CTA section with $500 price", async ({ page }) => {
    await expect(page.getByText("$500").first()).toBeVisible();
    await expect(page.getByText("Full Course")).toBeVisible();
  });

  test("footer contains GitHub and Discord links", async ({ page }) => {
    const footer = page.locator("footer");
    await expect(footer.getByText("GitHub")).toBeVisible();
    await expect(footer.getByText("Discord")).toBeVisible();
  });

  test("'Start Free Preview' links to introduction lesson", async ({
    page,
  }) => {
    const link = page.getByRole("link", { name: /Start Free Preview/i }).first();
    await expect(link).toHaveAttribute(
      "href",
      "/modules/00-foundation/01-introduction",
    );
  });
});
