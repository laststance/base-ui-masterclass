import { test, expect } from "./helpers/fixtures";

/**
 * Comprehensive E2E test: Verify ALL 22 exercises load and pass tests
 * when the solution code is shown via the "Show Solution" button.
 *
 * Each exercise lives in a lesson MDX page. The flow:
 * 1. Navigate to lesson URL
 * 2. Scroll to the exercise Sandpack section
 * 3. Click "Show Solution" to inject solution code
 * 4. Wait for Sandpack tests to complete
 * 5. Assert "All tests passed" banner appears
 *
 * @example
 * pnpm --filter web playwright test e2e/exercise-all.spec.ts
 */

const EXERCISES = [
  { id: "button-basic", url: "/modules/01-primitives/01-button" },
  { id: "input-basic", url: "/modules/01-primitives/02-input" },
  {
    id: "use-controllable-state",
    url: "/modules/02-toggle-state/01-use-controllable-state",
  },
  { id: "switch-basic", url: "/modules/02-toggle-state/02-switch" },
  { id: "checkbox-basic", url: "/modules/02-toggle-state/04-checkbox" },
  { id: "progress-basic", url: "/modules/04-data-display/01-progress" },
  { id: "collapsible-basic", url: "/modules/05-disclosure/01-collapsible" },
  { id: "accordion-basic", url: "/modules/05-disclosure/02-accordion" },
  { id: "roving-tabindex", url: "/modules/06-navigation/01-roving-tabindex" },
  { id: "tabs-basic", url: "/modules/06-navigation/02-tabs" },
  { id: "tooltip-basic", url: "/modules/07-overlays-1/02-tooltip" },
  { id: "popover-basic", url: "/modules/07-overlays-1/03-popover" },
  { id: "dialog-basic", url: "/modules/08-overlays-2/02-dialog" },
  { id: "alert-dialog-basic", url: "/modules/08-overlays-2/03-alert-dialog" },
  { id: "select-basic", url: "/modules/09-selection/02-select" },
  { id: "combobox-basic", url: "/modules/09-selection/03-combobox" },
  { id: "menu-basic", url: "/modules/10-menus/02-menu" },
  { id: "context-menu-basic", url: "/modules/10-menus/03-context-menu" },
  { id: "number-field-basic", url: "/modules/11-advanced/01-number-field" },
  { id: "slider-basic", url: "/modules/11-advanced/02-slider" },
  { id: "scroll-area-basic", url: "/modules/11-advanced/03-scroll-area" },
  { id: "toast-basic", url: "/modules/11-advanced/04-toast" },
] as const;

test.describe("All Exercises — Solution Tests", () => {
  // Sandpack compilation + test execution can be slow
  test.setTimeout(120_000);

  for (const exercise of EXERCISES) {
    test(`${exercise.id}: solution passes all tests`, async ({
      purchasedPage,
    }) => {
      // 1. Navigate to the lesson page containing this exercise
      await purchasedPage.goto(exercise.url, { waitUntil: "load" });

      // 2. Find the exercise section by its stable data-testid
      const exerciseSection = purchasedPage.locator(
        `[data-testid="exercise-${exercise.id}"]`,
      );
      await exerciseSection.scrollIntoViewIfNeeded();

      // 3. Click "Show Solution" button scoped to this exercise
      const solutionBtn = exerciseSection.getByRole("button", {
        name: /Solution|解答/i,
      });
      await expect(solutionBtn).toBeVisible({ timeout: 15_000 });
      await solutionBtn.click();

      // 4. Wait for Sandpack to compile and run tests.
      //    Race success vs failure — fail fast on the error path.
      const statusArea = exerciseSection.locator('[role="status"]').last();

      await expect(async () => {
        const successVisible = await statusArea
          .getByText(/All tests passed|全テスト合格/i)
          .isVisible();
        const failureVisible = await statusArea
          .getByText(/Tests failed|テスト失敗/i)
          .isVisible();
        if (failureVisible) {
          throw new Error(`[${exercise.id}] Sandpack reported test failure`);
        }
        expect(successVisible).toBe(true);
      }).toPass({ timeout: 90_000, intervals: [1_000] });

      // 5. Verify the success banner is present
      const banner = exerciseSection.locator(".bg-success\\/5").first();
      await expect(banner).toBeVisible();
    });
  }
});
