import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { SiteHeader } from "@/components/layout/site-header";
import "../globals.css";

export const metadata: Metadata = {
  title: "Base UI Masterclass \u2014 Build Base UI from Scratch",
  description:
    "Premium tutorial: rebuild all 35 Base UI components from scratch. Master compound components, accessibility, and headless UI patterns.",
  openGraph: {
    title: "Base UI Masterclass",
    description: "Build Base UI from Scratch \u2014 35 Components, 45 Lessons",
    type: "website",
  },
};

/**
 * Locale-aware root layout.
 * Wraps children with NextIntlClientProvider and sets the lang attribute.
 * Loads Google Fonts for the "Void to Form" design system.
 *
 * @param params - Contains the locale segment from the URL
 * @param children - Page content
 *
 * @example
 * // /modules/... renders with locale="en"
 * // /ja/modules/... renders with locale="ja"
 */
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=Fira+Code:wght@400;500;600&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <SiteHeader />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
