interface CodeBlockProps {
  children: string;
  title?: string;
  highlight?: string;
}

/**
 * Enhanced code block wrapper for MDX content.
 * Wraps shiki-highlighted code with a header showing the filename.
 *
 * @param children - Pre-highlighted HTML from shiki
 * @param title - Optional filename or label shown in the header
 * @param highlight - Comma-separated line numbers to highlight (future use)
 *
 * @example
 * <CodeBlock title="button.tsx">
 *   {highlightedCodeHTML}
 * </CodeBlock>
 */
export function CodeBlock({ children, title }: CodeBlockProps) {
  return (
    <figure className="my-6 overflow-hidden rounded-lg border border-border">
      {title && (
        <figcaption className="flex items-center gap-2 border-b border-border bg-surface px-4 py-2">
          <svg
            className="h-4 w-4 text-text-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
            />
          </svg>
          <span className="text-xs font-mono text-text-muted">{title}</span>
        </figcaption>
      )}
      <div className="overflow-x-auto bg-surface-elevated p-4 text-sm [&>pre]:!m-0 [&>pre]:!bg-transparent [&>pre]:!p-0">
        {children}
      </div>
    </figure>
  );
}
