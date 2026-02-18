import type { ComponentPropsWithoutRef } from "react";

/**
 * Anchor element for external URLs with `target="_blank"` and security attributes.
 * Ensures consistent `rel="noopener noreferrer"` across all external links.
 *
 * @param href - The external URL to navigate to
 * @param children - Link content
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
    <a target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  );
}
