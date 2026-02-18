"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

/**
 * Authenticated user menu showing avatar initial and sign-out button.
 * Uses BetterAuth client for sign-out.
 *
 * @param userName - Display name of the signed-in user
 * @param userImage - Optional avatar URL
 *
 * @example
 * <UserMenu userName="Alice" />
 */
export function UserMenu({
  userName,
  userImage,
}: {
  userName: string;
  userImage?: string | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const initial = userName.charAt(0).toUpperCase();

  const handleSignOut = () => {
    startTransition(async () => {
      await authClient.signOut();
      router.refresh();
    });
  };

  return (
    <div className="flex items-center gap-3">
      {userImage ? (
        <img
          src={userImage}
          alt={userName}
          className="h-8 w-8 rounded-full border border-border"
        />
      ) : (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-xs font-semibold text-accent">
          {initial}
        </div>
      )}
      <button
        type="button"
        onClick={handleSignOut}
        disabled={isPending}
        className="inline-flex items-center min-h-[44px] text-xs font-mono text-text-muted hover:text-text-primary transition-colors disabled:opacity-50"
      >
        {isPending ? "..." : "Sign Out"}
      </button>
    </div>
  );
}
