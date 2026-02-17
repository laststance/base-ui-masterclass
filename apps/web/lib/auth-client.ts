"use client";

import { createAuthClient } from "better-auth/react";

/**
 * BetterAuth client instance for Client Components.
 * Provides hooks and methods for auth operations.
 *
 * @example
 * import { authClient } from "@/lib/auth-client";
 *
 * // Hook for session state:
 * const { data: session, isPending } = authClient.useSession();
 *
 * // OAuth sign-in:
 * authClient.signIn.social({ provider: "github", callbackURL: "/" });
 *
 * // Sign out:
 * authClient.signOut();
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
});
