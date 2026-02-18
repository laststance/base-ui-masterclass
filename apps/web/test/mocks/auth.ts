import { vi } from "vitest";

/**
 * Configurable mock for `@/lib/auth` module.
 * Provides both `getSession` and `getSessionWithPurchase` mocks.
 *
 * @example
 * import { mockGetSession } from "@/test/mocks/auth";
 * mockGetSession.mockResolvedValue(mockAuthenticatedSession());
 */
export const mockGetSession = vi.fn();
export const mockGetSessionWithPurchase = vi.fn();

/**
 * Returns a mock authenticated session matching BetterAuth's shape.
 *
 * @param overrides - Partial overrides for user or session fields
 * @returns Mock session object
 *
 * @example
 * mockAuthenticatedSession({ user: { email: "custom@test.com" } })
 */
export function mockAuthenticatedSession(
  overrides: {
    user?: Partial<{ id: string; name: string; email: string }>;
  } = {},
) {
  return {
    user: {
      id: "user-001",
      name: "Test User",
      email: "test@example.com",
      ...overrides.user,
    },
    session: {
      id: "session-001",
      userId: overrides.user?.id ?? "user-001",
      expiresAt: new Date(Date.now() + 86400000),
    },
  };
}

/**
 * Returns a mock session with purchase status for paywall tests.
 *
 * @param hasPurchased - Whether the user has an active purchase
 * @param overrides - Additional session overrides
 * @returns Mock session with `hasPurchased` flag
 *
 * @example
 * mockGetSessionWithPurchase.mockResolvedValue(mockPurchasedSession(true));
 */
export function mockPurchasedSession(
  hasPurchased: boolean,
  overrides: {
    user?: Partial<{ id: string; name: string; email: string }>;
  } = {},
) {
  return {
    ...mockAuthenticatedSession(overrides),
    hasPurchased,
  };
}
