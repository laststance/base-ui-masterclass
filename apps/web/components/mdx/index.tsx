import type { ComponentPropsWithoutRef } from "react";
import { Callout } from "./callout";
import { CodeBlock } from "./code-block";
import { Exercise } from "./exercise";

/**
 * Custom MDX component mapping.
 * Maps MDX tag names to React components for lesson rendering.
 * Standard HTML elements get styled versions; custom components
 * are available directly in MDX files.
 *
 * @example
 * // In MDX:
 * <Callout variant="tip">Use `useId()` for unique IDs</Callout>
 * <Exercise id="button-basic" title="Build a Button" />
 */
export const mdxComponents = {
  // Custom components available in MDX
  Callout,
  CodeBlock,
  Exercise,

  // Styled HTML overrides for prose
  h1: (props: ComponentPropsWithoutRef<"h1">) => (
    <h1
      className="mt-10 mb-4 text-3xl font-display font-800 text-text-primary tracking-tight"
      {...props}
    />
  ),
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2
      className="mt-8 mb-3 text-2xl font-display font-700 text-text-primary tracking-tight"
      {...props}
    />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3
      className="mt-6 mb-2 text-xl font-display font-700 text-text-primary"
      {...props}
    />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p className="mb-4 text-text-secondary leading-relaxed" {...props} />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul className="mb-4 ml-6 list-disc text-text-secondary space-y-1" {...props} />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol
      className="mb-4 ml-6 list-decimal text-text-secondary space-y-1"
      {...props}
    />
  ),
  li: (props: ComponentPropsWithoutRef<"li">) => (
    <li className="leading-relaxed" {...props} />
  ),
  a: (props: ComponentPropsWithoutRef<"a">) => (
    <a
      className="text-accent underline decoration-accent/30 underline-offset-2 hover:decoration-accent transition-colors"
      {...props}
    />
  ),
  strong: (props: ComponentPropsWithoutRef<"strong">) => (
    <strong className="font-semibold text-text-primary" {...props} />
  ),
  code: (props: ComponentPropsWithoutRef<"code">) => (
    <code
      className="rounded-md bg-surface-elevated border border-border px-1.5 py-0.5 text-xs font-mono text-accent"
      {...props}
    />
  ),
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className="my-4 border-l-2 border-accent/40 pl-4 text-text-muted italic"
      {...props}
    />
  ),
  hr: () => <hr className="my-8 border-border" />,
  table: (props: ComponentPropsWithoutRef<"table">) => (
    <div className="my-6 overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm" {...props} />
    </div>
  ),
  thead: (props: ComponentPropsWithoutRef<"thead">) => (
    <thead className="bg-surface border-b border-border" {...props} />
  ),
  th: (props: ComponentPropsWithoutRef<"th">) => (
    <th
      className="px-4 py-2 text-left font-semibold text-text-primary"
      {...props}
    />
  ),
  td: (props: ComponentPropsWithoutRef<"td">) => (
    <td className="px-4 py-2 text-text-secondary border-t border-border-subtle" {...props} />
  ),
};
