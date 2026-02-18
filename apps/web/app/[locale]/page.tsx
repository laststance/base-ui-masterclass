import Link from "next/link";
import { getLocale } from "next-intl/server";
import { modules, type Locale } from "@base-ui-masterclass/content";
import { ExternalLink } from "@/components/ui/external-link";

/**
 * Premium landing page for the Base UI Masterclass course ($500).
 * Server Component — no client-side JavaScript. CSS-only animations.
 * Supports EN + JA via next-intl locale detection.
 *
 * @example
 * // Visit http://localhost:3000 to see the full marketing page
 * // Visit http://localhost:3000/ja for the Japanese version
 */
export default async function HomePage() {
  const locale = (await getLocale()) as Locale;
  const isJa = locale === "ja";

  /** Total component count derived from config */
  const totalComponents = modules.reduce(
    (sum, mod) => sum + mod.components.length,
    0,
  );

  /** Component category cards for the "What You'll Build" grid */
  const categories = [
    {
      icon: "\u25A1",
      title: isJa ? "オーバーレイ" : "Overlays",
      items: ["Dialog", "Popover", "Tooltip", "Drawer"],
    },
    {
      icon: "\u2263",
      title: isJa ? "フォーム" : "Forms",
      items: ["Field", "Checkbox", "Radio", "Switch"],
    },
    {
      icon: "\u2192",
      title: isJa ? "ナビゲーション" : "Navigation",
      items: ["Tabs", "Toolbar", "NavigationMenu"],
    },
    {
      icon: "\u25C7",
      title: isJa ? "セレクション" : "Selection",
      items: ["Select", "Combobox", "Autocomplete"],
    },
    {
      icon: "\u2630",
      title: isJa ? "メニュー" : "Menus",
      items: ["Menu", "ContextMenu", "Menubar"],
    },
    {
      icon: "\u2261",
      title: isJa ? "アドバンスド" : "Advanced",
      items: ["Slider", "ScrollArea", "Toast", "NumberField"],
    },
  ];

  /** Checklist items for "What's Included" section */
  const included = isJa
    ? [
        "全13モジュール・45以上のレッスン",
        "35個のハンズオン演習",
        "Discordコミュニティへのアクセス",
        "ライフタイムアップデート",
        "英語 + 日本語対応",
        "修了証明書",
      ]
    : [
        "All 13 modules with 45+ lessons",
        "35 hands-on coding exercises",
        "Private Discord community access",
        "Lifetime updates — every new component added",
        "Full course in English + Japanese",
        "Certificate of completion",
      ];

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/*  CSS-only keyframe animations (inline style tag for Server Component) */}
      {/* ------------------------------------------------------------------ */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes hero-gradient {
              0%, 100% {
                background-position: 0% 50%;
              }
              50% {
                background-position: 100% 50%;
              }
            }
            @keyframes fade-in-up {
              from {
                opacity: 0;
                transform: translateY(24px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            @keyframes pulse-glow {
              0%, 100% {
                opacity: 0.4;
              }
              50% {
                opacity: 0.7;
              }
            }
            .animate-hero-gradient {
              background-size: 200% 200%;
              animation: hero-gradient 8s ease infinite;
            }
            .animate-fade-in {
              animation: fade-in-up 0.8s ease-out both;
            }
            .animate-fade-in-delay-1 {
              animation: fade-in-up 0.8s ease-out 0.15s both;
            }
            .animate-fade-in-delay-2 {
              animation: fade-in-up 0.8s ease-out 0.3s both;
            }
            .animate-fade-in-delay-3 {
              animation: fade-in-up 0.8s ease-out 0.45s both;
            }
            .animate-pulse-glow {
              animation: pulse-glow 4s ease-in-out infinite;
            }
          `,
        }}
      />

      <main className="min-h-screen overflow-x-hidden">
        {/* ================================================================ */}
        {/*  HERO                                                            */}
        {/* ================================================================ */}
        <section className="relative flex min-h-[100dvh] flex-col items-center justify-center px-6 py-32">
          {/* Animated gradient orb — decorative background */}
          <div
            aria-hidden="true"
            className="animate-hero-gradient pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(232,185,49,0.08) 0%, rgba(232,185,49,0.02) 40%, transparent 70%)",
              backgroundSize: "200% 200%",
            }}
          />
          {/* Secondary subtle glow */}
          <div
            aria-hidden="true"
            className="animate-pulse-glow pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(232,185,49,0.06) 0%, transparent 70%)",
            }}
          />

          <div className="mx-auto max-w-4xl text-center">
            <p className="animate-fade-in mb-6 font-mono text-sm uppercase tracking-[0.25em] text-accent">
              {isJa
                ? "プレミアムチュートリアル"
                : "Premium Tutorial Course"}
            </p>

            <h1 className="animate-fade-in-delay-1 font-display text-5xl font-800 leading-[0.92] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
              {isJa ? (
                <>
                  <span className="text-accent">Base UI</span>
                  を
                  <br />
                  ゼロから構築
                </>
              ) : (
                <>
                  Build{" "}
                  <span className="text-accent">Base UI</span>
                  <br />
                  from Scratch
                </>
              )}
            </h1>

            <p className="animate-fade-in-delay-2 mx-auto mt-8 max-w-2xl font-body text-lg leading-relaxed text-text-secondary md:text-xl">
              {isJa
                ? `${totalComponents}個のBase UIコンポーネントをすべて再構築して、ヘッドレスReactコンポーネントをマスターしましょう。コンパウンドパターン、アクセシビリティ、TypeScript — 完全なパッケージです。`
                : `Master headless React components by rebuilding all ${totalComponents} Base UI components. Compound patterns, accessibility, TypeScript generics — the complete package.`}
            </p>

            {/* Stats row */}
            <div className="animate-fade-in-delay-2 mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 font-mono text-sm text-text-muted">
              <span>
                {totalComponents}{" "}
                {isJa ? "コンポーネント" : "Components"}
              </span>
              <span
                aria-hidden="true"
                className="hidden text-border sm:inline"
              >
                /
              </span>
              <span>
                13 {isJa ? "モジュール" : "Modules"}
              </span>
              <span
                aria-hidden="true"
                className="hidden text-border sm:inline"
              >
                /
              </span>
              <span>
                45+ {isJa ? "レッスン" : "Lessons"}
              </span>
            </div>

            {/* CTA buttons */}
            <div className="animate-fade-in-delay-3 mt-12 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/modules/00-foundation/01-introduction"
                className="inline-flex h-12 min-w-[180px] items-center justify-center rounded-lg border border-border px-8 font-display text-sm font-semibold text-text-primary transition-colors hover:border-text-muted hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {isJa ? "無料プレビュー" : "Start Free Preview"}
              </Link>
              <Link
                href="/pricing"
                className="inline-flex h-12 min-w-[180px] items-center justify-center rounded-lg bg-accent px-8 font-display text-sm font-semibold text-background transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {isJa ? "購入する — $500" : "Buy Now — $500"}
              </Link>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/*  WHAT YOU'LL BUILD                                               */}
        {/* ================================================================ */}
        <section className="border-t border-border-subtle px-6 py-24 md:py-32">
          <div className="mx-auto max-w-6xl">
            <p className="mb-3 font-mono text-sm uppercase tracking-[0.2em] text-accent">
              {isJa ? "カリキュラム概要" : "Curriculum Overview"}
            </p>
            <h2 className="font-display text-3xl font-700 tracking-tight md:text-4xl lg:text-5xl">
              {isJa
                ? "構築するもの"
                : "What You'll Build"}
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-text-secondary">
              {isJa
                ? "6つのカテゴリーにまたがるプロダクションレディなヘッドレスコンポーネントライブラリ全体を構築します。"
                : "A complete production-ready headless component library spanning six categories of UI primitives."}
            </p>

            <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((cat) => (
                <div
                  key={cat.title}
                  className="group rounded-xl border border-border-subtle bg-surface p-6 transition-colors hover:border-border hover:bg-surface-elevated"
                >
                  <span
                    className="mb-4 block font-mono text-2xl text-accent"
                    aria-hidden="true"
                  >
                    {cat.icon}
                  </span>
                  <h3 className="font-display text-lg font-700 text-text-primary">
                    {cat.title}
                  </h3>
                  <p className="mt-2 font-mono text-sm leading-relaxed text-text-muted">
                    {cat.items.join(" · ")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/*  CURRICULUM — Full Module List                                   */}
        {/* ================================================================ */}
        <section
          id="curriculum"
          className="border-t border-border-subtle px-6 py-24 md:py-32"
        >
          <div className="mx-auto max-w-4xl">
            <p className="mb-3 font-mono text-sm uppercase tracking-[0.2em] text-accent">
              {isJa ? "全カリキュラム" : "Full Curriculum"}
            </p>
            <h2 className="font-display text-3xl font-700 tracking-tight md:text-4xl lg:text-5xl">
              {isJa ? "13モジュール" : "13 Modules"}
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-text-secondary">
              {isJa
                ? "基礎からキャップストーンプロジェクトまで、体系的にスキルを構築します。"
                : "Structured to build your skills progressively, from foundations to shipping your own library."}
            </p>

            <div className="mt-16 space-y-0">
              {modules.map((mod) => (
                <div
                  key={mod.slug}
                  className="group border-b border-border-subtle py-6 first:border-t"
                >
                  <div className="flex items-start gap-6">
                    {/* Module number */}
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface font-mono text-sm font-semibold text-text-muted">
                      {String(mod.order).padStart(2, "0")}
                    </span>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-display text-lg font-700 text-text-primary">
                          {mod.title[locale]}
                        </h3>
                        {mod.isFree && (
                          <span className="inline-flex items-center rounded-md bg-accent-muted px-2.5 py-0.5 font-mono text-xs font-semibold uppercase tracking-wider text-accent">
                            {isJa ? "無料" : "Free"}
                          </span>
                        )}
                      </div>

                      <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
                        {mod.description[locale]}
                      </p>

                      {mod.components.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {mod.components.map((comp) => (
                            <span
                              key={comp}
                              className="inline-flex items-center rounded-md border border-border-subtle bg-background px-2.5 py-1 font-mono text-xs text-text-muted"
                            >
                              {comp}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/*  HOW IT WORKS                                                    */}
        {/* ================================================================ */}
        <section className="border-t border-border-subtle px-6 py-24 md:py-32">
          <div className="mx-auto max-w-5xl">
            <p className="mb-3 text-center font-mono text-sm uppercase tracking-[0.2em] text-accent">
              {isJa ? "学習の流れ" : "How It Works"}
            </p>
            <h2 className="text-center font-display text-3xl font-700 tracking-tight md:text-4xl lg:text-5xl">
              {isJa
                ? "読む → 書く → テスト"
                : "Read, Build, Verify"}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-text-secondary">
              {isJa
                ? "各レッスンは3つのステップで設計されています。理論を学び、手を動かし、テストで確認します。"
                : "Every lesson follows the same three-step loop. Theory meets practice, and tests confirm understanding."}
            </p>

            <div className="mt-16 grid gap-6 md:grid-cols-3">
              {[
                {
                  step: "01",
                  title: isJa ? "レッスンを読む" : "Read the Lesson",
                  desc: isJa
                    ? "APIデザインの思考過程、アクセシビリティ要件、実装パターンを深く理解します。"
                    : "Understand the API design rationale, accessibility requirements, and implementation patterns.",
                },
                {
                  step: "02",
                  title: isJa
                    ? "エディタで構築する"
                    : "Build in the Editor",
                  desc: isJa
                    ? "ブラウザ内エディタで、テスト付きの演習に取り組みます。リアルタイムフィードバック付き。"
                    : "Work through hands-on exercises in the browser editor with real-time feedback and hints.",
                },
                {
                  step: "03",
                  title: isJa
                    ? "テストをパスする"
                    : "Pass the Tests",
                  desc: isJa
                    ? "各演習にはテストスイートが付属。グリーンのテストが理解の証明になります。"
                    : "Every exercise ships with a test suite. Green tests confirm your component works correctly.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="rounded-xl border border-border-subtle bg-surface p-8"
                >
                  <span className="font-mono text-3xl font-semibold text-accent">
                    {item.step}
                  </span>
                  <h3 className="mt-4 font-display text-lg font-700 text-text-primary">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/*  WHAT'S INCLUDED                                                 */}
        {/* ================================================================ */}
        <section className="border-t border-border-subtle px-6 py-24 md:py-32">
          <div className="mx-auto max-w-3xl">
            <p className="mb-3 text-center font-mono text-sm uppercase tracking-[0.2em] text-accent">
              {isJa ? "含まれるもの" : "What's Included"}
            </p>
            <h2 className="text-center font-display text-3xl font-700 tracking-tight md:text-4xl lg:text-5xl">
              {isJa
                ? "すべてが揃った完全パッケージ"
                : "Everything You Need"}
            </h2>

            <ul className="mt-16 space-y-5">
              {included.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-4 rounded-lg border border-border-subtle bg-surface px-6 py-4"
                >
                  <span
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-muted font-mono text-xs font-bold text-accent"
                    aria-hidden="true"
                  >
                    &#x2713;
                  </span>
                  <span className="text-base text-text-primary">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ================================================================ */}
        {/*  PRICING CTA                                                     */}
        {/* ================================================================ */}
        <section className="border-t border-border-subtle px-6 py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 font-mono text-sm uppercase tracking-[0.2em] text-accent">
              {isJa ? "今すぐ始める" : "Get Started"}
            </p>
            <h2 className="font-display text-3xl font-700 tracking-tight md:text-4xl lg:text-5xl">
              {isJa
                ? "ヘッドレスUIをマスターしよう"
                : "Master Headless UI"}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-text-secondary">
              {isJa
                ? "一度購入すれば、ライフタイムアクセス。新しいコンポーネントが追加されるたびに、無料でアップデートされます。"
                : "One-time purchase, lifetime access. Every new component and update is included — forever."}
            </p>

            {/* Price block */}
            <div className="mx-auto mt-12 max-w-md rounded-2xl border border-border bg-surface p-8 md:p-10">
              <p className="font-mono text-sm uppercase tracking-wider text-text-muted">
                {isJa ? "フルコース" : "Full Course"}
              </p>
              <p className="mt-2 font-display text-6xl font-800 tracking-tight text-text-primary">
                $500
              </p>
              <p className="mt-3 text-sm text-text-secondary">
                {isJa
                  ? "30日間の返金保証"
                  : "30-day money-back guarantee"}
              </p>

              <div className="mt-8 flex flex-col gap-3">
                <Link
                  href="/pricing"
                  className="inline-flex h-12 items-center justify-center rounded-lg bg-accent px-8 font-display text-sm font-semibold text-background transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {isJa ? "購入する" : "Buy Now"}
                </Link>
                <Link
                  href="/modules/00-foundation/01-introduction"
                  className="inline-flex h-12 items-center justify-center rounded-lg border border-border px-8 font-display text-sm font-semibold text-text-primary transition-colors hover:border-text-muted hover:bg-surface-elevated focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {isJa ? "まず無料プレビュー" : "Start Free Preview"}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/*  FOOTER                                                          */}
        {/* ================================================================ */}
        <footer className="border-t border-border-subtle px-6 py-12">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
            <p className="font-mono text-sm text-text-muted">
              &copy; {new Date().getFullYear()} Base UI Masterclass
            </p>
            <nav
              aria-label={isJa ? "フッターリンク" : "Footer links"}
              className="flex items-center gap-6"
            >
              <ExternalLink
                href="https://github.com/laststance/base-ui-masterclass"
                className="font-mono text-sm text-text-muted transition-colors hover:text-text-primary"
              >
                GitHub
              </ExternalLink>
              <ExternalLink
                href="https://discord.gg/base-ui-masterclass"
                className="font-mono text-sm text-text-muted transition-colors hover:text-text-primary"
              >
                Discord
              </ExternalLink>
            </nav>
          </div>
        </footer>
      </main>
    </>
  );
}
