import Link from "next/link";
import { getLocale } from "next-intl/server";
import { getAllModules, type Locale } from "@base-ui-masterclass/content";

/**
 * Modules index page — lists all 13 course modules.
 * Shows module number, title, component count, and lesson count.
 *
 * @example
 * // /modules → English module list
 * // /ja/modules → Japanese module list
 */
export default async function ModulesPage() {
  const locale = (await getLocale()) as Locale;
  const modulesWithLessons = getAllModules(locale);

  return (
    <main className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <div className="mb-2 text-sm font-mono text-accent uppercase tracking-wider">
          Curriculum
        </div>
        <h1 className="text-4xl font-display font-800 mb-3 tracking-tight">
          {locale === "ja" ? "全モジュール" : "All Modules"}
        </h1>
        <p className="text-lg text-text-secondary mb-12 leading-relaxed">
          {locale === "ja"
            ? "13モジュール、45レッスン、35コンポーネントをゼロから構築"
            : "13 modules, 45 lessons, 35 components built from scratch"}
        </p>

        <div className="space-y-3">
          {modulesWithLessons.map((mod) => (
            <Link
              key={mod.slug}
              href={`/modules/${mod.slug}`}
              className="group flex items-center gap-4 rounded-lg border border-border bg-surface p-5 transition-colors hover:bg-surface-elevated hover:border-text-muted"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-elevated text-sm font-mono text-text-muted group-hover:text-accent group-hover:bg-accent/10 transition-colors">
                {String(mod.order).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="font-display font-700 text-text-primary group-hover:text-accent transition-colors">
                  {mod.title[locale]}
                </h2>
                <p className="text-sm text-text-muted truncate">
                  {mod.description[locale]}
                </p>
              </div>
              <div className="hidden sm:flex shrink-0 items-center gap-3 text-xs font-mono text-text-muted">
                {mod.lessons.length > 0 && (
                  <span>{mod.lessons.length} lessons</span>
                )}
                {mod.components.length > 0 && (
                  <span className="text-border">|</span>
                )}
                {mod.components.length > 0 && (
                  <span>{mod.components.length} components</span>
                )}
              </div>
              {mod.isFree && (
                <span className="shrink-0 rounded-full bg-success/10 border border-success/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-success">
                  Free
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
