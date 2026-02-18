import { test as base, type Page } from "@playwright/test";
import {
  createTestUser,
  createTestSession,
  createTestPurchase,
  cleanupTestUser,
} from "./auth-setup";

/**
 * Test user data seeded into the database.
 */
interface TestUser {
  id: string;
  email: string;
  name: string | null;
}

/**
 * Custom Playwright fixtures for authenticated E2E tests.
 * Seeds BetterAuth-compatible User + Session rows directly via Prisma,
 * then injects the session cookie into the browser context.
 *
 * Provides three auth states:
 * - `authenticatedPage` — logged-in user without purchase
 * - `purchasedPage` — logged-in user with active purchase
 * - `testUser` — the seeded test user object
 *
 * @example
 * test("dashboard shows progress", async ({ authenticatedPage }) => {
 *   await authenticatedPage.goto("/dashboard");
 *   await expect(authenticatedPage.getByText("E2E User")).toBeVisible();
 * });
 *
 * @example
 * test("premium lesson accessible", async ({ purchasedPage }) => {
 *   await purchasedPage.goto("/modules/01-primitives/01-button");
 *   await expect(purchasedPage.locator("article")).toBeVisible();
 * });
 */
export const test = base.extend<{
  authenticatedPage: Page;
  purchasedPage: Page;
  testUser: TestUser;
}>({
  testUser: async ({}, use) => {
    const user = await createTestUser();
    await use(user);
    await cleanupTestUser(user.id);
  },

  authenticatedPage: async ({ context, testUser }, use) => {
    const cookies = await createTestSession(testUser.id);
    await context.addCookies(cookies);
    const page = await context.newPage();
    await use(page);
  },

  purchasedPage: async ({ context, testUser }, use) => {
    await createTestPurchase(testUser.id, testUser.email);
    const cookies = await createTestSession(testUser.id);
    await context.addCookies(cookies);
    const page = await context.newPage();
    await use(page);
  },
});

export { expect } from "@playwright/test";
