import type { Session } from "next-auth";
import Link from "next/link";

interface PaywallGuardProps {
  session: Session | null;
  children: React.ReactNode;
}

/**
 * Server component that gates content behind purchase verification.
 * Shows a paywall UI for unauthenticated or non-purchased users.
 * Renders children for users with active purchases.
 *
 * @param session - Auth.js session (null if unauthenticated)
 * @param children - Protected content to render for purchasers
 *
 * @example
 * const session = await auth();
 * <PaywallGuard session={session}>
 *   <LessonContent />
 * </PaywallGuard>
 */
export function PaywallGuard({ session, children }: PaywallGuardProps) {
  // User has active purchase — render content
  if (session?.hasPurchased) {
    return <>{children}</>;
  }

  // Not authenticated
  if (!session) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <div className="max-w-md">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-surface-elevated border border-border">
            <svg
              className="h-8 w-8 text-accent"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="mb-3 text-2xl font-display font-700 text-text-primary">
            Sign in to access this lesson
          </h2>
          <p className="mb-8 text-text-secondary leading-relaxed">
            This is a premium lesson. Sign in with your account and verify your
            license to continue.
          </p>
          <Link
            href="/login"
            className="inline-flex h-12 items-center rounded-lg bg-accent px-8 text-sm font-semibold text-background transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  // Authenticated but no purchase
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <div className="max-w-md">
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-accent-muted">
          <svg
            className="h-8 w-8 text-accent"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
            />
          </svg>
        </div>
        <h2 className="mb-3 text-2xl font-display font-700 text-text-primary">
          Purchase Required
        </h2>
        <p className="mb-4 text-text-secondary leading-relaxed">
          Get lifetime access to all 35 components, 45 lessons, and the
          Discord community.
        </p>
        <p className="mb-8 text-3xl font-display font-800 text-accent">$500</p>
        <div className="flex flex-col gap-3">
          <a
            href="#pricing"
            className="inline-flex h-12 items-center justify-center rounded-lg bg-accent px-8 text-sm font-semibold text-background transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Buy Now
          </a>
          <Link
            href="/license"
            className="text-sm text-text-muted hover:text-text-secondary transition-colors"
          >
            Already purchased? Enter your license key
          </Link>
        </div>
      </div>
    </div>
  );
}
