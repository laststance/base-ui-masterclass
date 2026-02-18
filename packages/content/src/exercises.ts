import fs from "node:fs";
import path from "node:path";
import type { Locale } from "../config";

const EXERCISES_DIR =
  process.env.CONTENT_EXERCISES_DIR ||
  path.join(process.cwd(), "..", "..", "packages", "content", "exercises");

export interface ExerciseMeta {
  id: string;
  title: { en: string; ja: string };
  difficulty: "beginner" | "intermediate" | "advanced";
  module: string;
  order: number;
  hints: { en: string[]; ja: string[] };
  dependencies: Record<string, string>;
}

export interface ExerciseFiles {
  initial: string;
  solution: string;
  tests: string;
}

export interface ExerciseData {
  meta: ExerciseMeta;
  files: ExerciseFiles;
}

/**
 * Returns exercise metadata and file contents.
 *
 * @param exerciseId - Exercise directory name (e.g. "button-basic")
 * @returns Exercise data with meta and files, or null if not found
 *
 * @example
 * const exercise = getExercise("button-basic");
 * exercise?.files.initial; // Student starting code
 * exercise?.meta.hints.en[0]; // First hint in English
 */
export function getExercise(exerciseId: string): ExerciseData | null {
  const exerciseDir = path.join(EXERCISES_DIR, exerciseId);

  if (!fs.existsSync(exerciseDir)) {
    return null;
  }

  const metaPath = path.join(exerciseDir, "meta.json");
  if (!fs.existsSync(metaPath)) {
    return null;
  }

  const meta = JSON.parse(
    fs.readFileSync(metaPath, "utf-8"),
  ) as ExerciseMeta;

  const readFile = (name: string): string => {
    const filePath = path.join(exerciseDir, name);
    return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf-8") : "";
  };

  return {
    meta,
    files: {
      initial: readFile("initial.tsx"),
      solution: readFile("solution.tsx"),
      tests: readFile("tests.tsx"),
    },
  };
}

/**
 * Returns all exercise IDs sorted by module and order.
 *
 * @returns Array of exercise IDs
 *
 * @example
 * getAllExerciseIds(); // ["button-basic", "input-basic", ...]
 */
export function getAllExerciseIds(): string[] {
  if (!fs.existsSync(EXERCISES_DIR)) {
    return [];
  }

  const dirs = fs.readdirSync(EXERCISES_DIR).filter((d) => {
    const metaPath = path.join(EXERCISES_DIR, d, "meta.json");
    return fs.existsSync(metaPath);
  });

  // Sort by module order then exercise order
  return dirs.sort((a, b) => {
    const metaA = JSON.parse(
      fs.readFileSync(path.join(EXERCISES_DIR, a, "meta.json"), "utf-8"),
    ) as ExerciseMeta;
    const metaB = JSON.parse(
      fs.readFileSync(path.join(EXERCISES_DIR, b, "meta.json"), "utf-8"),
    ) as ExerciseMeta;
    if (metaA.module !== metaB.module) {
      return metaA.module.localeCompare(metaB.module);
    }
    return metaA.order - metaB.order;
  });
}

/**
 * Returns exercises for a given module.
 *
 * @param moduleSlug - Module slug (e.g. "01-primitives")
 * @returns Array of exercise metadata
 *
 * @example
 * getExercisesForModule("01-primitives");
 * // => [{ id: "button-basic", title: { en: "Build a Headless Button", ... }, ... }]
 */
export function getExercisesForModule(moduleSlug: string): ExerciseMeta[] {
  const ids = getAllExerciseIds();

  return ids
    .map((id) => {
      const metaPath = path.join(EXERCISES_DIR, id, "meta.json");
      return JSON.parse(fs.readFileSync(metaPath, "utf-8")) as ExerciseMeta;
    })
    .filter((meta) => meta.module === moduleSlug)
    .sort((a, b) => a.order - b.order);
}
