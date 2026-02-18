import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { modules, type Locale, type ModuleConfig } from "../config";

/**
 * Resolves the modules directory path.
 * Prefers CONTENT_MODULES_DIR env override for non-standard working directories.
 * Falls back to process.cwd()-based resolution (assumes cwd is apps/web).
 * Uses process.cwd() instead of __dirname because Next.js transpilePackages
 * changes __dirname to the compiled output path inside .next/server/.
 *
 * @returns Absolute path to packages/content/modules
 */
const MODULES_DIR =
  process.env.CONTENT_MODULES_DIR ||
  path.join(process.cwd(), "..", "..", "packages", "content", "modules");

if (!fs.existsSync(MODULES_DIR)) {
  throw new Error(
    `[packages/content] MODULES_DIR not found: "${MODULES_DIR}". ` +
      `Ensure the process is started from apps/web or set CONTENT_MODULES_DIR.`,
  );
}

export interface LessonFrontmatter {
  title: string;
  description: string;
  order: number;
  isFree: boolean;
}

export interface LessonMeta extends LessonFrontmatter {
  slug: string;
  moduleSlug: string;
}

export interface LessonData extends LessonMeta {
  content: string;
}

export interface ModuleWithLessons extends ModuleConfig {
  lessons: LessonMeta[];
}

/**
 * Returns all modules with their lesson metadata for a given locale.
 * Reads frontmatter from MDX files without loading full content.
 *
 * @param locale - Target locale ("en" | "ja")
 * @returns Array of modules with nested lesson metadata
 *
 * @example
 * const mods = getAllModules("en");
 * mods[0].lessons[0].title; // "What is a Headless UI Library?"
 */
export function getAllModules(locale: Locale): ModuleWithLessons[] {
  return modules.map((mod) => ({
    ...mod,
    lessons: getLessonsForModule(mod.slug, locale),
  }));
}

/**
 * Returns lesson metadata for a single module.
 *
 * @param moduleSlug - Module directory name (e.g. "00-foundation")
 * @param locale - Target locale
 * @returns Sorted array of lesson metadata
 *
 * @example
 * getLessonsForModule("00-foundation", "en");
 * // => [{ slug: "01-introduction", title: "What is a Headless UI Library?", ... }]
 */
export function getLessonsForModule(
  moduleSlug: string,
  locale: Locale,
): LessonMeta[] {
  const moduleDir = path.join(MODULES_DIR, locale, moduleSlug);

  if (!fs.existsSync(moduleDir)) {
    return [];
  }

  const files = fs
    .readdirSync(moduleDir)
    .filter((f) => f.endsWith(".mdx"));

  return files
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const filePath = path.join(moduleDir, file);
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(raw);
      const fm = data as LessonFrontmatter;

      return {
        slug,
        moduleSlug,
        title: fm.title,
        description: fm.description,
        order: fm.order,
        isFree: fm.isFree ?? false,
      };
    })
    .sort((a, b) => a.order - b.order);
}

/**
 * Returns full lesson data including raw MDX content.
 *
 * @param moduleSlug - Module directory name
 * @param lessonSlug - Lesson file name without extension
 * @param locale - Target locale
 * @returns Lesson data with content, or null if not found
 *
 * @example
 * const lesson = getLesson("00-foundation", "01-introduction", "en");
 * lesson?.content; // Raw MDX string
 */
export function getLesson(
  moduleSlug: string,
  lessonSlug: string,
  locale: Locale,
): LessonData | null {
  const filePath = path.join(
    MODULES_DIR,
    locale,
    moduleSlug,
    `${lessonSlug}.mdx`,
  );

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const fm = data as LessonFrontmatter;

  return {
    slug: lessonSlug,
    moduleSlug,
    title: fm.title,
    description: fm.description,
    order: fm.order,
    isFree: fm.isFree ?? false,
    content,
  };
}

/**
 * Returns all lesson slugs for static generation.
 * Used by Next.js generateStaticParams.
 *
 * @param locale - Target locale
 * @returns Array of { moduleSlug, lessonSlug } pairs
 *
 * @example
 * getAllLessonSlugs("en");
 * // => [{ moduleSlug: "00-foundation", lessonSlug: "01-introduction" }]
 */
export function getAllLessonSlugs(
  locale: Locale,
): { moduleSlug: string; lessonSlug: string }[] {
  const result: { moduleSlug: string; lessonSlug: string }[] = [];

  for (const mod of modules) {
    const moduleDir = path.join(MODULES_DIR, locale, mod.slug);
    if (!fs.existsSync(moduleDir)) continue;

    const files = fs
      .readdirSync(moduleDir)
      .filter((f) => f.endsWith(".mdx"));

    for (const file of files) {
      result.push({
        moduleSlug: mod.slug,
        lessonSlug: file.replace(/\.mdx$/, ""),
      });
    }
  }

  return result;
}
