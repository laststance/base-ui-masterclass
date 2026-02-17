"use client";

import Script from "next/script";

/**
 * Loads the Lemon Squeezy embed script for overlay checkout.
 * Uses `lazyOnload` strategy so it never blocks page rendering.
 * Include this once per page that contains a checkout button.
 *
 * @example
 * // In a layout or page:
 * <LemonSqueezyLoader />
 */
export function LemonSqueezyLoader() {
  return (
    <Script
      src="https://assets.lemonsqueezy.com/lemon.js"
      strategy="lazyOnload"
    />
  );
}
