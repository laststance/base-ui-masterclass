/**
 * Minimal root layout — delegates to [locale]/layout.tsx.
 * This is required by Next.js as the top-level layout,
 * but locale-specific rendering happens in the [locale] segment.
 *
 * @example
 * // Next.js requires this file at app/layout.tsx
 * // All visual layout is handled by app/[locale]/layout.tsx
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
