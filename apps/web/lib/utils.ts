import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS classes with clsx, resolving conflicts via tailwind-merge.
 *
 * @param inputs - Class values to merge (strings, objects, arrays)
 * @returns Merged class string with Tailwind conflicts resolved
 *
 * @example
 * cn("px-4 py-2", condition && "bg-accent", "px-6")
 * // => "py-2 px-6 bg-accent" (px-4 overridden by px-6)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
