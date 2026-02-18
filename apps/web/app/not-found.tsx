import Link from "next/link";
import type { Metadata } from "next";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "404 – Page Not Found",
  description: "The page you requested could not be found.",
};

const messages: Record<string, { notFound: string; goHome: string }> = {
  ja: { notFound: "ページが見つかりません", goHome: "ホームへ" },
  en: { notFound: "Page not found", goHome: "Go Home" },
};

/**
 * Root-level 404 page for routes outside the [locale] segment.
 * Provides its own <html>/<body> wrapper since the root layout
 * delegates HTML rendering to [locale]/layout.tsx.
 * Derives best-effort locale from Accept-Language header.
 *
 * @returns {Promise<JSX.Element>} The 404 error page
 *
 * @example
 * // Triggered by: /fr/modules, /nonexistent, /de/
 * // NOT triggered by: /en/modules/99-invalid (handled by [locale] not-found)
 */
export default async function RootNotFound() {
  const acceptLang = (await headers()).get("accept-language") ?? "en";
  const lang = acceptLang.split(",")[0].split("-")[0] ?? "en";
  const { notFound, goHome } = messages[lang] ?? messages["en"];

  return (
    <html lang={lang}>
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#09090b",
          color: "#fafafa",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <h1
            style={{
              fontSize: "4rem",
              fontWeight: 700,
              color: "#d4a843",
              margin: "0 0 0.5rem",
            }}
          >
            404
          </h1>
          <p
            style={{
              fontSize: "1.125rem",
              color: "#a1a1aa",
              margin: "0 0 2rem",
            }}
          >
            {notFound}
          </p>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "44px",
              padding: "0.625rem 1.5rem",
              borderRadius: "0.5rem",
              backgroundColor: "#d4a843",
              color: "#09090b",
              fontWeight: 600,
              fontSize: "0.875rem",
              textDecoration: "none",
            }}
          >
            {goHome}
          </Link>
        </div>
      </body>
    </html>
  );
}
