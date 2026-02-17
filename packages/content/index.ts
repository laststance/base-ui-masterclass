/**
 * Content package public API.
 * Provides typed access to modules, lessons, and exercises.
 *
 * @example
 * import { modules, type Locale } from "@base-ui-masterclass/content";
 */
export { modules, locales, defaultLocale } from "./config";
export type { ModuleConfig, Locale } from "./config";
