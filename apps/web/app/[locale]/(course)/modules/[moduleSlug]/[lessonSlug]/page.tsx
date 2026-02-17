import { notFound } from "next/navigation";
import Link from "next/link";
import { getLocale } from "next-intl/server";
import {
  modules,
  getLesson,
  getLessonsForModule,
  type Locale,
} from "@base-ui-masterclass/content";
import { compileLessonMDX } from "@/lib/mdx";
import { getSessionWithPurchase } from "@/lib/auth";
import { PaywallGuard } from "@/components/course/paywall-guard";

/**
 * Lesson page — renders MDX content with syntax highlighting.
 * Applies paywall guard for premium lessons.
 * Shows prev/next navigation based on lesson order.
 *
 * @param params - Contains moduleSlug and lessonSlug from URL
 *
 * @example
 * // /modules/00-foundation/01-introduction → renders the intro lesson
 * // /ja/modules/01-primitives/01-button → Japanese Button lesson
 */
export default async function LessonPage({
  params,
}: {
  params: Promise<{ moduleSlug: string; lessonSlug: string }>;
}) {
  const { moduleSlug, lessonSlug } = await params;
  const locale = (await getLocale()) as Locale;

  const moduleConfig = modules.find((m) => m.slug === moduleSlug);
  if (!moduleConfig) {
    notFound();
  }

  const lesson = getLesson(moduleSlug, lessonSlug, locale);
  if (!lesson) {
    notFound();
  }

  // Determine prev/next lessons
  const allLessons = getLessonsForModule(moduleSlug, locale);
  const currentIndex = allLessons.findIndex((l) => l.slug === lessonSlug);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  // Compile MDX
  const { content } = await compileLessonMDX(lesson.content);

  // Free lessons render without paywall
  if (lesson.isFree) {
    return (
      <LessonShell
        moduleConfig={moduleConfig}
        lesson={lesson}
        locale={locale}
        prevLesson={prevLesson}
        nextLesson={nextLesson}
        currentIndex={currentIndex}
        totalLessons={allLessons.length}
      >
        {content}
      </LessonShell>
    );
  }

  // Premium lessons require auth + purchase
  const session = await getSessionWithPurchase();

  return (
    <PaywallGuard session={session}>
      <LessonShell
        moduleConfig={moduleConfig}
        lesson={lesson}
        locale={locale}
        prevLesson={prevLesson}
        nextLesson={nextLesson}
        currentIndex={currentIndex}
        totalLessons={allLessons.length}
      >
        {content}
      </LessonShell>
    </PaywallGuard>
  );
}

function LessonShell({
  moduleConfig,
  lesson,
  locale,
  prevLesson,
  nextLesson,
  currentIndex,
  totalLessons,
  children,
}: {
  moduleConfig: { slug: string; title: { en: string; ja: string }; order: number };
  lesson: { title: string; slug: string; moduleSlug: string };
  locale: Locale;
  prevLesson: { slug: string; title: string } | null;
  nextLesson: { slug: string; title: string } | null;
  currentIndex: number;
  totalLessons: number;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen px-6 py-16">
      <article className="mx-auto max-w-3xl">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-text-muted">
          <Link
            href={`/modules/${moduleConfig.slug}`}
            className="hover:text-text-secondary transition-colors"
          >
            Module {moduleConfig.order}: {moduleConfig.title[locale]}
          </Link>
          <span>/</span>
          <span className="text-text-secondary">
            Lesson {currentIndex + 1} of {totalLessons}
          </span>
        </nav>

        {/* Content */}
        <div className="prose-custom">{children}</div>

        {/* Prev/Next navigation */}
        <nav className="mt-16 flex items-stretch gap-4">
          {prevLesson ? (
            <Link
              href={`/modules/${lesson.moduleSlug}/${prevLesson.slug}`}
              className="flex-1 rounded-lg border border-border bg-surface p-4 transition-colors hover:bg-surface-elevated hover:border-text-muted group"
            >
              <span className="text-xs text-text-muted mb-1 block">
                Previous
              </span>
              <span className="font-display font-600 text-text-primary group-hover:text-accent transition-colors">
                {prevLesson.title}
              </span>
            </Link>
          ) : (
            <div className="flex-1" />
          )}

          {nextLesson ? (
            <Link
              href={`/modules/${lesson.moduleSlug}/${nextLesson.slug}`}
              className="flex-1 rounded-lg border border-border bg-surface p-4 text-right transition-colors hover:bg-surface-elevated hover:border-text-muted group"
            >
              <span className="text-xs text-text-muted mb-1 block">Next</span>
              <span className="font-display font-600 text-text-primary group-hover:text-accent transition-colors">
                {nextLesson.title}
              </span>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
        </nav>
      </article>
    </main>
  );
}
