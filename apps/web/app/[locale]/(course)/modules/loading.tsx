/**
 * Skeleton loading state for the modules list page.
 * Shows placeholder cards matching the actual layout during navigation.
 *
 * @returns Animated skeleton placeholders for the modules list
 *
 * @example
 * // Automatically rendered by Next.js during page transition to /modules
 */
export default function ModulesLoading() {
  return (
    <main className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-3xl">
        {/* Header skeleton */}
        <div className="mb-2 h-4 w-24 animate-pulse rounded bg-surface-elevated" />
        <div className="mb-3 h-10 w-64 animate-pulse rounded bg-surface-elevated" />
        <div className="mb-12 h-6 w-96 animate-pulse rounded bg-surface-elevated" />

        {/* Module card skeletons */}
        <div className="space-y-4">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="rounded-lg border border-border bg-surface p-6"
            >
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 animate-pulse rounded-lg bg-surface-elevated" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-48 animate-pulse rounded bg-surface-elevated" />
                  <div className="h-4 w-full animate-pulse rounded bg-surface-elevated" />
                  <div className="flex gap-4 pt-1">
                    <div className="h-4 w-20 animate-pulse rounded bg-surface-elevated" />
                    <div className="h-4 w-24 animate-pulse rounded bg-surface-elevated" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
