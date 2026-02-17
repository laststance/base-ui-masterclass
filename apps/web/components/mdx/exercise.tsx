import type { ReactNode } from "react";

interface ExerciseProps {
  id: string;
  title: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
  children?: ReactNode;
}

const difficultyColors = {
  beginner: "bg-success/10 text-success border-success/30",
  intermediate: "bg-warning/10 text-warning border-warning/30",
  advanced: "bg-error/10 text-error border-error/30",
};

/**
 * Exercise placeholder component for MDX content.
 * Renders an exercise card that will be wired to Sandpack in Phase 4.
 *
 * @param id - Unique exercise identifier (e.g. "button-basic")
 * @param title - Display title for the exercise
 * @param difficulty - Difficulty level badge
 * @param children - Optional description/instructions
 *
 * @example
 * <Exercise id="button-basic" title="Build a Button" difficulty="beginner">
 *   Create a polymorphic Button component with `render` prop support.
 * </Exercise>
 */
export function Exercise({
  id,
  title,
  difficulty = "beginner",
  children,
}: ExerciseProps) {
  return (
    <div
      className="my-8 rounded-lg border border-accent/30 bg-accent/5 p-6"
      data-exercise-id={id}
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent/15">
          <svg
            className="h-4 w-4 text-accent"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div>
          <h3 className="font-display font-700 text-text-primary">{title}</h3>
          <span
            className={`mt-1 inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${difficultyColors[difficulty]}`}
          >
            {difficulty}
          </span>
        </div>
      </div>
      {children && (
        <div className="text-sm text-text-secondary leading-relaxed">
          {children}
        </div>
      )}
      <div className="mt-4 rounded-md border border-border bg-surface p-8 text-center text-text-muted text-sm">
        Sandpack exercise environment will load here.
      </div>
    </div>
  );
}
