import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { getSession } from "@/lib/auth";
import { UserMenu } from "./user-menu";

/**
 * Global navigation header rendered in the locale layout.
 * Shows logo, nav links, locale switcher, and user menu.
 * Server Component — session is fetched on the server.
 *
 * @example
 * // In [locale]/layout.tsx:
 * <SiteHeader />
 */
export async function SiteHeader() {
  const [session, locale, t] = await Promise.all([
    getSession().catch(() => null),
    getLocale(),
    getTranslations("nav"),
  ]);

  const altLocale = locale === "en" ? "ja" : "en";
  const altLocaleLabel = locale === "en" ? "JA" : "EN";

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 min-h-[44px] font-display text-lg font-bold text-text-primary hover:text-accent transition-colors"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-xs font-bold text-background">
            B
          </span>
          <span className="hidden sm:inline">Base UI</span>
        </Link>

        {/* Nav + Actions */}
        <nav className="flex items-center gap-1 sm:gap-4">
          {session?.user && (
            <>
              <Link
                href={`/${locale}/dashboard`}
                className="inline-flex items-center min-h-[44px] px-2 sm:px-3 text-sm text-text-muted hover:text-text-primary transition-colors"
              >
                {t("dashboard")}
              </Link>
              <Link
                href={`/${locale}/modules`}
                className="inline-flex items-center min-h-[44px] px-2 sm:px-3 text-sm text-text-muted hover:text-text-primary transition-colors"
              >
                {t("modules")}
              </Link>
            </>
          )}

          {/* Locale switcher */}
          <Link
            href={`/${altLocale}`}
            className="inline-flex items-center min-h-[44px] px-2 text-xs font-mono text-text-muted hover:text-accent transition-colors"
          >
            {altLocaleLabel}
          </Link>

          {/* User area */}
          {session?.user ? (
            <UserMenu
              userName={session.user.name ?? session.user.email}
              userImage={session.user.image}
            />
          ) : (
            <Link
              href={`/${locale}/login`}
              className="inline-flex items-center min-h-[44px] px-4 py-2 rounded-md bg-accent text-background text-sm font-semibold hover:bg-accent-hover transition-colors"
            >
              {t("signIn")}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
