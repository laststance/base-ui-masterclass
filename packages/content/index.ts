/**
 * Content package public API.
 * Provides typed access to modules, lessons, and exercises.
 *
 * @example
 * import { modules, getAllModules, getLesson, getExercise } from "@base-ui-masterclass/content";
 * const mods = getAllModules("en");
 * const lesson = getLesson("00-foundation", "01-introduction", "en");
 * const exercise = getExercise("button-basic");
 */
export { modules, locales, defaultLocale } from "./config";
export type { ModuleConfig, Locale } from "./config";
export {
  getAllModules,
  getLessonsForModule,
  getLesson,
  getAllLessonSlugs,
} from "./src/api";
export type {
  LessonFrontmatter,
  LessonMeta,
  LessonData,
  ModuleWithLessons,
} from "./src/api";
export {
  getExercise,
  getAllExerciseIds,
  getExercisesForModule,
} from "./src/exercises";
export type {
  ExerciseMeta,
  ExerciseFiles,
  ExerciseData,
} from "./src/exercises";
