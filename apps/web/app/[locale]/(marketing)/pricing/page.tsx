import type { Metadata } from "next";
import Link from "next/link";
import { getLocale } from "next-intl/server";
import type { Locale } from "@base-ui-masterclass/content";
import { CheckoutButton } from "@/components/marketing/checkout-button";

export const metadata: Metadata = {
  title: "Pricing — Base UI Masterclass",
  description:
    "One-time purchase. Lifetime access to 13 modules, 35+ exercises, full source code, Discord community, and updates. 30-day money-back guarantee.",
  openGraph: {
    title: "Pricing — Base UI Masterclass",
    description:
      "Master headless React components. $500, one-time purchase with lifetime access.",
    type: "website",
  },
};

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const FEATURES = [
  {
    en: "13 Modules, 35+ Interactive Exercises",
    ja: "13モジュール、35以上のインタラクティブ演習",
  },
  {
    en: "Full source code & solutions",
    ja: "完全なソースコード＆解答",
  },
  {
    en: "Discord Community Access",
    ja: "Discordコミュニティへのアクセス",
  },
  {
    en: "Lifetime updates",
    ja: "永久アップデート",
  },
  {
    en: "English + Japanese content",
    ja: "英語＋日本語コンテンツ",
  },
  {
    en: "Certificate of Completion",
    ja: "修了証明書",
  },
] as const;

const FAQ = [
  {
    q: {
      en: "Is this a subscription?",
      ja: "これはサブスクリプションですか？",
    },
    a: {
      en: "No. It is a one-time purchase that gives you lifetime access to every module, exercise, and future update. You will never be charged again.",
      ja: "いいえ。一度の購入で、すべてのモジュール、演習、今後のアップデートへの永久アクセスが得られます。追加料金は一切ありません。",
    },
  },
  {
    q: {
      en: "What if I get stuck?",
      ja: "行き詰まったらどうすればいいですか？",
    },
    a: {
      en: "Every exercise includes a full solution you can reference. You also get access to a private Discord community where you can ask questions and discuss with other students.",
      ja: "すべての演習には参照できる完全な解答が含まれています。また、質問や他の受講生とのディスカッションができるプライベートDiscordコミュニティへのアクセスも得られます。",
    },
  },
  {
    q: {
      en: "Is it refundable?",
      ja: "返金は可能ですか？",
    },
    a: {
      en: "Yes. We offer a 30-day money-back guarantee — no questions asked. If the course isn't for you, just reach out and we'll refund you in full.",
      ja: "はい。30日間の返金保証を提供しています。理由を問いません。コースが合わない場合は、ご連絡いただければ全額返金いたします。",
    },
  },
  {
    q: {
      en: "What tech stack is covered?",
      ja: "どのような技術スタックが対象ですか？",
    },
    a: {
      en: "React 19, TypeScript, headless UI patterns, compound components, accessibility (WAI-ARIA), and testing. You'll rebuild all 35 Base UI components from scratch.",
      ja: "React 19、TypeScript、ヘッドレスUIパターン、複合コンポーネント、アクセシビリティ（WAI-ARIA）、テスト。35個すべてのBase UIコンポーネントをゼロから再構築します。",
    },
  },
] as const;

const COMPARISON = {
  headers: {
    aspect: { en: "Aspect", ja: "観点" },
    self: { en: "Self-learning", ja: "独学" },
    course: { en: "This Course", ja: "このコース" },
  },
  rows: [
    {
      aspect: { en: "Structure", ja: "構造" },
      self: {
        en: "Scattered blog posts & docs",
        ja: "散在するブログ記事＆ドキュメント",
      },
      course: {
        en: "13 progressive modules, guided path",
        ja: "13の段階的モジュール、ガイド付きパス",
      },
    },
    {
      aspect: { en: "Exercises", ja: "演習" },
      self: { en: "None", ja: "なし" },
      course: {
        en: "35+ hands-on, in-browser exercises",
        ja: "35以上のハンズオン、ブラウザ内演習",
      },
    },
    {
      aspect: { en: "Accessibility", ja: "アクセシビリティ" },
      self: {
        en: "Often overlooked",
        ja: "見落とされがち",
      },
      course: {
        en: "WAI-ARIA built into every component",
        ja: "すべてのコンポーネントにWAI-ARIAを実装",
      },
    },
    {
      aspect: { en: "Source code", ja: "ソースコード" },
      self: { en: "Incomplete snippets", ja: "不完全なスニペット" },
      course: {
        en: "Full, production-grade solutions",
        ja: "完全な本番品質のソリューション",
      },
    },
    {
      aspect: { en: "Community", ja: "コミュニティ" },
      self: { en: "Public forums", ja: "公開フォーラム" },
      course: {
        en: "Private Discord with direct support",
        ja: "直接サポート付きプライベートDiscord",
      },
    },
    {
      aspect: { en: "Updates", ja: "アップデート" },
      self: {
        en: "Must track changes yourself",
        ja: "自分で変更を追跡する必要あり",
      },
      course: {
        en: "Lifetime updates included",
        ja: "永久アップデート付き",
      },
    },
  ],
} as const;

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

/**
 * Pricing page for Base UI Masterclass.
 * Displays the price, feature list, comparison table, FAQ,
 * and a Lemon Squeezy checkout button.
 *
 * @example
 * // /pricing  → English pricing page
 * // /ja/pricing → Japanese pricing page
 */
