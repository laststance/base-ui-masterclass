import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";
import { prisma } from "@base-ui-masterclass/database";

/**
 * Validates required OAuth environment variables at runtime.
 * Called lazily on first session request to avoid build-time failures.
 */
function validateAuthEnv() {
  const requiredEnvVars = [
    "AUTH_GITHUB_ID",
    "AUTH_GITHUB_SECRET",
    "AUTH_GOOGLE_ID",
    "AUTH_GOOGLE_SECRET",
  ] as const;

  const missing = requiredEnvVars.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  }
}

/**
 * BetterAuth server instance with Prisma adapter.
 * Supports GitHub and Google OAuth providers.
 *
 * @example
 * // In a Server Component or Server Action:
 * import { auth, getSession } from "@/lib/auth";
 * const session = await getSession();
 * if (session?.user?.id) { ... }
 */
export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  socialProviders: {
    github: {
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    },
    google: {
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    },
  },
  plugins: [nextCookies()],
});

/**
 * Convenience wrapper for getting the current session.
 * Centralizes the headers() wiring for BetterAuth.
 *
 * @returns BetterAuth session or null if unauthenticated
 *
 * @example
 * const session = await getSession();
 * if (session?.user?.id) { ... }
 */
export async function getSession() {
  validateAuthEnv();
  return auth.api.getSession({ headers: await headers() });
}

/**
 * Session with purchase status for paywall checks.
 * Queries the Purchase table and attaches `hasPurchased` to the session.
 *
 * @returns Session with hasPurchased flag, or null if unauthenticated
 *
 * @example
 * const session = await getSessionWithPurchase();
 * if (session?.hasPurchased) { // render premium content }
 */
export async function getSessionWithPurchase() {
  const session = await getSession();
  if (!session) return null;

  const purchase = await prisma.purchase.findUnique({
    where: { userId: session.user.id },
    select: { status: true },
  });

  return {
    ...session,
    hasPurchased: purchase?.status === "active",
  };
}

export type SessionWithPurchase = NonNullable<
  Awaited<ReturnType<typeof getSessionWithPurchase>>
>;
