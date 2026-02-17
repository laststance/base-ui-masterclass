/**
 * Landing page for Base UI Masterclass.
 * Placeholder for the full marketing page (Phase 8).
 *
 * @example
 * // Visit http://localhost:3000 to see this page
 */
export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        <p className="mb-4 text-sm font-mono tracking-widest uppercase text-text-secondary">
          Premium Tutorial — $500
        </p>
        <h1 className="text-5xl md:text-7xl font-display font-800 leading-[0.95] tracking-tight mb-6">
          Build{" "}
          <span className="text-accent">Base UI</span>
          <br />
          from Scratch
        </h1>
        <p className="text-lg text-text-secondary leading-relaxed mb-10 max-w-lg mx-auto">
          Master headless React components by rebuilding all 35 Base UI
          components. Compound patterns, accessibility, TypeScript — the
          complete package.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="#curriculum"
            className="inline-flex h-12 items-center rounded-lg bg-accent px-8 text-sm font-semibold text-background transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            View Curriculum
          </a>
          <a
            href="/en/modules/00-foundation/01-introduction"
            className="inline-flex h-12 items-center rounded-lg border border-border px-8 text-sm font-semibold text-text-primary transition-colors hover:bg-surface hover:border-text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Free Preview
          </a>
        </div>
        <div className="mt-16 flex items-center justify-center gap-8 text-text-muted text-sm font-mono">
          <span>35 Components</span>
          <span className="text-border">|</span>
          <span>45 Lessons</span>
          <span className="text-border">|</span>
          <span>EN + JA</span>
        </div>
      </div>
    </main>
  );
}
