import { randomBytes, createHmac } from "crypto";
import { prisma } from "@base-ui-masterclass/database";

/**
 * BetterAuth cookie name for session token.
 * Must match the default: `better-auth.session_token`.
 */
const SESSION_COOKIE_NAME = "better-auth.session_token";

/**
 * Default session duration: 7 days (matches BetterAuth default maxAge).
 */
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Signs a cookie value with HMAC-SHA256 to match BetterAuth's signed cookie format.
 * BetterAuth uses `setSignedCookie()` which produces: `{value}.{base64(hmac(value, secret))}`.
 *
 * @param value - The plain session token
 * @param secret - BETTER_AUTH_SECRET
 * @returns Signed cookie value: `token.signature`
 *
 * @example
 * signCookieValue("abc123", "secret") // => "abc123.base64sig..."
 */
function signCookieValue(value: string, secret: string): string {
  const signature = createHmac("sha256", secret).update(value).digest("base64");
  return `${value}.${signature}`;
}

/**
 * Creates a test user in the database and returns its data.
 * Uses Prisma directly — no BetterAuth runtime dependency.
 *
 * @param overrides - Optional field overrides
 * @returns Created user record
 *
 * @example
 * const user = await createTestUser({ name: "Alice" });
 * // => { id: "cuid...", email: "e2e-1234@test.local", name: "Alice", ... }
 */
export async function createTestUser(
  overrides: { email?: string; name?: string } = {},
) {
  return prisma.user.create({
    data: {
      email:
        overrides.email ??
        `e2e-${Date.now()}-${randomBytes(4).toString("hex")}@test.local`,
      name: overrides.name ?? "E2E User",
      emailVerified: true,
    },
  });
}

/**
 * Creates a BetterAuth-compatible session in the database for the given user
 * and returns Playwright-compatible cookie objects.
 *
 * @param userId - ID of the user to create a session for
 * @returns Array of cookie objects for `context.addCookies()`
 *
 * @example
 * const cookies = await createTestSession(user.id);
 * await context.addCookies(cookies);
 */
export async function createTestSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  const secret = process.env.BETTER_AUTH_SECRET;
  if (!secret) {
    throw new Error("BETTER_AUTH_SECRET must be set for E2E session seeding");
  }

  await prisma.session.create({
    data: {
      token,
      userId,
      expiresAt: new Date(Date.now() + SESSION_MAX_AGE_MS),
      ipAddress: "127.0.0.1",
      userAgent: "Playwright E2E Test",
    },
  });

  // BetterAuth expects signed cookies: `token.base64(hmac-sha256(token, secret))`
  const signedValue = signCookieValue(token, secret);
  const baseUrl = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";
  const domain = new URL(baseUrl).hostname;

  return [
    {
      name: SESSION_COOKIE_NAME,
      value: signedValue,
      domain,
      path: "/",
      httpOnly: true,
      secure: new URL(baseUrl).protocol === "https:",
      sameSite: "Lax" as const,
    },
  ];
}

/**
 * Creates an active Purchase record for the test user.
 *
 * @param userId - User ID to link the purchase to
 * @param email - User's email address
 * @returns Created purchase record
 *
 * @example
 * await createTestPurchase(user.id, user.email);
 */
export async function createTestPurchase(userId: string, email: string) {
  return prisma.purchase.create({
    data: {
      userId,
      email,
      status: "active",
      orderId: `e2e-order-${Date.now()}`,
    },
  });
}

/**
 * Removes a test user and all cascaded records (sessions, accounts, progress).
 * Also cleans up purchase records (optional FK, not cascaded).
 *
 * @param userId - User ID to clean up
 *
 * @example
 * await cleanupTestUser(user.id);
 */
export async function cleanupTestUser(userId: string) {
  await prisma.purchase.deleteMany({ where: { userId } }).catch(() => {});
  await prisma.user.delete({ where: { id: userId } }).catch(() => {});
}

export { prisma };
