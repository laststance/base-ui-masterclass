import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { getSession } from "@/lib/auth";
import { getUserProgress } from "@/lib/actions/progress";
import {
  modules,
  getExercisesForModule,
  getLessonsForModule,
  type Locale,
} from "@base-ui-masterclass/content";

export const metadata: Metadata = {
  title: "Dashboard — Base UI Masterclass",
  description: "Track your course progress across all modules and exercises.",
};

/**
 * Student dashboard showing overall course progress.
 * Displays per-module completion stats and overall percentage.
 * Requires authentication — redirects to /login if not signed in.
 *
 * @example
 * // /dashboard → shows progress for the authenticated user
 */
export default async function DashboardPage() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login");
  }

  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("dashboard");
  const progress = await getUserProgress();
  const completedIds = new Set(progress.map((p) => p.exerciseId));

  // Calculate per-module progress
  const moduleProgress = modules.map((mod) => {
    const exercises = getExercisesForModule(mod.slug);
    const lessons = getLessonsForModule(mod.slug, locale);
    const total = exercises.length;
    const completed = exercises.filter((e) => completedIds.has(e.id)).length;
    return {
      ...mod,
      total,
      completed,
      lessonCount: lessons.length,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  });

  const totalExercises = moduleProgress.reduce((sum, m) => sum + m.total, 0);
  const totalCompleted = moduleProgress.reduce(
    (sum, m) => sum + m.completed,
    0,
  );
  const overallPercentage =
    totalExercises > 0
      ? Math.round((totalCompleted / totalExercises) * 100)
      : 0;

  return (
    <main className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-display font-800 mb-2 tracking-tight">
          {locale === "ja" ? "ダッシュボード" : "Dashboard"}
        </h1>
        <p className="text-text-secondary mb-10">
          {locale === "ja"
            ? `ようこそ、${session.user.name ?? ""}さん`
            : `Welcome back, ${session.user.name ?? ""}`}
        </p>

        {/* Overall progress */}
        <div className="mb-10 rounded-lg border border-border bg-surface p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display font-700 text-lg">
                {locale === "ja" ? "全体の進捗" : "Overall Progress"}
              </h2>
              <p className="text-sm text-text-muted">
                {totalCompleted} / {totalExercises}{" "}
                {locale === "ja" ? "エクササイズ完了" : "exercises completed"}
              </p>
            </div>
            <span className="text-3xl font-display font-800 text-accent">
              {overallPercentage}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-surface-elevated overflow-hidden">
            <div
              className="h-full rounded-full bg-accent transition-all duration-500"
              style={{ width: `${overallPercentage}%` }}
            />
          </div>
        </div>

        {/* Per-module progress */}
        <div className="space-y-3">
          {moduleProgress.map((mod) => (
            <Link
              key={mod.slug}
              href={`/modules/${mod.slug}`}
              className="group flex items-center gap-4 rounded-lg border border-border bg-surface p-4 transition-colors hover:bg-surface-elevated hover:border-text-muted"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-elevated text-sm font-mono text-text-muted">
                {String(mod.order).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-display font-600 text-text-primary group-hover:text-accent transition-colors truncate">
                    {mod.title[locale]}
                  </h3>
                  {mod.total > 0 && mod.completed === mod.total && (
                    <svg
                      className="h-4 w-4 text-success shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                {mod.total > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 rounded-full bg-surface-elevated overflow-hidden">
                      <div
                        className="h-full rounded-full bg-accent/70 transition-all duration-500"
                        style={{ width: `${mod.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-text-muted shrink-0">
                      {mod.completed}/{mod.total}
                    </span>
                  </div>
                )}
                {mod.total === 0 && (
                  <p className="text-xs text-text-muted">
                    {mod.lessonCount > 0
                      ? t("lessonsNoExercises", { count: mod.lessonCount })
                      : t("comingSoon")}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
