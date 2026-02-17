import { LemonSqueezyLoader } from "@/components/marketing/lemon-squeezy-loader";

/**
 * Marketing route-group layout.
 * Includes the Lemon Squeezy embed script so overlay checkout
 * is available on all marketing pages (pricing, landing, etc.).
 *
 * @param children - Marketing page content
 *
 * @example
 * // Any page under app/[locale]/(marketing)/ automatically
 * // gets the Lemon Squeezy script loaded.
 */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <LemonSqueezyLoader />
    </>
  );
}
