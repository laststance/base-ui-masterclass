/**
 * Skeleton loading state for the lesson page.
 * Shows placeholder breadcrumb, title, and content blocks during navigation.
 *
 * @example
 * // Automatically rendered by Next.js during page transition to a lesson
 */
export default function LessonLoading() {
  return (
    <main className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-3xl">
        {/* Breadcrumb skeleton */}
        <div className="mb-8 flex items-center gap-2">
          <div className="h-4 w-32 animate-pulse rounded bg-surface-elevated" />
          <div className="h-4 w-4 animate-pulse rounded bg-surface-elevated" />
          <div className="h-4 w-24 animate-pulse rounded bg-surface-elevated" />
        </div>

        {/* Title skeleton */}
        <div className="mb-4 h-10 w-3/4 animate-pulse rounded bg-surface-elevated" />
        <div className="mb-8 h-5 w-1/2 animate-pulse rounded bg-surface-elevated" />

        {/* Content skeleton — paragraphs */}
        <div className="space-y-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-full animate-pulse rounded bg-surface-elevated" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-surface-elevated" />
              <div className="h-4 w-4/6 animate-pulse rounded bg-surface-elevated" />
            </div>
          ))}

          {/* Code block skeleton */}
          <div className="h-48 w-full animate-pulse rounded-lg bg-surface-elevated" />

          {/* More paragraphs */}
          {Array.from({ length: 2 }, (_, i) => (
            <div key={`p2-${i}`} className="space-y-2">
              <div className="h-4 w-full animate-pulse rounded bg-surface-elevated" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-surface-elevated" />
            </div>
          ))}
        </div>

        {/* Navigation skeleton */}
        <div className="mt-12 flex justify-between border-t border-border pt-6">
          <div className="h-10 w-32 animate-pulse rounded bg-surface-elevated" />
          <div className="h-10 w-32 animate-pulse rounded bg-surface-elevated" />
        </div>
      </div>
    </main>
  );
}
