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

    // Exercise toolbar buttons indicate exercise presence
    const solutionButton = purchasedPage.getByRole("button", {
      name: /Solution|解答/i,
    });

    // Assert exercises exist on this page (fail-fast if lesson has no exercises)
    await expect(solutionButton.first()).toBeVisible();
    await expect(
      purchasedPage.getByRole("button", { name: /Reset|リセット/i }),
    ).toBeVisible();
  });

  test("hint button shows progressive hints", async ({ purchasedPage }) => {
    await purchasedPage.goto("/modules/01-primitives/01-button");

    const hintButton = purchasedPage.getByRole("button", {
      name: /Hint|ヒント/i,
    });
    await expect(hintButton.first()).toBeVisible();
    await hintButton.first().click();
    // After clicking, a hint panel should appear
    await expect(
      purchasedPage.getByText(/Hint 1|ヒント 1/),
    ).toBeVisible();
  });
});
