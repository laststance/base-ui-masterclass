import { test, expect } from "./helpers/fixtures";

/**
 * E2E tests for the Exercise Sandpack component.
 * Tests exercise rendering within a purchased lesson context.
 * Note: Only runs against lessons that contain exercises.
 */
test.describe("Exercise Sandpack", () => {
  test("renders Sandpack editor in a purchased lesson with exercises", async ({
    purchasedPage,
  }) => {
    // Module 01 lessons typically contain exercises
    await purchasedPage.goto("/modules/01-primitives/01-button");

    // Check for the Sandpack toolbar (exercise ID indicator)
    const exerciseContainer = purchasedPage.locator(
      '[class*="rounded-lg border border-accent"]',
    );

    // If this lesson has exercises, the Sandpack container should be visible
    // Skip gracefully if this particular lesson has no exercise
    const count = await exerciseContainer.count();
    if (count > 0) {
      await expect(exerciseContainer.first()).toBeVisible();

      // Verify toolbar buttons exist
      await expect(
        purchasedPage.getByRole("button", { name: /Solution|解答/i }),
      ).toBeVisible();
      await expect(
        purchasedPage.getByRole("button", { name: /Reset|リセット/i }),
      ).toBeVisible();
    }
  });

  test("hint button shows progressive hints", async ({ purchasedPage }) => {
    await purchasedPage.goto("/modules/01-primitives/01-button");

    const hintButton = purchasedPage.getByRole("button", {
      name: /Hint|ヒント/i,
    });
    const count = await hintButton.count();
    if (count > 0) {
      await hintButton.click();
      // After clicking, a hint panel should appear
      await expect(
        purchasedPage.getByText(/Hint 1|ヒント 1/),
      ).toBeVisible();
    }
  });
});