export default async function PricingPage() {
  const locale = (await getLocale()) as Locale;

  return (
    <main className="min-h-screen">
      {/* ---- Hero / Price Card ---- */}
      <section className="px-6 pt-24 pb-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-sm font-mono tracking-widest uppercase text-accent">
            {locale === "ja" ? "プレミアムチュートリアル" : "Premium Tutorial"}
          </p>
          <h1 className="text-4xl md:text-6xl font-display font-800 leading-[0.95] tracking-tight mb-6">
            {locale === "ja" ? (
              <>
                Base UIを
                <br />
                <span className="text-accent">ゼロから</span>マスター
              </>
            ) : (
              <>
                Master{" "}
                <span className="text-accent">Base UI</span>
                <br />
                from Scratch
              </>
            )}
          </h1>
          <p className="text-lg text-text-secondary leading-relaxed mb-14 max-w-lg mx-auto">
            {locale === "ja"
              ? "35個のヘッドレスReactコンポーネントを再構築する、実践的なコース。"
              : "A hands-on course where you rebuild all 35 headless React components."}
          </p>

          {/* ---- Pricing card ---- */}
          <div className="relative mx-auto max-w-md rounded-xl border border-accent/30 bg-surface p-10 shadow-[0_0_80px_-20px_rgba(232,185,49,0.15)]">
            {/* Subtle gold glow ring */}
            <div
              className="pointer-events-none absolute -inset-px rounded-xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(232,185,49,0.20) 0%, transparent 50%, rgba(232,185,49,0.10) 100%)",
                mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                maskComposite: "exclude",
                WebkitMaskComposite: "xor",
                padding: "1px",
                borderRadius: "inherit",
              }}
            />

            <p className="text-7xl md:text-8xl font-display font-800 text-text-primary tracking-tight">
              $500
            </p>
            <p className="mt-2 text-text-muted text-sm font-mono uppercase tracking-wider">
              {locale === "ja"
                ? "買い切り \u00B7 永久アクセス"
                : "One-time purchase \u00B7 Lifetime access"}
            </p>

            <div className="my-8 h-px bg-border" />

            {/* Feature list */}
            <ul className="space-y-3 text-left mb-10">
              {FEATURES.map((f) => (
                <li key={f.en} className="flex items-start gap-3">
                  <svg
                    className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-text-secondary text-sm leading-relaxed">
                    {f[locale]}
                  </span>
                </li>
              ))}
            </ul>

            <CheckoutButton className="w-full" />

            {/* Guarantee badge */}
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-text-muted">
              <svg
                className="h-4 w-4 text-success"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span>
                {locale === "ja"
                  ? "30日間 返金保証"
                  : "30-Day Money-Back Guarantee"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Comparison Table ---- */}
      <section className="px-6 py-20 border-t border-border">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-display font-800 tracking-tight mb-3 text-center">
            {locale === "ja"
              ? "独学 vs このコース"
              : "Self-learning vs This Course"}
          </h2>
          <p className="text-text-secondary text-center mb-10 max-w-lg mx-auto">
            {locale === "ja"
              ? "構造化されたカリキュラムで学習時間を大幅に短縮します。"
              : "A structured curriculum dramatically reduces the time to mastery."}
          </p>

          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 pr-4 font-mono text-text-muted uppercase tracking-wider text-xs">
                    {COMPARISON.headers.aspect[locale]}
                  </th>
                  <th className="py-3 px-4 font-mono text-text-muted uppercase tracking-wider text-xs">
                    {COMPARISON.headers.self[locale]}
                  </th>
                  <th className="py-3 pl-4 font-mono text-accent uppercase tracking-wider text-xs">
                    {COMPARISON.headers.course[locale]}
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.rows.map((row) => (
                  <tr
                    key={row.aspect.en}
                    className="border-b border-border-subtle"
                  >
                    <td className="py-4 pr-4 font-semibold text-text-primary whitespace-nowrap">
                      {row.aspect[locale]}
                    </td>
                    <td className="py-4 px-4 text-text-muted">
                      {row.self[locale]}
                    </td>
                    <td className="py-4 pl-4 text-text-secondary">
                      {row.course[locale]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ---- FAQ ---- */}
      <section className="px-6 py-20 border-t border-border">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-display font-800 tracking-tight mb-10 text-center">
            {locale === "ja" ? "よくある質問" : "Frequently Asked Questions"}
          </h2>

          <div className="space-y-2">
            {FAQ.map((item) => (
              <details
                key={item.q.en}
                className="group rounded-lg border border-border bg-surface transition-colors open:bg-surface-elevated"
              >
                <summary className="flex min-h-[44px] cursor-pointer items-center justify-between gap-4 px-5 py-4 text-text-primary font-semibold select-none list-none [&::-webkit-details-marker]:hidden">
                  <span>{item.q[locale]}</span>
                  <svg
                    className="h-5 w-5 shrink-0 text-text-muted transition-transform group-open:rotate-45"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </summary>
                <div className="px-5 pb-5 text-sm text-text-secondary leading-relaxed">
                  {item.a[locale]}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Bottom CTA ---- */}
      <section className="px-6 py-20 border-t border-border">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-2xl md:text-3xl font-display font-800 tracking-tight mb-4">
            {locale === "ja"
              ? "ヘッドレスUIの構築を始めましょう"
              : "Start building headless UI today"}
          </h2>
          <p className="text-text-secondary mb-8 leading-relaxed">
            {locale === "ja"
              ? "35コンポーネント、永久アクセス、30日間返金保証。"
              : "35 components. Lifetime access. 30-day money-back guarantee."}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <CheckoutButton />
            <Link
              href="/modules"
              className="inline-flex h-14 items-center rounded-lg border border-border px-10 text-base font-semibold text-text-primary transition-colors hover:bg-surface hover:border-text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {locale === "ja" ? "カリキュラムを見る" : "View Curriculum"}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
