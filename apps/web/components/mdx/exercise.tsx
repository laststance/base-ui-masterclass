import { ExerciseProvider } from "@/components/exercise/exercise-provider";

interface ExerciseProps {
  id: string;
}

/**
 * Exercise component for MDX content.
 * Renders a full Sandpack exercise environment within lessons.
 * Delegates to ExerciseProvider which loads exercise data from content package.
 *
 * @param id - Unique exercise identifier (e.g. "button-basic")
 *
 * @example
 * // In MDX:
 * <Exercise id="button-basic" />
 */
export function Exercise({ id }: ExerciseProps) {
  return <ExerciseProvider exerciseId={id} />;
}
