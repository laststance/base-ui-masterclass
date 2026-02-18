import { createHmac, randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@base-ui-masterclass/database";

const DEV_USER_EMAIL = "dev@localhost";
const DEV_USER_NAME = "Dev User";
const SESSION_COOKIE_NAME = "better-auth.session_token";
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Signs a session token using HMAC-SHA256, matching BetterAuth's cookie format.
 *
 * @param value - Plain session token
 * @param secret - BETTER_AUTH_SECRET
 * @returns Signed cookie value in format `{token}.{base64(hmac)}`
 *
 * @example
 * signCookieValue("abc123", "secret") // => "abc123.base64signature"
 */
function signCookieValue(value: string, secret: string): string {
  const signature = createHmac("sha256", secret).update(value).digest("base64");
  return `${value}.${signature}`;
}

/**
 * GET /api/dev-login — Creates a dev user with purchase and sets a signed session cookie.
 * Only available in non-production environments. Returns 404 in production.
 *
 * Usage: Open http://localhost:3000/api/dev-login in your browser.
 * You will be redirected to /dashboard as an authenticated user with full course access.
 *
 * @example
 * // Browser: navigate to http://localhost:3000/api/dev-login
 * // → Creates/reuses dev@localhost user
 * // → Creates session + signed cookie
 * // → Creates purchase record (active)
 * // → Redirects to /dashboard
 */
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }

  const secret = process.env.BETTER_AUTH_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "BETTER_AUTH_SECRET is not set" },
      { status: 500 },
    );
  }

  // Upsert dev user (idempotent — safe to call multiple times)
  const user = await prisma.user.upsert({
    where: { email: DEV_USER_EMAIL },
    update: { name: DEV_USER_NAME },
    create: {
      email: DEV_USER_EMAIL,
      name: DEV_USER_NAME,
      emailVerified: true,
    },
  });

  // Ensure active purchase exists for full course access
  await prisma.purchase.upsert({
    where: { userId: user.id },
    update: { status: "active" },
    create: {
      userId: user.id,
      email: DEV_USER_EMAIL,
      status: "active",
    },
  });

  // Create a new session with signed cookie
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_MS);

  await prisma.session.create({
    data: {
      token,
      userId: user.id,
      expiresAt,
      ipAddress: "127.0.0.1",
      userAgent: "Dev Login",
    },
  });

  const signedValue = signCookieValue(token, secret);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const response = NextResponse.redirect(new URL("/dashboard", baseUrl));

  response.cookies.set(SESSION_COOKIE_NAME, signedValue, {
    path: "/",
    httpOnly: true,
    secure: baseUrl.startsWith("https"),
    sameSite: "lax",
    expires: expiresAt,
  });

  return response;
}
