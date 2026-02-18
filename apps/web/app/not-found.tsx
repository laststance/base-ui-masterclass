import Link from "next/link";

/**
 * Root-level 404 page for routes outside the [locale] segment.
 * Provides its own <html>/<body> wrapper since the root layout
 * delegates HTML rendering to [locale]/layout.tsx.
 *
 * @example
 * // Triggered by: /fr/modules, /nonexistent, /de/
 * // NOT triggered by: /en/modules/99-invalid (handled by [locale] not-found)
 */
export default function RootNotFound() {
  return (
    <html lang="en">
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
            Page not found
          </p>
          <Link
            href="/en"
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
            Go Home
          </Link>
        </div>
      </body>
    </html>
  );
}
