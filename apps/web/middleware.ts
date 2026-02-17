import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

/**
 * i18n middleware that handles locale detection and URL rewriting.
 * English (default) has no prefix, Japanese uses /ja/ prefix.
 *
 * @example
 * // /modules/... → en locale (no prefix)
 * // /ja/modules/... → ja locale
 */
export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
