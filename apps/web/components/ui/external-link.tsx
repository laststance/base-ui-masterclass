import type { ComponentPropsWithoutRef } from "react";

/**
 * Anchor element for external URLs with `target="_blank"` and security attributes.
 * Ensures consistent `rel="noopener noreferrer"` across all external links.
 * Security attributes are applied last so callers cannot override them via props.
 *
 * @param href - The external URL to navigate to
 * @param children - Link content
 * @returns An anchor element with enforced `target="_blank"` and `rel="noopener noreferrer"`
 *
 * @example
 * <ExternalLink href="https://github.com/laststance/base-ui-masterclass">
 *   GitHub
 * </ExternalLink>
 */
export function ExternalLink({
  children,
  ...props
}: ComponentPropsWithoutRef<"a">) {
  return (
    <a {...props} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}
