import { defineRouting } from "next-intl/routing";

/**
 * Defines supported locales and routing behavior.
 * Uses "as-needed" prefix strategy — English routes have no prefix,
 * Japanese routes are prefixed with /ja/.
 *
 * @example
 * // English: /modules/00-foundation/01-introduction
 * // Japanese: /ja/modules/00-foundation/01-introduction
 */
export const routing = defineRouting({
  locales: ["en", "ja"],
  defaultLocale: "en",
  localePrefix: "as-needed",
});
