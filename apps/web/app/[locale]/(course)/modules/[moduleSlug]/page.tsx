import { notFound } from "next/navigation";
import Link from "next/link";
import { getLocale } from "next-intl/server";
import {
  modules,
  getLessonsForModule,
  type Locale,
} from "@base-ui-masterclass/content";

/**
 * Module overview page listing all lessons within a module.
 * Shows lesson titles, descriptions, and free/premium badges.
 *
 * @param params - Contains moduleSlug from URL
 *
 * @example
 * // /modules/00-foundation → lists all foundation lessons
 * // /ja/modules/01-primitives → Japanese version
 */
export default async function ModulePage({
  params,
}: {
  params: Promise<{ moduleSlug: string }>;
}) {
  const { moduleSlug } = await params;
  const locale = (await getLocale()) as Locale;

  const moduleConfig = modules.find((m) => m.slug === moduleSlug);
  if (!moduleConfig) {
    notFound();
  }

  const lessons = getLessonsForModule(moduleSlug, locale);

  return (
    <main className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/modules"
          className="mb-8 inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-secondary transition-colors"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          All Modules
        </Link>

        <div className="mb-2 text-sm font-mono text-accent uppercase tracking-wider">
          Module {moduleConfig.order}
        </div>
        <h1 className="text-4xl font-display font-800 mb-3 tracking-tight">
          {moduleConfig.title[locale]}
        </h1>
        <p className="text-lg text-text-secondary mb-10 leading-relaxed">
          {moduleConfig.description[locale]}
        </p>

        {moduleConfig.components.length > 0 && (
          <div className="mb-10 flex flex-wrap gap-2">
            {moduleConfig.components.map((comp) => (
              <span
                key={comp}
                className="inline-flex items-center rounded-md border border-border bg-surface px-3 py-1 text-xs font-mono text-text-muted"
              >
                {comp}
              </span>
            ))}
          </div>
        )}

        <div className="space-y-3">
          {lessons.map((lesson, index) => (
            <Link
              key={lesson.slug}
              href={`/modules/${moduleSlug}/${lesson.slug}`}
              className="group flex items-center gap-4 rounded-lg border border-border bg-surface p-4 transition-colors hover:bg-surface-elevated hover:border-text-muted"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-surface-elevated text-sm font-mono text-text-muted group-hover:text-accent transition-colors">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="font-display font-600 text-text-primary group-hover:text-accent transition-colors truncate">
                  {lesson.title}
                </h2>
                <p className="text-sm text-text-muted truncate">
                  {lesson.description}
                </p>
              </div>
              {lesson.isFree ? (
                <span className="shrink-0 rounded-full bg-success/10 border border-success/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-success">
                  Free
                </span>
              ) : (
                <span className="shrink-0 rounded-full bg-accent/10 border border-accent/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
                  Premium
                </span>
              )}
            </Link>
          ))}
        </div>

        {lessons.length === 0 && (
          <div className="rounded-lg border border-border bg-surface p-12 text-center">
            <p className="text-text-muted">
              Lessons for this module are coming soon.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
