"use client";

import { cn } from "@/lib/utils";

const CHECKOUT_URL = process.env.NEXT_PUBLIC_LEMONSQUEEZY_CHECKOUT_URL ?? "#";

/**
 * Lemon Squeezy checkout button.
 * Renders an anchor with the `lemonsqueezy-button` class so the
 * Lemon Squeezy embed script automatically intercepts clicks and
 * opens the overlay checkout modal.
 *
 * Requires `NEXT_PUBLIC_LEMONSQUEEZY_CHECKOUT_URL` env var in production.
 * Falls back to `#` in development when unset.
 *
 * @param className - Additional Tailwind classes to merge
 * @param children - Button label (defaults to "Buy Now — $500")
 *
 * @example
 * <CheckoutButton />
 * // => gold CTA that opens Lemon Squeezy overlay
 *
 * @example
 * <CheckoutButton className="w-full">Get Lifetime Access</CheckoutButton>
 */
export function CheckoutButton({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <a
      href={CHECKOUT_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "lemonsqueezy-button inline-flex h-14 items-center justify-center rounded-lg bg-accent px-10 text-base font-semibold text-background transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        className,
      )}
    >
      {children ?? "Buy Now \u2014 $500"}
    </a>
  );
}
