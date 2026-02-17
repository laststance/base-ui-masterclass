import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Base UI Masterclass — Build Base UI from Scratch",
  description:
    "Premium tutorial: rebuild all 35 Base UI components from scratch. Master compound components, accessibility, and headless UI patterns.",
  openGraph: {
    title: "Base UI Masterclass",
    description: "Build Base UI from Scratch — 35 Components, 45 Lessons",
    type: "website",
  },
};

/**
 * Root layout wrapping the entire application.
 * Loads Bricolage Grotesque (display), Source Serif 4 (body), and Fira Code (mono)
 * via Google Fonts for the "Void to Form" design system.
 *
 * @example
 * // This layout is automatically applied to all pages
 * // via Next.js App Router conventions
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
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
      <body>{children}</body>
    </html>
  );
}
