import { getLocale, getTranslations } from "next-intl/server";
import { getExercise, type Locale } from "@base-ui-masterclass/content";
import { ExerciseSandpack } from "./exercise-sandpack";
import { isExerciseCompleted } from "@/lib/actions/progress";

interface ExerciseProviderProps {
  exerciseId: string;
}

/**
 * Server component that loads exercise data and renders the Sandpack environment.
 * Fetches initial code, solution, tests, and hints from the content package,
 * then passes them to the ExerciseSandpack client component.
 * Also queries whether the current user has already completed this exercise.
 *
 * @param exerciseId - Exercise directory name (e.g. "button-basic")
 *
 * @example
 * // In a lesson MDX or page:
 * <ExerciseProvider exerciseId="button-basic" />
 */
export async function ExerciseProvider({ exerciseId }: ExerciseProviderProps) {
  const locale = (await getLocale()) as Locale;
  const exercise = getExercise(exerciseId);

  if (!exercise) {
    const t = await getTranslations("exercise");
    return (
      <div className="my-8 rounded-lg border border-error/30 bg-error/5 p-6 text-center">
        <p className="text-sm text-error">
          {t("notFound", { id: exerciseId })}
        </p>
      </div>
    );
  }

  const completed = await isExerciseCompleted(exercise.meta.id).catch(() => false);

  return (
    <ExerciseSandpack
      exerciseId={exercise.meta.id}
      initialCode={exercise.files.initial}
      solutionCode={exercise.files.solution}
      testCode={exercise.files.tests}
      hints={exercise.meta.hints[locale] ?? exercise.meta.hints.en}
      dependencies={exercise.meta.dependencies}
      initialCompleted={completed}
    />
  );
}
